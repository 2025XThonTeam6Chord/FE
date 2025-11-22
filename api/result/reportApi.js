/**
 * 리포트 관련 API 호출 함수들
 */

// API 베이스 URL (환경 변수에서 가져오거나 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 디버깅용: 현재 사용 중인 API 베이스 URL 로그
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

/**
 * 요약 리포트 조회
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<{summary: string, dangerRate: number, answerCount: number}>}
 */
export const getSummaryReport = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user-reports/analysis/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': userId || '', // API 스펙에 따라 헤더에 포함
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('요약 리포트 조회 실패:', error);
    
    // 연결 거부 에러를 더 명확하게 처리
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error(`서버에 연결할 수 없습니다. ${API_BASE_URL} 서버가 실행 중인지 확인해주세요.`);
    }
    
    throw error;
  }
};

/**
 * API 에러 핸들링을 위한 기본 설정
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
};

