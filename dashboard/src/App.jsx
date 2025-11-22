import KPICards from './components/KPICards';
import MainTimeSeriesChart from './components/MainTimeSeriesChart';
import ComparisonChart from './components/ComparisonChart';
import AIInsightWidget from './components/AIInsightWidget';
import RiskStudentList from './components/RiskStudentList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="dashboard-header">
        <h1 className="dashboard-title">다독 관리자 대시보드</h1>
        <p className="dashboard-subtitle">학생 심리 건강 모니터링 및 분석</p>
      </header>

      {/* KPI Cards */}
      <KPICards />

      {/* Main Content Grid */}
      <div className="main-grid">
        <MainTimeSeriesChart />
        <div className="right-column">
          <ComparisonChart />
          <AIInsightWidget />
        </div>
      </div>

      {/* Risk Student List */}
      <RiskStudentList />
    </div>
  );
}

export default App;
