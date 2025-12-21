// import { useState } from "react";
// import PageWrapper from "../components/PageWrapper";
// import dashboardBg from "../assets/dashboard-bg.jpg";
// import api from "../api/api";
// import ConfirmModal from "../components/ConfirmModal";

// function StockManager() {
//   const [glassTypeStock, setGlassTypeStock] = useState("");
//   const [standNo, setStandNo] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [stockAction, setStockAction] = useState("ADD");
//   const [stockMessage, setStockMessage] = useState("");

//   const [glassMode, setGlassMode] = useState("SELECT");
//   const [manualThickness, setManualThickness] = useState("");

//   const [height, setHeight] = useState("");
//   const [width, setWidth] = useState("");
//   const [unit, setUnit] = useState("MM");

//   // 🔴 CONFIRM MODAL STATE
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [pendingPayload, setPendingPayload] = useState(null);

//   /* ===============================
//      OPEN CONFIRM MODAL
//      =============================== */
//   const updateStock = () => {
//     setStockMessage("");

//     // ✅ Validation
//     if (!standNo || !quantity || !height || !width) {
//       setStockMessage("❌ Please fill all required fields");
//       return;
//     }

//     if (glassMode === "SELECT" && !glassTypeStock) {
//       setStockMessage("❌ Please select glass type");
//       return;
//     }

//     if (glassMode === "MANUAL" && !manualThickness) {
//       setStockMessage("❌ Please enter manual thickness");
//       return;
//     }

//     const payload = {
//       standNo: Number(standNo),
//       quantity: Number(quantity),
//       action: stockAction,

//       glassType:
//         glassMode === "SELECT"
//           ? glassTypeStock
//           : `${manualThickness}MM`,

//       thickness:
//         glassMode === "SELECT"
//           ? Number(glassTypeStock.replace("MM", ""))
//           : Number(manualThickness),

//       height: Number(height),
//       width: Number(width),
//       unit
//     };

//     setPendingPayload(payload);
//     setShowConfirm(true);
//   };

//   /* ===============================
//      CONFIRM & SAVE
//      =============================== */
//   const confirmSaveStock = async () => {
//     try {
//       await api.post("/stock/update", pendingPayload);

//       setStockMessage("✅ Stock updated successfully");

//       // Reset form
//       setStandNo("");
//       setQuantity("");
//       setHeight("");
//       setWidth("");
//       setManualThickness("");
//       setGlassTypeStock("");

//     } catch (error) {
//       console.error(error);
//       setStockMessage(
//         error.response?.data || "❌ Failed to update stock"
//       );
//     } finally {
//       setShowConfirm(false);
//       setPendingPayload(null);
//     }
//   };

//   return (
//     <PageWrapper background={dashboardBg}>
//       <div style={centerWrapper}>
//         <div style={glassCard}>
//           <h2 style={{ textAlign: "center" }}>➕➖ Manage Stock</h2>

//           <label>Glass Type Mode</label>
//           <select value={glassMode} onChange={e => setGlassMode(e.target.value)}>
//             <option value="SELECT">Select from list</option>
//             <option value="MANUAL">Manual entry</option>
//           </select>

//           {glassMode === "SELECT" ? (
//             <>
//               <label>Glass Type</label>
//               <select
//                 value={glassTypeStock}
//                 onChange={e => setGlassTypeStock(e.target.value)}
//               >
//                 <option value="">Select</option>
//                 <option value="5MM">5 MM</option>
//                 <option value="8MM">8 MM</option>
//                 <option value="10MM">10 MM</option>
//               </select>
//             </>
//           ) : (
//             <>
//               <label>Manual Thickness (MM)</label>
//               <input
//                 type="number"
//                 value={manualThickness}
//                 onChange={e => setManualThickness(e.target.value)}
//               />
//             </>
//           )}

//           <label>Dimension Unit</label>
//           <select value={unit} onChange={e => setUnit(e.target.value)}>
//             <option value="MM">MM</option>
//             <option value="INCH">INCH</option>
//             <option value="FEET">FEET</option>
//           </select>

//           <label>Height</label>
//           <input type="number" value={height} onChange={e => setHeight(e.target.value)} />

//           <label>Width</label>
//           <input type="number" value={width} onChange={e => setWidth(e.target.value)} />

//           <label>Stand No</label>
//           <input type="number" value={standNo} onChange={e => setStandNo(e.target.value)} />

//           <label>Quantity</label>
//           <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />

//           <label>Action</label>
//           <select value={stockAction} onChange={e => setStockAction(e.target.value)}>
//             <option value="ADD">ADD</option>
//             <option value="REMOVE">REMOVE</option>
//           </select>

//           <button onClick={updateStock}>
//             {stockAction === "ADD" ? "Add Stock" : "Remove Stock"}
//           </button>

//           {stockMessage && (
//             <p style={{ textAlign: "center", fontWeight: "bold" }}>
//               {stockMessage}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* 🔴 CONFIRM MODAL */}
//       <ConfirmModal
//         show={showConfirm}
//         payload={pendingPayload || {}}
//         onCancel={() => setShowConfirm(false)}
//         onConfirm={confirmSaveStock}
//       />
//     </PageWrapper>
//   );
// }

// /* ================= STYLES ================= */

// const centerWrapper = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   minHeight: "70vh"
// };

