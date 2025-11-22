import { FaRobot, FaArrowUp } from 'react-icons/fa';
import './AIInsightWidget.css';

function AIInsightWidget() {
  const insights = [
    {
      id: 1,
      type: 'warning',
      department: '공과대학',
      message: '스트레스 수준이 중간고사 기간에 15% 급등했습니다.',
      metric: '+15%',
      time: '2시간 전'
    },
    {
      id: 2,
      type: 'info',
      department: '의과대학',
      message: '고위험군 학생 비율이 다른 단과대 대비 높게 나타났습니다.',
      metric: '8.2%',
      time: '5시간 전'
    },
    {
      id: 3,
      type: 'positive',
      department: '인문대학',
      message: '최근 2주간 응답률이 지속적으로 개선되고 있습니다.',
      metric: '+12%',
      time: '1일 전'
    }
  ];

  const getInsightIcon = (type) => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'positive':
        return '✅';
      default:
        return '🤖';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      case 'positive':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  return (
    <div className="card ai-insight-widget">
      <div className="card-header">
        <div className="ai-header">
          <FaRobot className="ai-icon" />
          <div>
            <div className="card-title">AI 분석 인사이트</div>
            <div className="card-subtitle">실시간 패턴 감지 및 예측</div>
          </div>
        </div>
      </div>
      <div className="insights-list">
        {insights.map((insight) => {
          const color = getInsightColor(insight.type);
          return (
            <div key={insight.id} className="insight-item">
              <div className="insight-header">
                <span className="insight-emoji">{getInsightIcon(insight.type)}</span>
                <span className="insight-department" style={{ color }}>
                  {insight.department}
                </span>
                <span className="insight-time">{insight.time}</span>
              </div>
              <div className="insight-content">
                <p className="insight-message">{insight.message}</p>
                <div className="insight-metric" style={{ color }}>
                  <FaArrowUp className="metric-icon" />
                  <span>{insight.metric}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AIInsightWidget;

