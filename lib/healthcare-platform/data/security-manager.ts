/**
 * Data Management & Security Module
 * Handles PHI sanitization, field-level encryption, tokenization, and audit logging
 */

import * as crypto from 'crypto';
import { EventEmitter } from 'events';
import {
    AuditLogEntry,
    DataClassification,
    DataIngestionConfig,
    DataTransformation,
    DataValidation
} from '../types';

// Encryption configuration
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 64;

export class DataSecurityManager extends EventEmitter {
  private encryptionKey: Buffer;
  private tokenVault: Map<string, string> = new Map();
  private fieldEncryptionKeys: Map<string, Buffer> = new Map();
  private auditBuffer: AuditLogEntry[] = [];

  constructor(masterKey?: string) {
    super();
    // In production, use proper key management (AWS KMS, Azure Key Vault, etc.)
    this.encryptionKey = masterKey
      ? crypto.scryptSync(masterKey, 'salt', KEY_LENGTH)
      : crypto.randomBytes(KEY_LENGTH);
  }

  // Process data through security pipeline
  public async processData(
    data: any,
    config: DataIngestionConfig
  ): Promise<{
    processedData: any;
    metadata: {
      classification: DataClassification;
      transformations: string[];
      validationErrors: string[];
    };
  }> {
    let processedData = { ...data };
    const transformations: string[] = [];
    const validationErrors: string[] = [];

    // 1. Validate data
    if (config.validation) {
      const errors = await this.validateData(processedData, config.validation);
      validationErrors.push(...errors);

      if (errors.length > 0 && config.validation.some(v => v.type === 'required')) {
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
    }

    // 2. Classify data
    const classification = config.classification || this.classifyData(processedData);

    // 3. Apply transformations
    if (config.transformation) {
      for (const transform of config.transformation) {
        processedData = await this.applyTransformation(
          processedData,
          transform,
          classification
        );
        transformations.push(`${transform.type}:${transform.fields.join(',')}`);
      }
    }

    // 4. Apply default security based on classification
    processedData = await this.applyDefaultSecurity(processedData, classification);

    // 5. Audit the operation
    await this.auditDataOperation('process', {
      source: config.source,
      type: config.type,
      classification,
      transformations,
      dataSize: JSON.stringify(data).length
    });

    return {
      processedData,
      metadata: {
        classification,
        transformations,
        validationErrors
      }
    };
  }

  // Validate data against rules
  private async validateData(
    data: any,
    validations: DataValidation[]
  ): Promise<string[]> {
    const errors: string[] = [];

    for (const validation of validations) {
      const value = this.getFieldValue(data, validation.field);

      switch (validation.type) {
        case 'required':
          if (!value || value === '') {
            errors.push(validation.errorMessage);
          }
          break;

        case 'format':
          if (value && !new RegExp(validation.rule).test(value)) {
            errors.push(validation.errorMessage);
          }
          break;

        case 'range':
          const [min, max] = validation.rule.split('-').map(Number);
          const numValue = Number(value);
          if (isNaN(numValue) || numValue < min || numValue > max) {
            errors.push(validation.errorMessage);
          }
          break;

        case 'custom':
          // Custom validation would call external validator
          break;
      }
    }

    return errors;
  }

  // Apply transformation to data
  private async applyTransformation(
    data: any,
    transformation: DataTransformation,
    classification: DataClassification
  ): Promise<any> {
    const transformed = { ...data };

    for (const field of transformation.fields) {
      const value = this.getFieldValue(transformed, field);
      if (!value) continue;

      switch (transformation.type) {
        case 'sanitize':
          this.setFieldValue(
            transformed,
            field,
            this.sanitizeValue(value, transformation.options)
          );
          break;

        case 'tokenize':
          this.setFieldValue(
            transformed,
            field,
            this.tokenizeValue(value, field)
          );
          break;

        case 'encrypt':
          this.setFieldValue(
            transformed,
            field,
            await this.encryptValue(value, field)
          );
          break;

        case 'anonymize':
          this.setFieldValue(
            transformed,
            field,
            this.anonymizeValue(value, transformation.options)
          );
          break;

        case 'pseudonymize':
          this.setFieldValue(
            transformed,
            field,
            this.pseudonymizeValue(value, field)
          );
          break;
      }
    }

    return transformed;
  }

  // Sanitize sensitive data
  private sanitizeValue(value: string, options?: any): string {
    const str = String(value);

    // Remove common PHI patterns
    let sanitized = str
      // SSN patterns
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX')
      .replace(/\b\d{9}\b/g, 'XXXXXXXXX')
      // Phone numbers
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, 'XXX-XXX-XXXX')
      // Email addresses
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, 'XXXX@XXXX.XXX')
      // Credit card numbers
      .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, 'XXXX-XXXX-XXXX-XXXX');

    // Apply custom sanitization rules
    if (options?.patterns) {
      for (const pattern of options.patterns) {
        sanitized = sanitized.replace(new RegExp(pattern.regex, 'g'), pattern.replacement);
      }
    }

    return sanitized;
  }

  // Tokenize sensitive value
  private tokenizeValue(value: string, field: string): string {
    const token = `TOK_${field}_${crypto.randomBytes(16).toString('hex')}`;
    this.tokenVault.set(token, value);

    // In production, store in secure token vault
    this.emit('token:created', { token, field });

    return token;
  }

  // Detokenize value
  public detokenize(token: string): string | null {
    const value = this.tokenVault.get(token);

    if (value) {
      this.auditDataOperation('detokenize', { token });
    }

    return value || null;
  }

  // Encrypt field value
  private async encryptValue(value: string, field: string): Promise<string> {
    // Get or create field-specific key
    let fieldKey = this.fieldEncryptionKeys.get(field);
    if (!fieldKey) {
      fieldKey = crypto.scryptSync(this.encryptionKey, field, KEY_LENGTH);
      this.fieldEncryptionKeys.set(field, fieldKey);
    }

    // Generate IV and encrypt
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, fieldKey, iv);

    const encrypted = Buffer.concat([
      cipher.update(value, 'utf8'),
      cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    // Return base64 encoded: iv + tag + encrypted
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  // Decrypt field value
  public async decryptValue(encryptedValue: string, field: string): Promise<string> {
    const fieldKey = this.fieldEncryptionKeys.get(field);
    if (!fieldKey) {
      throw new Error(`No encryption key found for field: ${field}`);
    }

    // Decode and extract components
    const buffer = Buffer.from(encryptedValue, 'base64');
    const iv = buffer.slice(0, IV_LENGTH);
    const tag = buffer.slice(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
    const encrypted = buffer.slice(IV_LENGTH + TAG_LENGTH);

    // Decrypt
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, fieldKey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);

    this.auditDataOperation('decrypt', { field });

    return decrypted.toString('utf8');
  }

  // Anonymize value
  private anonymizeValue(value: string, options?: any): string {
    const type = options?.type || 'hash';

    switch (type) {
      case 'hash':
        return crypto.createHash('sha256').update(value).digest('hex').substring(0, 12);

      case 'generalize':
        // Age -> age range, ZIP -> ZIP prefix, etc.
        if (/^\d+$/.test(value)) {
          const num = parseInt(value);
          if (num < 100) {
            // Likely age
            return `${Math.floor(num / 10) * 10}-${Math.floor(num / 10) * 10 + 9}`;
          } else if (num > 10000 && num < 99999) {
            // Likely ZIP code
            return value.substring(0, 3) + '**';
          }
        }
        return '****';

      case 'suppress':
        return '';

      default:
        return '****';
    }
  }

  // Pseudonymize value
  private pseudonymizeValue(value: string, field: string): string {
    // Create consistent pseudonym based on value and field
    const hash = crypto.createHmac('sha256', this.encryptionKey)
      .update(`${field}:${value}`)
      .digest('hex');

    return `PSEUDO_${hash.substring(0, 16)}`;
  }

  // Apply default security based on classification
  private async applyDefaultSecurity(
    data: any,
    classification: DataClassification
  ): Promise<any> {
    const secured = { ...data };

    switch (classification) {
      case 'PHI':
        // Encrypt sensitive PHI fields by default
        const phiFields = ['ssn', 'mrn', 'insurance_id', 'diagnosis', 'medication'];
        for (const field of phiFields) {
          if (secured[field]) {
            secured[field] = await this.encryptValue(secured[field], field);
          }
        }
        break;

      case 'PII':
        // Tokenize PII fields
        const piiFields = ['email', 'phone', 'address'];
        for (const field of piiFields) {
          if (secured[field]) {
            secured[field] = this.tokenizeValue(secured[field], field);
          }
        }
        break;

      case 'Confidential':
        // Encrypt entire object
        secured._encrypted = await this.encryptValue(JSON.stringify(data), 'confidential');
        // Remove original fields
        Object.keys(data).forEach(key => delete secured[key]);
        break;
    }

    return secured;
  }

  // Classify data based on content
  private classifyData(data: any): DataClassification {
    const dataStr = JSON.stringify(data).toLowerCase();

    // Check for PHI indicators
    if (
      dataStr.includes('diagnosis') ||
      dataStr.includes('medication') ||
      dataStr.includes('treatment') ||
      dataStr.includes('medical') ||
      /\b\d{3}-\d{2}-\d{4}\b/.test(dataStr) // SSN pattern
    ) {
      return 'PHI';
    }

    // Check for PII indicators
    if (
      dataStr.includes('email') ||
      dataStr.includes('phone') ||
      dataStr.includes('address') ||
      dataStr.includes('name')
    ) {
      return 'PII';
    }

    // Check for confidential indicators
    if (
      dataStr.includes('confidential') ||
      dataStr.includes('secret') ||
      dataStr.includes('classified')
    ) {
      return 'Confidential';
    }

    return 'Internal';
  }

  // Audit data operation
  private async auditDataOperation(
    operation: string,
    details: Record<string, any>
  ): Promise<void> {
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId: details.userId || 'system',
      action: `data:${operation}`,
      resource: details.resource || 'data',
      details,
      ipAddress: details.ipAddress || '0.0.0.0',
      userAgent: details.userAgent || 'DataSecurityManager',
      result: 'success',
      dataAccessed: details.fields
    };

    this.auditBuffer.push(entry);
    this.emit('audit:entry', entry);

    // Flush audit buffer periodically
    if (this.auditBuffer.length >= 100) {
      await this.flushAuditBuffer();
    }
  }

  // Flush audit buffer to persistent storage
  private async flushAuditBuffer(): Promise<void> {
    if (this.auditBuffer.length === 0) return;

    const entries = [...this.auditBuffer];
    this.auditBuffer = [];

    // In production, write to immutable audit log storage
    this.emit('audit:flush', { entries, count: entries.length });
  }

  // Get field value from nested object
  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Set field value in nested object
  private setFieldValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }

  // Export security configuration
  public exportConfiguration(): any {
    return {
      algorithm: ENCRYPTION_ALGORITHM,
      tokenVaultSize: this.tokenVault.size,
      fieldKeys: Array.from(this.fieldEncryptionKeys.keys()),
      auditBufferSize: this.auditBuffer.length
    };
  }

  // Rotate encryption keys
  public async rotateKeys(fields?: string[]): Promise<void> {
    const targetFields = fields || Array.from(this.fieldEncryptionKeys.keys());

    for (const field of targetFields) {
      const newKey = crypto.scryptSync(this.encryptionKey, `${field}_${Date.now()}`, KEY_LENGTH);
      this.fieldEncryptionKeys.set(field, newKey);
    }

    this.emit('keys:rotated', { fields: targetFields });
    await this.auditDataOperation('key-rotation', { fields: targetFields });
  }
}