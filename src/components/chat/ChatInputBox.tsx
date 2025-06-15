
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  onAttachFile?: (files: FileList) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
}

const ChatInputBox: React.FC<ChatInputBoxProps> = ({
  value,
  onChange,
  onSend,
  onAttachFile,
  onKeyPress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (onAttachFile && files && files.length > 0) {
      onAttachFile(files);
      toast({
        title: "File attached",
        description: `${files[0].name} ready to send`,
      });
    }
  };

  return (
    <div className="px-4 py-2 border-t bg-white">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            className="pr-10 py-3 text-sm"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 -translate-y-1/2"
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
          className="h-10 w-10 rounded-full"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInputBox;
