

// import { useEffect, useState, useMemo } from "react";
// import { toast } from "react-toastify";
// import api from "../api/api";
// import PageWrapper from "../components/PageWrapper";
// import stockBg from "../assets/stock-bg.jpg";

// function StockDashboard() {
//   const [allStock, setAllStock] = useState([]);

//   const [filterGlassType, setFilterGlassType] = useState("");
//   const [filterHeight, setFilterHeight] = useState("");
//   const [filterWidth, setFilterWidth] = useState("");

//   /* ================= LOAD STOCK ================= */
//   const loadStock = async () => {
//     try {
//       const res = await api.get("/stock/all");
//       setAllStock(res.data);

//       res.data.forEach(item => {
//         if (item.quantity < item.minQuantity) {
//           toast.error(
//             `🚨 LOW STOCK: ${item.glass?.type} (Stand ${item.standNo})`,
//             { toastId: `${item.standNo}-${item.glass?.type}` }
//           );
//         }
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadStock();
//   }, []);

//   /* ================= LIVE FILTERING ================= */
//   const filteredStock = useMemo(() => {
//   const h = Number(filterHeight);
//   const w = Number(filterWidth);

//   return allStock.filter(s => {
//     const matchGlass =
//       !filterGlassType ||
//       s.glass?.type?.toLowerCase().includes(filterGlassType.toLowerCase());

//     const matchHeight =
//       !filterHeight ||
//       (Number(s.height) >= h && Number(s.height) <= h + 3);

//     const matchWidth =
//       !filterWidth ||
//       (Number(s.width) >= w && Number(s.width) <= w + 3);

//     return matchGlass && matchHeight && matchWidth;
//   });
// }, [allStock, filterGlassType, filterHeight, filterWidth]);

//   <button
//   style={downloadBtn}
//   onClick={() =>
//     window.open("http://localhost:8080/stock/download", "_blank")
//   }
// >
//   ⬇ Download Stock Report
// </button>


//   /* ================= UI ================= */
//   return (
//     <PageWrapper background={stockBg}>
//       <div style={tableCard}>
//         <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
//           📦 View Stock
//         </h2>

//         {/* 🔍 SEARCH BAR */}
//         <div style={filterBar}>
//           <input
//             type="text"
//             placeholder="Glass Type (5MM)"
//             value={filterGlassType}
//             onChange={e => setFilterGlassType(e.target.value)}
//           />

//           <input
//             type="number"
//             placeholder="Height (5 → 8)"
//             value={filterHeight}
//             onChange={e => setFilterHeight(e.target.value)}
//           />

//           <input
//             type="number"
//             placeholder="Width (5 → 8)"
//             value={filterWidth}
//             onChange={e => setFilterWidth(e.target.value)}
//           />

//           <button
//             onClick={() => {
//               setFilterGlassType("");
//               setFilterHeight("");
//               setFilterWidth("");
//             }}
//           >
//             Clear
//           </button>
//         </div>

//         {/* 📊 TABLE */}
//         <table style={tableStyle}>
//           <thead>
//             <tr>
//               <th>Stand</th>
//               <th>Glass</th>
//               <th>Thickness</th>
//               <th>Height</th>
//               <th>Width</th>
//               <th>Qty</th>
//               <th>Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredStock.length === 0 ? (
//               <tr>
//                 <td colSpan="7">No stock found</td>
//               </tr>
//             ) : (
//               filteredStock.map((s, i) => {
//                 const isLow = s.quantity < s.minQuantity;

//                 return (
//                   <tr
//                     key={i}
//                     style={{
//                       backgroundColor: isLow
//                         ? "rgba(255, 0, 0, 0.25)"
//                         : "transparent",
//                       color: isLow ? "#ff4d4d" : "white",
//                       animation: isLow ? "blink 1s infinite" : "none",
//                       fontWeight: isLow ? "bold" : "normal"
//                     }}
//                   >
//                     <td>{s.standNo}</td>
//                     <td>{s.glass?.type}</td>
//                     <td>{s.glass?.thickness} mm</td>

//                     <td>
//   {s.height}{" "}
//   {s.glass?.unit === "FEET" && "ft"}
//   {s.glass?.unit === "INCH" && "in"}
//   {s.glass?.unit === "MM" && "mm"}
// </td>

// <td>
//   {s.width}{" "}
//   {s.glass?.unit === "FEET" && "ft"}
//   {s.glass?.unit === "INCH" && "in"}
//   {s.glass?.unit === "MM" && "mm"}
// </td>


//                     <td>{s.quantity}</td>

