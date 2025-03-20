"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, FileIcon, ImageIcon, FileTextIcon, FileAudioIcon, FileVideoIcon } from "lucide-react"

type FileUploadProps = {
  onFileUpload: (file: File) => void
  onFileRemove: (fileId: string) => void
  uploadedFiles: UploadedFile[]
}

export type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  progress: number
  url?: string
}

export function FileUpload({ onFileUpload, onFileRemove, uploadedFiles }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
      e.target.value = ""
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6" />
    if (fileType.startsWith("audio/")) return <FileAudioIcon className="h-6 w-6" />
    if (fileType.startsWith("video/")) return <FileVideoIcon className="h-6 w-6" />
    if (fileType === "application/pdf" || fileType.includes("document")) return <FileTextIcon className="h-6 w-6" />
    return <FileIcon className="h-6 w-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
      />

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div className="space-y-1">
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onFileRemove(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {file.progress < 100 && <Progress value={file.progress} className="h-1 mt-2" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

