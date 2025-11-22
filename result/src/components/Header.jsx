import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PDFExportButton from './PDFExportButton';
import './Header.css';

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <motion.header
      className="header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="header-left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        >
          <FaHeart className="header-logo-icon" />
        </motion.div>
        <span className="header-logo-text">다독</span>
      </motion.div>
      <motion.div
        className="header-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <PDFExportButton />
        <div className="header-time">{formatTime(currentTime)}</div>
      </motion.div>
    </motion.header>
  );
}

export default Header;

