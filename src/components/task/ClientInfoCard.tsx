
import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type TaskInfo } from "@/types"

interface ClientInfoCardProps {
  task: TaskInfo
}

const getRoboHashUrl = (name: string) => {
  const base = name ? name.trim() : "client";
  return `https://robohash.org/${encodeURIComponent(base)}.png?size=80x80&set=set1`;
};

const renderStatusBadge = (status?: string) => {
  if (!status) return null;
  const color =
    status.toLowerCase() === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
};

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  task
}) => {
  const client = task.created_by;

  return (
    <Card className="border border-muted-foreground/10 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="w-5 h-5" />
          Client
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={getRoboHashUrl(client?.first_name || "client")}
              alt={client?.first_name || "Client"}
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-foreground text-sm">
              {client?.first_name} {client?.last_name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {renderStatusBadge(client?.status)}
              {client?.is_verified && (
                <span className="text-emerald-600 bg-emerald-50 rounded px-1 py-0.5 text-[10px] font-semibold ml-2">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div>
            <span className="font-medium text-foreground">Email:</span>{" "}
            <span className="text-muted-foreground">{client?.email || "—"}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Phone:</span>{" "}
            <span className="text-muted-foreground">{client?.phone_number || "—"}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Tasks:</span>{" "}
            <span className="text-foreground font-medium">
              {typeof client?.tasks_count === "number" ? client.tasks_count : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClientInfoCard
