import WebSocketClient from '../components/websocketClient';

export default function Home() {
  return (
    <div>
      <h1 style={{ width: "100%", textAlign: "center"}}>Next.js WebSocket Example</h1>
      <WebSocketClient />
    </div>
  );
}