import { FaMinus, FaPlus, FaBalanceScale } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box } from '@mui/material';
import './DetailedAnalysis.css';

function DetailedAnalysis({ data: apiData, isLoading }) {
  // API 데이터가 없으면 기본값 사용
  const detailMessages = apiData || {
    lowestMessage: '수면 영역이 38점으로 가장 낮게 측정되었습니다. 이 부분에 대한 관심이 필요합니다.',
    highestMessage: '스트레스 영역이 72점으로 가장 높게 나타났습니다. 이 강점을 활용해보세요.',
    overallMessage: '전반적으로 약간의 불균형이 감지되었습니다. 수면과 사회성 영역의 개선이 전체적인 심리 균형에 도움이 될 수 있습니다.',
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <Card
        sx={{
          borderRadius: 1,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          padding: 3,
          height: '100%',
        }}
      >
        <CardContent sx={{ padding: '0 !important' }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                marginBottom: 3,
                color: 'text.primary',
              }}
            >
              상세 분석
            </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: 2,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    <FaMinus />
                  </Box>
                </motion.div>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      marginBottom: 0.5,
                      fontSize: '15px',
                    }}
                  >
                    가장 낮은 지표
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: '14px',
                    }}
                  >
                    {isLoading ? '분석 중...' : detailMessages.lowestMessage}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: 2,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#D1FAE5',
                      color: '#10B981',
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    <FaPlus />
                  </Box>
                </motion.div>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      marginBottom: 0.5,
                      fontSize: '15px',
                    }}
                  >
                    가장 높은 지표
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: '14px',
                    }}
                  >
                    {isLoading ? '분석 중...' : detailMessages.highestMessage}
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  padding: 2,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(107, 114, 128, 0.05)',
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                <motion.div
                  variants={iconVariants}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Box
                    sx={{
                      backgroundColor: '#F3F4F6',
                      color: '#6B7280',
                      width: 56,
                      height: 56,
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    <FaBalanceScale />
                  </Box>
                </motion.div>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      marginBottom: 0.5,
                      fontSize: '15px',
                    }}
                  >
                    균형 분석
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: '14px',
                    }}
                  >
                    {isLoading ? '분석 중...' : detailMessages.overallMessage}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default DetailedAnalysis;

