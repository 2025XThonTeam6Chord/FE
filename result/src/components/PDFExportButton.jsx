import { FaFilePdf } from 'react-icons/fa';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';
import './PDFExportButton.css';

function PDFExportButton() {
  const handleExportPDF = () => {
    // 브라우저의 기본 인쇄 기능 사용
    // 사용자가 인쇄 대화상자에서 "PDF로 저장" 선택 가능
    window.print();
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="contained"
        color="primary"
        startIcon={<FaFilePdf />}
        onClick={handleExportPDF}
        sx={{
          borderRadius: '12px',
          padding: '10px 20px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(255, 107, 0, 0.3)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 107, 0, 0.4)',
          },
        }}
      >
        PDF 저장
      </Button>
    </motion.div>
  );
}

export default PDFExportButton;

