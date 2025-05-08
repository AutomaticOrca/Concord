import * as signalR from "@microsoft/signalr";
import { BASE_URL } from "./config";

export const createMessageHubConnection = (
  token: string,
  recipient: string
) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${BASE_URL}/hubs/message?user=${recipient}`, {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
};
