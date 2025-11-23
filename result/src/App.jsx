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
// API 호출 제거 - Mock 데이터 사용
// import {
//   getSummaryReport,
//   getMentalBalance,
//   getRecommendations,
//   getEmotionTrend,
//   getDetailAnalysis,
// } from '@api/result/reportApi';
import './App.css';

function ResultPage() {
  // 모든 API 데이터 state
  const [summaryData, setSummaryData] = useState(null);
  const [mentalBalanceData, setMentalBalanceData] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState(null);
  const [emotionTrendData, setEmotionTrendData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 ID (임시로 localStorage에서 가져오거나 URL 파라미터에서 가져올 수 있음)
  const getUserId = () => {
    // TODO: 실제 사용자 ID를 가져오는 로직으로 변경
    // 예: localStorage에서 가져오기, URL 파라미터에서 가져오기 등
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('userId') || localStorage.getItem('userId') || '1'; // 기본값 1
  };

  // Mock 데이터 사용 (API 호출 제거)
  useEffect(() => {
    const loadMockData = () => {
      setIsLoading(true);

      // Mock 데이터 설정
      const mockSummary = {
        summary: '오늘의 마음은 구름 낀 해와 같아요. 약간의 스트레스가 있지만, 회복력이 함께하고 있어요.',
        dangerRate: 75,
        answerCount: 12,
      };

      const mockMentalBalance = {
        emotion: 65,
        sociality: 45,
        sleep: 38,
        stress: 72,
        resilience: 55,
      };

      const mockRecommendations = {
        recommendations: [
          {
            title: '수면 개선이 필요해요',
            message: '수면 점수가 38점으로 낮게 나타났습니다. 규칙적인 수면 패턴을 만들어보세요. 매일 같은 시간에 잠자리에 들고 일어나면 수면의 질이 개선됩니다. 취침 전 1시간 전부터 스마트폰 사용을 줄이고, 따뜻한 물로 샤워하거나 가벼운 스트레칭을 하면 더 나은 수면을 취할 수 있습니다.'
          },
          {
            title: '사회적 연결 강화',
            message: '사회성 지표 개선을 위해 친구들과의 소통 시간을 늘려보세요. 혼자 고민하지 말고 주변 사람들과 대화를 나누며 사회적 지지를 받아보세요. 취미 활동이나 동아리에 참여하여 새로운 사람들과 만나는 것도 좋은 방법입니다. 작은 대화라도 꾸준히 이어가면 관계가 깊어질 수 있습니다.'
          },
        ],
      };

      const mockEmotionTrend = {
        dates: ['2024-01-01', '2024-01-08', '2024-01-15', '2024-01-22', '2024-01-29'],
        scores: [65, 68, 72, 70, 75],
        trendMessage: '최근 감정 상태가 점진적으로 개선되고 있습니다.',
      };

      const mockDetail = {
        lowestMessage: '수면 영역이 38점으로 가장 낮게 측정되었습니다. 이 부분에 대한 관심이 필요합니다.',
        highestMessage: '스트레스 영역이 72점으로 가장 높게 나타났습니다. 이 강점을 활용해보세요.',
        overallMessage: '전반적으로 약간의 불균형이 감지되었습니다. 수면과 사회성 영역의 개선이 전체적인 심리 균형에 도움이 될 수 있습니다.',
      };

      // 약간의 지연을 주어 로딩 효과 시뮬레이션
      setTimeout(() => {
        setSummaryData(mockSummary);
        setMentalBalanceData(mockMentalBalance);
        setRecommendationsData(mockRecommendations);
        setEmotionTrendData(mockEmotionTrend);
        setDetailData(mockDetail);
        setIsLoading(false);
      }, 500);
    };

    loadMockData();
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
          <PsychologicalBalance data={mentalBalanceData} isLoading={isLoading} />
        </div>
        <div className="content-right">
          <DetailedAnalysis data={detailData} isLoading={isLoading} />
          <CareSuggestions data={recommendationsData} isLoading={isLoading} />
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
        <EmotionalTrend data={emotionTrendData} isLoading={isLoading} />
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
