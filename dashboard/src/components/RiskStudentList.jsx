import { useState, useEffect } from "react";
import { getReserveList } from "../../../api/dashboard/dashboardApi";
import { FaLock } from "react-icons/fa";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap";
import "./RiskStudentList.css";

function RiskStudentList() {
  const [riskStudents, setRiskStudents] = useState([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authError, setAuthError] = useState("");

  // 기본 데이터 (API 실패 시 사용)
  const getDefaultData = () => [
    {
      id: 1,
      name: "김○○",
      studentId: "2020123456",
      college: "공과대학",
      department: "컴퓨터공학과",
      riskLevel: "심각",
      riskScore: 9.2,
      requestDate: "2024.01.15",
    },
    {
      id: 2,
      name: "이○○",
      studentId: "2021123456",
      college: "의과대학",
      department: "의학과",
      riskLevel: "심각",
      riskScore: 8.8,
      requestDate: "2024.01.14",
    },
    {
      id: 3,
      name: "박○○",
      studentId: "2022123456",
      college: "인문대학",
      department: "국어국문학과",
      riskLevel: "주의",
      riskScore: 7.5,
      requestDate: "2024.01.15",
    },
    {
      id: 4,
      name: "최○○",
      studentId: "2020127890",
      college: "경영대학",
      department: "경영학과",
      riskLevel: "주의",
      riskScore: 7.2,
      requestDate: "2024.01.13",
    },
    {
      id: 5,
      name: "정○○",
      studentId: "2021127890",
      college: "공과대학",
      department: "전기공학과",
      riskLevel: "주의",
      riskScore: 7.0,
      requestDate: "2024.01.15",
    },
    {
      id: 6,
      name: "강○○",
      studentId: "2022127890",
      college: "예술대학",
      department: "음악과",
      riskLevel: "주의",
      riskScore: 6.8,
      requestDate: "2024.01.12",
    },
  ];

  useEffect(() => {
    if (!isUnlocked) return; // 잠금 해제 전에는 데이터 로드 안 함

    const fetchData = async () => {
      try {
        const userId = "admin"; // 테스트용
        const response = await getReserveList(userId);
        console.log("📊 RiskStudentList 데이터 로드:", response);

        // API 응답이 배열로 직접 오는 경우
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

        // API 응답을 컴포넌트 형식으로 변환
        const transformedData = dataArray.map((user, index) => {
          // 위험 점수에 따라 위험도 결정 (API에 없으면 랜덤 또는 기본값)
          const riskScore =
            user.riskScore || user.score || 7.0 + Math.random() * 2; // 7.0 ~ 9.0
          const riskLevel = riskScore >= 8.0 ? "심각" : "주의";

          // 상담 신청일 (API에 없으면 오늘 날짜)
          const requestDate =
            user.requestDate ||
            user.createdAt ||
            user.lastResponse ||
            new Date().toISOString().split("T")[0].replace(/-/g, ".");

          return {
            id: index + 1,
            name: user.name || "이름 없음",
            studentId: user.userKey || user.studentId || "",
            college: user.univ || user.college || "",
            department: user.major || user.department || "",
            riskLevel: riskLevel,
            riskScore: parseFloat(riskScore.toFixed(1)),
            requestDate: requestDate,
          };
        });

        setRiskStudents(
          transformedData.length > 0 ? transformedData : getDefaultData()
        );
      } catch (err) {
        console.error("상담 신청 목록 로드 실패:", err);
        setRiskStudents(getDefaultData());
      }
    };

    fetchData();
  }, [isUnlocked]);

  const handleLockClick = () => {
    setShowAuthModal(true);
    setAuthCode("");
    setAuthError("");
  };

  const handleAuthSubmit = () => {
    // 인증코드 검증 (예: "ADMIN123" 또는 다른 코드)
    const validCodes = ["ADMIN123", "1234", "admin"];
    if (
      validCodes.includes(authCode.toUpperCase()) ||
      validCodes.includes(authCode)
    ) {
      setIsUnlocked(true);
      setShowAuthModal(false);
      setAuthCode("");
      setAuthError("");
    } else {
      setAuthError("인증코드가 올바르지 않습니다.");
    }
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
    setAuthCode("");
    setAuthError("");
  };

  const getRiskBadgeClass = (level) => {
    return level === "심각" ? "risk-badge-critical" : "risk-badge-warning";
  };

  return (
    <div className="card risk-list-card">
      <div className="card-header">
        <div>
          <div className="card-title">상담 신청 목록</div>
          <div className="card-subtitle">상담 신청 학생 목록</div>
        </div>
      </div>
      {isUnlocked ? (
        <div className="table-container">
          <table className="risk-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>학과</th>
                <th>위험도</th>
                <th>위험 점수</th>
                <th>상담 신청일</th>
              </tr>
            </thead>
            <tbody>
              {riskStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="student-name">
                      <span className="name-text">{student.name}</span>
                      <span className="student-id">{student.studentId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="department-info">
                      <span className="college">{student.college}</span>
                      <span className="department">{student.department}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`risk-badge ${getRiskBadgeClass(
                        student.riskLevel
                      )}`}
                    >
                      {student.riskLevel}
                    </span>
                  </td>
                  <td>
                    <span
                      className="risk-score"
                      style={{
                        color: student.riskScore >= 8 ? "#DC3D53" : "#E2A97C",
                      }}
                    >
                      {student.riskScore}
                    </span>
                  </td>
                  <td>
                    <span className="date-text">{student.requestDate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="locked-content" onClick={handleLockClick}>
          <FaLock size={48} className="locked-icon" />
          <p className="locked-message">인증이 필요합니다</p>
          <p className="locked-submessage">클릭하여 인증코드를 입력하세요</p>
        </div>
      )}

      <Modal
        isOpen={showAuthModal}
        toggle={handleModalClose}
        centered
        className="auth-modal"
      >
        <ModalHeader className="auth-modal-header">
          <div className="auth-modal-title">인증코드 입력</div>
        </ModalHeader>
        <ModalBody className="auth-modal-body">
          <div className="auth-form">
            <Input
              type="text"
              id="authCode"
              value={authCode}
              onChange={(e) => {
                setAuthCode(e.target.value);
                setAuthError("");
              }}
              placeholder="인증코드를 입력하세요"
              className="auth-input"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAuthSubmit();
                }
              }}
            />
            {authError && <div className="auth-error">{authError}</div>}
          </div>
        </ModalBody>
        <ModalFooter className="auth-modal-footer">
          <Button className="auth-btn-cancel" onClick={handleModalClose}>
            취소
          </Button>
          <Button className="auth-btn-submit" onClick={handleAuthSubmit}>
            확인
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default RiskStudentList;
