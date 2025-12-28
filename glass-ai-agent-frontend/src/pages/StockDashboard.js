

import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import PageWrapper from "../components/PageWrapper";
import stockBg from "../assets/stock-bg.jpg";

function StockDashboard() {
  const [allStock, setAllStock] = useState([]);

  const [filterGlassType, setFilterGlassType] = useState("");
  const [filterHeight, setFilterHeight] = useState("");
  const [filterWidth, setFilterWidth] = useState("");

  /* ================= LOAD STOCK ================= */
  const loadStock = async () => {
    try {
      const res = await api.get("/stock/all");
      setAllStock(res.data);

      res.data.forEach(item => {
        if (item.quantity < item.minQuantity) {
          toast.error(
            `🚨 LOW STOCK: ${item.glass?.type} (Stand ${item.standNo})`,
            { toastId: `${item.standNo}-${item.glass?.type}` }
          );
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  /* ================= LIVE FILTERING ================= */
  const filteredStock = useMemo(() => {
  const h = Number(filterHeight);
  const w = Number(filterWidth);

  return allStock.filter(s => {
    const matchGlass =
      !filterGlassType ||
      s.glass?.type?.toLowerCase().includes(filterGlassType.toLowerCase());

    const matchHeight =
      !filterHeight ||
      (Number(s.height) >= h && Number(s.height) <= h + 3);

    const matchWidth =
      !filterWidth ||
      (Number(s.width) >= w && Number(s.width) <= w + 3);

    return matchGlass && matchHeight && matchWidth;
  });
}, [allStock, filterGlassType, filterHeight, filterWidth]);

  <button
  style={downloadBtn}
  onClick={() =>
    window.open("http://localhost:8080/stock/download", "_blank")
  }
>
  ⬇ Download Stock Report
</button>


  /* ================= UI ================= */
  return (
    <PageWrapper background={stockBg}>
      <div style={tableCard}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
          📦 View Stock
        </h2>

        {/* 🔍 SEARCH BAR */}
        <div style={filterBar}>
          <input
            type="text"
            placeholder="Glass Type (5MM)"
            value={filterGlassType}
            onChange={e => setFilterGlassType(e.target.value)}
          />

          <input
            type="number"
            placeholder="Height (5 → 8)"
            value={filterHeight}
            onChange={e => setFilterHeight(e.target.value)}
          />

          <input
            type="number"
            placeholder="Width (5 → 8)"
            value={filterWidth}
            onChange={e => setFilterWidth(e.target.value)}
          />

          <button
            onClick={() => {
              setFilterGlassType("");
              setFilterHeight("");
              setFilterWidth("");
            }}
          >
            Clear
          </button>
        </div>

        {/* 📊 TABLE */}
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Stand</th>
              <th>Glass</th>
              <th>Thickness</th>
              <th>Height</th>
              <th>Width</th>
              <th>Qty</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredStock.length === 0 ? (
              <tr>
                <td colSpan="7">No stock found</td>
              </tr>
            ) : (
              filteredStock.map((s, i) => {
                const isLow = s.quantity < s.minQuantity;

                return (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: isLow
                        ? "rgba(255, 0, 0, 0.25)"
                        : "transparent",
                      color: isLow ? "#ff4d4d" : "white",
                      animation: isLow ? "blink 1s infinite" : "none",
                      fontWeight: isLow ? "bold" : "normal"
                    }}
                  >
                    <td>{s.standNo}</td>
                    <td>{s.glass?.type}</td>
                    <td>{s.glass?.thickness} mm</td>

                    <td>
  {s.height}{" "}
  {s.glass?.unit === "FEET" && "ft"}
  {s.glass?.unit === "INCH" && "in"}
  {s.glass?.unit === "MM" && "mm"}
</td>

<td>
  {s.width}{" "}
  {s.glass?.unit === "FEET" && "ft"}
  {s.glass?.unit === "INCH" && "in"}
  {s.glass?.unit === "MM" && "mm"}
</td>


                    <td>{s.quantity}</td>

                    <td>
                      {isLow ? "🔴 LOW" : "✅ OK"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}

/* ================= STYLES ================= */

const downloadBtn = {
  padding: "10px 18px",
  marginBottom: "15px",
  borderRadius: "10px",
  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  color: "white",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
};


const tableCard = {
  width: "90%",
  margin: "auto",
  padding: "20px",
  background: "rgba(0,0,0,0.6)",
  borderRadius: "12px",
};

const filterBar = {
  display: "flex",
  gap: "8px",
  marginBottom: "15px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const tableStyle = {
  width: "100%",
  color: "white",
  textAlign: "center",
  borderCollapse: "collapse",
};

export default StockDashboard;
