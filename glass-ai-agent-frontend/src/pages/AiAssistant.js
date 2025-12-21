import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import aiBg from "../assets/ai-bg.jpg";
import api from "../api/api";

function AiAssistant() {
  const [action, setAction] = useState("LOW_STOCK");
  const [glassType, setGlassType] = useState("");
  const [result, setResult] = useState("");

const askAI = async () => {
  try {
    const res = await api.post("/ai/ask", {
      action,
      glassType
    });
    setResult(res.data);
  } catch (error) {
    console.error(error);
    setResult("❌ Failed to fetch AI response");
  }
};




  return (
    <PageWrapper background={aiBg}>
      <div style={centerWrapper}>
        <div style={glassCard}>
          <h2 style={{ textAlign: "center" }}>🤖 Smart AI Assistant</h2>

          <label>What do you want to know?</label>
          <select value={action} onChange={e => setAction(e.target.value)}>
            <option value="LOW_STOCK">Low stock alert</option>
            <option value="AVAILABLE">Available stock</option>
          </select>

          {action === "AVAILABLE" && (
            <>
              <label>Glass Type</label>
              <select value={glassType} onChange={e => setGlassType(e.target.value)}>
                <option value="">Select</option>
                <option value="5MM">5 MM</option>
                <option value="8MM">8 MM</option>
                <option value="10MM">10 MM</option>
              </select>
            </>
          )}

          <button onClick={askAI}>Ask AI</button>

          {result && (
            <div style={resultBox}>
              <strong>AI Response:</strong>
              <pre>{result}</pre>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

const centerWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh"
};

const glassCard = {
  width: "600px",
  padding: "30px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.18)",
  backdropFilter: "blur(10px)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const resultBox = {
  marginTop: "15px",
  padding: "12px",
  background: "rgba(0,0,0,0.6)",
  borderRadius: "8px",
  whiteSpace: "pre-wrap"
};

export default AiAssistant;
