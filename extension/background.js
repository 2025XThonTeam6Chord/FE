// Chrome Extension Background Script
// API 호출을 background script에서 처리하여 CORS 문제 해결

const API_BASE_URL = 'https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app';

// Background script 초기화 로그
console.log('🚀 Background Script 로드됨');
console.log('📡 API Base URL:', API_BASE_URL);

// Background script에서 API 호출
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Background - 메시지 수신:', request);
    
    // sendResponse가 유효한지 확인
    if (!sendResponse) {
        console.error('❌ sendResponse가 없습니다!');
        return false;
    }
    if (request.action === 'getQuestions') {
        // 임시: userId를 무조건 '1'로 고정
        const userId = '1';
        
        fetch(`${API_BASE_URL}/questions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-USER-ID': userId,
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP ${response.status}: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            // 응답이 배열이 아닌 경우 배열로 변환
            const questions = Array.isArray(data) ? data : [data];
            sendResponse({ success: true, data: questions });
        })
        .catch(error => {
            console.error('Background API 호출 실패:', error);
            sendResponse({ success: false, error: error.message });
        });
        
        // 비동기 응답을 위해 true 반환
        return true;
    }
    
    if (request.action === 'submitAnswer') {
        console.log('✅ Background - submitAnswer 액션 처리 시작 (MOCK 모드)');
        
        // Mock: 실제 API 호출 없이 성공 응답만 반환
        console.log('📡 [MOCK] 답변 제출 요청 (실제 API 호출 없음)');
        console.log('👤 User ID:', request.userId);
        console.log('📝 Answer:', request.answer);
        console.log('📋 Question ID:', request.questionId);
        
        // Mock 응답: 항상 성공으로 처리
        setTimeout(() => {
            console.log('✅ [MOCK] Background - 답변 제출 성공');
            sendResponse({ success: true, data: true });
        }, 100); // 약간의 지연을 주어 실제 API 호출처럼 보이게
        
        // 비동기 응답을 위해 true 반환
        return true;
    }
});