// const glassCard = {
//   width: "420px",
//   padding: "25px",
//   borderRadius: "14px",
//   background: "rgba(255,255,255,0.15)",
//   backdropFilter: "blur(10px)",
//   color: "white",
//   display: "flex",
//   flexDirection: "column",
//   gap: "10px"
// };

// export default StockManager;

import { useState } from "react";
import PageWrapper from "../components/PageWrapper";
import dashboardBg from "../assets/dashboard-bg.jpg";
import api from "../api/api";
import ConfirmModal from "../components/ConfirmModal";

function StockManager() {
  const [glassTypeStock, setGlassTypeStock] = useState("");
  const [standNo, setStandNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stockAction, setStockAction] = useState("ADD");
  const [stockMessage, setStockMessage] = useState("");

  const [glassMode, setGlassMode] = useState("SELECT");
  const [manualThickness, setManualThickness] = useState("");

  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [unit, setUnit] = useState("MM");

  // 🔴 CONFIRM MODAL
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  // 🔁 UNDO STATE
  const [showUndo, setShowUndo] = useState(false);

  /* ===============================
     OPEN CONFIRM MODAL
     =============================== */
  const updateStock = () => {
    setStockMessage("");

    if (!standNo || !quantity || !height || !width) {
      setStockMessage("❌ Please fill all required fields");
      return;
    }

    if (glassMode === "SELECT" && !glassTypeStock) {
      setStockMessage("❌ Please select glass type");
      return;
    }

    if (glassMode === "MANUAL" && !manualThickness) {
      setStockMessage("❌ Please enter manual thickness");
      return;
    }

    const payload = {
      standNo: Number(standNo),
      quantity: Number(quantity),
      action: stockAction,
      glassType:
        glassMode === "SELECT"
          ? glassTypeStock
          : `${manualThickness}MM`,
      thickness:
        glassMode === "SELECT"
          ? Number(glassTypeStock.replace("MM", ""))
          : Number(manualThickness),
      height: Number(height),
      width: Number(width),
      unit
    };

    setPendingPayload(payload);
    setShowConfirm(true);
  };

  /* ===============================
     CONFIRM & SAVE
     =============================== */
  const confirmSaveStock = async () => {
    try {
      await api.post("/stock/update", pendingPayload);

      setStockMessage("✅ Stock updated successfully");
      setShowUndo(true); // 🔁 enable undo

      // reset form
      setStandNo("");
      setQuantity("");
      setHeight("");
      setWidth("");
      setManualThickness("");
      setGlassTypeStock("");

    } catch (error) {
      setStockMessage(error.response?.data || "❌ Failed to update stock");
    } finally {
      setShowConfirm(false);
      setPendingPayload(null);
    }
  };

  /* ===============================
     UNDO LAST ACTION
     =============================== */
  const undoLastAction = async () => {
    try {
      const res = await api.post("/stock/undo");
      setStockMessage(res.data);
      setShowUndo(false);
    } catch {
      setStockMessage("❌ Failed to undo last action");
    }
  };

  return (
    <PageWrapper background={dashboardBg}>
      <div style={centerWrapper}>
        <div style={glassCard}>
          <h2 style={{ textAlign: "center" }}>➕➖ Manage Stock</h2>

          <label>Glass Type Mode</label>
          <select value={glassMode} onChange={e => setGlassMode(e.target.value)}>
            <option value="SELECT">Select from list</option>
            <option value="MANUAL">Manual entry</option>
          </select>

          {glassMode === "SELECT" ? (
            <>
              <label>Glass Type</label>
              <select
                value={glassTypeStock}
                onChange={e => setGlassTypeStock(e.target.value)}
              >
                <option value="">Select</option>
                <option value="5MM">5 MM</option>
                <option value="8MM">8 MM</option>
                <option value="10MM">10 MM</option>
              </select>
            </>
          ) : (
            <>
              <label>Manual Thickness (MM)</label>
              <input
                type="number"
                value={manualThickness}
                onChange={e => setManualThickness(e.target.value)}
              />
            </>
          )}

          <label>Dimension Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)}>
            <option value="MM">MM</option>
            <option value="INCH">INCH</option>
            <option value="FEET">FEET</option>
          </select>

          <label>Height</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} />

          <label>Width</label>
          <input type="number" value={width} onChange={e => setWidth(e.target.value)} />

          <label>Stand No</label>
          <input type="number" value={standNo} onChange={e => setStandNo(e.target.value)} />

          <label>Quantity</label>
          <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />

          <label>Action</label>
          <select value={stockAction} onChange={e => setStockAction(e.target.value)}>
            <option value="ADD">ADD</option>
            <option value="REMOVE">REMOVE</option>
          </select>

          <button onClick={updateStock}>
            {stockAction === "ADD" ? "Add Stock" : "Remove Stock"}
          </button>

          {/* 🔁 UNDO BUTTON */}
          {showUndo && (
            <button
              style={{ background: "#ff9800", marginTop: "8px" }}
              onClick={undoLastAction}
            >
              ↩ Undo Last Action
            </button>
          )}

          {stockMessage && (
            <p style={{ textAlign: "center", fontWeight: "bold" }}>
              {stockMessage}
            </p>
          )}
        </div>
      </div>

      {/* 🔴 CONFIRM MODAL */}
      <ConfirmModal
        show={showConfirm}
        payload={pendingPayload || {}}
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmSaveStock}
      />
    </PageWrapper>
  );
}

/* ================= STYLES ================= */

const centerWrapper = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh"
};

const glassCard = {
  width: "420px",
  padding: "25px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

export default StockManager;
