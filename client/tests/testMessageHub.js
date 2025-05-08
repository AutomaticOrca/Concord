import * as signalR from "@microsoft/signalr";

const USERNAME = "ken";
const JWT_TOKEN =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxMDAyIiwidW5pcXVlX25hbWUiOiJrZW4iLCJyb2xlIjoiTWVtYmVyIiwibmJmIjoxNzQ0MTAyMjM4LCJleHAiOjE3NDQ3MDcwMzgsImlhdCI6MTc0NDEwMjIzOH0.oZ6yfUluf-97YtdpEByorflDsxppSsexLVv2nR7WKETPcfWjfRhm8eA93q5j1KuXzlAiTrs_OQ1S_uHlkplKUA";

const RECIPIENT = "ryan";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`http://localhost:5000/hubs/message?user=${RECIPIENT}`, {
    accessTokenFactory: () => JWT_TOKEN,
  })
  .configureLogging(signalR.LogLevel.Information)
  .withAutomaticReconnect()
  .build();

// 监听聊天消息
connection.on("NewMessage", (messageDto) => {
  console.log(
    `📩 NewMessage from ${messageDto.senderUsername}: ${messageDto.content}`
  );
});

// 监听聊天列表更新
connection.on("ChatListItemUpdated", (chatDto) => {
  console.log(
    `🔁 ChatListItemUpdated: ${chatDto.chatPartnerUsername} - ${chatDto.lastMessage}`
  );
});

// 连接并发送测试消息
async function run() {
  try {
    await connection.start();
    console.log("✅ Connected to MessageHub");

    // 创建测试消息
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
