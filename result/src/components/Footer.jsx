import { FaChevronDown } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <button className="counseling-button">
        <FaChevronDown className="button-icon" />
        상담센터로 결과 전송 및 예약 (No Call)
      </button>
      <p className="security-note">
        결과는 암호화되어 안전하게 전송됩니다
      </p>
      <div className="footer-branding">
        <span>Designed by Readdy</span>
      </div>
    </footer>
  );
}

export default Footer;

