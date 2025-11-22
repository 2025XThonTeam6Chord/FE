import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';

// 주소별 좌표 (미리 정의된 주요 위치들)
const locationCoordinates = {
    '서울 중구 필동로1길 30': { lat: 37.5580, lng: 126.9978 }, // 동국대학교
    '서울 동대문구 서울시립대로 163': { lat: 37.5826, lng: 127.0530 }, // 서울시립대학교
    '서울 광진구 능동로 120': { lat: 37.5406, lng: 127.0694 }, // 건국대학교
    '서울 강남구 테헤란로 123': { lat: 37.5013, lng: 127.0397 }, // 강남구
};

const KAKAO_MAP_APP_KEY = import.meta.env.VITE_KAKAO_MAP_APP_KEY;

function KakaoMap({ location }) {
    const mapRef = useRef(null);
    const kakaoMapRef = useRef(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [error, setError] = useState(null);

    // 카카오 맵 스크립트 로드 확인 (index.html에서 이미 로드됨)
    useEffect(() => {
        // 스크립트가 로드될 때까지 대기
        const checkKakaoMap = setInterval(() => {
            if (window.kakao && window.kakao.maps) {
                clearInterval(checkKakaoMap);
                setScriptLoaded(true);
            }
        }, 100);

        // 최대 5초 대기
        const timeout = setTimeout(() => {
            clearInterval(checkKakaoMap);
            if (!window.kakao || !window.kakao.maps) {
                setError('카카오 맵 API 로드 실패. 스크립트를 확인해주세요.');
            }
        }, 5000);

        return () => {
            clearInterval(checkKakaoMap);
            clearTimeout(timeout);
        };
    }, []);

    // 지도 초기화
    useEffect(() => {
        if (!scriptLoaded || !window.kakao || !window.kakao.maps || !mapRef.current) {
            return;
        }

        // 카카오 맵 API가 완전히 로드되었는지 확인
        if (!window.kakao.maps.LatLng || !window.kakao.maps.Map) {
            const checkAPI = setInterval(() => {
                if (window.kakao && window.kakao.maps && window.kakao.maps.LatLng && window.kakao.maps.Map && mapRef.current) {
                    clearInterval(checkAPI);
                    initMap();
                }
            }, 100);

            return () => clearInterval(checkAPI);
        }

        initMap();

        function initMap() {
            if (!window.kakao || !window.kakao.maps || !window.kakao.maps.LatLng || !window.kakao.maps.Map || !mapRef.current) {
                return;
            }

            try {
                // 주소에 해당하는 좌표 찾기
                const coords = locationCoordinates[location] || { lat: 37.5665, lng: 126.9780 };

                // 기존 지도가 있으면 제거
                if (kakaoMapRef.current) {
                    kakaoMapRef.current = null;
                }

                // 지도 옵션 설정
                const mapOption = {
                    center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
                    level: 3, // 줌 레벨 (1-14)
                };

                // 지도 생성
                const map = new window.kakao.maps.Map(mapRef.current, mapOption);
                kakaoMapRef.current = map;

                // 마커 추가
                const markerPosition = new window.kakao.maps.LatLng(coords.lat, coords.lng);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);

                // 인포윈도우 추가
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;font-size:12px;text-align:center;">${location}</div>`,
                });
                infowindow.open(map, marker);

                setError(null);
            } catch (error) {
                console.error('Map initialization error:', error);
                setError('지도 초기화 실패: ' + error.message);
            }
        }

        return () => {
            if (kakaoMapRef.current) {
                kakaoMapRef.current = null;
            }
        };
    }, [scriptLoaded, location]);

    if (error) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '300px',
                    borderRadius: 1,
                    overflow: 'hidden',
                    backgroundColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {location}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            ref={mapRef}
            sx={{
                width: '100%',
                height: '300px',
                borderRadius: 1,
                overflow: 'hidden',
                backgroundColor: 'grey.100',
            }}
        />
    );
}

export default KakaoMap;

