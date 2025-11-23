import { useState, useEffect } from "react";
import { getReserveList } from "../../../api/dashboard/dashboardApi";
import { FaLock } from "react-icons/fa";
import { Calendar, ChevronRight } from "lucide-react"; // 모던 아이콘 추가
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
} from "reactstrap";
import "./RiskStudentList.css";

function RiskStudentList() {
  const [riskStudents, setRiskStudents] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authError, setAuthError] = useState("");

  // 기본 데이터 (API 실패 시 사용) - 100점 만점
  const getDefaultData = () => [
    {
      id: 1,
      name: "김컴공",
      studentId: "20210001",
      college: "공과대학",
      dept: "컴퓨터공학과",
      riskLevel: "critical", // 심각
      riskScore: 92,
      date: "2025.11.22",
    },
    {
      id: 2,
      name: "이경영",
      studentId: "20210002",
      college: "경영대학",
      dept: "경영학과",
      riskLevel: "warning", // 주의
      riskScore: 78,
      date: "2025.11.22",
    },
    {
      id: 3,
      name: "박예술",
      studentId: "20230045",
      college: "예술대학",
      dept: "시각디자인학과",
      riskLevel: "normal", // 정상
      riskScore: 45,
      date: "2025.11.21",
    },
    {
      id: 4,
      name: "최의학",
      studentId: "20205512",
      college: "의과대학",
      dept: "의예과",
      riskLevel: "critical",
      riskScore: 95,
      date: "2025.11.20",
    },
  ];

  useEffect(() => {
    if (!isUnlocked) return;

    const fetchData = async () => {
      try {
        const userId = "admin";
        const response = await getReserveList(userId);

        let dataArray = [];
        if (Array.isArray(response)) {
          dataArray = response;
        } else if (
          response?.counselingUsers &&
          Array.isArray(response.counselingUsers)
        ) {
          dataArray = response.counselingUsers;
        } else if (response && typeof response === "object") {
          dataArray = [response];
        }

        const transformedData = dataArray.map((user, index) => {
          // API에서 받은 점수를 100점 만점으로 변환 (이미 100점 만점이면 그대로 사용)
          let rawScore =
            user.riskScore || user.score || 70 + Math.random() * 20;
          // 10점 만점인 경우 100점 만점으로 변환
          if (rawScore <= 10) {
            rawScore = rawScore * 10;
          }
          const riskScore = parseFloat(rawScore.toFixed(1));

          // 점수에 따라 레벨(클래스명) 매핑 - 100점 만점 기준
          let riskLevel = "normal";
          if (riskScore >= 80) riskLevel = "critical";
          else if (riskScore >= 70) riskLevel = "warning";

          const requestDate =
            user.requestDate ||
            new Date().toISOString().split("T")[0].replace(/-/g, ".");

          return {
            id: index + 1,
            name: user.name || "이름 없음",
            studentId: user.userKey || user.studentId || "",
            college: user.univ || user.college || "",
            dept: user.major || user.department || "",
            riskLevel: riskLevel,
            riskScore: riskScore,
            date: requestDate,
          };
        });

        setRiskStudents(
          transformedData.length > 0 ? transformedData : getDefaultData()
        );
      } catch (err) {
        console.error("로드 실패:", err);
        setRiskStudents(getDefaultData());
      }
    };

    fetchData();
  }, [isUnlocked]);

  // --- 핸들러 ---
  const handleLockClick = () => {
    setShowAuthModal(true);
    setAuthCode("");
    setAuthError("");
  };

  const handleAuthSubmit = () => {
    const validCodes = ["ADMIN123", "1234", "admin"];
    if (
      validCodes.includes(authCode.toUpperCase()) ||
      validCodes.includes(authCode)
    ) {
      setIsUnlocked(true);
      setShowAuthModal(false);
    } else {
      setAuthError("인증코드가 올바르지 않습니다.");
    }
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
    setAuthCode("");
    setAuthError("");
  };

  // --- UI 헬퍼 ---
  const getRiskBadge = (level) => {
    switch (level) {
      case "critical":
        return <span className="badge-modern critical">심각</span>;
      case "warning":
        return <span className="badge-modern warning">주의</span>;
      default:
        return <span className="badge-modern normal">정상</span>;
    }
  };

  const getScoreColor = (score) => {
    // 100점 만점 기준
    if (score >= 80) return "#EF4444";
    if (score >= 70) return "#F59E0B";
    return "#10B981";
  };

  return (
    <Card className="risk-list-card-modern">
      <CardHeader className="list-header-modern">
        <div className="header-content-modern">
          <div>
            <CardTitle tag="h5" className="list-title-modern">
              상담 신청 목록
            </CardTitle>
            <p className="list-subtitle-modern">
              {isUnlocked
                ? `오늘 접수된 상담 신청 ${riskStudents.length}건`
                : "민감한 학생 정보 보호를 위해 잠겨있습니다."}
            </p>
          </div>
          {isUnlocked && (
            <Button className="view-all-btn-modern">전체 보기</Button>
          )}
        </div>
      </CardHeader>

      <CardBody className="list-body-modern">
        {isUnlocked ? (
          <div className="student-list-grid">
            {/* 헤더 행 */}
            <div className="list-row-header-modern">
              <span className="col-student">학생 정보</span>
              <span className="col-dept">소속</span>
              <span className="col-risk">위험도 분석</span>
              <span className="col-date">신청일</span>
              <span className="col-action"></span>
            </div>

            {/* 데이터 행 리스트 */}
            {riskStudents.map((student) => (
              <div key={student.id} className="list-row-item-modern">
                {/* 1. 학생 프로필 */}
                <div className="col-student student-profile-modern">
                  <div className={`avatar-circle-modern ${student.riskLevel}`}>
                    {student.name[0]}
                  </div>
                  <div className="student-info-modern">
                    <span className="student-name">{student.name}</span>
                    <span className="student-id">{student.studentId}</span>
                  </div>
                </div>

                {/* 2. 소속 */}
                <div className="col-dept dept-info-modern">
                  <span className="college-name">{student.college}</span>
                  <span className="dept-name">{student.dept}</span>
                </div>

                {/* 3. 위험도 */}
                <div className="col-risk risk-info-modern">
                  {getRiskBadge(student.riskLevel)}
                  <div className="risk-score-box">
                    <span className="score-label">위험점수</span>
                    <span
                      className="score-value"
                      style={{ color: getScoreColor(student.riskScore) }}
                    >
                      {student.riskScore}
                    </span>
                  </div>
                </div>

                {/* 4. 날짜 */}
                <div className="col-date date-info-modern">
                  <Calendar size={14} className="date-icon" />
                  <span>{student.date}</span>
                </div>

                {/* 5. 액션 */}
                <div className="col-action">
                  <button className="action-btn-modern">
                    상담하기 <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 잠금 화면 */
          <div className="locked-content-modern" onClick={handleLockClick}>
            <div className="locked-icon-wrapper">
              <FaLock size={24} />
            </div>
            <p className="locked-title">인증이 필요합니다</p>
            <p className="locked-desc">
              학생 개인정보 보호를 위해 접근 권한을 확인합니다.
            </p>
            <Button className="unlock-btn">잠금 해제</Button>
          </div>
        )}
      </CardBody>

      {/* 인증 모달 (기존 로직 유지, 스타일 개선) */}
      <Modal
        isOpen={showAuthModal}
        toggle={handleModalClose}
        centered
        className="auth-modal-modern"
      >
        <ModalHeader className="auth-header">관리자 인증</ModalHeader>
        <ModalBody className="auth-body">
          <Input
            type="password"
            placeholder="인증 코드를 입력하세요"
            value={authCode}
            onChange={(e) => {
              setAuthCode(e.target.value);
              setAuthError("");
            }}
            onKeyPress={(e) => e.key === "Enter" && handleAuthSubmit()}
            className={`auth-input-modern ${authError ? "error" : ""}`}
            autoFocus
          />
          {authError && <p className="auth-error-msg">{authError}</p>}
        </ModalBody>
        <ModalFooter className="auth-footer">
          <Button onClick={handleModalClose} className="btn-cancel">
            취소
          </Button>
          <Button className="btn-confirm" onClick={handleAuthSubmit}>
            확인
          </Button>
        </ModalFooter>
      </Modal>
    </Card>
  );
}

export default RiskStudentList;
