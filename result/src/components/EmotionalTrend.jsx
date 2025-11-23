import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './EmotionalTrend.css';

function EmotionalTrend({ data: apiData, isLoading }) {
  // API 데이터가 없으면 기본값 사용
  const trendData = apiData || {
    dates: ['1일', '4일', '7일', '10일', '13일', '14일'],
    scores: [47, 52, 58, 63, 67, 70],
    trendMessage: '긍정적인 변화가 감지되었어요. 최근 일주일간 감정 점수가 상승 추세를 보이고 있습니다. 현재의 긍정적인 패턴을 유지하시면 더 나은 심리 상태를 경험하실 수 있어요.',
  };

  // API 응답을 차트 데이터 형식으로 변환
  const data = trendData.dates?.map((date, index) => ({
    day: date,
    score: trendData.scores?.[index] || 0,
  })) || [];

  const trendMessage = trendData.trendMessage || '긍정적인 변화가 감지되었어요. 최근 일주일간 감정 점수가 상승 추세를 보이고 있습니다.';

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const insightVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.4,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      className="trend-card"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={cardVariants}
    >
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        2주간 감정 변화
      </motion.h2>
      <motion.p
        className="trend-intro"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        지난 14일간의 전반적인 감정 상태 추이입니다
      </motion.p>

      <motion.div
        className="trend-chart-container"
        variants={chartVariants}
      >
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="day"
              tick={{ fill: 'var(--color-text-body)', fontSize: 12 }}
              stroke="#999"
            />
            <YAxis
              domain={[40, 75]}
              tick={{ fill: 'var(--color-text-body)', fontSize: 12 }}
              stroke="#999"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-card)',
              }}
            />
            <Line
              type="natural"
              dataKey="score"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', r: 5 }}
              activeDot={{ r: 7, fill: 'var(--color-primary)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="trend-insight"
        variants={insightVariants}
        whileHover={{ scale: 1.02, x: 5 }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        >
          <FaLightbulb className="insight-icon" />
        </motion.div>
        <p className="insight-text">
          {isLoading ? '트렌드 분석 중...' : trendMessage}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default EmotionalTrend;

