import { FaUsers, FaExclamationTriangle, FaChartLine, FaCalendarCheck } from 'react-icons/fa';
import { ResponsiveContainer, Area, AreaChart } from 'recharts';
import './KPICards.css';

function KPICards() {
  // Sparkline 데이터 생성 (최근 7일)
  const generateSparklineData = (trend) => {
    const data = [];
    let baseValue = 50;
    for (let i = 0; i < 7; i++) {
      if (trend === 'up') {
        baseValue += Math.random() * 10 - 2;
      } else if (trend === 'down') {
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
      title: '전체 학생 평균 우울 점수',
      value: '6.2',
      unit: '/ 10',
      change: '-0.3',
      changeType: 'positive',
      changePercent: '-4.6%',
      icon: FaChartLine,
      color: '#FF6B00',
      sparklineData: generateSparklineData('down')
    },
    {
      title: '고위험군 학생 수',
      value: '23',
      unit: '명',
      change: '+2',
      changeType: 'negative',
      changePercent: '+9.5%',
      icon: FaExclamationTriangle,
      color: '#EF4444',
      sparklineData: generateSparklineData('up')
    },
    {
      title: '이번 주 응답률',
      value: '68.5',
      unit: '%',
      change: '+5.2%',
      changeType: 'positive',
      changePercent: '+8.2%',
      icon: FaUsers,
      color: '#10B981',
      sparklineData: generateSparklineData('up')
    },
    {
      title: '상담 신청 건수',
      value: '12',
      unit: '건',
      change: '+3',
      changeType: 'neutral',
      changePercent: '+33.3%',
      icon: FaCalendarCheck,
      color: '#F59E0B',
      sparklineData: generateSparklineData('neutral')
    }
  ];

  return (
    <div className="kpi-grid">
      {kpis.map((kpi, index) => {
        const IconComponent = kpi.icon;
        return (
          <div key={index} className="kpi-card">
            <div className="kpi-header">
              <div className="kpi-info">
                <div className="kpi-title">{kpi.title}</div>
                <div className="kpi-value">
                  <span className="kpi-number" style={{ color: kpi.color }}>
                    {kpi.value}
                  </span>
                  <span className="kpi-unit">{kpi.unit}</span>
                </div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}>
                <IconComponent />
              </div>
            </div>
            
            {/* Sparkline Chart */}
            <div className="kpi-sparkline">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={kpi.sparklineData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={`sparklineGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={kpi.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={kpi.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={kpi.color}
                    strokeWidth={2}
                    fill={`url(#sparklineGradient${index})`}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="kpi-footer">
              <span className={`kpi-change-badge kpi-change-${kpi.changeType}`}>
                {kpi.change}
              </span>
              <span className="kpi-change-label">지난주 대비</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KPICards;

