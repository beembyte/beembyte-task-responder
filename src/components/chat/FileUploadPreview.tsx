
import React from "react";
import { File as FileIcon, X, FileImage, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadPreviewProps {
    files: File[];
    onRemoveFile: (index: number) => void;
}

const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <FileImage className="h-6 w-6 text-blue-500 flex-shrink-0" />;
    if (fileType === "application/pdf") return <FileText className="h-6 w-6 text-red-500 flex-shrink-0" />;
    if (fileType.includes("document") || fileType === "text/csv" || fileType.includes("sheet")) return <FileText className="h-6 w-6 text-gray-700 flex-shrink-0" />;
    return <FileIcon className="h-6 w-6 text-gray-500 flex-shrink-0" />;
};

const formatFileSize = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const FileUploadPreview: React.FC<FileUploadPreviewProps> = ({ files, onRemoveFile }) => {
    if (files.length === 0) return null;

    return (
        <div className="p-4 border-t bg-gray-50 max-h-48 overflow-y-auto">
            <div className="grid gap-3">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md text-sm border shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {getFileIcon(file.type)}
                            <div className="overflow-hidden">
                                <p className="truncate font-medium text-gray-800">{file.name}</p>
                                <p className="text-gray-500 text-xs">{formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-gray-500 hover:text-red-500 hover:bg-red-50" onClick={() => onRemoveFile(index)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FileUploadPreview;
