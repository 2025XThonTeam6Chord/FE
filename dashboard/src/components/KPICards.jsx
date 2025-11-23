import { useState, useEffect } from "react";
import {
  Activity, // 차트 라인 대체
  AlertTriangle, // 경고 대체
  Users, // 사용자 대체
  CalendarCheck, // 일정 대체
  Triangle, // 뱃지용 삼각형
} from "lucide-react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { getTotalSummary } from "../../../api/dashboard/dashboardApi";
import "./KPICards.css";

function KPICards() {
  const [kpiData, setKpiData] = useState(null);

  useEffect(() => {
    const fetchKPIData = async () => {
      try {
        const userId = "admin"; // 실제 구현시 Auth Context 등에서 가져옴
        const response = await getTotalSummary(userId);

        // null이나 빈 응답 처리
        if (!response) {
          console.warn("⚠️ KPI 데이터가 없습니다. 기본값을 사용합니다.");
          setKpiData(null); // null이면 기본값 사용
          return;
        }

        const data = Array.isArray(response) ? response[0] : response;
        setKpiData(data);
      } catch (err) {
        console.error("KPI 데이터 로드 실패:", err);
        setKpiData(null); // 에러 시 기본값 사용
      }
    };
    fetchKPIData();
  }, []);

  // 데이터 전처리 헬퍼: 부호(+, -) 제거 및 숫자만 반환
  const formatChangeValue = (val) => {
    if (!val) return "0";
    return val.replace(/[+-]/g, "").trim();
  };

  // API 데이터를 기반으로 KPI 배열 생성
  const kpis = kpiData
    ? [
        {
          title: "전체 학생 평균 우울 점수",
          value: kpiData.averageScore
            ? (parseFloat(kpiData.averageScore) * 10).toFixed(1)
            : "62",
          unit: "/ 100",
          changeRaw: kpiData.averageScoreChanged || "-3",
          // 점수가 낮아지면 좋은 것(Positive) -> Green
          isPositiveTrend: (kpiData.averageScoreChanged || "-").startsWith("-"),
          icon: Activity,
          color: "#FF6B00",
        },
        {
          title: "고위험군 학생 수",
          value: String(kpiData.highRiskNum || 23),
          unit: "명",
          changeRaw: kpiData.highRiskNumChanged || "+2",
          // 수가 늘어나면 나쁜 것(Negative) -> Red
          isPositiveTrend: (kpiData.highRiskNumChanged || "+").startsWith("-"),
          icon: AlertTriangle,
          color: "#EF4444",
        },
        {
          title: "이번 주 응답률",
          value: kpiData.responsNum
            ? parseFloat(kpiData.responsNum).toFixed(1)
            : "68.5",
          unit: "%",
          changeRaw: kpiData.responsNumChanged || "+5.2%",
          // 응답률은 높으면 좋은 것
          isPositiveTrend: !(kpiData.responsNumChanged || "+").startsWith("-"),
          icon: Users,
          color: "#10B981",
        },
        {
          title: "상담 신청 건수",
          value: String(kpiData.counselingReserveCount || 12),
          unit: "건",
          changeRaw: kpiData.counselingReserveCountChanged || "+3",
          // 상담 신청은 중립/긍정으로 해석 (여기선 긍정 취급)
          isPositiveTrend: true,
          icon: CalendarCheck,
          color: "#F59E0B",
        },
      ]
    : [
        // 로딩/에러 시 기본값
        {
          title: "전체 학생 평균 우울 점수",
          value: "62",
          unit: "/ 100",
          changeRaw: "-3",
          isPositiveTrend: true,
          icon: Activity,
          color: "#FF6B00",
        },
        {
          title: "고위험군 학생 수",
          value: "23",
          unit: "명",
          changeRaw: "+2",
          isPositiveTrend: false,
          icon: AlertTriangle,
          color: "#EF4444",
        },
        {
          title: "이번 주 응답률",
          value: "68.5",
          unit: "%",
          changeRaw: "+5.2%",
          isPositiveTrend: true,
          icon: Users,
          color: "#10B981",
        },
        {
          title: "상담 신청 건수",
          value: "12",
          unit: "건",
          changeRaw: "+3",
          isPositiveTrend: true,
          icon: CalendarCheck,
          color: "#F59E0B",
        },
      ];

  return (
    <Row>
      {kpis.map((kpi, index) => {
        const MainIcon = kpi.icon;
        // 변화량 텍스트에서 부호 제거
        const changeText = formatChangeValue(kpi.changeRaw);

        // 긍정적이면 초록, 부정적이면 빨강
        const badgeClass = kpi.isPositiveTrend
          ? "kpi-badge-green"
          : "kpi-badge-red";

        // 상승/하락 판단 (단순 문자열 기준)
        // 실제로는 데이터 의미에 따라 다르지만, 여기선 +, - 기호로 방향 결정
        const isDecrease = kpi.changeRaw.includes("-");

        return (
          <Col lg="3" md="6" sm="6" key={index} className="mb-4">
            <Card className="kpi-card-image-style">
              <CardBody>
                <div className="kpi-badge-container">
                  <div className={`kpi-badge ${badgeClass}`}>
                    {/* Lucide Triangle 아이콘 (fill 속성으로 채움) */}
                    <Triangle
                      size={10}
                      className={`kpi-badge-icon ${
                        isDecrease ? "rotate-180" : ""
                      }`}
                      fill="currentColor"
                      strokeWidth={0} // 외곽선 없이 채우기만
                    />
                    <span>{changeText}</span>
                  </div>

                  {/* 지난주 대비 텍스트 (선택 사항) */}
                  <span className="kpi-badge-label">지난주 대비</span>
                </div>

                <p className="kpi-title-image">{kpi.title}</p>

                <div className="kpi-content-wrapper">
                  <div className="kpi-value-image">
                    <span className="kpi-value-number-image">
                      {kpi.value}
                      <span className="kpi-unit-image">{kpi.unit}</span>
                    </span>
                  </div>

                  {/* 메인 아이콘: 색상 직접 제어 */}
                  <div
                    className="kpi-icon-bg"
                    style={{ backgroundColor: `${kpi.color}15` }} // 투명도 15% 적용
                  >
                    <MainIcon size={24} color={kpi.color} strokeWidth={2} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default KPICards;
