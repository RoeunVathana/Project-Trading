import { useCallback, useEffect, useMemo, useState } from "react";
import "./DistributionPage.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000")
  .replace(/\/$/, "");

const normalizeMachine = (machine) => ({
  ...machine,
  name: String(machine?.name || machine?.model || `Machine #${machine?.id || "?"}`).trim(),
  model: String(machine?.model || "").trim(),
  viewCount: Number(machine?.viewCount || 0),
});

const getAxisMax = (value) => {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.max(0, Math.floor(Math.log10(value)) - 1);
  return Math.ceil(value / magnitude) * magnitude;
};

const getChartPoints = (values, maxValue) => {
  const step = values.length > 1 ? 500 / (values.length - 1) : 250;
  return values.map((value, index) => ({
    x: values.length > 1 ? index * step : 250,
    y: 205 - (Number(value || 0) / maxValue) * 165,
  }));
};

const inventoryData = [
  {
    id: "XP-500-G3",
    region: "North America",
    stock: "HIGH",
    stockType: "high",
    price: "$14,200",
    leadTime: "2 Weeks",
    action: "Order Now",
  },
  {
    id: "XP-750-G3",
    region: "Europe",
    stock: "OPTIMAL",
    stockType: "optimal",
    price: "$18,450",
    leadTime: "3 Weeks",
    action: "Order Now",
  },
  {
    id: "XP-1000-MAX",
    region: "Asia Pacific",
    stock: "LOW STOCK",
    stockType: "low",
    price: "$42,900",
    leadTime: "6 Weeks",
    action: "Order Now",
  },
  {
    id: "TX-200-LITE",
    region: "Global",
    stock: "OUT OF STOCK",
    stockType: "out",
    price: "$8,100",
    leadTime: "Backordered",
    action: "Notify Me",
  },
];

