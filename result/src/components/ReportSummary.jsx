import { FaCloudSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import GaugeChart from 'react-gauge-chart';
import AnimatedCounter from './AnimatedCounter';
import './ReportSummary.css';

function ReportSummary({ summaryData, isLoading }) {
  // 위험도에 따른 상태 및 색상 결정
  const getDangerStatus = (dangerRate) => {
    if (dangerRate <= 40) {
      return { label: '안정', color: '#10B981', bgColor: '#D1FAE5' }; // 초록색
    } else if (dangerRate <= 70) {
      return { label: '주의', color: '#F59E0B', bgColor: '#FEF3C7' }; // 노란색
    } else {
      return { label: '고위험', color: '#EF4444', bgColor: '#FEE2E2' }; // 빨간색
    }
  };

  const dangerRate = summaryData?.dangerRate || 0;
  const dangerStatus = getDangerStatus(dangerRate);
  const answerCount = summaryData?.answerCount || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };


  return (
    <motion.div
      className="report-summary"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="report-header" variants={itemVariants}>
        <div className="report-title-section">
          <motion.span
            className="report-date"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            2024년 1월 15일 분석 결과
          </motion.span>
          <div className="report-title">
            <motion.div
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <FaCloudSun className="title-icon" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              윤찬영님의 마음 날씨
            </motion.h1>
          </div>
        </div>
      </motion.div>

      <motion.div className="mood-description" variants={itemVariants}>
        <p>
          {isLoading
            ? '분석 중...'
            : summaryData?.summary || '오늘의 마음은 구름 낀 해와 같아요. 약간의 스트레스가 있지만, 회복력이 함께하고 있어요. 작은 휴식이 큰 도움이 될 수 있습니다.'
          }
        </p>
      </motion.div>

      {/* 카드 그리드: 각 카드가 독립적으로 분리 */}
      <div className="summary-cards-grid">
        {/* 위험도 계기판 카드 */}
        <div className="danger-gauge-card">
          {/* 왼쪽: 계기판 */}
          <div className="gauge-section">
            <div className="gauge-container">
              <GaugeChart
                id="danger-gauge"
                nrOfLevels={3}
                arcsLength={[0.4, 0.3, 0.3]}
                colors={['#10B981', '#F59E0B', '#EF4444']}
                percent={dangerRate / 100}
                arcPadding={0.02}
                cornerRadius={3}
                textColor="#111111"
                needleColor="#555555"
                needleBaseColor="#888888"
                formatTextValue={() => ''}
                hideText={true}
                animate={true}
                animDelay={0}
                animateDuration={2000}
                marginInPercent={0.03}
              />
            </div>
          </div>

          {/* 오른쪽: 점수와 라벨 */}
          <div className="gauge-value-section">
            <div
              className="gauge-value"
              style={{ color: dangerStatus.color }}
            >
              <AnimatedCounter value={dangerRate} />
            </div>
            <div className="score-label">위험도</div>
          </div>
        </div>

        {/* 응답 문항수 카드 */}
        <div className="score-item">
          <div className="score-value">
            <AnimatedCounter value={answerCount} />
          </div>
          <div className="score-label">응답 문항수</div>
        </div>
      </div>
    </motion.div>
  );
}

export default ReportSummary;

