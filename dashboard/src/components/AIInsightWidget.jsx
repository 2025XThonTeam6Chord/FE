import { FaRobot, FaArrowUp } from "react-icons/fa";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import "./AIInsightWidget.css";

function AIInsightWidget() {
  const insights = [
    {
      id: 1,
      type: "warning",
      category: "스트레스 수준",
      department: "공과대학",
      message: "스트레스 수준이 중간고사 기간에 15% 급등했습니다.",
      metric: "+15%",
      time: "2시간 전",
    },
    {
      id: 2,
      type: "info",
      category: "고위험군 학생 비율",
      department: "의과대학",
      message: "고위험군 학생 비율이 다른 단과대 대비 높게 나타났습니다.",
      metric: "8.2%",
      time: "5시간 전",
    },
    {
      id: 3,
      type: "positive",
      category: "응답률",
      department: "인문대학",
      message: "최근 2주간 응답률이 지속적으로 개선되고 있습니다.",
      metric: "+12%",
      time: "1일 전",
    },
  ];

  const getInsightIcon = (type) => {
    const iconProps = { size: 18, strokeWidth: 2 };
    switch (type) {
      case "warning":
        return <AlertTriangle {...iconProps} />;
      case "info":
        return <Info {...iconProps} />;
      case "positive":
        return <CheckCircle {...iconProps} />;
      default:
        return <FaRobot size={18} />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case "warning":
        return "#DC3D53"; // 코랄 레드 (스트레스 수준)
      case "info":
        return "#E2A97C"; // 피치/오렌지 (고위험군 학생 비율)
      case "positive":
        return "#73A689"; // 세이지 그린 (응답률)
      default:
        return "#6B7280";
    }
  };

  const getInsightBgColor = (type) => {
    switch (type) {
      case "warning":
        return "#FDF1F2"; // 연한 코랄 레드 배경
      case "info":
        return "#FDF4ED"; // 연한 피치 배경
      case "positive":
        return "#F0F7F4"; // 연한 세이지 그린 배경
      default:
        return "#F9FAFB";
    }
  };

  return (
    <Card className="ai-insight-widget">
      <CardHeader>
        <div className="ai-header">
          <div>
            <CardTitle tag="h4">AI 분석 인사이트</CardTitle>
            <p className="card-category">실시간 패턴 감지 및 예측</p>
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="insights-list">
          {insights.map((insight) => {
            const color = getInsightColor(insight.type);
            const bgColor = getInsightBgColor(insight.type);
            return (
              <div
                key={insight.id}
                className="insight-item"
                style={{
                  backgroundColor: bgColor,
                  borderLeftColor: color,
                }}
              >
                <span
                  className="insight-category-badge"
                  style={{
                    backgroundColor: color,
                    color: "#FFFFFF",
                  }}
                >
                  {insight.category}
                </span>
                <span className="insight-time">{insight.time}</span>
                <div className="insight-body">
                  <div className="insight-title-row">
                    <span className="insight-icon" style={{ color }}>
                      {getInsightIcon(insight.type)}
                    </span>
                    <span className="insight-department" style={{ color }}>
                      {insight.department}
                    </span>
                  </div>
                  <div className="insight-content">
                    <p className="insight-message">{insight.message}</p>
                    <div className="insight-metric" style={{ color }}>
                      <FaArrowUp className="metric-icon" />
                      <span>{insight.metric}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

export default AIInsightWidget;
