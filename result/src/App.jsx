import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ReportSummary from './components/ReportSummary';
import DetailedAnalysis from './components/DetailedAnalysis';
import PsychologicalBalance from './components/PsychologicalBalance';
import CareSuggestions from './components/CareSuggestions';
import EmotionalTrend from './components/EmotionalTrend';
import FloatingCTA from './components/FloatingCTA';
import CounselingList from './pages/CounselingList';
import { getSummaryReport } from '@api/result/reportApi';
import './App.css';

function ResultPage() {
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 ID (임시로 localStorage에서 가져오거나 URL 파라미터에서 가져올 수 있음)
  const getUserId = () => {
    // TODO: 실제 사용자 ID를 가져오는 로직으로 변경
    // 예: localStorage에서 가져오기, URL 파라미터에서 가져오기 등
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || localStorage.getItem('userId') || '1'; // 기본값 1
  };

  // 요약 리포트 데이터 가져오기
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = getUserId();
        const data = await getSummaryReport(userId);
        setSummaryData(data);
      } catch (err) {
        console.error('요약 리포트 조회 실패:', err);
        setError(err.message);
        
        // 연결 실패 시 기본값 설정 (개발/테스트용)
        // 실제 운영 환경에서는 사용자에게 에러 메시지를 표시하는 것이 좋습니다
        const isConnectionError = err.message.includes('서버에 연결할 수 없습니다') || 
                                  err.message.includes('ERR_CONNECTION_REFUSED');
        
        if (isConnectionError) {
          // 서버 연결 실패 시 개발용 목 데이터 사용 (선택사항)
          // 실제 백엔드 서버가 연결되면 이 부분은 삭제하거나 주석 처리
          console.warn('⚠️ 백엔드 서버에 연결할 수 없습니다. 개발용 목 데이터를 사용합니다.');
          setSummaryData({
            summary: '오늘의 마음은 구름 낀 해와 같아요. 약간의 스트레스가 있지만, 회복력이 함께하고 있어요. 작은 휴식이 큰 도움이 될 수 있습니다.',
            dangerRate: 75,
            answerCount: 12,
          });
        } else {
          // 기타 에러
          setSummaryData({
            summary: '분석 결과를 불러올 수 없습니다.',
            dangerRate: 0,
            answerCount: 0,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const sectionVariants = {
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

  return (
    <motion.div
      className="app"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={sectionVariants}>
        <Header />
      </motion.div>

      {/* Main Grid - 왼쪽: 마음날씨 + 심리 균형 분석, 오른쪽: 상세분석 + 맞춤케어 제안 */}
      <motion.section
        className="main-grid"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="content-left">
          <ReportSummary summaryData={summaryData} isLoading={isLoading} />
          <PsychologicalBalance />
        </div>
        <div className="content-right">
          <DetailedAnalysis />
          <CareSuggestions />
        </div>
      </motion.section>

      {/* Section 3: Bottom Trend */}
      <motion.section
        className="bottom-trend-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <EmotionalTrend />
      </motion.section>

      {/* Floating CTA Button */}
      <FloatingCTA />
    </motion.div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ResultPage />} />
      <Route path="/counseling" element={<CounselingList />} />
    </Routes>
  );
}

export default App;
