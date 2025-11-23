import { FaMoon, FaUsers, FaCommentDots } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import './CareSuggestions.css';

function CareSuggestions({ data: apiData, isLoading }) {
  // API 데이터에서 recommendations 배열 가져오기
  const recommendations = apiData?.recommendations || [];

  // 아이콘 매핑 (제목 기반)
  const getIcon = (title) => {
    if (title?.includes('수면')) return FaMoon;
    if (title?.includes('사회')) return FaUsers;
    return FaCommentDots;
  };

  // API 응답을 컴포넌트 형식으로 변환
  const suggestions = recommendations.length > 0
    ? recommendations.map((rec, index) => ({
      icon: getIcon(rec.title),
      title: rec.title,
      text: rec.message,
      key: index,
    }))
    : [
      // 기본값 (API 데이터가 없을 때)
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
          padding: '24px 24px 16px 24px',
        }}
      >
        <CardContent sx={{ padding: '0 !important', paddingBottom: '0 !important', marginBottom: 0, '&:last-child': { paddingBottom: '0 !important', marginBottom: 0 } }}>
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
                marginBottom: 2,
                color: 'text.primary',
              }}
            >
              맞춤 케어 제안
            </Typography>
          </motion.div>

          <Grid
            container
            spacing={1.5}
            sx={{
              '& > .MuiGrid-item': {
                paddingBottom: '12px'
              },
              '& > .MuiGrid-item:last-child': {
                paddingBottom: 0
              }
            }}
          >
            {isLoading && suggestions.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                  추천 로딩 중...
                </Typography>
              </Grid>
            ) : suggestions.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                  추천 항목이 없습니다.
                </Typography>
              </Grid>
            ) : (
              suggestions.map((suggestion, index) => {
                const IconComponent = suggestion.icon;
                const isLast = index === suggestions.length - 1;
                return (
                  <Grid
                    item
                    xs={12}
                    key={suggestion.key || index}
                    sx={{
                      marginBottom: '0 !important',
                      paddingBottom: isLast ? '0 !important' : '12px'
                    }}
                  >
                    <motion.div
                      variants={cardVariants}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      style={{ marginBottom: isLast ? 0 : 0 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 1,
                          padding: 2,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'all 0.3s ease',
                          marginBottom: 0,
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
              })
            )}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CareSuggestions;

