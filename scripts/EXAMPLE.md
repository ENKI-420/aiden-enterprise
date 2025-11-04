# DNA-Lang Transmogrifier - Usage Example

This example demonstrates how the DNA-Lang Transmogrifier converts a React/TypeScript project to DNA-Lang format.

## Before Conversion

### File Structure
```
project/
├── components/
│   ├── Button.tsx
│   └── Header.tsx
├── app/
│   └── page.tsx
└── tsconfig.json
```

### Button.tsx
```typescript
import React from 'react';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>;
}
```

### Header.tsx
```typescript
import React from 'react';
import { Button } from './Button.tsx';

export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <Button>Click me</Button>
    </header>
  );
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "jsx": "preserve"
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
```

## Running the Transmogrifier

### Step 1: Preview (Dry Run)
```bash
node scripts/dnalang-transmogrifier.js --dry-run
```

**Output:**
```
🧬 Starting DNA-Lang Transmogrification (Dry Run: true)

[DRY-RUN: RENAME] /project/components/Button.tsx -> /project/components/Button.dna
[DRY-RUN: RENAME] /project/components/Header.tsx -> /project/components/Header.dna
[DRY-RUN: RENAME] /project/app/page.tsx -> /project/app/page.dna

🔄 Updating file references...
[DRY-RUN: REF] Updated references in Header.dna

⚙️ Updating configuration files...
[DRY-RUN: CONFIG] Configuration files ready for update.

✅ Transmogrification Complete.
```

### Step 2: Execute Conversion
```bash
node scripts/dnalang-transmogrifier.js
```

**Output:**
```
🧬 Starting DNA-Lang Transmogrification (Dry Run: false)

📦 Creating project backup at: /backup_dnalang_2025-10-31T05-30-45-123Z
   Backup complete.

[RENAME] Button.tsx -> Button.dna
[RENAME] Header.tsx -> Header.dna
[RENAME] page.tsx -> page.dna

🔄 Updating file references...
[REF] Updated references in Header.dna

⚙️ Updating configuration files...
[CONFIG] Updated tsconfig.json.
[CONFIG] Updated .gitignore.

✅ Transmogrification Complete.
   Converted Files:
┌──────────────────────────────────┬──────────────────────────────────┐
│ (index)                          │ Values                           │
├──────────────────────────────────┼──────────────────────────────────┤
│ /project/components/Button.tsx   │ '/project/components/Button.dna' │
│ /project/components/Header.tsx   │ '/project/components/Header.dna' │
│ /project/app/page.tsx            │ '/project/app/page.dna'          │
└──────────────────────────────────┴──────────────────────────────────┘
   No errors detected during conversion.
```

## After Conversion

### File Structure
```
project/
├── components/
│   ├── Button.dna
│   └── Header.dna
├── app/
│   └── page.dna
└── tsconfig.json
```

### Button.dna
```typescript
import React from 'react';

export function Button({ children }: { children: React.ReactNode }) {
  return <button className="btn">{children}</button>;
}
```

### Header.dna
```typescript
import React from 'react';
import { Button } from './Button.dna';  // ✅ Updated reference

export function Header() {
  return (
    <header>
      <h1>My App</h1>
      <Button>Click me</Button>
    </header>
  );
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "jsx": "preserve"
  },
  "include": ["**/*.ts", "**/*.dna"]  // ✅ Updated to include .dna files
}
```

### .gitignore (additions)
```
# DNA-Lang Transmogrifier Artifacts
*.dnaswap
dnalang_error_log_*.json
backup_dnalang_*/
```

## Key Changes

1. **File Extensions**: All `.tsx` files renamed to `.dna`
2. **Import Statements**: All references updated automatically
3. **Configuration**: `tsconfig.json` updated to recognize `.dna` files
4. **Safety**: Backup created at `../backup_dnalang_<timestamp>/`

## Error Handling Example

If errors occur during conversion, an error log is created:

**dnalang_error_log_2025-10-31T05-30-45-123Z.json**
```json
[
  {
    "type": "RENAME",
    "file": "/project/components/LockedFile.tsx",
    "details": "EACCES: permission denied"
  }
]
```

## Rollback

If you need to revert changes, restore from the backup:

```bash
# Remove converted files
rm -rf project/

# Restore from backup
mv ../backup_dnalang_2025-10-31T05-30-45-123Z/ project/
```

## Notes

- The script preserves file contents - only extensions and references are modified
- Excluded directories (`node_modules`, `.git`, etc.) are automatically skipped
- Backup excludes the same directories to save space
- All changes are reversible using the automatic backup