const DistributionPage = () => {
  const [topMachines, setTopMachines] = useState([]);
  const [machineLoadError, setMachineLoadError] = useState("");

  const loadMachineAnalytics = useCallback(async () => {
    try {
      const machineResponse = await fetch(`${API_BASE_URL}/api/machines/top?limit=5`);
      const machineResult = await machineResponse.json();
      if (!machineResponse.ok) throw new Error(machineResult.message || "Unable to load machine analytics.");

      setTopMachines(
        (Array.isArray(machineResult.data) ? machineResult.data : [])
          .map(normalizeMachine)
          .sort((left, right) => right.viewCount - left.viewCount || right.id - left.id),
      );
      setMachineLoadError("");
    } catch (error) {
      setMachineLoadError(error.message || "Unable to load machine analytics.");
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(loadMachineAnalytics, 0);
    const refreshTimer = window.setInterval(loadMachineAnalytics, 15 * 1000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(refreshTimer);
    };
  }, [loadMachineAnalytics]);

  const chartMachines = useMemo(
    () => topMachines.slice(0, 5),
    [topMachines],
  );

  const chartValues = useMemo(
    () => chartMachines.map((machine) => machine.viewCount),
    [chartMachines],
  );

  const chartMax = useMemo(
    () => getAxisMax(Math.max(...chartValues, 0)),
    [chartValues],
  );

  const chartPoints = useMemo(
    () => getChartPoints(chartValues, chartMax),
    [chartValues, chartMax],
  );

  const linePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const areaPoints = linePoints
    ? `${linePoints} 500,230 0,230`
    : "0,230 500,230";
  const axisLabels = [chartMax, chartMax * 0.75, chartMax * 0.5, chartMax * 0.25, 0];
  const topMachineMax = useMemo(
    () => getAxisMax(Math.max(...topMachines.map((machine) => machine.viewCount), 0)),
    [topMachines],
  );
  const machineAxisLabels = [topMachineMax, topMachineMax * 0.75, topMachineMax * 0.5, topMachineMax * 0.25, 0];

  return (
    <section className="distribution-page">
      {/* =====================================
          HERO
      ===================================== */}
      <section className="distribution-hero">
        <div className="distribution-hero-content">
          <span className="distribution-badge">
            <span>●</span> GLOBAL NETWORK UPDATE
          </span>

          <h1>
            DISTRIBUTION
            <br />
            PARTNER PORTAL
          </h1>

          <p>
            Empowering our global network with real-time logistics, sales
            <br className="desktop-break" />
            enablement
            <br className="desktop-break" />
            tools, and streamlined procurement.
          </p>

          <div className="distribution-actions">
            <button className="dashboard-btn">
              <span>⇩</span>
              Access To your Dashboard
            </button>

            <button className="history-btn">
              <span>▣</span>
              Order History
            </button>
          </div>
        </div>
      </section>

      {/* =====================================
          SALES ANALYTICS
      ===================================== */}
      <section className="distribution-section analytics-section">
        <div className="distribution-section-header">
          <div>
            <h2>TOP MACHINE ANALYTICS</h2>

            <p>Live product-detail views ranked by machine.</p>
          </div>
        </div>

        <div className="analytics-grid">
          {/* =================================
              LINE CHART
          ================================= */}
          <div className="analytics-card">
            <div className="chart-title">
              <span className="chart-icon line-icon">⌁</span>
              <span>Machine view activity</span>
            </div>

            {chartMachines.length ? (
              <div className="line-chart">
                <div className="chart-y-labels">
                  {axisLabels.map((label, index) => <span key={`axis-${index}`}>{Math.round(label)}</span>)}
                </div>

                <div className="line-chart-area">
                  <div className="chart-grid-lines">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <svg className="revenue-svg" viewBox="0 0 500 230" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="machineViewFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0878ff" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#0878ff" stopOpacity="0.03" />
                      </linearGradient>
                    </defs>
                    <polygon points={areaPoints} fill="url(#machineViewFill)" />
                    <polyline points={linePoints} fill="none" stroke="#0878ff" strokeWidth="3" />
                    {chartPoints.map(({ x, y }, index) => (
                      <circle key={`point-${index}`} cx={x} cy={y} r="4" fill="#0878ff" />
                    ))}
                  </svg>

                  <div className="chart-x-labels">
                    {chartMachines.map((machine) => <span key={machine.id} title={machine.name}>{machine.name}</span>)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="analytics-empty">
                {machineLoadError || "Open a product detail to start machine analytics."}
              </div>
            )}
          </div>

          {/* =================================
              BAR CHART
          ================================= */}
          <div className="analytics-card">
            <div className="chart-title">
              <span className="chart-icon bar-icon">↗</span>
              <span>Top machine views</span>
            </div>

            <div className="bar-chart">
              <div className="bar-y-labels">
                {machineAxisLabels.map((label, index) => <span key={`machine-axis-${index}`}>{Math.round(label)}</span>)}
              </div>

              <div className="bar-chart-area">
                <div className="bar-grid-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <div className="bars">
                  {topMachines.length ? topMachines.map((machine) => {
                    const value = machine.viewCount;
                    const height = value ? Math.max(8, (value / topMachineMax) * 100) : 3;

                    return (
                      <div className="bar-item" key={machine.id}>
                        <div className="bar" style={{ height: `${height}%` }} title={`${machine.name}: ${value} views`} />
                        <span title={machine.name}>{machine.name}</span>
                      </div>
                    );
                  }) : (
                    <div className="analytics-empty">{machineLoadError || "No machine views yet."}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          INVENTORY STATUS
      ===================================== */}
      <section className="distribution-section inventory-section">
        <div className="inventory-header">
          <div>
            <h2>GLOBAL INVENTORY STATUS</h2>

            <p>
              Current stock levels and wholesale pricing for the X-Series units.
            </p>
          </div>
        </div>

        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>PRODUCT ID</th>
                <th>REGION</th>
                <th>STOCK LEVEL</th>
                <th>WHOLESALE PRICE</th>
                <th>LEAD TIME</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td>{item.region}</td>

                  <td>
                    <span className={`stock-badge ${item.stockType}`}>
                      {item.stock}
                    </span>
                  </td>

                  <td className="price-cell">{item.price}</td>

                  <td className="lead-time">{item.leadTime}</td>

                  <td>
                    <button
                      className={
                        item.stockType === "out" ? "notify-btn" : "order-btn"
                      }
                    >
                      {item.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
};

export default DistributionPage;
