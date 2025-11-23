/**
 * 리포트 관련 API 호출 함수들
 */

// API 베이스 URL (환경 변수에서 가져오거나 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app';

// 디버깅용: 현재 사용 중인 API URL 로그
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

/**
 * API 호출 공통 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<any>}
 */
const apiCall = async (endpoint, userId) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  const finalUserId = userId || '1';
  
  console.log(`🔗 API 호출: ${endpoint}`);
  console.log(`📡 전체 URL: ${fullUrl}`);
  console.log(`👤 사용자 ID: ${finalUserId}`);
  
  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': finalUserId,
      },
    });

    console.log(`📡 응답 상태: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let errorText = '';
      let errorData = null;
      
      try {
        errorText = await response.text();
        console.error(`❌ API 에러 응답 (raw):`, errorText);
        
        // JSON 파싱 시도
        try {
          errorData = JSON.parse(errorText);
          console.error(`❌ API 에러 응답 (JSON):`, errorData);
        } catch (e) {
          // JSON이 아니면 그대로 사용
        }
      } catch (e) {
        console.error(`❌ 에러 응답 읽기 실패:`, e);
      }
      
      // 500 에러 상세 정보
      if (response.status === 500) {
        console.error(`🔍 500 서버 내부 오류 상세:`);
        console.error(`  - Endpoint: ${endpoint}`);
        console.error(`  - URL: ${fullUrl}`);
        console.error(`  - User ID: ${finalUserId}`);
        if (errorData) {
          console.error(`  - Error: ${errorData.error || 'Unknown'}`);
          console.error(`  - Message: ${errorData.message || 'None'}`);
          console.error(`  - Path: ${errorData.path || 'None'}`);
        }
      }
      
      const errorMessage = errorData?.message || errorData?.error || `API 요청 실패: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`✅ API 호출 성공: ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`❌ API 호출 실패 (${endpoint}):`, error);
    console.error(`❌ 에러 타입:`, error.constructor.name);
    console.error(`❌ 에러 메시지:`, error.message);
    
    // 연결 거부 에러를 더 명확하게 처리
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      console.error(`🔍 연결 거부 에러 - API Base URL 확인: ${API_BASE_URL}`);
      throw new Error(`서버에 연결할 수 없습니다. API 서버가 실행 중인지 확인해주세요. (URL: ${API_BASE_URL})`);
    }
    
    throw error;
  }
};

/**
 * 요약 리포트 조회
 * GET /user-reports/analysis/summary
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<{summary: string, dangerRate: number, answerCount: number}>}
 */
export const getSummaryReport = async (userId) => {
  return await apiCall('/user-reports/analysis/summary', userId);
};

/**
 * 심리 균형 분석 조회
 * GET /user-reports/analysis/mental-balance
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<{emotion: number, sociality: number, sleep: number, stress: number, resilience: number}>}
 */
export const getMentalBalance = async (userId) => {
  return await apiCall('/user-reports/analysis/mental-balance', userId);
};

/**
 * 맞춤 케어 추천 조회
 * GET /user-reports/analysis/recommendations
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<{recommendations: Array<{title: string, message: string}>}>}
 */
export const getRecommendations = async (userId) => {
  return await apiCall('/user-reports/analysis/recommendations', userId);
};

/**
 * 2주간 감정 변화 조회
 * GET /user-reports/analysis/emotion-trend
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<{dates: string[], scores: number[], trendMessage: string}>}
 */
export const getEmotionTrend = async (userId) => {
  return await apiCall('/user-reports/analysis/emotion-trend', userId);
};

/**
 * 상세 분석 조회
 * GET /user-reports/analysis/detail
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<{lowestMessage: string, highestMessage: string, overallMessage: string}>}
 */
export const getDetailAnalysis = async (userId) => {
  return await apiCall('/user-reports/analysis/detail', userId);
};

/**
 * API 에러 핸들링을 위한 기본 설정
 */
export const apiConfig = {
  baseURL: API_BASE_URL,
};
