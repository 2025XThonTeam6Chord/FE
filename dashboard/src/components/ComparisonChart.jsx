import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import "./ComparisonChart.css";

function ComparisonChart() {
  const [filterType, setFilterType] = useState("college"); // 'college', 'department', 'grade'

  // 단과대별 데이터
  const collegeData = [
    { name: "공과대학", stress: 7.2, students: 1200 },
    { name: "인문대학", stress: 6.8, students: 850 },
    { name: "경영대학", stress: 6.5, students: 680 },
    { name: "의과대학", stress: 7.8, students: 420 },
    { name: "예술대학", stress: 5.9, students: 350 },
    { name: "사범대학", stress: 6.3, students: 520 },
  ];

  // 학과별 데이터
  const departmentData = [
    { name: "컴퓨터공학과", stress: 7.5, students: 320 },
    { name: "전기전자공학과", stress: 7.1, students: 280 },
    { name: "기계공학과", stress: 7.0, students: 250 },
    { name: "국어국문학과", stress: 6.5, students: 180 },
    { name: "영어영문학과", stress: 6.3, students: 200 },
    { name: "경영학과", stress: 6.8, students: 350 },
    { name: "회계학과", stress: 6.2, students: 180 },
    { name: "의학과", stress: 8.0, students: 150 },
    { name: "간호학과", stress: 7.6, students: 120 },
  ];

  // 학년별 데이터
  const gradeData = [
    { name: "1학년", stress: 6.2, students: 850 },
    { name: "2학년", stress: 6.8, students: 920 },
    { name: "3학년", stress: 7.3, students: 880 },
    { name: "4학년", stress: 7.6, students: 750 },
  ];

  // 필터 타입에 따라 데이터 선택
  const getData = () => {
    switch (filterType) {
      case "college":
        return collegeData;
      case "department":
        return departmentData;
      case "grade":
        return gradeData;
      default:
        return collegeData;
    }
  };

  const data = getData();

  // 전체 평균 계산
  const averageStress =
    data.reduce((sum, item) => sum + item.stress, 0) / data.length;

  // 모든 필터에서 동일한 높이 사용 (학년별 기준: 300px)
  const chartHeight = 300;

  // 스트레스 수준에 따라 색상 결정
  const getColor = (value) => {
    if (value >= 7.0) return "#DC3D53"; // 빨간색 (7.0 이상)
    return "#DCDFCF"; // 회색 (7.0 미만)
  };

  return (
    <Card className="card-chart comparison-card">
      <CardHeader>
        <div className="card-title-row">
          <div>
            <CardTitle tag="h4">집단별 스트레스 수준</CardTitle>
            <p className="card-category">2024년 1학기 기준</p>
          </div>
          <div className="filter-dropdown-container">
            <select
              className="filter-dropdown"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="college">단과대별</option>
              <option value="department">학과별</option>
              <option value="grade">학년별</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 10,
                right: 40,
                left: 20,
                bottom: -30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis
                type="number"
                domain={[0, 10]}
                stroke="#888888"
                tick={{ fill: "#555555", fontSize: 12 }}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#888888"
                tick={{ fill: "#555555", fontSize: 12 }}
                width={
                  filterType === "department"
                    ? 150
                    : filterType === "grade"
                    ? 80
                    : 110
                }
                tickMargin={10}
                angle={0}
                interval={0}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="custom-tooltip">
                        <div className="tooltip-label">{data.name}</div>
                        <div className="tooltip-item">
                          <span>스트레스 수준:</span>
                          <span
                            style={{
                              fontWeight: 600,
                              color: getColor(data.stress),
                            }}
                          >
                            {data.stress}
                          </span>
                        </div>
                        <div className="tooltip-item">
                          <span>학생 수:</span>
                          <span style={{ fontWeight: 600 }}>
                            {data.students.toLocaleString()}명
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* 전체 평균 기준선 */}
              <ReferenceLine
                x={averageStress}
                stroke="#666666"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{
                  value: `전체 평균 ${averageStress.toFixed(1)}`,
                  position: "top",
                  offset: 1,
                  style: { fill: "#666666", fontSize: 11, fontWeight: 600 },
                }}
              />

              <Bar dataKey="stress" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.stress)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}

export default ComparisonChart;
