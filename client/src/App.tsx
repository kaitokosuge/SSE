import { useState, useEffect, useRef } from "react";

function App() {
  const [number, setNumber] = useState(null);
  const [status, setStatus] = useState("停止中");
  const [isReceiving, setIsReceiving] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startSSE = () => {
    if (eventSourceRef.current) return;

    const es = new EventSource("http://localhost:8080/number");
    eventSourceRef.current = es;
    setStatus("受信中...");
    setIsReceiving(true);

    es.onmessage = (event) => {
      setNumber(event.data);
    };

    es.onerror = () => {
      console.error("SSE connection failed.");
      stopSSE();
    };
  };

  const stopSSE = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setStatus("停止中");
      setIsReceiving(false);
    }
  };

  useEffect(() => {
    return () => stopSSE();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>SSE Random Number Stream</h1>
      <div style={{ fontSize: "48px", margin: "20px" }}>
        {number !== null ? number : "--"}
      </div>
      <p>
        ステータス: <strong>{status}</strong>
      </p>

      <button onClick={startSSE} disabled={isReceiving}>
        開始
      </button>
      <button
        onClick={stopSSE}
        disabled={!isReceiving}
        style={{ marginLeft: "10px" }}
      >
        停止（キャンセル）
      </button>
    </div>
  );
}

export default App;
