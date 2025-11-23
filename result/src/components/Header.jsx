import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import PDFExportButton from './PDFExportButton';
import './Header.css';

function Header() {

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
        <span className="header-logo-text">결과 리포트</span>
      </motion.div>
      <motion.div
        className="header-right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <PDFExportButton />
      </motion.div>
    </motion.header>
  );
}

export default Header;

