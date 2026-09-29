import React, { useState } from "react";
import "./DistributionPage.css";

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
  const [metric, setMetric] = useState("standard");

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
            <h2>REGIONAL SALES ANALYTICS</h2>

            <p>Real-time distribution data and market penetration metrics.</p>
          </div>

          <div className="metric-switch">
            <button
              className={metric === "standard" ? "active" : ""}
              onClick={() => setMetric("standard")}
            >
              Standard
            </button>

            <button
              className={metric === "metric" ? "active" : ""}
              onClick={() => setMetric("metric")}
            >
              Metric
            </button>
          </div>
        </div>

        <div className="analytics-grid">
          {/* =================================
              LINE CHART
          ================================= */}
          <div className="analytics-card">
            <div className="chart-title">
              <span className="chart-icon line-icon">⌁</span>
              <span>Quarterly Revenue Growth</span>
            </div>

            <div className="line-chart">
              <div className="chart-y-labels">
                <span>1000</span>
                <span>800</span>
                <span>600</span>
                <span>400</span>
                <span>200</span>
                <span>0</span>
              </div>

              <div className="line-chart-area">
                <div className="chart-grid-lines">
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <svg
                  className="revenue-svg"
                  viewBox="0 0 500 230"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="revenueFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#0878ff"
                        stopOpacity="0.22"
                      />

                      <stop
                        offset="100%"
                        stopColor="#0878ff"
                        stopOpacity="0.03"
                      />
                    </linearGradient>
                  </defs>

                  <polygon
                    points="
                      0,165
                      165,135
                      330,88
                      500,48
                      500,230
                      0,230
                    "
                    fill="url(#revenueFill)"
                  />

                  <polyline
                    points="
                      0,165
                      165,135
                      330,88
                      500,48
                    "
                    fill="none"
                    stroke="#0878ff"
                    strokeWidth="3"
                  />

                  <circle cx="0" cy="165" r="4" fill="#0878ff" />
                  <circle cx="165" cy="135" r="4" fill="#0878ff" />
                  <circle cx="330" cy="88" r="4" fill="#0878ff" />
                  <circle cx="500" cy="48" r="4" fill="#0878ff" />
                </svg>

                <div className="chart-x-labels">
                  <span>Q1</span>
                  <span>Q2</span>
                  <span>Q3</span>
                  <span>Q4</span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================
              BAR CHART
          ================================= */}
          <div className="analytics-card">
            <div className="chart-title">
              <span className="chart-icon bar-icon">↗</span>
              <span>Inventory Turnover Rate</span>
            </div>

            <div className="bar-chart">
              <div className="bar-y-labels">
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
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
                  <div className="bar-item">
                    <div className="bar" style={{ height: "82%" }} />
                    <span>North America</span>
                  </div>

                  <div className="bar-item">
                    <div className="bar" style={{ height: "70%" }} />
                    <span>Europe</span>
                  </div>

                  <div className="bar-item">
                    <div className="bar" style={{ height: "92%" }} />
                    <span>Asia Pacific</span>
                  </div>

                  <div className="bar-item">
                    <div className="bar" style={{ height: "57%" }} />
                    <span>Latin America</span>
                  </div>
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
