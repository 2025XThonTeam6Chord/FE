import { useState, useEffect, useMemo } from "react";
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
import { getFilteredScore } from "../../../api/dashboard/dashboardApi";
import "./ComparisonChart.css";

function ComparisonChart() {
  const [filterType, setFilterType] = useState("college"); // 'college', 'department', 'grade'

  // 기본 데이터 맵
  const defaultDataMap = useMemo(
    () => ({
      college: [
        { name: "공과대학", stress: 7.2, students: 1200 },
        { name: "인문대학", stress: 6.8, students: 850 },
        { name: "경영대학", stress: 6.5, students: 680 },
        { name: "의과대학", stress: 7.8, students: 420 },
        { name: "예술대학", stress: 5.9, students: 350 },
        { name: "사범대학", stress: 6.3, students: 520 },
      ],
      department: [
        { name: "컴퓨터공학과", stress: 7.5, students: 320 },
        { name: "전기전자공학과", stress: 7.1, students: 280 },
        { name: "기계공학과", stress: 7.0, students: 250 },
        { name: "국어국문학과", stress: 6.5, students: 180 },
        { name: "영어영문학과", stress: 6.3, students: 200 },
        { name: "경영학과", stress: 6.8, students: 350 },
        { name: "화학공학과", stress: 6.9, students: 220 },
        { name: "산업공학과", stress: 6.7, students: 190 },
        { name: "건축공학과", stress: 6.6, students: 160 },
        { name: "신소재공학과", stress: 6.4, students: 140 },
      ],
      grade: [
        { name: "1학년", stress: 6.2, students: 850 },
        { name: "2학년", stress: 6.8, students: 920 },
        { name: "3학년", stress: 7.3, students: 880 },
        { name: "4학년", stress: 7.6, students: 750 },
      ],
    }),
    []
  );

  const [data, setData] = useState(() => defaultDataMap.college);

  // 필터 타입을 API의 filter 숫자로 변환
  const getFilterNumber = (type) => {
    switch (type) {
      case "college":
        return 0;
      case "department":
        return 1;
      case "grade":
        return 2;
      default:
        return 0;
    }
  };

  // API에서 데이터 가져오기
  useEffect(() => {
    // 기본 데이터로 즉시 설정하여 빠른 UI 업데이트
    const defaultData = defaultDataMap[filterType] || [];
    setData(defaultData);

    const fetchData = async () => {
      try {
        const userId = "admin"; // 테스트용
        const filterNum = getFilterNumber(filterType);
        const response = await getFilteredScore(filterNum, userId);
        console.log("📊 ComparisonChart API 응답:", response);
        console.log("📊 Filter Type:", filterType, "Filter Num:", filterNum);

        // API 응답 처리: Swagger 문서에 따르면 {filteredGroups: [...]} 형식이지만,
        // 실제로는 배열로 직접 오는 경우도 있음
        let dataArray = [];
        if (Array.isArray(response)) {
          // 배열로 직접 오는 경우
          dataArray = response;
        } else if (response?.filteredGroups) {
          // {filteredGroups: [...]} 형식
          dataArray = Array.isArray(response.filteredGroups)
            ? response.filteredGroups
            : [response.filteredGroups];
        } else {
          console.warn("예상하지 못한 API 응답 형식:", response);
        }

        console.log("📊 파싱된 데이터 배열:", dataArray);

        // API 응답을 차트 형식으로 변환
        const transformedData = dataArray.map((item) => {
          // scoreY 우선, 없으면 groupY 사용 (Swagger: scoreY, 실제: groupY도 사용)
          const score =
            item.scoreY !== undefined && item.scoreY !== null
              ? parseFloat(item.scoreY)
              : item.groupY !== undefined && item.groupY !== null
              ? parseFloat(item.groupY)
              : 0;

          return {
            name: item.groupX || "",
            stress: score / 10 || 0, // 100점 만점을 10점 만점으로 변환
            students: 0, // API에 학생 수가 없으면 0
          };
        });

        console.log("📊 변환된 차트 데이터:", transformedData);
        setData(transformedData.length > 0 ? transformedData : defaultData);
      } catch (err) {
        console.error("집단별 점수 데이터 로드 실패:", err);
        setData(defaultData);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  // 전체 평균 계산 - useMemo로 최적화
  const averageStress = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((sum, item) => sum + item.stress, 0) / data.length;
  }, [data]);

  // 차트 높이 계산: 표시 영역은 6개 기준으로 고정, 실제 차트는 데이터 길이에 따라
  const maxVisibleItems = 6;
  const itemHeight = 50; // 각 항목당 높이
  const baseHeight = 100; // 기본 여백 및 축 높이
  const visibleHeight = maxVisibleItems * itemHeight + baseHeight; // 표시 영역 높이
  const chartHeight = data.length * itemHeight + baseHeight; // 실제 차트 높이

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
            <p className="card-category">최근 16주 기준</p>
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
        <div
          className="chart-wrapper"
          style={{ maxHeight: `${visibleHeight}px` }}
        >
          <div
            className="chart-container"
            style={{
              height: `${chartHeight}px`,
              marginTop: filterType === "grade" ? "30px" : "0",
              marginLeft: "-20px",
            }}
          >
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 40,
                  left: 20,
                  bottom: 10,
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
                  width={150}
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
        </div>
      </CardBody>
    </Card>
  );
}

export default ComparisonChart;
