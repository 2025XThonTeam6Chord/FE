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
import { Filter } from "lucide-react";
import { getFilteredScore } from "../../../api/dashboard/dashboardApi";
import "./ComparisonChart.css";

function ComparisonChart() {
  const [filterType, setFilterType] = useState("college");

  // Mock 데이터 (70점 기준 테스트를 위해 100점 만점 스케일로 변경)
  const defaultDataMap = useMemo(
    () => ({
      college: [
        { name: "공과대학", stress: 72, students: 1200 },
        { name: "인문대학", stress: 68, students: 850 },
        { name: "경영대학", stress: 65, students: 680 },
        { name: "의과대학", stress: 78, students: 420 }, // 70점 이상 (Red)
        { name: "예술대학", stress: 59, students: 350 },
        { name: "사범대학", stress: 63, students: 520 },
      ],
      department: [
        { name: "컴퓨터공학", stress: 75, students: 320 },
        { name: "전기전자", stress: 71, students: 280 },
        { name: "기계공학", stress: 70, students: 250 },
        { name: "국어국문", stress: 65, students: 180 },
        { name: "영어영문", stress: 63, students: 200 },
        { name: "경영학과", stress: 68, students: 350 },
      ],
      grade: [
        { name: "1학년", stress: 62, students: 850 },
        { name: "2학년", stress: 68, students: 920 },
        { name: "3학년", stress: 73, students: 880 },
        { name: "4학년", stress: 76, students: 750 },
      ],
    }),
    []
  );

  const [data, setData] = useState(() => defaultDataMap.college);

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

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setFilterType(newFilter);
    setData(defaultDataMap[newFilter] || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = "admin";
        const filterNum = getFilterNumber(filterType);
        const response = await getFilteredScore(filterNum, userId);

        let dataArray = [];
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (response?.filteredGroups) {
          dataArray = Array.isArray(response.filteredGroups)
            ? response.filteredGroups
            : [response.filteredGroups];
        }

        if (dataArray.length > 0) {
          const transformedData = dataArray.map((item) => {
            const rawScore = item.scoreX ?? item.scoreY ?? 0;
            const score = parseFloat(rawScore) || 0;
            const name = item.groupY || item.groupX || "";

            return {
              name: name,
              stress: score,
              students: item.count || 0,
            };
          });
          setData(transformedData);
        }
      } catch (err) {
        console.error("데이터 로드 실패, 기본값 유지", err);
      }
    };

    fetchData();
  }, [filterType]);

  const averageStress = useMemo(() => {
    if (data.length === 0) return 0;
    return data.reduce((sum, item) => sum + item.stress, 0) / data.length;
  }, [data]);

  // [수정] 70점 이상일 때만 빨간색, 그 외 회색
  const getColor = (value) => {
    return value >= 70 ? "#EF4444" : "#E5E7EB";
  };

  const filterOptions = {
    college: "단과대별 보기",
    department: "학과별 보기",
    grade: "학년별 보기",
  };

  return (
    <Card className="widget-card comparison-card-modern">
      <CardHeader className="widget-header">
        <div className="header-content">
          <div>
            <CardTitle tag="h5" className="widget-title">
              집단별 스트레스 분석
            </CardTitle>
            <p className="widget-subtitle">항목 별 집단 비교</p>
          </div>

          <div className="filter-wrapper">
            <Filter size={16} className="filter-icon" />
            <select
              className="modern-select"
              value={filterType}
              onChange={handleFilterChange}
            >
              {Object.entries(filterOptions).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardBody className="widget-body chart-body-modern">
        <div className={`chart-wrapper ${data.length > 6 ? "scrollable" : ""}`}>
          <ResponsiveContainer
            width="100%"
            height={data.length > 6 ? data.length * 60 : 380}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 25, right: 20, left: 40, bottom: 0 }} // 상단 여백 조금 늘림(라벨 공간)
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#E5E7EB"
              />

              {/* [수정] 100점 만점 기준으로 변경 */}
              <XAxis type="number" hide domain={[0, 100]} />

              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 13, fill: "#4B5563", fontWeight: 500 }}
                width={80}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.03)" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;

                    let safeStress = Number(d.stress);
                    if (isNaN(safeStress)) safeStress = 0;

                    return (
                      <div className="custom-tooltip-dark">
                        <p className="tooltip-title">{d.name}</p>
                        <div className="tooltip-row">
                          <span>스트레스</span>
                          {/* [수정] 70점 기준 색상 적용 */}
                          <span
                            className={`value ${
                              safeStress >= 70 ? "danger" : ""
                            }`}
                          >
                            {safeStress.toFixed(1)}점
                          </span>
                        </div>
                        <div className="tooltip-row">
                          <span>학생 수</span>
                          <span className="value">
                            {(d.students || 0).toLocaleString()}명
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* [수정] 'Avg' -> '평균 점수' 변경 */}
              <ReferenceLine
                x={averageStress}
                stroke="#9CA3AF"
                strokeDasharray="4 4"
                label={{
                  value: `${averageStress.toFixed(1)}점`,
                  position: "top",
                  fill: "#9CA3AF",
                  fontSize: 11,
                  fontWeight: 600,
                  offset: 10, // 라벨을 선에서 약간 위로 띄움
                }}
              />

              <Bar dataKey="stress" barSize={20} radius={[0, 4, 4, 0]}>
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
