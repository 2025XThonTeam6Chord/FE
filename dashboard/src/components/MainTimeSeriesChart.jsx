import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import "./MainTimeSeriesChart.css";

function MainTimeSeriesChart() {
  // 학기 전체 데이터 (16주)
  const data = [];
  const weeks = [
    "1주",
    "2주",
    "3주",
    "4주",
    "5주",
    "6주",
    "7주",
    "8주",
    "9주",
    "10주",
    "11주",
    "12주",
    "13주",
    "14주",
    "15주",
    "16주",
  ];

  // 중간고사 기간: 8-9주
  // 기말고사 기간: 15-16주

  for (let i = 0; i < 16; i++) {
    let stress = 5.5;
    let depression = 6.0;

    // 중간고사 기간 증가
    if (i >= 7 && i <= 9) {
      stress += Math.random() * 1.5 + 0.5;
      depression += Math.random() * 1.2 + 0.3;
    }
    // 기말고사 기간 증가
    else if (i >= 14) {
      stress += Math.random() * 2 + 0.8;
      depression += Math.random() * 1.8 + 0.5;
    } else {
      stress += Math.random() * 0.8 - 0.4;
      depression += Math.random() * 0.6 - 0.3;
    }

    data.push({
      week: weeks[i],
      stress: Math.round(stress * 10) / 10,
      depression: Math.round(depression * 10) / 10,
      weekNum: i + 1,
    });
  }

  return (
    <Card className="card-chart">
      <CardHeader>
        <CardTitle tag="h4">학기 전체 심리 상태 추이</CardTitle>
        <p className="card-category">2024년 1학기 (16주)</p>
      </CardHeader>
      <CardBody>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={data}
              margin={{ top: 70, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF6B00" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="depressionGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis
                dataKey="week"
                stroke="#888888"
                tick={{ fill: "#555555", fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke="#888888"
                tick={{ fill: "#555555", fontSize: 12 }}
                domain={[0, 10]}
                label={{
                  value: "점수",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#555555" },
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="custom-tooltip">
                        <div className="tooltip-label">{label}</div>
                        {payload.map((entry, index) => (
                          <div
                            key={index}
                            className="tooltip-item"
                            style={{ color: entry.color }}
                          >
                            <span className="tooltip-name">
                              {entry.name === "stress" ? "스트레스" : "우울"}:
                            </span>
                            <span className="tooltip-value">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) =>
                  value === "stress" ? "스트레스 수준" : "우울 수준"
                }
              />

              <Area
                type="monotone"
                dataKey="stress"
                stroke="#FF6B00"
                strokeWidth={2}
                fill="url(#stressGradient)"
                dot={{ fill: "#FF6B00", r: 4 }}
                activeDot={{ r: 6 }}
                name="stress"
              />
              <Area
                type="monotone"
                dataKey="depression"
                stroke="#EF4444"
                strokeWidth={2}
                fill="url(#depressionGradient)"
                dot={{ fill: "#EF4444", r: 4 }}
                activeDot={{ r: 6 }}
                name="depression"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: "#FF6B00" }}
            ></span>
            <span>스트레스 수준</span>
          </div>
          <div className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: "#EF4444" }}
            ></span>
            <span>우울 수준</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default MainTimeSeriesChart;
