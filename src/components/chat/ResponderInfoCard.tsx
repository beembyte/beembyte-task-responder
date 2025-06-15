
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserType } from "@/types";

interface ResponderInfoCardProps {
  responder: UserType | null;
}

// Generate RoboHash set3 avatar (set3 = cute monsters/avatars)
const getRoboHashUrl = (name: string) => {
  const base = name ? name.trim() : "client";
  return `https://robohash.org/${encodeURIComponent(base)}.png?set=set3&size=80x80`;
};

const ResponderInfoCard: React.FC<ResponderInfoCardProps> = ({ responder }) => {
  // Show first and last name, fallback to "Client" if data missing
  const responderName = responder ? `${responder.first_name} ${responder.last_name}` : "Client";
  // Example join date (could take from responder.last_login or omit if unavailable)
  const joinDate =
    responder && responder.last_login
      ? new Date(responder.last_login).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <Card className="border-none shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={getRoboHashUrl(responder?.first_name || "client")}
              alt={responderName}
            />
            <AvatarFallback>
              {(responder?.first_name || "C").charAt(0)}
            </AvatarFallback>
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
            <p className="text-muted-foreground">About Client</p>
            <p className="text-foreground font-medium">
              {responder && responder.email
                ? `Contact: ${responder.email}`
                : "A valued client using our platform."}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Member Since</p>
            <p className="text-foreground font-medium">{joinDate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResponderInfoCard;
