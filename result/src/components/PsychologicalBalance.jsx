import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import './PsychologicalBalance.css';

function PsychologicalBalance() {
  const data = [
    { subject: '정서', value: 65, fullMark: 100, color: '#ffa726' },
    { subject: '사회성', value: 45, fullMark: 100, color: '#ff69b4' },
    { subject: '수면', value: 38, fullMark: 100, color: '#ff0000' },
    { subject: '스트레스', value: 72, fullMark: 100, color: '#ff8c00' },
    { subject: '회복력', value: 55, fullMark: 100, color: '#ffcc99' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const indicatorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1],
      },
    }),
  };

  return (
    <div className="psychological-balance">
      {/* RadarChartCard */}
      <motion.div
        className="radar-chart-card"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="balance-header">
          <h2 className="section-title">심리 균형 분석</h2>
          <p className="balance-intro">
            5가지 핵심 지표를 통해 현재 심리 상태의 균형을 확인하세요
          </p>
        </div>

        <div className="radar-chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'var(--color-text-body)', fontSize: 13, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'var(--color-text-caption)', fontSize: 11 }}
                axisLine={false}
              />
              <Radar
                name="점수"
                dataKey="value"
                stroke="var(--color-primary)"
                fill="url(#radarGradient)"
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ScoreCardsRow */}
      <div className="score-cards-row">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="indicator-item"
            variants={indicatorVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={index}
            whileHover={{ scale: 1.1, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="indicator-value">
              <AnimatedCounter value={item.value} />
            </span>
            <div className="indicator-header">
              <span className="indicator-name">{item.subject}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PsychologicalBalance;

