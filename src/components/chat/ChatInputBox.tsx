
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAutosizeTextarea } from "./useAutosizeTextarea";

interface ChatInputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onAttachFile?: (files: FileList) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  recipientName?: string;
  disabled?: boolean;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onSend,
  onAttachFile,
  onKeyPress,
  recipientName,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextarea(textareaRef, value, { minRows: 1, maxRows: 4 });

  const handleAttach = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (onAttachFile && files && files.length > 0) {
      onAttachFile(files);
    }
    if(e.target) e.target.value = "";
  };

  const handleSend = () => {
    if (!disabled) {
      onSend();
    }
  };

  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={`Message ${recipientName || '...'}`}
            className="bg-gray-100 border-none rounded-2xl pr-10 py-3 text-sm resize-none pl-4 focus-visible:ring-1 focus-visible:ring-primary"
            style={{
              lineHeight: "1.4rem",
              maxHeight: "7.5rem",
              minHeight: "2.5rem",
              overflowY: "auto",
            }}
            rows={1}
            disabled={disabled}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleAttach}
            tabIndex={-1}
            type="button"
            disabled={disabled}
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf,.doc,.docx,text/csv,.xlsx,.xls"
            disabled={disabled}
          />
        </div>
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="h-11 w-11 rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={disabled}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBox;
