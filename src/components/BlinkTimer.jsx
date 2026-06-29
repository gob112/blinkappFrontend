import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
//open websocket
//get predicted data
//every 10 sec check ratio of array of data
//compare ratio
// if more that 40% reroute to /timer
//make button and function to choose mode of dummy data
const BlinkTimer = () => {
  const [predictions, setPredictions] = useState([]);
  const [currentServerMode, setCurrentServerMode] = useState("normal");
  const wsRef = useRef(null);
  const predictionsRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Open connection to your FastAPI backend
    wsRef.current = new WebSocket("ws://localhost:8000/test");

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPredictions((prev) => {
        const next = [...prev, data.pred];
        const trimmed = next.length > 15 ? next.slice(-5) : next;
        predictionsRef.current = trimmed;
        return trimmed;
      });
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // 2. The 10-Second Sliding Ratio Audit Mechanism
  useEffect(() => {
    const Interval = setInterval(() => {
      if (predictionsRef.current.length === 0) return;
     

      // Count abnormal flags 
      const recentData = predictionsRef.current.slice(-10)
      const abnormalCount = recentData.filter((p) => p === 1).length;
      const ratio = abnormalCount / recentData.length;
      console.log(ratio)
      
      // 40% Threshold Check Condition
      if (ratio >= 0.40) {
        console.log("ratio more than 40%");
        clearInterval(Interval);
        setPredictions([]);
        
        if (wsRef.current) wsRef.current.close();
        
        //reroute to timer
        navigate("/timer");
      }

      
      
    }, 10000); // 10 seconds

    return () => clearInterval(Interval);
  }, [navigate]);
  //mode change if abnormal dummy data or normal 
  const sendModeChangeRequest = (mode) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      setCurrentServerMode(mode);
       setPredictions([]);
      
      wsRef.current.send(JSON.stringify({ type: mode }));
     
    }
  };

  return (
    <div style={{ padding: "20px", marginTop: "40px", border: "1px solid #ccc", borderRadius: "8px" }}>
      

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "20px 0" }}>
        <button onClick={() => sendModeChangeRequest("normal")} disabled={currentServerMode === "normal"}>
          Inject Normal Stream
        </button>
        <button onClick={() => sendModeChangeRequest("abnormal")} disabled={currentServerMode === "abnormal"}>
        Inject Abnormal Stream
        </button>
      </div>

      <div style={{ background: "#222", color: "#0f0", padding: "15px", borderRadius: "5px", fontFamily: "monospace" }}>
        <strong>Live Array:</strong> {JSON.stringify(predictions)}
      </div>
    </div>
  );
};

export default BlinkTimer;