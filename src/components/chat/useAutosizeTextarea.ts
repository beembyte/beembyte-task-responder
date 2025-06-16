
import { useLayoutEffect } from "react";

export function useAutosizeTextarea(
  ref: React.RefObject<HTMLTextAreaElement>,
  value: string,
  { minRows = 1, maxRows = 4 } = {}
) {
  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 22;
    // Calculate new height
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;
    textarea.style.height = `${minHeight}px`;
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }, [ref, value, minRows, maxRows]);
}
