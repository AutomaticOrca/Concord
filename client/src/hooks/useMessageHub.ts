import { useEffect, useRef } from "react";
import { createMessageHubConnection } from "@/lib/signalrClient";
import type { MessageDto, ChatDto } from "@/types";

export function useMessageHub({
  token,
  recipient,
  onNewMessage,
  onChatListUpdate,
}: {
  token: string;
  recipient: string;
  onNewMessage: (msg: MessageDto) => void;
  onChatListUpdate: (chat: ChatDto) => void;
}) {
  const hubRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    if (!token || !recipient) return;

    const hub = createMessageHubConnection(token, recipient);
    hubRef.current = hub;

    hub.on("NewMessage", onNewMessage);
    hub.on("ChatListItemUpdated", onChatListUpdate);

    hub.start().catch((err) => console.error("❌ SignalR failed", err));

    return () => {
      hub.stop();
    };
  }, [token, recipient]);

  return hubRef;
}
