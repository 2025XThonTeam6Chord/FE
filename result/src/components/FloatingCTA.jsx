import { useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Button, Box } from '@mui/material';
import './FloatingCTA.css';

function FloatingCTA() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        whileHover={{
          scale: 1.05,
          y: -2,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          endIcon={
            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <FaChevronDown />
            </motion.div>
          }
          sx={{
            borderRadius: '50px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 8px 32px rgba(255, 107, 0, 0.3)',
            '&:hover': {
              boxShadow: '0 12px 40px rgba(255, 107, 0, 0.5)',
            },
          }}
          onClick={() => navigate('/counseling')}
        >
          상담 더 알아보기
        </Button>
      </motion.div>

      {/* 펄스 효과 */}
      <motion.div
        className="floating-cta-pulse"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50px',
          backgroundColor: '#FF6B00',
          zIndex: -1,
        }}
      />
    </Box>
  );
}

export default FloatingCTA;

