
import React from "react"

interface ChatMessageTextProps {
  text: string
  isResponder: boolean
}

const urlRegex =
  /((https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/[^\s]*)?)/gi

// Extracts the first url in the text, if available
function extractFirstUrl(text: string): string | null {
  const match = text.match(urlRegex)
  if (match && match[0]) {
    const url = match[0].startsWith("http") ? match[0] : "https://" + match[0]
    return url
  }
  return null
}

const LinkPreview: React.FC<{ url: string }> = ({ url }) => {
  let hostname: string = ""
  try {
    hostname = new URL(url).hostname
  } catch {
    hostname = url
  }
  return (
    <div className="mt-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded px-2 py-1 max-w-xs overflow-x-auto">
      <span className="font-medium">Preview:</span> {hostname}
    </div>
  )
}

const ChatMessageText: React.FC<ChatMessageTextProps> = ({ text, isResponder }) => {
  if (!text) return null

  // Find URLs and split text
  const parts = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const regex = new RegExp(urlRegex)
  while ((match = regex.exec(text)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-sm">{text.slice(lastIndex, match.index)}</span>
      )
    }
    // Push the link part, always start with http(s).
    const url = match[0].startsWith("http") ? match[0] : "https://" + match[0]
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`underline font-medium text-sm ${
          isResponder
            ? "text-white hover:text-blue-200"
            : "text-blue-700 hover:text-blue-900"
        }`}
        style={{
          wordBreak: "break-all",
          // Force white background for links sent by responder
          background: isResponder ? "rgba(255,255,255,0.2)" : undefined,
          borderRadius: "3px",
          padding: "0 2px",
        }}
      >
        {match[0]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  // Push any remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-rest`} className="text-sm">{text.slice(lastIndex)}</span>
    )
  }

  // Show link preview for first link only
  const firstUrl = extractFirstUrl(text)

  return (
    <span className="text-sm">
      {parts}
      {firstUrl && <LinkPreview url={firstUrl} />}
    </span>
  )
}

export default ChatMessageText

