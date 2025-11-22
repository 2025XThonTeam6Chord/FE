import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from 'recharts';
import './ComparisonChart.css';

function ComparisonChart() {
  const data = [
    { college: '공과대학', stress: 7.2, students: 1200 },
    { college: '인문대학', stress: 6.8, students: 850 },
    { college: '경영대학', stress: 6.5, students: 680 },
    { college: '의과대학', stress: 7.8, students: 420 },
    { college: '예술대학', stress: 5.9, students: 350 },
    { college: '사범대학', stress: 6.3, students: 520 }
  ];

  // 전체 평균 계산
  const averageStress = data.reduce((sum, item) => sum + item.stress, 0) / data.length;

  // 스트레스 수준에 따라 색상 결정
  const getColor = (value) => {
    if (value >= 7.5) return '#EF4444';
    if (value >= 7.0) return '#F59E0B';
    if (value >= 6.5) return '#FF6B00';
    return '#10B981';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-label">{data.college}</div>
          <div className="tooltip-item">
            <span>스트레스 수준:</span>
            <span style={{ fontWeight: 600, color: getColor(data.stress) }}>
              {data.stress}
            </span>
          </div>
          <div className="tooltip-item">
            <span>학생 수:</span>
            <span style={{ fontWeight: 600 }}>{data.students.toLocaleString()}명</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card comparison-card">
      <div className="card-header">
        <div className="card-title">단과대별 스트레스 수준</div>
        <div className="card-subtitle">2024년 1학기 기준</div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
            <XAxis
              type="number"
              domain={[0, 10]}
              stroke="#888888"
              tick={{ fill: '#555555', fontSize: 12 }}
            />
            <YAxis
              dataKey="college"
              type="category"
              stroke="#888888"
              tick={{ fill: '#555555', fontSize: 12 }}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* 전체 평균 기준선 */}
            <ReferenceLine
              x={averageStress}
              stroke="#666666"
              strokeDasharray="3 3"
              strokeWidth={2}
              label={{
                value: `전체 평균 ${averageStress.toFixed(1)}`,
                position: "top",
                style: { fill: '#666666', fontSize: 11, fontWeight: 600 }
              }}
            />
            
            <Bar dataKey="stress" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.stress)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="comparison-legend">
        <div className="legend-item">
          <span className="legend-box" style={{ backgroundColor: '#EF4444' }}></span>
          <span>매우 높음 (7.5+)</span>
        </div>
        <div className="legend-item">
          <span className="legend-box" style={{ backgroundColor: '#F59E0B' }}></span>
          <span>높음 (7.0-7.5)</span>
        </div>
        <div className="legend-item">
          <span className="legend-box" style={{ backgroundColor: '#FF6B00' }}></span>
          <span>주의 (6.5-7.0)</span>
        </div>
        <div className="legend-item">
          <span className="legend-box" style={{ backgroundColor: '#10B981' }}></span>
          <span>양호 (6.5 이하)</span>
        </div>
      </div>
    </div>
  );
}

export default ComparisonChart;

