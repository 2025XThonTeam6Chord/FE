import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import Sidebar from "./components/Sidebar/Sidebar";
import DemoNavbar from "./components/Navbars/DemoNavbar";
import Footer from "./components/Footer/Footer";
import KPICards from "./components/KPICards";
import MainTimeSeriesChart from "./components/MainTimeSeriesChart";
import ComparisonChart from "./components/ComparisonChart";
import AIInsightWidget from "./components/AIInsightWidget";
import RiskStudentList from "./components/RiskStudentList";
import "./App.css";

function App() {
  const [backgroundColor] = useState("black");
  const [activeColor] = useState("info");
  const mainPanel = useRef(null);

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1 && mainPanel.current) {
      try {
        const ps = new PerfectScrollbar(mainPanel.current);
        document.body.classList.toggle("perfect-scrollbar-on");
        return () => {
          try {
            ps.destroy();
          } catch (e) {
            console.error(e);
          }
          document.body.classList.toggle("perfect-scrollbar-on");
        };
      } catch (error) {
        console.error("PerfectScrollbar error:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (mainPanel.current) {
      mainPanel.current.scrollTop = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    }
  });

  return (
    <div className="wrapper">
      <Sidebar bgColor={backgroundColor} activeColor={activeColor} />
      <div className="main-panel" ref={mainPanel}>
        <DemoNavbar />
        <div className="content">
          <KPICards />
          <div className="time-series-section">
            <MainTimeSeriesChart />
          </div>
          <div className="bottom-grid">
            <ComparisonChart />
            <AIInsightWidget />
          </div>
          <RiskStudentList />
        </div>
        <Footer fluid />
      </div>
    </div>
  );
}

export default App;
