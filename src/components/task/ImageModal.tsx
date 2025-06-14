
import React from "react"
import { Dialog } from "@radix-ui/react-dialog"

interface ImageModalProps {
  imageUrl: string
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden max-w-full max-h-full p-2"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Full Preview"
          className="max-h-[80vh] max-w-[90vw] object-contain"
        />
      </div>
    </div>
  )
}

export default ImageModal
