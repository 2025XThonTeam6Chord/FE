import './RiskStudentList.css';

function RiskStudentList() {
  const riskStudents = [
    {
      id: 1,
      name: '김○○',
      studentId: '2020123456',
      college: '공과대학',
      department: '컴퓨터공학과',
      riskLevel: '심각',
      riskScore: 9.2,
      symptoms: ['불면증', '우울감', '자해 사고'],
      lastResponse: '2024.01.15',
      counselingStatus: '대기중'
    },
    {
      id: 2,
      name: '이○○',
      studentId: '2021123456',
      college: '의과대학',
      department: '의학과',
      riskLevel: '심각',
      riskScore: 8.8,
      symptoms: ['극도의 불안', '섭식 장애', '집중력 저하'],
      lastResponse: '2024.01.14',
      counselingStatus: '진행중'
    },
    {
      id: 3,
      name: '박○○',
      studentId: '2022123456',
      college: '인문대학',
      department: '국어국문학과',
      riskLevel: '주의',
      riskScore: 7.5,
      symptoms: ['불안감', '스트레스', '수면 부족'],
      lastResponse: '2024.01.15',
      counselingStatus: '대기중'
    },
    {
      id: 4,
      name: '최○○',
      studentId: '2020127890',
      college: '경영대학',
      department: '경영학과',
      riskLevel: '주의',
      riskScore: 7.2,
      symptoms: ['우울감', '학업 스트레스'],
      lastResponse: '2024.01.13',
      counselingStatus: '완료'
    },
    {
      id: 5,
      name: '정○○',
      studentId: '2021127890',
      college: '공과대학',
      department: '전기공학과',
      riskLevel: '주의',
      riskScore: 7.0,
      symptoms: ['불안감', '피로'],
      lastResponse: '2024.01.15',
      counselingStatus: '대기중'
    },
    {
      id: 6,
      name: '강○○',
      studentId: '2022127890',
      college: '예술대학',
      department: '음악과',
      riskLevel: '주의',
      riskScore: 6.8,
      symptoms: ['스트레스', '집중력 저하'],
      lastResponse: '2024.01.12',
      counselingStatus: '진행중'
    }
  ];

  const getRiskBadgeClass = (level) => {
    return level === '심각' ? 'risk-badge-critical' : 'risk-badge-warning';
  };

  const getCounselingBadgeClass = (status) => {
    if (status === '진행중') return 'counseling-badge-progress';
    if (status === '완료') return 'counseling-badge-completed';
    return 'counseling-badge-waiting';
  };

  return (
    <div className="card risk-list-card">
      <div className="card-header">
        <div className="card-title">고위험군 학생 목록</div>
        <div className="card-subtitle">상담이 필요한 학생 (AI 분석 기반)</div>
      </div>
      <div className="table-container">
        <table className="risk-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>학과</th>
              <th>위험도</th>
              <th>위험 점수</th>
              <th>주요 증상</th>
              <th>최근 응답일</th>
              <th>액션</th>
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
                  <span className={`risk-badge ${getRiskBadgeClass(student.riskLevel)}`}>
                    {student.riskLevel}
                  </span>
                </td>
                <td>
                  <span className="risk-score" style={{
                    color: student.riskScore >= 8 ? '#EF4444' : '#F59E0B'
                  }}>
                    {student.riskScore}
                  </span>
                </td>
                <td>
                  <div className="symptoms-tags">
                    {student.symptoms.map((symptom, index) => {
                      // 증상별 색상 매핑
                      const getSymptomColor = (symptom) => {
                        if (symptom.includes('불면') || symptom.includes('수면')) return { bg: '#DBEAFE', color: '#3B82F6' };
                        if (symptom.includes('우울')) return { bg: '#FEE2E2', color: '#EF4444' };
                        if (symptom.includes('불안') || symptom.includes('스트레스')) return { bg: '#FEF3C7', color: '#F59E0B' };
                        if (symptom.includes('자해')) return { bg: '#FEE2E2', color: '#DC2626' };
                        return { bg: '#F3F4F6', color: '#6B7280' };
                      };
                      const colors = getSymptomColor(symptom);
                      return (
                        <span
                          key={index}
                          className="symptom-tag"
                          style={{ backgroundColor: colors.bg, color: colors.color }}
                        >
                          {symptom}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td>
                  <span className="date-text">{student.lastResponse}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    {student.counselingStatus === '대기중' && (
                      <button
                        className="action-btn action-btn-primary"
                        onClick={() => alert(`${student.name} 학생에게 상담사를 배정합니다.`)}
                      >
                        상담사 배정
                      </button>
                    )}
                    {student.counselingStatus === '진행중' && (
                      <button
                        className="action-btn action-btn-secondary"
                        onClick={() => alert(`${student.name} 학생의 상담 로그를 확인합니다.`)}
                      >
                        로그 보기
                      </button>
                    )}
                    {student.counselingStatus === '완료' && (
                      <button
                        className="action-btn action-btn-completed"
                        onClick={() => alert(`${student.name} 학생의 상담 결과를 확인합니다.`)}
                      >
                        결과 보기
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RiskStudentList;

