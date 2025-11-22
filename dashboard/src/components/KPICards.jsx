import {
  FaUsers,
  FaExclamationTriangle,
  FaChartLine,
  FaCalendarCheck,
} from "react-icons/fa";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import { Card, CardBody, CardFooter, CardTitle, Row, Col } from "reactstrap";
import "./KPICards.css";

function KPICards() {
  // Sparkline 데이터 생성 (최근 7일)
  const generateSparklineData = (trend) => {
    const data = [];
    let baseValue = 50;
    for (let i = 0; i < 7; i++) {
      if (trend === "up") {
        baseValue += Math.random() * 10 - 2;
      } else if (trend === "down") {
        baseValue -= Math.random() * 8 - 1;
      } else {
        baseValue += Math.random() * 6 - 3;
      }
      data.push({ value: Math.max(0, Math.min(100, baseValue)) });
    }
    return data;
  };

  const kpis = [
    {
      title: "전체 학생 평균 우울 점수",
      value: "6.2",
      unit: "/ 10",
      change: "-0.3",
      changeType: "positive",
      changePercent: "-4.6%",
      icon: FaChartLine,
      color: "#FF6B00",
      sparklineData: generateSparklineData("down"),
      status: "warning", // 괜찮은 상황 (중간 수준)
    },
    {
      title: "고위험군 학생 수",
      value: "23",
      unit: "명",
      change: "+2",
      changeType: "negative",
      changePercent: "+9.5%",
      icon: FaExclamationTriangle,
      color: "#EF4444",
      sparklineData: generateSparklineData("up"),
      status: "danger", // 안 좋은 상황 (증가)
    },
    {
      title: "이번 주 응답률",
      value: "68.5",
      unit: "%",
      change: "+5.2%",
      changeType: "positive",
      changePercent: "+8.2%",
      icon: FaUsers,
      color: "#10B981",
      sparklineData: generateSparklineData("up"),
      status: "success", // 좋은 상황 (증가)
    },
    {
      title: "상담 신청 건수",
      value: "12",
      unit: "건",
      change: "+3",
      changeType: "neutral",
      changePercent: "+33.3%",
      icon: FaCalendarCheck,
      color: "#F59E0B",
      sparklineData: generateSparklineData("neutral"),
      status: "success", // 좋은 상황 (증가)
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
