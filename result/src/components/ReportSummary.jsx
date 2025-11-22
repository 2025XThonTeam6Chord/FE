import { useState, useEffect } from 'react';
import { FaCloudSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import './ReportSummary.css';

function ReportSummary({ summaryData, isLoading }) {

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

  const scoreVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1],
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
              김다독님의 마음 날씨
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

      <motion.div className="summary-scores" variants={containerVariants}>
        <motion.div className="score-item" variants={scoreVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="score-value">
            <AnimatedCounter value={55} />
          </div>
          <div className="score-label">종합 점수</div>
        </motion.div>
        <motion.div className="score-item positive" variants={scoreVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="score-value">+<AnimatedCounter value={8} /></div>
          <div className="score-label">지난주 대비</div>
        </motion.div>
        <motion.div className="score-item" variants={scoreVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="score-value">
            <AnimatedCounter value={summaryData?.answerCount || 0} />
          </div>
          <div className="score-label">답변 수</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ReportSummary;

