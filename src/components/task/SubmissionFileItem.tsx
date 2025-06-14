
import React, { useState } from "react"
import ImageModal from "./ImageModal"
import { FileImage, FileSignature, FileText as FileTextIcon } from "lucide-react"

interface SubmissionFileItemProps {
  url: string
}

/** Determine file extension from URL for thumbnail/icon logic */
function getFileType(url: string): "image" | "pdf" | "doc" | "text" | "other" {
  if (!url) return "other"
  const ext = url.split(".").pop()?.toLowerCase()?.split(/\#|\?/)[0] || ""

  if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff"].includes(ext)) return "image"
  if (["pdf"].includes(ext)) return "pdf"
  if (["doc", "docx"].includes(ext)) return "doc"
  if (["txt", "md"].includes(ext)) return "text"
  return "other"
}

const SubmissionFileItem: React.FC<SubmissionFileItemProps> = ({ url }) => {
  const [showModal, setShowModal] = useState(false)
  const fileType = getFileType(url)

  if (fileType === "image") {
    return (
      <>
        <img
          src={url}
          alt="Submitted file"
          loading="lazy"
          className="h-16 w-16 object-cover rounded border cursor-pointer transition hover:ring-2 hover:ring-emerald-400"
          onClick={() => setShowModal(true)}
        />
        {showModal && <ImageModal imageUrl={url} onClose={() => setShowModal(false)} />}
      </>
    )
  }

  if (fileType === "pdf") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center w-16"
        title="Open PDF"
        style={{ textDecoration: "none" }}
      >
        <FileSignature className="h-8 w-8 text-red-500 mb-1" />
        <span className="text-[10px] text-muted-foreground truncate w-full">PDF</span>
      </a>
    )
  }

  if (fileType === "doc") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center w-16"
        title="Open Document"
        style={{ textDecoration: "none" }}
      >
        <FileTextIcon className="h-8 w-8 text-sky-500 mb-1" />
        <span className="text-[10px] text-muted-foreground truncate w-full">DOC</span>
      </a>
    )
  }

  // Fallback for unrecognized files
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center w-16"
      title="Open File"
      style={{ textDecoration: "none" }}
    >
      <FileTextIcon className="h-8 w-8 text-zinc-500 mb-1" />
      <span className="text-[10px] text-muted-foreground truncate w-full">File</span>
    </a>
  )
}

export default SubmissionFileItem

