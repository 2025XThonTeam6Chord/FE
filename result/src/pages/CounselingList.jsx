import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Chip,
    IconButton
} from '@mui/material';
import { FaArrowLeft, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import './CounselingList.css';

function CounselingList() {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);

    const counselingCenters = [
        {
            id: 1,
            name: '동국대학교 상담센터',
            type: 'university',
            location: '서울 중구 필동로1길 30',
            phone: '02-2260-3000',
            hours: '평일 09:00 - 18:00',
            description: '동국대학교 학생들을 위한 전문 상담 서비스',
            distance: '0.1km',
            isOurSchool: true,
        },
        {
            id: 2,
            name: '서울시립대학교 학생상담센터',
            type: 'university',
            location: '서울 동대문구 서울시립대로 163',
            phone: '02-6490-2114',
            hours: '평일 09:00 - 17:00',
            description: '서울시립대학교 학생 상담 서비스',
            distance: '2.3km',
            isOurSchool: false,
        },
        {
            id: 3,
            name: '건국대학교 학생상담센터',
            type: 'university',
            location: '서울 광진구 능동로 120',
            phone: '02-450-3050',
            hours: '평일 09:00 - 17:00',
            description: '건국대학교 학생 상담 서비스',
            distance: '5.1km',
            isOurSchool: false,
        },
        {
            id: 4,
            name: '서울심리상담센터',
            type: 'private',
            location: '서울 강남구 테헤란로 123',
            phone: '02-1234-5678',
            hours: '평일 10:00 - 20:00',
            description: '전문 심리 상담 서비스',
            distance: '8.5km',
            isOurSchool: false,
        },
    ];

    const handleSendResults = (centerId) => {
        alert('분석 결과가 상담센터로 전송되었습니다!');
    };

    const handleReserve = (centerId) => {
        alert('상담 예약 페이지로 이동합니다.');
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
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

    // 우리 학교를 첫 번째로 정렬
    const sortedCenters = [...counselingCenters].sort((a, b) => {
        if (a.isOurSchool) return -1;
        if (b.isOurSchool) return 1;
        return 0;
    });

    return (
        <motion.div
            className="counseling-list-page"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Box
                sx={{
                    maxWidth: '1000px',
                    margin: '0 auto',
                    padding: '24px',
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                }}
            >
                {/* Header */}
                <motion.div variants={itemVariants}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            marginBottom: 4,
                        }}
                    >
                        <IconButton
                            onClick={() => navigate(-1)}
                            sx={{
                                backgroundColor: 'rgba(255, 107, 0, 0.1)',
                                color: 'primary.main',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 107, 0, 0.2)',
                                },
                            }}
                        >
                            <FaArrowLeft />
                        </IconButton>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: 'text.primary',
                            }}
                        >
                            상담 더 알아보기
                        </Typography>
                    </Box>
                </motion.div>

                {/* Counseling Centers List */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {sortedCenters.map((center, index) => (
                        <motion.div
                            key={center.id}
                            variants={itemVariants}
                            custom={index}
                        >
                            <Card
                                onClick={() => setSelectedCard(selectedCard === center.id ? null : center.id)}
                                sx={{
                                    borderRadius: 1,
                                    boxShadow: selectedCard === center.id
                                        ? '0 8px 32px rgba(255, 107, 0, 0.2)'
                                        : '0 4px 20px rgba(0, 0, 0, 0.05)',
                                    padding: center.isOurSchool ? 4 : 3,
                                    border: center.isOurSchool ? '2px solid' : '1px solid',
                                    borderColor: selectedCard === center.id
                                        ? 'primary.main'
                                        : (center.isOurSchool ? 'primary.main' : 'divider'),
                                    transform: selectedCard === center.id
                                        ? 'scale(1.01)'
                                        : (center.isOurSchool ? 'scale(1.01)' : 'scale(1)'),
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    backgroundColor: selectedCard === center.id
                                        ? 'rgba(255, 107, 0, 0.02)'
                                        : 'background.paper',
                                    cursor: 'pointer',
                                    marginBottom: selectedCard === center.id ? 0 : 0,
                                }}
                            >
                                <CardContent sx={{ padding: '0 !important' }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            gap: 3,
                                        }}
                                    >
                                        {/* Left: Info */}
                                        <Box sx={{ flex: 1 }}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    marginBottom: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant={center.isOurSchool ? 'h5' : 'h6'}
                                                    sx={{
                                                        fontWeight: 700,
                                                        color: 'text.primary',
                                                    }}
                                                >
                                                    {center.name}
                                                </Typography>
                                                {center.isOurSchool && (
                                                    <Chip
                                                        label="우리 학교"
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'primary.main',
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            fontSize: '12px',
                                                        }}
                                                    />
                                                )}
                                            </Box>

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    marginBottom: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        color: 'text.secondary',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    <FaMapMarkerAlt size={14} />
                                                    <span>{center.location}</span>
                                                    {!center.isOurSchool && (
                                                        <Chip
                                                            label={center.distance}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: 'grey.100',
                                                                fontSize: '11px',
                                                                height: '20px',
                                                            }}
                                                        />
                                                    )}
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        color: 'text.secondary',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    <FaPhone size={14} />
                                                    <span>{center.phone}</span>
                                                </Box>

                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        color: 'text.secondary',
                                                        fontSize: '14px',
                                                    }}
                                                >
                                                    <FaClock size={14} />
                                                    <span>{center.hours}</span>
                                                </Box>
                                            </Box>

                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: 'text.secondary',
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {center.description}
                                            </Typography>
                                        </Box>

                                    </Box>
                                </CardContent>
                            </Card>

                            {/* 지도 및 버튼 슬라이드 영역 */}
                            {selectedCard === center.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <Card
                                        sx={{
                                            borderRadius: 1,
                                            marginTop: 2,
                                            padding: 3,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                gap: 3,
                                            }}
                                        >
                                            {/* 지도 */}
                                            <Box
                                                sx={{
                                                    flex: 1,
                                                    minHeight: '300px',
                                                    borderRadius: 1,
                                                    overflow: 'hidden',
                                                    backgroundColor: 'grey.100',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                <iframe
                                                    width="100%"
                                                    height="300"
                                                    style={{
                                                        border: 0,
                                                    }}
                                                    loading="lazy"
                                                    allowFullScreen
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(center.location)}`}
                                                />
                                                {/* API 키가 필요할 경우: src에 &key=YOUR_API_KEY 추가 */}
                                            </Box>

                                            {/* 버튼 영역 */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 2,
                                                    minWidth: { xs: '100%', md: '200px' },
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    startIcon={<FaCheckCircle />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSendResults(center.id);
                                                    }}
                                                    sx={{
                                                        borderRadius: 1,
                                                        padding: '12px',
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        fontSize: '15px',
                                                    }}
                                                >
                                                    결과 즉시 전송
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleReserve(center.id);
                                                    }}
                                                    sx={{
                                                        borderRadius: 1,
                                                        padding: '12px',
                                                        fontWeight: 600,
                                                        textTransform: 'none',
                                                        fontSize: '15px',
                                                        borderWidth: 2,
                                                        '&:hover': {
                                                            borderWidth: 2,
                                                        },
                                                    }}
                                                >
                                                    예약하기
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </Box>
            </Box>
        </motion.div>
    );
}

export default CounselingList;

