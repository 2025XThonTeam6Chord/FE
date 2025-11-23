// 다독 크롬 익스텐션 Content Script

(function () {
    'use strict';

    // 진행률 상태 관리
    let progress = 0; // 0-100%
    let answeredCount = 0; // 답변한 문항 수
    const totalQuestions = 10; // 총 문항 수 (고정값)
    let currentQuestion = null; // 현재 질문 데이터
    let selectedAnswer = null; // 선택된 답변

    // API 베이스 URL
    const API_BASE_URL = 'https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app'; // 프로덕션 API 서버

    // 질문 조회 API (Background script를 통한 호출로 CORS 문제 해결)
    async function getQuestions(userId) {
        // 임시: userId를 무조건 '1'로 고정
        const finalUserId = '1';
        
        const requestId = Date.now();
        console.group(`🔗 [${requestId}] API 호출 시작 (Background Script 통한 호출)`);
        console.log('📡 요청 URL:', `${API_BASE_URL}/questions`);
        console.log('👤 받은 사용자 ID:', userId);
        console.log('👤 최종 사용할 사용자 ID:', finalUserId);
        
        try {
            console.log('📡 Background script로 메시지 전송...');
            const fetchStartTime = Date.now();
            
            // Background script를 통해 API 호출
            const response = await chrome.runtime.sendMessage({
                action: 'getQuestions',
                userId: finalUserId
            });
            
            const fetchEndTime = Date.now();
            const fetchDuration = fetchEndTime - fetchStartTime;
            console.log(`⏱️ Background script 응답 받음 (소요 시간: ${fetchDuration}ms)`);
            
            // Background script 응답 처리
            if (!response || !response.success) {
                const errorMessage = response?.error || '알 수 없는 오류가 발생했습니다.';
                console.error('❌ Background script 응답 실패:', errorMessage);
                console.groupEnd();
                throw new Error(errorMessage);
            }
            
            const data = response.data;
            console.log('✅ API 호출 성공');
            console.log('📦 받아온 데이터:', data);
            console.log('📦 데이터 타입:', typeof data);
            console.log('📦 배열 여부:', Array.isArray(data));
            
            // Background script는 이미 배열로 변환해서 보내줌
            if (Array.isArray(data)) {
                console.log(`✅ 질문 배열 받아옴 (${data.length}개)`);
                if (data.length > 0) {
                    console.log('📋 첫 번째 질문 샘플:', JSON.stringify(data[0], null, 2));
                }
                console.groupEnd();
                return data;
            }
            
            // 단일 객체인 경우 배열로 변환
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                console.log('📋 단일 질문 객체를 배열로 변환');
                console.log('📋 질문 데이터:', JSON.stringify(data, null, 2));
                console.groupEnd();
                return [data];
            }
            
            // 기타 경우 빈 배열 반환
            console.warn('⚠️ 예상치 못한 응답 형식');
            console.warn('⚠️ 데이터:', data);
            console.groupEnd();
            return [];
        } catch (error) {
            console.error('❌ 예외 발생:', error);
            console.error('❌ 에러 타입:', error.constructor.name);
            console.error('❌ 에러 메시지:', error.message);
            console.error('❌ 에러 스택:', error.stack);
            
            // 연결 관련 에러 확인
            if (error.message.includes('Failed to fetch')) {
                console.error('🔍 CORS 또는 네트워크 에러 가능성');
                console.error('🔍 네트워크 상태 확인 필요');
                console.error('🔍 CORS 설정 확인 필요');
            }
            if (error.message.includes('ERR_CONNECTION_REFUSED')) {
                console.error('🔍 연결 거부 에러');
            }
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('🔍 fetch API 사용 불가 (네트워크 에러 가능성)');
            }
            
            console.groupEnd();
            
            // 연결 거부 에러를 더 명확하게 처리
            if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
                throw new Error(`서버에 연결할 수 없습니다. API 서버가 실행 중인지 확인해주세요. (URL: ${API_BASE_URL})`);
            }
            
            throw error;
        }
    }

    // 사용자 ID 가져오기 (eClass에서 추출하거나 localStorage에서 가져오기)
    function getUserId() {
        console.group('🔍 사용자 ID 추출');
        
        // 방법 1: eClass 페이지에서 학번 추출
        console.log('🔍 방법 1: eClass 페이지에서 학번 추출 시도');
        const targetElement = document.querySelector('.fullname');
        console.log('🔍 .fullname 요소:', targetElement);
        
        if (targetElement) {
            const rawText = targetElement.textContent;
            console.log('🔍 추출된 텍스트:', rawText);
            const match = rawText.match(/\(\s*(\d+)\s*\)/);
            console.log('🔍 매칭 결과:', match);
            
            if (match) {
                const userId = match[1];
                console.log('✅ eClass에서 학번 추출 성공:', userId);
                console.groupEnd();
                return userId;
            } else {
                console.log('⚠️ 학번 패턴 매칭 실패');
            }
        } else {
            console.log('⚠️ .fullname 요소를 찾을 수 없음');
        }
        
        // 방법 2: localStorage에서 가져오기
        console.log('🔍 방법 2: localStorage에서 사용자 ID 가져오기 시도');
        try {
            const userId = localStorage.getItem('userId');
            console.log('🔍 localStorage에서 가져온 값:', userId);
            if (userId) {
                console.log('✅ localStorage에서 사용자 ID 가져오기 성공:', userId);
                console.groupEnd();
                return userId;
            } else {
                console.log('⚠️ localStorage에 userId 없음');
            }
        } catch (e) {
            console.warn('⚠️ localStorage 접근 불가:', e);
        }
        
        // 방법 3: 기본값 (개발/테스트용)
        const defaultUserId = '1';
        console.log('⚠️ 기본값 사용:', defaultUserId);
        console.groupEnd();
        return defaultUserId;
    }

    // 질문 유형 상수 (API 응답 형식에 맞춤)
    const QUESTION_TYPES = {
        RATING_5: 'RATING_5', // 5점 평점 (매우 만족 ~ 매우 불만족)
        YES_NO: 'YES_NO', // 예/아니오
        SHORT_TEXT: 'SHORT_TEXT' // 주관식 텍스트 입력
    };

    // SVG 원형 프로그레스 링 생성
    function createProgressRing() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'dadok-progress-ring');
        svg.setAttribute('viewBox', '0 0 64 64');
        svg.setAttribute('width', '72');
        svg.setAttribute('height', '72');

        // 트랙 (배경 링)
        const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        track.setAttribute('class', 'dadok-progress-track');
        track.setAttribute('cx', '32');
        track.setAttribute('cy', '32');
        track.setAttribute('r', '30');

        // 프로그레스 (채워지는 링)
        const fill = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        fill.setAttribute('class', 'dadok-progress-fill');
        fill.setAttribute('id', 'dadok-progress-fill');
        fill.setAttribute('cx', '32');
        fill.setAttribute('cy', '32');
        fill.setAttribute('r', '30');

        // 원둘레 계산
        const circumference = 2 * Math.PI * 30;
        fill.style.strokeDasharray = `${circumference} ${circumference}`;
        fill.style.strokeDashoffset = circumference;

        svg.appendChild(track);
        svg.appendChild(fill);
        return svg;
    }

    // 진행률 업데이트 함수
    function updateProgress(percent) {
        const fill = document.getElementById('dadok-progress-fill');
        if (!fill) return;

        progress = Math.min(100, Math.max(0, percent));
        const circumference = 2 * Math.PI * 30;
        const offset = circumference - (circumference * progress / 100);
        fill.style.strokeDashoffset = offset;
    }

    // FAB 생성
    function createFAB() {
        const container = document.createElement('div');
        container.className = 'dadok-fab-container';
        container.id = 'dadok-fab-container';

        const progressRing = createProgressRing();
        container.appendChild(progressRing);

        const fab = document.createElement('button');
        fab.className = 'dadok-fab';
        fab.setAttribute('aria-label', '다독 질문 답변');
        fab.innerHTML = '💭';
        fab.id = 'dadok-fab';
        container.appendChild(fab);

        return container;
    }

    // 5점 평점 선택지 생성 (RATING_5)
    function createRating5Popup(question) {
        const popup = document.createElement('div');
        popup.className = 'dadok-popup';
        popup.id = 'dadok-popup';

        // 헤더 프레임 (제목 + 제출 버튼)
        const headerFrame = document.createElement('div');
        headerFrame.className = 'dadok-popup-header';

        // 질문 제목 (content 필드 사용)
        const title = document.createElement('div');
        title.className = 'dadok-popup-title';
        title.textContent = question.content || '';

        // 제출 버튼
        const submitBtn = document.createElement('button');
        submitBtn.className = 'dadok-submit-button';
        submitBtn.textContent = '응답 제출';
        submitBtn.addEventListener('click', handleSubmit);

        headerFrame.appendChild(title);
        headerFrame.appendChild(submitBtn);
        popup.appendChild(headerFrame);

        // 선택지 컨테이너
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dadok-options-container';

        // API 응답에서 question1~question5 사용
        // 빈 문자열도 필터링 (question1이 빈 문자열일 수 있음)
        const options = [
            question.question1,
            question.question2,
            question.question3,
            question.question4,
            question.question5
        ].filter(opt => opt && opt.trim() !== ''); // undefined와 빈 문자열 제거
        
        // 옵션이 없으면 기본값 사용 (RATING_5의 경우)
        if (options.length === 0) {
            options.push('매우 만족', '만족', '보통', '불만족', '매우 불만족');
        }

        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'dadok-option-button';
            button.dataset.answer = index + 1;
            button.textContent = option;

            button.addEventListener('click', () => {
                // 기존 선택 해제
                document.querySelectorAll('.dadok-option-button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // 현재 선택
                button.classList.add('selected');
                selectedAnswer = index + 1;
            });

            optionsContainer.appendChild(button);
        });

        popup.appendChild(optionsContainer);

        return popup;
    }

    // 예/아니오 선택지 생성 (YES_NO)
    function createYesNoPopup(question) {
        const popup = document.createElement('div');
        popup.className = 'dadok-popup';
        popup.id = 'dadok-popup';

        // 헤더 프레임 (제목 + 제출 버튼)
        const headerFrame = document.createElement('div');
        headerFrame.className = 'dadok-popup-header';

        // 질문 제목 (content 필드 사용)
        const title = document.createElement('div');
        title.className = 'dadok-popup-title';
        title.textContent = question.content || '';

        // 제출 버튼
        const submitBtn = document.createElement('button');
        submitBtn.className = 'dadok-submit-button';
        submitBtn.textContent = '응답 제출';
        submitBtn.addEventListener('click', handleSubmit);

        headerFrame.appendChild(title);
        headerFrame.appendChild(submitBtn);
        popup.appendChild(headerFrame);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'dadok-options-container dadok-yesno-container';

        // API 응답에서 question1, question2 사용
        const yesBtn = document.createElement('button');
        yesBtn.className = 'dadok-option-button dadok-yesno-button';
        yesBtn.dataset.answer = 'yes';
        yesBtn.textContent = question.question1 || '있다';
        yesBtn.addEventListener('click', () => {
            document.querySelectorAll('.dadok-yesno-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            yesBtn.classList.add('selected');
            selectedAnswer = 'yes';
        });

        const noBtn = document.createElement('button');
        noBtn.className = 'dadok-option-button dadok-yesno-button';
        noBtn.dataset.answer = 'no';
        noBtn.textContent = question.question2 || '없다';
        noBtn.addEventListener('click', () => {
            document.querySelectorAll('.dadok-yesno-button').forEach(btn => {
                btn.classList.remove('selected');
            });
            noBtn.classList.add('selected');
            selectedAnswer = 'no';
        });

        optionsContainer.appendChild(yesBtn);
        optionsContainer.appendChild(noBtn);
        
        popup.appendChild(optionsContainer);

        return popup;
    }

    // 주관식 텍스트 입력 생성 (SHORT_TEXT)
    function createShortTextPopup(question) {
        const popup = document.createElement('div');
        popup.className = 'dadok-popup';
        popup.id = 'dadok-popup';

        // 헤더 프레임 (제목 + 제출 버튼)
        const headerFrame = document.createElement('div');
        headerFrame.className = 'dadok-popup-header';

        // 질문 제목 (content 필드 사용)
        const title = document.createElement('div');
        title.className = 'dadok-popup-title';
        title.textContent = question.content || '';

        // 제출 버튼
        const submitBtn = document.createElement('button');
        submitBtn.className = 'dadok-submit-button';
        submitBtn.textContent = '응답 제출';
        submitBtn.addEventListener('click', handleSubmit);

        headerFrame.appendChild(title);
        headerFrame.appendChild(submitBtn);
        popup.appendChild(headerFrame);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'dadok-input-container';

        const textarea = document.createElement('textarea');
        textarea.className = 'dadok-text-input';
        textarea.placeholder = '답변을 입력해주세요...';
        textarea.rows = 3;

        textarea.addEventListener('input', (e) => {
            selectedAnswer = e.target.value;
        });

        inputContainer.appendChild(textarea);
        
        popup.appendChild(inputContainer);

        return popup;
    }

    // 유형에 따른 팝업 생성
    function createPopup(questionData) {
        currentQuestion = questionData;
        selectedAnswer = null;

        // 기존 팝업 제거
        const existingPopup = document.getElementById('dadok-popup');
        if (existingPopup) existingPopup.remove();

        let popup;

        switch (questionData.responseType) {
            case QUESTION_TYPES.RATING_5:
                popup = createRating5Popup(questionData);
                break;
            case QUESTION_TYPES.YES_NO:
                popup = createYesNoPopup(questionData);
                break;
            case QUESTION_TYPES.SHORT_TEXT:
                popup = createShortTextPopup(questionData);
                break;
            default:
                console.error('Unknown question type:', questionData.responseType);
                return null;
        }

        return popup;
    }

    // 응답 제출 핸들러
    async function handleSubmit() {
        if (!selectedAnswer && selectedAnswer !== 0) {
            alert('답변을 선택해주세요.');
            return;
        }

        try {
            console.group('📤 답변 제출 시작');
            // 임시: userId를 무조건 '1'로 고정
            const userId = '1';
            
            // 답변을 문자열로 변환
            const answerString = String(selectedAnswer);
            console.log('📝 제출할 답변:', answerString);
            console.log('📝 답변 타입:', typeof selectedAnswer);
            console.log('👤 사용자 ID (고정):', userId);
            console.log('📋 질문 ID:', currentQuestion?.questionId);
            console.log('📋 질문 유형:', currentQuestion?.responseType);
            
            // Mock: 실제 API 호출 없이 성공 응답만 반환
            console.log('📡 [MOCK] 답변 제출 요청 (실제 API 호출 없음)');
            console.log('📦 전송할 메시지:', {
                action: 'submitAnswer',
                userId: userId,
                answer: answerString,
                questionId: currentQuestion?.questionId || null
            });
            
            // Mock 응답: 항상 성공으로 처리
            const response = {
                success: true,
                data: true
            };
            
            console.log('✅ [MOCK] 답변 제출 성공:', response.data);
            console.groupEnd();

            // localStorage에 답변한 질문 ID 저장
            try {
                const answeredQuestionIds = JSON.parse(localStorage.getItem('answeredQuestionIds') || '[]');
                if (currentQuestion?.questionId && !answeredQuestionIds.includes(currentQuestion.questionId)) {
                    answeredQuestionIds.push(currentQuestion.questionId);
                    localStorage.setItem('answeredQuestionIds', JSON.stringify(answeredQuestionIds));
                }
            } catch (e) {
                console.warn('localStorage 저장 실패:', e);
            }

            // 답변 수 증가 및 진행률 업데이트
            answeredCount++;
            if (totalQuestions > 0) {
                const newProgress = (answeredCount / totalQuestions) * 100;
                updateProgress(newProgress);
                
                console.log('📊 진행률:', `${answeredCount} / ${totalQuestions} (${newProgress.toFixed(1)}%)`);
                
                // 100% 달성 시 버튼 아이콘 변경 및 애니메이션
                if (newProgress >= 100) {
                    const fab = document.getElementById('dadok-fab');
                    if (fab) {
                        fab.innerHTML = '✅';
                        fab.style.animation = 'bounce 0.6s ease';
                        setTimeout(() => {
                            fab.style.animation = '';
                        }, 600);
                    }
                }
            }

            // 팝업 닫기
            closePopup();

            // 응원 메시지 및 프로그레스 바 표시
            showCompletionMessage();
        } catch (error) {
            console.error('답변 제출 실패:', error);
            alert('답변 제출에 실패했습니다. 다시 시도해주세요.');
        }
    }

    // 완료 메시지 표시
    function showCompletionMessage() {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'dadok-completion-message';
        messageContainer.id = 'dadok-completion-message';

        const encouragementMessages = [
            '좋아요! 한 걸음씩 나아가고 있어요 🌟',
            '잘하고 있어요! 계속 힘내세요 💪',
            '멋져요! 오늘도 수고하셨어요 ✨',
            '훌륭해요! 작은 변화가 큰 변화를 만들어요 🌈'
        ];

        const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];

        messageContainer.innerHTML = `
            <div class="dadok-message-text">${randomMessage}</div>
            <div class="dadok-progress-bar-container">
                <div class="dadok-progress-bar-label">오늘의 답변 진행률</div>
                <div class="dadok-progress-bar">
                    <div class="dadok-progress-bar-fill" id="dadok-progress-bar-fill" style="width: ${progress}%"></div>
                </div>
                <div class="dadok-progress-text">${answeredCount} / ${totalQuestions}</div>
            </div>
        `;

        document.body.appendChild(messageContainer);

        // 3초 후 자동 제거
        setTimeout(() => {
            messageContainer.classList.add('fade-out');
            setTimeout(() => {
                messageContainer.remove();
            }, 300);
        }, 3000);
    }

    // Overlay 생성
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'dadok-overlay';
        overlay.id = 'dadok-overlay';

        overlay.addEventListener('click', () => {
            closePopup();
        });

        return overlay;
    }

    // 팝업 열기
    function openPopup(questionData) {
        // 현재 질문 데이터 저장 (답변 제출 시 사용)
        currentQuestion = questionData;
        console.log('📋 현재 질문 설정:', {
            questionId: currentQuestion?.questionId,
            content: currentQuestion?.content,
            responseType: currentQuestion?.responseType
        });
        
        // 백엔드에서 질문 데이터를 받아온다고 가정
        // 실제로는 API 호출 필요
        const popup = createPopup(questionData);
        const overlay = document.getElementById('dadok-overlay');

        if (popup && overlay) {
            document.body.appendChild(popup);
            popup.classList.add('active');
            overlay.classList.add('active');
        }
    }

    // 팝업 닫기
    function closePopup() {
        const popup = document.getElementById('dadok-popup');
        const overlay = document.getElementById('dadok-overlay');

        if (popup) {
            popup.classList.remove('active');
            setTimeout(() => popup.remove(), 300);
        }
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    // 초기화
    function init() {
        // 기존 요소 제거
        const existingContainer = document.getElementById('dadok-fab-container');
        const existingPopup = document.getElementById('dadok-popup');
        const existingOverlay = document.getElementById('dadok-overlay');

        if (existingContainer) existingContainer.remove();
        if (existingPopup) existingPopup.remove();
        if (existingOverlay) existingOverlay.remove();

        // 새 요소 생성
        const fabContainer = createFAB();
        const overlay = createOverlay();

        document.body.appendChild(overlay);
        document.body.appendChild(fabContainer);

        // 초기 진행률: 0%로 시작 (항상 0부터 시작)
        answeredCount = 0;
        progress = 0;
        updateProgress(0);

        // FAB 클릭 이벤트
        const fab = document.getElementById('dadok-fab');
        if (fab) {
            fab.addEventListener('click', async (e) => {
                e.stopPropagation();

                try {
                    // 임시: userId를 무조건 '1'로 고정
                    const userId = '1';
                    
                    // API에서 질문 목록 가져오기
                    const questions = await getQuestions(userId);
                    
                    if (questions.length === 0) {
                        alert('답변할 질문이 없습니다.');
                        return;
                    }

                    // 아직 답변하지 않은 질문 찾기 (간단한 로직)
                    // TODO: 실제로는 서버에서 답변한 질문을 제외하고 받아오거나,
                    // localStorage에 답변한 질문 ID를 저장해서 필터링
                    const unansweredQuestions = questions.filter(q => {
                        try {
                            const answeredQuestionIds = JSON.parse(localStorage.getItem('answeredQuestionIds') || '[]');
                            return !answeredQuestionIds.includes(q.questionId);
                        } catch (e) {
                            return true;
                        }
                    });

                    // 아직 답변하지 않은 질문이 있으면 첫 번째 질문 표시
                    // 없으면 모든 질문 중 랜덤하게 선택
                    const questionToShow = unansweredQuestions.length > 0 
                        ? unansweredQuestions[0]
                        : questions[Math.floor(Math.random() * questions.length)];

                    // 총 질문 수는 10개로 고정 (이미 상수로 설정됨)

                    console.log('🎯 표시할 질문:', {
                        questionId: questionToShow.questionId,
                        content: questionToShow.content,
                        responseType: questionToShow.responseType
                    });
                    
                    openPopup(questionToShow);
                    console.groupEnd();
                } catch (error) {
                    console.group('❌ 에러 처리');
                    console.error('❌ 질문 로드 실패');
                    console.error('❌ 에러 객체:', error);
                    console.error('❌ 에러 타입:', error.constructor.name);
                    console.error('❌ 에러 메시지:', error.message);
                    console.error('❌ 에러 스택:', error.stack);
                    console.groupEnd();
                    
                    // 사용자에게 친화적인 메시지 표시
                    const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
                    alert(`질문을 불러오는데 실패했습니다.\n\n${errorMessage}\n\n콘솔을 확인하여 상세 정보를 볼 수 있습니다.`);
                    
                    // 에러 발생 시 테스트용 기본 질문 표시
                    console.warn('⚠️ Fallback 질문 사용');
                    const fallbackQuestion = {
                        content: '지금 가장 해결하고 싶은 고민이 있다면 적어주세요.',
                        responseType: QUESTION_TYPES.SHORT_TEXT,
                        questionId: 999
                    };
                    openPopup(fallbackQuestion);
                    console.groupEnd();
                }
            });
        }

        // ESC 키로 팝업 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePopup();
            }
        });
    }

    // DOM 로드 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // SPA 대응
    const observer = new MutationObserver(() => {
        if (!document.getElementById('dadok-fab')) {
            init();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();

// Chrome 메시지 리스너 (기존 코드 유지)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getStudentId") {
        const targetElement = document.querySelector('.fullname');
        let studentId = "학번 미확인";

        if (targetElement) {
            const rawText = targetElement.textContent;
            const match = rawText.match(/\(\s*(\d+)\s*\)/);
            if (match) {
                studentId = match[1];
            }
        }

        sendResponse({ studentId: studentId });
    }
});
