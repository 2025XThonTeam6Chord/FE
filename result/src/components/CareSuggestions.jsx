import { FaMoon, FaUsers, FaCommentDots } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import './CareSuggestions.css';

function CareSuggestions() {
  const suggestions = [
    {
      icon: FaMoon,
      title: '수면 개선이 필요해요',
      text: '수면 점수가 38점으로 낮게 나타났습니다. 규칙적인 수면 패턴을 만들어보세요.',
    },
    {
      icon: FaUsers,
      title: '사회적 연결 강화',
      text: '사회성 지표 개선을 위해 친구들과의 소통 시간을 늘려보세요.',
    },
    {
      icon: FaCommentDots,
      title: '전문가 상담 권장',
      text: '스트레스 수치가 높게 측정되었습니다. 전문 상담을 통해 도움을 받아보세요.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
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
              맞춤 케어 제안
            </Typography>
          </motion.div>
          
          <Grid container spacing={2}>
            {suggestions.map((suggestion, index) => {
              const IconComponent = suggestion.icon;
              return (
                <Grid item xs={12} key={index}>
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 1,
                        padding: 2,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(255, 107, 0, 0.15)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2,
                        }}
                      >
                        <motion.div
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Box
                            sx={{
                              backgroundColor: 'primary.light',
                              color: 'white',
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
                            <IconComponent />
                          </Box>
                        </motion.div>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              marginBottom: 1,
                              fontSize: '16px',
                            }}
                          >
                            {suggestion.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'text.secondary',
                              lineHeight: 1.7,
                              fontSize: '14px',
                            }}
                          >
                            {suggestion.text}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CareSuggestions;

