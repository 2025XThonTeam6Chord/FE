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
import './App.css';

function ResultPage() {

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
          <ReportSummary />
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
