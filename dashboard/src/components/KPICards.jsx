import { useState, useEffect } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaChartLine,
  FaCalendarCheck,
} from "react-icons/fa";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardBody, CardFooter, CardTitle, Row, Col } from "reactstrap";
import { getTotalSummary } from "../../../api/dashboard/dashboardApi";
import "./KPICards.css";

function KPICards() {
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        // 테스트용 userId (실제로는 인증에서 가져와야 함)
        const userId = "admin";
        const response = await getTotalSummary(userId);
        // API 응답이 배열인 경우 첫 번째 요소 사용
        const data = Array.isArray(response) ? response[0] : response;
        console.log("📊 KPI 데이터 로드 성공:", data);
        setKpiData(data);
      } catch (err) {
        console.error("KPI 데이터 로드 실패:", err);
        // 에러 발생 시 기본값 유지 (kpiData가 null이면 기본값 사용)
      }
    };

    fetchKPIData();
  }, []);
  // Sparkline 데이터 생성 (최근 7일) - useMemo로 고정값 사용
  const generateSparklineData = (trend) => {
    const data = [];
    let baseValue = 50;
    // 고정된 시드 기반 값 생성 (랜덤 대신)
    const seed = trend === "up" ? 0.3 : trend === "down" ? -0.2 : 0.1;
    for (let i = 0; i < 7; i++) {
      if (trend === "up") {
        baseValue += seed * 10 + i * 0.5;
      } else if (trend === "down") {
        baseValue -= Math.abs(seed) * 8 + i * 0.3;
      } else {
        baseValue += seed * 6;
      }
      data.push({ value: Math.max(0, Math.min(100, baseValue)) });
    }
    return data;
  };

  // API 데이터를 기반으로 KPI 배열 생성
  const kpis = kpiData
    ? [
        {
          title: "전체 학생 평균 우울 점수",
          value: kpiData.averageScore
            ? (typeof kpiData.averageScore === "string"
                ? parseFloat(kpiData.averageScore)
                : kpiData.averageScore
              ).toFixed(1)
            : "6.2",
          unit: "/ 10",
          change: kpiData.averageScoreChanged || "-0.3",
          changeType: kpiData.averageScoreChanged?.startsWith("-")
            ? "positive"
            : "negative",
          icon: FaChartLine,
          color: "#FF6B00",
          sparklineData: generateSparklineData("down"),
          status: "warning",
        },
        {
          title: "고위험군 학생 수",
          value: String(kpiData.highRiskNum || 23),
          unit: "명",
          change: kpiData.highRiskNumChanged || "+2",
          changeType: kpiData.highRiskNumChanged?.startsWith("+")
            ? "negative"
            : "positive",
          icon: FaExclamationTriangle,
          color: "#EF4444",
          sparklineData: generateSparklineData("up"),
          status: "danger",
        },
        {
          title: "이번 주 응답률",
          value:
            kpiData.responsNum || kpiData.responseNum
              ? (typeof (kpiData.responsNum || kpiData.responseNum) === "string"
                  ? parseFloat(kpiData.responsNum || kpiData.responseNum)
                  : kpiData.responsNum || kpiData.responseNum
                ).toFixed(1)
              : "68.5",
          unit: "%",
          change:
            kpiData.responsNumChanged || kpiData.responseNumChanged || "+5.2%",
          changeType: (
            kpiData.responsNumChanged || kpiData.responseNumChanged
          )?.startsWith("+")
            ? "positive"
            : "negative",
          icon: FaUsers,
          color: "#10B981",
          sparklineData: generateSparklineData("up"),
          status: "success",
        },
        {
          title: "상담 신청 건수",
          value: String(kpiData.counselingReserveCount || 12),
          unit: "건",
          change: kpiData.counselingReserveCountChanged || "+3",
          changeType: "neutral",
          icon: FaCalendarCheck,
          color: "#F59E0B",
          sparklineData: generateSparklineData("neutral"),
          status: "success",
        },
      ]
    : [
        // 기본값 (로딩 중 또는 에러 시)
        {
          title: "전체 학생 평균 우울 점수",
          value: "6.2",
          unit: "/ 10",
          change: "-0.3",
          changeType: "positive",
          icon: FaChartLine,
          color: "#FF6B00",
          sparklineData: generateSparklineData("down"),
          status: "warning",
        },
        {
          title: "고위험군 학생 수",
          value: "23",
          unit: "명",
          change: "+2",
          changeType: "negative",
          icon: FaExclamationTriangle,
          color: "#EF4444",
          sparklineData: generateSparklineData("up"),
          status: "danger",
        },
        {
          title: "이번 주 응답률",
          value: "68.5",
          unit: "%",
          change: "+5.2%",
          changeType: "positive",
          icon: FaUsers,
          color: "#10B981",
          sparklineData: generateSparklineData("up"),
          status: "success",
        },
        {
          title: "상담 신청 건수",
          value: "12",
          unit: "건",
          change: "+3",
          changeType: "neutral",
          icon: FaCalendarCheck,
          color: "#F59E0B",
          sparklineData: generateSparklineData("neutral"),
          status: "success",
        },
      ];

  const getIconClass = (color) => {
    if (color === "#EF4444") return "text-danger";
    if (color === "#10B981") return "text-success";
    if (color === "#F59E0B") return "text-warning";
    return "text-primary";
  };

  return (
    <Row>
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        const iconClass = getIconClass(kpi.color);
        const statusClass = `kpi-status-${kpi.status}`;
        return (
          <Col lg="3" md="6" sm="6" key={index}>
            <Card className={`card-stats ${statusClass}`}>
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className={`icon-big text-center ${iconClass}`}>
                      <IconComponent size={24} />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">{kpi.title}</p>
                      <CardTitle tag="p">
                        {kpi.value}
                        {kpi.unit}
                      </CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> 지난주 대비 {kpi.change}
                </div>
              </CardFooter>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default KPICards;
