
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";

interface ChatInputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onAttachFile?: (files: FileList) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  recipientName?: string;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onSend,
  onAttachFile,
  onKeyPress,
  recipientName,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (onAttachFile && files && files.length > 0) {
      onAttachFile(files);
    }
  };

  return (
    <div className="px-4 py-3 border-t bg-white">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={`Message ${recipientName || '...'}`}
            className="bg-gray-100 border-none rounded-full pr-10 py-3 text-sm h-11 pl-4 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleAttach}
          >
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
        <Button 
          onClick={onSend} 
          size="icon" 
          className="h-11 w-11 rounded-full flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBox;
