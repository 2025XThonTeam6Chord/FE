import { useEffect, useRef } from "react";
import PerfectScrollbar from "perfect-scrollbar";

import logo from "../../logo.svg";

let ps;

function Sidebar({ bgColor = "black", activeColor = "info" }) {
  const sidebar = useRef(null);

  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1 && sidebar.current) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return () => {
      if (navigator.platform.indexOf("Win") > -1 && ps) {
        ps.destroy();
      }
    };
  }, []);

  return (
    <div
      className="sidebar"
      data-color={bgColor}
      data-active-color={activeColor}
    >
      <div className="logo">
        <a href="/" className="simple-text logo-mini">
          <div className="logo-img">
            <img src={logo} alt="react-logo" />
          </div>
        </a>
        <a href="/" className="simple-text logo-normal">
          다독 관리자
        </a>
      </div>
      <div className="sidebar-wrapper" ref={sidebar}>
        <nav>
          <ul>
            <li className="active">
              <a href="#dashboard" className="nav-link">
                <i className="nc-icon nc-chart-pie-35" />
                <p>대시보드</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
