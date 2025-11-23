/**
 * 익스텐션 질문 관련 API 호출 함수들
 */

// API 베이스 URL (환경 변수에서 가져오거나 기본값 사용)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app';

/**
 * 질문 조회
 * GET /questions
 * @param {string} userId - 사용자 ID (헤더에 포함)
 * @returns {Promise<Array<{
 *   content: string,
 *   responseType: 'RATING_5' | 'YES_NO' | 'SHORT_TEXT',
 *   questionId: number,
 *   question1?: string,
 *   question2?: string,
 *   question3?: string,
 *   question4?: string,
 *   question5?: string
 * }>>}
 */
export const getQuestions = async (userId) => {
    // 임시: userId가 없으면 기본값 1 사용
    const finalUserId = userId || '1';

    try {
        console.log('🔗 questionApi.js - getQuestions 호출');
        console.log('👤 받은 userId:', userId);
        console.log('👤 최종 사용할 userId:', finalUserId);

        const response = await fetch(`${API_BASE_URL}/questions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-USER-ID': finalUserId,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('질문을 찾을 수 없습니다.');
            }
            throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // 응답이 배열인지 확인
        if (Array.isArray(data)) {
            return data;
        }

        // 단일 객체인 경우 배열로 변환
        if (data && typeof data === 'object') {
            return [data];
        }

        // 기타 경우 빈 배열 반환
        return [];
    } catch (error) {
        console.error('질문 조회 실패:', error);

        // 연결 거부 에러를 더 명확하게 처리
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            throw new Error(`서버에 연결할 수 없습니다. API 서버가 실행 중인지 확인해주세요.`);
        }

        throw error;
    }
};

/**
 * 질문 답변 제출
 * POST /questions
 * @param {string|number} userId - 사용자 ID
 * @param {string} answer - 답변 내용
 * @param {number} questionId - 질문 ID
 * @returns {Promise<any>}
 */
export const submitAnswer = async (userId, answer, questionId) => {
    try {
        console.log('🔗 questionApi.js - submitAnswer 호출');
        console.log('👤 받은 userId:', userId);
        console.log('📝 받은 answer:', answer);
        console.log('📋 받은 questionId:', questionId);

        // answer를 문자열로 변환
        const answerString = String(answer || '');
        // 임시: userId를 무조건 1로 고정 (Long 타입이므로 숫자)
        const finalUserId = 1;
        const finalQuestionId = questionId ? Number(questionId) : null;

        console.log('👤 최종 사용할 userId (고정):', finalUserId);
        console.log('📝 최종 전송할 answer:', answerString);
        console.log('📋 최종 전송할 questionId:', finalQuestionId);

        // Request body 생성 (서버가 기대하는 형식)
        const requestBody = {
            answer: answerString,
            userId: finalUserId,
            questionId: finalQuestionId
        };

        console.log('📦 Request Body:', JSON.stringify(requestBody, null, 2));

        const response = await fetch(`${API_BASE_URL}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-USER-ID': String(finalUserId), // 헤더는 문자열
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('잘못된 요청입니다.');
            }
            throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ 답변 제출 성공:', data);
        return data;
    } catch (error) {
        console.error('답변 제출 실패:', error);

        // 연결 거부 에러를 더 명확하게 처리
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
            throw new Error(`서버에 연결할 수 없습니다. API 서버가 실행 중인지 확인해주세요.`);
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

