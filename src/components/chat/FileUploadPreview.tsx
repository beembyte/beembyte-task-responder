
import React, { useEffect, useState } from "react";
import { File as FileIcon, X, Sheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadPreviewProps {
    files: File[];
    onRemoveFile: (index: number) => void;
}

const FilePreviewItem: React.FC<{ file: File; onRemove: () => void }> = ({ file, onRemove }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file.type.startsWith("image/")) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const renderIcon = () => {
        const fileType = file.type;
        const fileName = file.name.toLowerCase();

        if (
          fileType.includes("sheet") ||
          fileName.endsWith(".xlsx") ||
          fileName.endsWith(".xls") ||
          fileName.endsWith(".csv") ||
          fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          fileType === "application/vnd.ms-excel"
        ) {
            return <Sheet className="h-8 w-8 text-green-600" />;
        }
        if (fileType === "application/pdf" || fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
            return <FileText className="h-8 w-8 text-red-500" />;
        }
        return <FileIcon className="h-8 w-8 text-gray-500" />;
    };

    return (
        <div className="w-24 flex-shrink-0">
            <div className="relative aspect-square w-full bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border">
                {previewUrl ? (
                    <img src={previewUrl} alt={file.name} className="h-full w-full object-cover" />
                ) : (
                    renderIcon()
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                    onClick={onRemove}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
            <p className="text-xs mt-1.5 truncate text-center text-gray-600">{file.name}</p>
        </div>
    );
};


const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({ files, onRemoveFile }) => {
    if (files.length === 0) return null;

    return (
        <div className="px-4 pt-3 bg-white">
            <div className="flex gap-3 overflow-x-auto pb-2">
                {files.map((file, index) => (
                    <FilePreviewItem key={index} file={file} onRemove={() => onRemoveFile(index)} />
                ))}
            </div>
        </div>
    );
};

export default FileUploadPreview;