//                     <td>
//                       {isLow ? "🔴 LOW" : "✅ OK"}
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </PageWrapper>
//   );
// }

// /* ================= STYLES ================= */

// const downloadBtn = {
//   padding: "10px 18px",
//   marginBottom: "15px",
//   borderRadius: "10px",
//   background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
//   color: "white",
//   fontWeight: "600",
//   border: "none",
//   cursor: "pointer",
// };


// const tableCard = {
//   width: "90%",
//   margin: "auto",
//   padding: "20px",
//   background: "rgba(0,0,0,0.6)",
//   borderRadius: "12px",
// };

// const filterBar = {
//   display: "flex",
//   gap: "8px",
//   marginBottom: "15px",
//   justifyContent: "center",
//   flexWrap: "wrap",
// };

// const tableStyle = {
//   width: "100%",
//   color: "white",
//   textAlign: "center",
//   borderCollapse: "collapse",
// };

// export default StockDashboard;


import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import PageWrapper from "../components/PageWrapper";
import stockBg from "../assets/stock-bg.jpg";

/* ================= UNIT CONVERSION FUNCTIONS ================= */

/**
 * Parse dimension string (handles fractions like "26 1/4" or "5.5" or "5")
 * Returns the numeric value in the given unit
 */
const parseDimension = (dimensionStr) => {
  if (!dimensionStr || dimensionStr.trim() === "") return null;
  
  const str = dimensionStr.trim();
  
  // Handle fraction format: "26 1/4" or "1/4"
  const fractionMatch = str.match(/(\d+)?\s*(\d+)\/(\d+)/);
  if (fractionMatch) {
    const wholePart = fractionMatch[1] ? parseFloat(fractionMatch[1]) : 0;
    const numerator = parseFloat(fractionMatch[2]);
    const denominator = parseFloat(fractionMatch[3]);
    return wholePart + (numerator / denominator);
  }
  
  // Handle decimal format: "5.5" or "127"
  const decimal = parseFloat(str);
  if (!isNaN(decimal)) {
    return decimal;
  }
  
  return null;
};

/**
 * Convert value from source unit to MM
 */
const convertToMM = (value, fromUnit) => {
  if (value === null || value === undefined || isNaN(value)) return null;
  
  switch (fromUnit?.toUpperCase()) {
    case "MM":
      return value;
    case "INCH":
      return value * 25.4; // 1 inch = 25.4 mm
    case "FEET":
      return value * 304.8; // 1 foot = 304.8 mm (12 inches)
    default:
      return value; // Default to MM if unit not recognized
  }
};

/**
 * Convert value from MM to target unit
 */
const convertFromMM = (valueInMM, toUnit) => {
  if (valueInMM === null || valueInMM === undefined || isNaN(valueInMM)) return null;
  
  switch (toUnit?.toUpperCase()) {
    case "MM":
      return valueInMM;
    case "INCH":
      return valueInMM / 25.4;
    case "FEET":
      return valueInMM / 304.8;
    default:
      return valueInMM;
  }
};

