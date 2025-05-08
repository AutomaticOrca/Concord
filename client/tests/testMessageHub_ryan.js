import * as signalR from "@microsoft/signalr";

const USERNAME = "ryan";
const JWT_TOKEN =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMDAzIiwidW5pcXVlX25hbWUiOiJyeWFuIiwicm9sZSI6Ik1lbWJlciIsIm5iZiI6MTc0NDEwMzEwNywiZXhwIjoxNzQ0NzA3OTA3LCJpYXQiOjE3NDQxMDMxMDd9.jUPXJggUgwOFy744PF_NGIqkxiyCHx9EIYnP-pT6tAVX1yDDMh4cf-Bhx0Ldg3mU4kEcHiopwwB0GPIYuuV2NQ";

const RECIPIENT = "ken";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`http://localhost:5000/hubs/message?user=${RECIPIENT}`, {
    accessTokenFactory: () => JWT_TOKEN,
  })
  .configureLogging(signalR.LogLevel.Information)
  .withAutomaticReconnect()
  .build();

connection.on("NewMessage", (messageDto) => {
  console.log(
    `📩 NewMessage from ${messageDto.senderUsername}: ${messageDto.content}`
  );
});

connection.on("ChatListItemUpdated", (chatDto) => {
  console.log(
    `🔁 ChatListItemUpdated: ${chatDto.chatPartnerUsername} - ${chatDto.lastMessage}`
  );
});

async function run() {
  try {
    await connection.start();
    console.log("✅ Connected to MessageHub");

    const message = {
      recipientUsername: RECIPIENT,
      content: "Hello from Node.js tester!",
    };

    await connection.invoke("SendMessage", message);
    console.log("✅ Message sent.");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

run();
