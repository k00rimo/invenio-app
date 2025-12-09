"use client";

import { useCallback } from "react";
import { useDropzone, type FileRejection, type DropzoneOptions } from "react-dropzone";
import { useFormContext, useController } from "react-hook-form";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileUploaderProps {
  name: string;
  label?: string;
  accept?: DropzoneOptions["accept"];
  maxSize?: number; // in bytes
  maxFiles?: number;
}

const formatFileSize = (bytes: number) => {
if (bytes === 0) return "0 Bytes";
const k = 1024;
const sizes = ["Bytes", "KB", "MB", "GB"];
const i = Math.floor(Math.log(bytes) / Math.log(k));
return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileUploader = ({
  name,
  label,
  accept,
  maxSize = 1024 * 1024 * 50, // Default 50MB
  maxFiles = 10,
}: FileUploaderProps) => {
  const { control, setError, clearErrors } = useFormContext();

  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        const firstError = rejectedFiles[0].errors[0];
        setError(name, {
          type: "manual",
          message: firstError.message || "File validation failed",
        });
        return;
      }

      clearErrors(name);

      const currentFiles = Array.isArray(value) ? value : [];
      
      const availableSlots = maxFiles - currentFiles.length;
      if (availableSlots <= 0) {
        setError(name, { type: "manual", message: `Maximum ${maxFiles} files allowed`});
        return;
      }

      const newFiles = [...currentFiles, ...acceptedFiles].slice(0, maxFiles);
      onChange(newFiles);
    },
    [name, setError, clearErrors, value, onChange, maxFiles]
  );

  const removeFile = (indexToRemove: number) => {
    const currentFiles = Array.isArray(value) ? value : [];
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    onChange(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles,
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "group relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed px-6 py-10 transition-colors cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:bg-muted/50",
          error && "border-destructive/50 bg-destructive/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="p-4 bg-background rounded-full shadow-sm border">
            <UploadCloud className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {label || "Click to upload"} or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              Max file size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      </div>

      {/* FILE LIST */}
      {Array.isArray(value) && value.length > 0 && (
        <ScrollArea className="h-fit w-full border">
          <div className="p-4 space-y-3">
            {value.map((file: File, index: number) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-muted/40 hover:bg-muted transition-colors group"
              >
                <div className="flex items-center pl-1 overflow-hidden">
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-medium truncate max-w-[200px] sm:max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-sm text-gray-dark">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default FileUploader
