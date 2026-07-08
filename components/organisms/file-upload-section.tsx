"use client";

import { useEffect, useState } from "react";
import { formatBytes, useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { Progress } from "../ui/progress";
import { progress } from "motion/react";

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface ProgressUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  title: string;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
  progress: number;
}

export function FileUploadSection({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = "*",
  multiple = true,
  title,
  className,
  onFilesChange,
  simulateUpload = true,
  progress,
}: ProgressUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

  const [
    { isDragging },
    { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: [],
    onFilesChange: (newFiles) => {
      const newUploadFiles = newFiles.map((file) => {
        const existingFile = uploadFiles.find((existing) => existing.id === file.id);

        if (existingFile) {
          return {
            ...existingFile,
            ...file,
          };
        } else {
          return {
            ...file,
            progress: 0,
            status: "uploading" as const,
          };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== "uploading") return file;

          const increment = Math.random() * 15 + 5;
          const newProgress = Math.min(file.progress + increment, 100);

          if (newProgress > 50 && Math.random() < 0.1) {
            return {
              ...file,
              status: "error" as const,
              error: "Upload failed. Please try again.",
            };
          }

          if (newProgress >= 100) {
            return {
              ...file,
              progress: 100,
              status: "completed" as const,
            };
          }

          return {
            ...file,
            progress: newProgress,
          };
        })
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  return (
    <div
      className={cn(
        "rounded-lg relative border border-dashed p-8 text-center transition-colors size-full",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input {...getInputProps()} className="sr-only" id="file-input" />
      <div className="flex flex-col items-center gap-4 justify-center size-full">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-full",
            isDragging ? "bg-primary/10" : "bg-muted"
          )}
        >
          <UploadIcon
            className={cn("h-6", isDragging ? "text-primary" : "text-muted-foreground")}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">
            Drag and drop files here or click to browse
          </p>
          <p className="text-muted-foreground text-xs">
            Support for single file types up to {formatBytes(maxSize)}
          </p>
        </div>

        <Button onClick={openFileDialog}>
          <UploadIcon className="h-4 w-4" />
          Select files
        </Button>

        {progress > 0 && <Progress value={progress} />}
      </div>
    </div>
  );
}