function StockDashboard() {
  const [allStock, setAllStock] = useState([]);

  const [filterGlassType, setFilterGlassType] = useState("");
  const [filterHeight, setFilterHeight] = useState("");
  const [filterWidth, setFilterWidth] = useState("");
  const [searchUnit, setSearchUnit] = useState("MM"); // Unit for search (MM, INCH, FEET)

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
      // If it's a 401, the interceptor will handle redirect
      // For other errors, show a message
      if (err.response?.status !== 401) {
        toast.error("Failed to load stock. Please try again.");
      }
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  /* ================= FILTER ================= */
  const filteredStock = useMemo(() => {
    // Parse search values
    const searchHeightValue = parseDimension(filterHeight);
    const searchWidthValue = parseDimension(filterWidth);
    
    // Convert search values to MM for comparison
    const searchHeightMM = searchHeightValue !== null 
      ? convertToMM(searchHeightValue, searchUnit) 
      : null;
    const searchWidthMM = searchWidthValue !== null 
      ? convertToMM(searchWidthValue, searchUnit) 
      : null;

    // Filter stock
    const filtered = allStock.filter(s => {
      // Match glass type
      const matchGlass =
        !filterGlassType ||
        s.glass?.type?.toLowerCase().includes(filterGlassType.toLowerCase());

      // Match height with unit conversion - show all stock >= search value
      let matchHeight = true;
      if (searchHeightMM !== null) {
        const stockHeightValue = parseDimension(s.height);
        if (stockHeightValue !== null) {
          // Convert stock height to MM based on its stored unit
          const stockHeightMM = convertToMM(stockHeightValue, s.glass?.unit);
          if (stockHeightMM !== null) {
            // Show all stock with height >= search value
            matchHeight = stockHeightMM >= searchHeightMM;
          } else {
            matchHeight = false;
          }
        } else {
          matchHeight = false;
        }
      }

      // Match width with unit conversion - show all stock >= search value
      let matchWidth = true;
      if (searchWidthMM !== null) {
        const stockWidthValue = parseDimension(s.width);
        if (stockWidthValue !== null) {
          // Convert stock width to MM based on its stored unit
          const stockWidthMM = convertToMM(stockWidthValue, s.glass?.unit);
          if (stockWidthMM !== null) {
            // Show all stock with width >= search value
            matchWidth = stockWidthMM >= searchWidthMM;
          } else {
            matchWidth = false;
          }
        } else {
          matchWidth = false;
        }
      }

      return matchGlass && matchHeight && matchWidth;
    });

    // Sort results by height first, then width (both ascending)
    return filtered.sort((a, b) => {
      // Parse and convert heights to MM for comparison
      const aHeightValue = parseDimension(a.height);
      const bHeightValue = parseDimension(b.height);
      const aHeightMM = aHeightValue !== null ? convertToMM(aHeightValue, a.glass?.unit) : 0;
      const bHeightMM = bHeightValue !== null ? convertToMM(bHeightValue, b.glass?.unit) : 0;

      // If heights are different, sort by height
      if (aHeightMM !== bHeightMM) {
        return aHeightMM - bHeightMM;
      }

      // If heights are same, sort by width
      const aWidthValue = parseDimension(a.width);
      const bWidthValue = parseDimension(b.width);
      const aWidthMM = aWidthValue !== null ? convertToMM(aWidthValue, a.glass?.unit) : 0;
      const bWidthMM = bWidthValue !== null ? convertToMM(bWidthValue, b.glass?.unit) : 0;

      return aWidthMM - bWidthMM;
    });
  }, [allStock, filterGlassType, filterHeight, filterWidth, searchUnit]);

  return (
    <PageWrapper background={stockBg}>
      <div style={card}>
        <h2 style={title}>📦 View Stock</h2>

        {/* 🔍 FILTERS */}
        <div style={filters}>
          <input
            style={input}
            placeholder="Glass Type (5MM)"
            value={filterGlassType}
            onChange={e => setFilterGlassType(e.target.value)}
          />

          <input
            style={input}
            type="text"
            placeholder="Height (e.g. 5, 5.5, 5 1/4)"
            value={filterHeight}
            onChange={e => setFilterHeight(e.target.value)}
          />

          <input
            style={input}
            type="text"
            placeholder="Width (e.g. 7, 7.5, 7 3/8)"
            value={filterWidth}
            onChange={e => setFilterWidth(e.target.value)}
          />

          <select
            style={input}
            value={searchUnit}
            onChange={e => setSearchUnit(e.target.value)}
            title="Select unit for height and width search"
          >
            <option value="MM">MM</option>
            <option value="INCH">INCH</option>
            <option value="FEET">FEET</option>
          </select>

          <button
            style={clearBtn}
            onClick={() => {
              setFilterGlassType("");
              setFilterHeight("");
              setFilterWidth("");
              setSearchUnit("MM");
            }}
          >
            Clear
          </button>
        </div>

        {/* 📊 TABLE (SCROLLABLE) */}
        <div style={tableWrapper}>
          <table style={table}>
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
                        background: isLow
                          ? "rgba(255,0,0,0.25)"
                          : "transparent",
                        color: isLow ? "#ff4d4d" : "white",
                        animation: isLow ? "blink 1s infinite" : "none",
                        fontWeight: isLow ? "600" : "400",
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
                      <td>{isLow ? "🔴 LOW" : "✅ OK"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}

export default StockDashboard;

/* ================= STYLES ================= */

const card = {
  width: "100%",
  maxWidth: "1100px",
  margin: "auto",
  padding: "16px",
  background: "rgba(0,0,0,0.6)",
  borderRadius: "16px",
};

const title = {
  textAlign: "center",
  marginBottom: "15px",
};

const filters = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px",
  marginBottom: "15px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  outline: "none",
};

const clearBtn = {
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#374151",
  color: "white",
  cursor: "pointer",
};

const tableWrapper = {
  width: "100%",
  overflowX: "auto",
};

const table = {
  width: "100%",
  minWidth: "720px", // 👈 keeps columns readable on mobile
  borderCollapse: "collapse",
  textAlign: "center",
  color: "white",
};

