"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Database, CheckCircle, AlertTriangle, Clock, Download, Share2, Trash2 } from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  type: "Genomic Data" | "Clinical Records" | "Lab Results" | "Imaging Data" | "EHR Export"
  size: number
  status: "Uploading" | "Processing" | "Completed" | "Failed"
  progress: number
  uploadTime: string
  patientId?: string
  metadata?: Record<string, any>
  validationResults?: {
    isValid: boolean
    errors: string[]
    warnings: string[]
  }
}

interface DataSource {
  id: string
  name: string
  type: string
  description: string
  icon: any
  supportedFormats: string[]
  requirements: string[]
}

export function DataUploadPanel() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: "FILE-001",
      name: "patient_001_wgs.vcf",
      type: "Genomic Data",
      size: 2547891,
      status: "Completed",
      progress: 100,
      uploadTime: "2024-01-15T10:30:00Z",
      patientId: "PT-2024-001",
      metadata: {
        sequencingPlatform: "Illumina NovaSeq",
        coverage: "30x",
        variants: 4567890,
      },
      validationResults: {
        isValid: true,
        errors: [],
        warnings: ["Low coverage in chromosome Y"],
      },
    },
    {
      id: "FILE-002",
      name: "clinical_notes_batch_jan.json",
      type: "Clinical Records",
      size: 156789,
      status: "Processing",
      progress: 67,
      uploadTime: "2024-01-15T14:20:00Z",
      metadata: {
        recordCount: 45,
        dateRange: "2024-01-01 to 2024-01-15",
      },
    },
    {
      id: "FILE-003",
      name: "lab_results_q1.csv",
      type: "Lab Results",
      size: 89234,
      status: "Failed",
      progress: 0,
      uploadTime: "2024-01-15T09:15:00Z",
      validationResults: {
        isValid: false,
        errors: ["Missing required column: patient_id", "Invalid date format in row 23"],
        warnings: [],
      },
    },
  ])

  const [dragActive, setDragActive] = useState(false)
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null)
  const [uploadMetadata, setUploadMetadata] = useState<Record<string, any>>({})

  const dataSources: DataSource[] = [
    {
      id: "genomic-vcf",
      name: "Genomic VCF Files",
      type: "Genomic Data",
      description: "Variant Call Format files from whole genome or exome sequencing",
      icon: Database,
      supportedFormats: [".vcf", ".vcf.gz", ".bcf"],
      requirements: ["Patient ID in filename or metadata", "Standard VCF format v4.2+"],
    },
    {
      id: "clinical-hl7",
      name: "HL7 FHIR Records",
      type: "Clinical Records",
      description: "Electronic health records in HL7 FHIR format",
      icon: FileText,
      supportedFormats: [".json", ".xml"],
      requirements: ["FHIR R4 compliance", "Patient resource included"],
    },
    {
      id: "lab-results",
      name: "Laboratory Results",
      type: "Lab Results",
      description: "Structured laboratory test results and biomarker data",
      icon: Upload,
      supportedFormats: [".csv", ".xlsx", ".json"],
      requirements: ["Patient ID column", "Test date column", "Result value column"],
    },
    {
      id: "imaging-dicom",
      name: "Medical Imaging",
      type: "Imaging Data",
      description: "DICOM medical imaging files and metadata",
      icon: Database,
      supportedFormats: [".dcm", ".dicom", ".zip"],
      requirements: ["DICOM standard compliance", "Patient demographics in header"],
    },
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: `FILE-${String(uploadedFiles.length + 1).padStart(3, "0")}`,
        name: file.name,
        type: determineFileType(file.name),
        size: file.size,
        status: "Uploading",
        progress: 0,
        uploadTime: new Date().toISOString(),
        metadata: uploadMetadata,
      }

      setUploadedFiles((prev) => [newFile, ...prev])

      // Simulate upload progress
      simulateUpload(newFile.id)
    })
  }

  const determineFileType = (filename: string): UploadedFile["type"] => {
    const ext = filename.toLowerCase().split(".").pop()
    switch (ext) {
      case "vcf":
      case "bcf":
        return "Genomic Data"
      case "json":
      case "xml":
        return "Clinical Records"
      case "csv":
      case "xlsx":
        return "Lab Results"
      case "dcm":
      case "dicom":
        return "Imaging Data"
      default:
        return "Clinical Records"
    }
  }

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "Uploading") {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)
            if (newProgress === 100) {
              return {
                ...file,
                status: Math.random() > 0.8 ? "Failed" : "Processing",
                progress: newProgress,
                validationResults:
                  Math.random() > 0.8
                    ? {
                        isValid: false,
                        errors: ["Sample validation error"],
                        warnings: [],
                      }
                    : {
                        isValid: true,
                        errors: [],
                        warnings: ["Sample warning"],
                      },
              }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
      setUploadedFiles((prev) =>
        prev.map((file) =>
          file.id === fileId && file.status === "Processing" ? { ...file, status: "Completed" } : file,
        ),
      )
    }, 5000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "#2E8B57"
      case "Processing":
        return "#FF8C00"
      case "Uploading":
        return "#1E90FF"
      case "Failed":
        return "#DC143C"
      default:
        return "#808080"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "Processing":
      case "Uploading":
        return <Clock className="h-4 w-4" />
      case "Failed":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  const deleteFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const retryUpload = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, status: "Uploading", progress: 0 } : file)),
    )
    simulateUpload(fileId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#4A4A4A] flex items-center gap-2">
            <Upload className="h-6 w-6 text-[#1E90FF]" />
            Data Upload
          </h2>
          <p className="text-[#4A4A4A]/70">Secure upload and processing of clinical and genomic data</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            API Documentation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="queue">Upload Queue</TabsTrigger>
          <TabsTrigger value="sources">Data Sources</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* Upload Area */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upload Clinical Data</CardTitle>
              <CardDescription>Drag and drop files or click to browse</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-[#1E90FF] bg-[#1E90FF]/5"
                    : "border-gray-300 hover:border-[#1E90FF] hover:bg-gray-50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-[#4A4A4A]/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#4A4A4A] mb-2">Upload Files</h3>
                <p className="text-[#4A4A4A]/70 mb-4">Drag and drop your files here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <Button asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Browse Files
                  </label>
                </Button>
                <p className="text-xs text-[#4A4A4A]/50 mt-4">
                  Supported formats: VCF, JSON, CSV, XLSX, DICOM, HL7 FHIR
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Upload Metadata */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upload Metadata</CardTitle>
              <CardDescription>Additional information for uploaded files</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patient-id">Patient ID</Label>
                  <Input
                    id="patient-id"
                    placeholder="PT-2024-001"
                    value={uploadMetadata.patientId || ""}
                    onChange={(e) => setUploadMetadata((prev) => ({ ...prev, patientId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select
                    value={uploadMetadata.dataType || ""}
                    onValueChange={(value) => setUploadMetadata((prev) => ({ ...prev, dataType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="genomic">Genomic Data</SelectItem>
                      <SelectItem value="clinical">Clinical Records</SelectItem>
                      <SelectItem value="lab">Lab Results</SelectItem>
                      <SelectItem value="imaging">Imaging Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional notes about this upload..."
                  value={uploadMetadata.description || ""}
                  onChange={(e) => setUploadMetadata((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Upload Queue ({uploadedFiles.length})</CardTitle>
              <CardDescription>Monitor file upload and processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="p-4 rounded-lg border bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded" style={{ backgroundColor: `${getStatusColor(file.status)}20` }}>
                          <div style={{ color: getStatusColor(file.status) }}>{getStatusIcon(file.status)}</div>
                        </div>
                        <div>
                          <h4 className="font-medium text-[#4A4A4A]">{file.name}</h4>
                          <p className="text-sm text-[#4A4A4A]/70">
                            {file.type} • {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          style={{
                            backgroundColor: getStatusColor(file.status),
                            color: "white",
                          }}
                        >
                          {file.status}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => deleteFile(file.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {(file.status === "Uploading" || file.status === "Processing") && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{file.status}</span>
                          <span>{file.progress.toFixed(0)}%</span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-[#4A4A4A]/70">Upload Time:</span>
                        <p className="font-medium">{new Date(file.uploadTime).toLocaleString()}</p>
                      </div>
                      {file.patientId && (
                        <div>
                          <span className="text-[#4A4A4A]/70">Patient ID:</span>
                          <p className="font-medium">{file.patientId}</p>
                        </div>
                      )}
                    </div>

                    {file.metadata && Object.keys(file.metadata).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <span className="text-[#4A4A4A]/70 text-sm">Metadata:</span>
                        <div className="grid md:grid-cols-2 gap-2 mt-1 text-sm">
                          {Object.entries(file.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {file.validationResults && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 mb-2">
                          {file.validationResults.isValid ? (
                            <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-[#DC143C]" />
                          )}
                          <span className="text-sm font-medium">
                            Validation {file.validationResults.isValid ? "Passed" : "Failed"}
                          </span>
                        </div>

                        {file.validationResults.errors.length > 0 && (
                          <div className="mb-2">
                            <span className="text-xs text-[#DC143C] font-medium">Errors:</span>
                            {file.validationResults.errors.map((error, index) => (
                              <p key={index} className="text-xs text-[#DC143C] ml-2">
                                • {error}
                              </p>
                            ))}
                          </div>
                        )}

                        {file.validationResults.warnings.length > 0 && (
                          <div>
                            <span className="text-xs text-[#FF8C00] font-medium">Warnings:</span>
                            {file.validationResults.warnings.map((warning, index) => (
                              <p key={index} className="text-xs text-[#FF8C00] ml-2">
                                • {warning}
                              </p>
                            ))}
                          </div>
                        )}

                        {file.status === "Failed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 bg-transparent"
                            onClick={() => retryUpload(file.id)}
                          >
                            Retry Upload
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {uploadedFiles.length === 0 && (
                  <div className="text-center py-8">
                    <Upload className="h-12 w-12 text-[#4A4A4A]/30 mx-auto mb-4" />
                    <p className="text-[#4A4A4A]/70">No files uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Supported Data Sources</CardTitle>
              <CardDescription>Compatible file formats and integration options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {dataSources.map((source) => (
                  <div key={source.id} className="p-4 rounded-lg border bg-white">
                    <div className="flex items-center gap-3 mb-3">
                      <source.icon className="h-6 w-6 text-[#1E90FF]" />
                      <div>
                        <h4 className="font-medium text-[#4A4A4A]">{source.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {source.type}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-[#4A4A4A]/70 mb-3">{source.description}</p>

                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-[#4A4A4A]">Supported Formats:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {source.supportedFormats.map((format, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-medium text-[#4A4A4A]">Requirements:</span>
                        <ul className="text-xs text-[#4A4A4A]/70 mt-1 ml-2">
                          {source.requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Data Validation Rules</CardTitle>
              <CardDescription>Quality checks and validation criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-[#2E8B57]/10 border border-[#2E8B57]/20">
                  <h4 className="font-semibold text-[#4A4A4A] mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                    Genomic Data Validation
                  </h4>
                  <ul className="text-sm text-[#4A4A4A] space-y-1">
                    <li>• VCF format compliance (v4.2+)</li>
                    <li>• Reference genome consistency</li>
                    <li>• Quality score thresholds</li>
                    <li>• Allele frequency validation</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20">
                  <h4 className="font-semibold text-[#4A4A4A] mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1E90FF]" />
                    Clinical Data Validation
                  </h4>
                  <ul className="text-sm text-[#4A4A4A] space-y-1">
                    <li>• FHIR R4 compliance</li>
                    <li>• Patient identifier validation</li>
                    <li>• Date format consistency</li>
                    <li>• Required field completeness</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-[#FF8C00]/10 border border-[#FF8C00]/20">
                  <h4 className="font-semibold text-[#4A4A4A] mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-[#FF8C00]" />
                    Security & Privacy
                  </h4>
                  <ul className="text-sm text-[#4A4A4A] space-y-1">
                    <li>• HIPAA compliance verification</li>
                    <li>• Data encryption validation</li>
                    <li>• Access control checks</li>
                    <li>• Audit trail generation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
