// src/context/ChatContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";
import { useAuth } from "@/context/AuthContext"; // Assuming AuthContext provides user with token
import { getUser } from "@/lib/api/detail";
import { getMessageThread } from "@/lib/api/chat";
import { MemberDto, MessageDto } from "@/types";

// Define the shape of the context state and actions
interface ChatContextState {
  chatPartner: MemberDto | null;
  messages: MessageDto[];
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  isLoading: boolean;
  error: string | null;
  currentChatUsername: string | null; // Track which chat is active
}

interface ChatContextActions {
  sendMessage: (content: string) => Promise<void>;
  loadChat: (username: string) => void; // Function to initiate/switch chat
  disconnectChat: () => void; // Function to explicitly disconnect
}

// Combine state and actions for the context value
type ChatContextValue = ChatContextState & ChatContextActions;

// Create the context
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Define props for the provider
interface ChatProviderProps {
  children: ReactNode;
}

// Create the Provider Component
export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth(); // Get authenticated user (needs token)
  const [chatPartner, setChatPartner] = useState<MemberDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentChatUsername, setCurrentChatUsername] = useState<string | null>(
    null
  );
  // Use a ref to track the *current* username inside async/callback functions
  // This helps avoid stale closure issues in SignalR handlers
  const currentChatUsernameRef = useRef<string | null>(null);

  // Update the ref whenever the state changes
  useEffect(() => {
    currentChatUsernameRef.current = currentChatUsername;
  }, [currentChatUsername]);

  // --- Disconnect Function ---
  const disconnectChat = useCallback(async () => {
    setCurrentChatUsername(null); // Signal intent to disconnect
    if (connection) {
      console.log("ChatContext: Stopping previous SignalR connection...");
      await connection.stop();
      setConnection(null); // Clear connection object
      setConnectionStatus("disconnected");
      console.log("ChatContext: Previous SignalR connection stopped.");
    }
    // Reset state when explicitly disconnecting or switching users
    setChatPartner(null);
    setMessages([]);
    setIsLoading(false);
    setError(null);
  }, [connection]); // Dependency on connection state

  // --- Load Chat Function ---
  const loadChat = useCallback(
    async (username: string) => {
      if (!username || username === currentChatUsernameRef.current) {
        console.log(
          `ChatContext: Skipping loadChat. Username: ${username}, Current: ${currentChatUsernameRef.current}`
        );
        return; // Avoid reloading the same chat or loading with no username
      }

      console.log(`ChatContext: loadChat called for username: ${username}`);
      setIsLoading(true);
      setError(null);
      setMessages([]); // Clear previous messages immediately
      setChatPartner(null); // Clear previous partner

      // Disconnect previous connection *before* setting the new username
      if (connection) {
        console.log(
          "ChatContext: Disconnecting existing connection before loading new chat."
        );
        await disconnectChat(); // Use the disconnect function
      }

      // Now set the new username AFTER cleanup
      setCurrentChatUsername(username); // This triggers the useEffects below

      try {
        console.log(`ChatContext: Fetching initial data for ${username}...`);
        const [userData, thread] = await Promise.all([
          getUser(username),
          getMessageThread(username),
        ]);
        // Only update state if the fetched data is for the *currently* intended chat user
        if (currentChatUsernameRef.current === username) {
          setChatPartner(userData);
          setMessages(thread);
          console.log(
            `ChatContext: Loaded ${thread.length} historical messages for ${username}.`
          );
        } else {
          console.warn(
            `ChatContext: Data fetched for ${username}, but current chat target changed to ${currentChatUsernameRef.current}. Discarding fetched data.`
          );
        }
      } catch (err: unknown) {
        console.error("❌ ChatContext: Failed to load initial chat data", err);
        if (currentChatUsernameRef.current === username) {
          setError(`Failed to load chat data for ${username}.`);
        }
      } finally {
        // Only set loading to false if we are still targeting this user
        if (currentChatUsernameRef.current === username) {
          setIsLoading(false);
        }
      }
    },
    [disconnectChat, connection]
  ); // Add disconnectChat dependency

  // --- Effect for SignalR Connection ---
  useEffect(() => {
    // 1. Dependency checks
    if (!currentChatUsername || !user?.token) {
      console.log(
        `ChatContext SignalR Effect: Skipping (no currentChatUsername [${currentChatUsername}] or token)`
      );
      // Ensure disconnected state if dependencies missing
      if (connectionStatus !== "disconnected") {
        setConnectionStatus("disconnected");
        setConnection(null);
      }
      return;
    }

    // Avoid reconnecting if already connected/connecting to the *same* user
    if (connection && connectionStatus !== "disconnected") {
      // Ideally, check if connection URL matches currentChatUsername if possible,
      // but HubConnection doesn't easily expose the initial URL query params.
      // For now, rely on loadChat logic to disconnect first.
      console.log(
        `ChatContext SignalR Effect: Connection exists with status ${connectionStatus}. Assuming it's for ${currentChatUsername}.`
      );
      return;
    }

    // 2. Set initial status & Log
    setConnectionStatus("connecting");
    setError(null); // Clear previous errors
    console.log(
      `ChatContext SignalR Effect: Status 'connecting' for chat with ${currentChatUsername}.`
    );

    // 3. Create HubConnection instance
    const newConnection = new HubConnectionBuilder()
      .withUrl(
        `http://localhost:5000/hubs/message?user=${currentChatUsername}`,
        {
          accessTokenFactory: () => user.token,
        }
      )
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    // 4. Define message receiver
    const handleNewMessage = (message: MessageDto) => {
      // Check if the received message belongs to the currently active chat window
      // Requires message structure to include sender/recipient info accessible here
      const isActiveChat =
        message.senderUsername === currentChatUsernameRef.current ||
        message.recipientUsername === currentChatUsernameRef.current;

      if (
        isActiveChat &&
        message &&
        typeof message === "object" &&
        "id" in message
      ) {
        console.log(
          "📩 ChatContext SignalR: Received NewMessage for active chat:",
          message
        );
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => m.id === message.id)) {
            console.warn(
              "Duplicate message received, skipping state update:",
              message.id
            );
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      } else if (!isActiveChat) {
        console.log(
          "📩 ChatContext SignalR: Received NewMessage for INACTIVE chat:",
          message
        );
        // Optional: Handle notifications for inactive chats here (e.g., update a global counter)
      } else {
        console.warn(
          "Received unexpected message format on NewMessage:",
          message
        );
      }
    };

    // 5. Define connection close handler
    const handleConnectionClose = (error?: Error) => {
      // Only set error/disconnected if this specific connection instance closed
      // Check if the closed connection is the one we currently hold in state
      if (
        connection === newConnection ||
        !connection /* If connection state was already null */
      ) {
        if (error) {
          console.error(
            "ChatContext SignalR Effect: Connection closed due to error.",
            error
          );
          setConnectionStatus("error");
          setError("Connection lost. Attempting to reconnect..."); // Provide user feedback
        } else {
          console.log(
            "ChatContext SignalR Effect: Connection closed gracefully."
          );
          setConnectionStatus("disconnected");
        }
        setConnection(null); // Clear the connection state
      } else {
        console.log(
          "ChatContext SignalR Effect: An older connection instance closed. Ignoring."
        );
      }
    };

    // 6. Start connection
    newConnection
      .start()
      .then(() => {
        // Check if we are still trying to connect to the *same user*
        if (currentChatUsernameRef.current === currentChatUsername) {
          setConnection(newConnection);
          setConnectionStatus("connected");
          console.log(
            `✅ ChatContext SignalR Effect: Connected for ${currentChatUsername}. ID: ${newConnection.connectionId}`
          );
          newConnection.on("NewMessage", handleNewMessage);
        } else {
          console.warn(
            `ChatContext SignalR Effect: Connection successful for ${currentChatUsername}, but target user changed to ${currentChatUsernameRef.current}. Disconnecting.`
          );
          newConnection.stop(); // Stop the connection immediately
          setConnectionStatus("disconnected"); // Reset status
        }
      })
      .catch((err) => {
        // Check if the error corresponds to the current connection attempt
        if (currentChatUsernameRef.current === currentChatUsername) {
          setConnectionStatus("error");
          setConnection(null);
          setError("Failed to connect to chat server.");
          console.error(
            `❌ ChatContext SignalR Effect: Connection failed for ${currentChatUsername}.`,
            err
          );
        } else {
          console.warn(
            `ChatContext SignalR Effect: Connection failed for ${currentChatUsername}, but target user changed to ${currentChatUsernameRef.current}. Ignoring error.`
          );
        }
      });

    // 7. Register close handler
    newConnection.onclose(handleConnectionClose);

    // 8. Cleanup function
    return () => {
      console.log(
        `ChatContext SignalR Effect Cleanup: Cleaning up connection attempt/instance for ${currentChatUsername}...`
      );
      // Ensure we remove listeners and stop the connection *instance* created in *this* effect run
      newConnection.off("NewMessage", handleNewMessage);
      newConnection.off("close", handleConnectionClose);
      newConnection
        .stop()
        .then(() =>
          console.log(
            `ChatContext SignalR Cleanup: Stopped connection instance for ${currentChatUsername}.`
          )
        )
        .catch((err) =>
          console.error(
            `ChatContext SignalR Cleanup error for ${currentChatUsername}:`,
            err
          )
        );

      // Avoid resetting global state here if another connection process might be starting immediately
      // Let the `loadChat` or subsequent effect runs handle the state based on `currentChatUsername`
      // We only definitively set to disconnected if the *current* username becomes null
      if (!currentChatUsernameRef.current) {
        setConnectionStatus("disconnected");
        setConnection(null);
        console.log(
          "ChatContext SignalR Cleanup: Setting status to disconnected as currentChatUsername is null."
        );
      }
    };
  }, [currentChatUsername, user?.token]); // Re-run when chat user or auth token changes

  // --- Send Message Function ---
  const sendMessage = useCallback(
    async (content: string) => {
      if (
        !content.trim() ||
        !connection ||
        connectionStatus !== "connected" ||
        !currentChatUsername
      ) {
        console.error("ChatContext: Cannot send message. Invalid state.", {
          content: !!content.trim(),
          connection: !!connection,
          status: connectionStatus,
          username: currentChatUsername,
        });
        setError("Cannot send message: not connected or no recipient.");
        return;
      }

      try {
        await connection.invoke("SendMessage", {
          recipientUsername: currentChatUsername, // Use state for username
          content: content.trim(),
        });
        setError(null); // Clear error on successful send
      } catch (err) {
        console.error(
          "❌ ChatContext: Failed to send message via SignalR:",
          err
        );
        setError("Failed to send message.");
        // Maybe trigger a reconnect attempt or provide more specific feedback
      }
    },
    [connection, connectionStatus, currentChatUsername]
  ); // Dependencies

  // --- Context Value ---
  const value: ChatContextValue = {
    chatPartner,
    messages,
    connectionStatus,
    isLoading,
    error,
    currentChatUsername,
    sendMessage,
    loadChat,
    disconnectChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// --- Custom Hook for Consuming the Context ---
export const useChat = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
