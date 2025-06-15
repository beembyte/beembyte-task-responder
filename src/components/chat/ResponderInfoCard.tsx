
```tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@/types";

interface ResponderInfoCardProps {
  responder: UserType | null;
}

const getRoboHashUrl = (name: string) => {
  const base = name ? name.trim() : "responder";
  return `https://robohash.org/${encodeURIComponent(base)}.png?set=set4&size=80x80`;
};

const ResponderInfoCard: React.FC<ResponderInfoCardProps> = ({ responder }) => {
  const responderName = responder ? `${responder.first_name} ${responder.last_name}` : "Responder";
  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={getRoboHashUrl(responder?.first_name || "responder")}
              alt={responderName}
            />
            <AvatarFallback>{(responder?.first_name || "R").charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-lg text-foreground">
              {responderName}
            </div>
            <div className="text-sm text-green-600 flex items-center">
              <span className="w-2 h-2 rounded-full mr-1.5 bg-green-500"></span>
              Online
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-3 text-sm">
            <div>
                <p className="text-muted-foreground">About Me</p>
                <p className="text-foreground font-medium">Ready to help with your tasks efficiently and professionally.</p>
            </div>
            <div>
                <p className="text-muted-foreground">Member Since</p>
                <p className="text-foreground font-medium">Jan 15, 2024</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponderInfoCard;
```
