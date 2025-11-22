import { useState, useEffect, useMemo, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import { getAverageScore } from "../../../api/dashboard/dashboardApi";
import "./MainTimeSeriesChart.css";

function MainTimeSeriesChart() {
  const [data, setData] = useState([]);

  const weeks = useMemo(
    () => [
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
    ],
    []
  );

  // 기본 데이터 생성 (API 실패 시 사용)
  const generateDefaultData = useCallback(() => {
    const defaultData = [];
    for (let i = 0; i < 15; i++) {
      let stress = 5.5;

      if (i >= 7 && i <= 9) {
        stress += Math.random() * 1.5 + 0.5;
      } else if (i >= 14) {
        stress += Math.random() * 2 + 0.8;
      } else {
        stress += Math.random() * 0.8 - 0.4;
      }

      defaultData.push({
        week: weeks[i],
        stress: Math.round(stress * 10) / 10,
        weekNum: i + 1,
      });
    }
    return defaultData;
  }, [weeks]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "admin"; // 테스트용
        const response = await getAverageScore(userId);
        console.log("📊 MainTimeSeriesChart 데이터 로드:", response);

        // API 응답이 배열로 직접 오는 경우
        let dataArray = [];
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (
          response?.averageScores &&
          Array.isArray(response.averageScores)
        ) {
          dataArray = response.averageScores;
        } else if (response && typeof response === "object") {
          dataArray = [response];
        }

        // API 응답을 차트 형식으로 변환
        const transformedData = dataArray.map((item, index) => {
          // scoreY를 숫자로 변환 (100점 만점 그대로 사용)
          const score = parseFloat(item.scoreY || item.score || 0);

          // dateX에서 날짜 범위 추출 (예: "2025/08/17~2025/08/24")
          const dateRange = item.dateX || "";

          return {
            week: weeks[index] || `주차 ${index + 1}`,
            stress: score, // 100점 만점 점수
            weekNum: index + 1,
            dateRange: dateRange, // 날짜 범위 저장 (필요시 사용)
          };
        });

        // API 데이터 그대로 사용 (15주까지만)
        if (transformedData.length > 0) {
          setData(transformedData.slice(0, 15)); // 최대 15주만 표시
        } else {
          // API 데이터가 없으면 기본 데이터 사용
          const defaultData = generateDefaultData();
          setData(defaultData);
        }
      } catch (err) {
        console.error("평균 점수 데이터 로드 실패:", err);
        setData(generateDefaultData());
      }
    };

    fetchData();
  }, [weeks, generateDefaultData]);

  return (
    <Card className="card-chart">
      <CardHeader>
        <CardTitle tag="h4">최근 15주 심리 상태 추이</CardTitle>
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
                domain={[0, 100]}
                label={{
                  value: "점수",
                  angle: -90,
                  position: "insideLeft",
                  offset: 18,
                  style: { fill: "#555555" },
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dateRange = payload[0].payload?.dateRange || "";
                    return (
                      <div className="custom-tooltip">
                        <div className="tooltip-label">{label}</div>
                        {dateRange && (
                          <div className="tooltip-date-range">{dateRange}</div>
                        )}
                        <div
                          className="tooltip-item"
                          style={{ color: payload[0].color }}
                        >
                          <span className="tooltip-name">스트레스:</span>
                          <span className="tooltip-value">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
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
        </div>
      </CardBody>
    </Card>
  );
}

export default MainTimeSeriesChart;
