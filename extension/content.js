// 다독 크롬 익스텐션 Content Script

(function () {
    'use strict';

    // 진행률 상태 관리
    let progress = 40; // 0-100% (초기값: 40%)
    let answeredCount = 2; // 답변한 문항 수 (초기값: 5개 중 2개 = 40%)
    const totalQuestions = 5; // 총 문항 수 (감정 선택지 5개)

    // 감정 데이터
    const emotions = [
        { emoji: '😊', text: '좋아요', value: 'happy' },
        { emoji: '😐', text: '그저 그래요', value: 'neutral' },
        { emoji: '😢', text: '힘들어요', value: 'sad' },
        { emoji: '😰', text: '불안해요', value: 'anxious' },
        { emoji: '😴', text: '피곤해요', value: 'tired' }
    ];

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

        // [수정] setAttribute 대신 style 속성 사용
        fill.style.strokeDasharray = `${circumference} ${circumference}`;
        fill.style.strokeDashoffset = circumference; // 초기값: 완전히 비어있음

        svg.appendChild(track);
        svg.appendChild(fill);

        return svg;
    }

    // 진행률 업데이트 함수
    function updateProgress(percent) {
        const fill = document.getElementById('dadok-progress-fill');
        const fab = document.getElementById('dadok-fab');

        if (!fill || !fab) return;

        progress = Math.min(100, Math.max(0, percent));

        // 원둘레 계산
        const circumference = 2 * Math.PI * 30;
        // stroke-dashoffset: 전체 원둘레에서 진행률만큼 빼기
        const offset = circumference - (circumference * progress / 100);

        // [수정] setAttribute 대신 style 속성 사용 (CSS 파일보다 우선순위 높음)
        fill.style.strokeDashoffset = offset;

        // 100% 달성 시 완료 효과
        if (progress >= 100 && !fab.classList.contains('completed')) {
            fab.classList.add('completed');
            fab.innerHTML = '✅';

            // 바운스 애니메이션 후 원래 상태로
            setTimeout(() => {
                fab.classList.remove('completed');
            }, 600);
        } else if (progress < 100) {
            fab.innerHTML = '💭';
        }
    }

    // HTML 생성
    function createFAB() {
        // 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'dadok-fab-container';
        container.id = 'dadok-fab-container';

        // 프로그레스 링 생성
        const progressRing = createProgressRing();
        container.appendChild(progressRing);

        // 버튼 생성
        const fab = document.createElement('button');
        fab.className = 'dadok-fab';
        fab.setAttribute('aria-label', '다독 심리 상태 기록');
        fab.innerHTML = '💭';
        fab.id = 'dadok-fab';
        container.appendChild(fab);

        return container;
    }

    function createPopup() {
        const popup = document.createElement('div');
        popup.className = 'dadok-popup';
        popup.id = 'dadok-popup';

        const title = document.createElement('div');
        title.className = 'dadok-popup-title';
        title.textContent = '오늘의 마음은 어때요?';

        const subtitle = document.createElement('div');
        subtitle.className = 'dadok-popup-subtitle';
        subtitle.textContent = '간단하게 기록해보세요';

        popup.appendChild(title);
        popup.appendChild(subtitle);

        // 감정 버튼들 생성
        emotions.forEach(emotion => {
            const button = document.createElement('button');
            button.className = 'dadok-emotion-button';
            button.dataset.emotion = emotion.value;

            const emojiSpan = document.createElement('span');
            emojiSpan.className = 'dadok-emotion-emoji';
            emojiSpan.textContent = emotion.emoji;

            const textSpan = document.createElement('span');
            textSpan.className = 'dadok-emotion-text';
            textSpan.textContent = emotion.text;

            button.appendChild(emojiSpan);
            button.appendChild(textSpan);

            // 클릭 이벤트
            button.addEventListener('click', () => {
                handleEmotionClick(emotion);
            });

            popup.appendChild(button);
        });

        return popup;
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'dadok-overlay';
        overlay.id = 'dadok-overlay';

        overlay.addEventListener('click', () => {
            closePopup();
        });

        return overlay;
    }

    // 감정 클릭 핸들러
    function handleEmotionClick(emotion) {
        // 여기서 나중에 API 호출 등을 할 수 있습니다
        console.log('감정 기록:', emotion);

        // 답변 수 증가 (중복 방지 - 한 번만 증가)
        if (answeredCount < totalQuestions) {
            answeredCount++;
            const newProgress = (answeredCount / totalQuestions) * 100;
            updateProgress(newProgress);
        }

        // 사용자에게 알림
        alert(`${emotion.emoji} ${emotion.text} - 기록되었습니다!`);

        // 팝업 닫기
        closePopup();

        // TODO: 실제로는 서버로 데이터 전송
        // sendEmotionToServer(emotion);
    }

    // 팝업 열기
    function openPopup() {
        const popup = document.getElementById('dadok-popup');
        const overlay = document.getElementById('dadok-overlay');

        if (popup && overlay) {
            popup.classList.add('active');
            overlay.classList.add('active');
        }
    }

    // 팝업 닫기
    function closePopup() {
        const popup = document.getElementById('dadok-popup');
        const overlay = document.getElementById('dadok-overlay');

        if (popup && overlay) {
            popup.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    // 초기화
    function init() {
        // 기존에 추가된 요소가 있으면 제거
        const existingContainer = document.getElementById('dadok-fab-container');
        const existingPopup = document.getElementById('dadok-popup');
        const existingOverlay = document.getElementById('dadok-overlay');

        if (existingContainer) existingContainer.remove();
        if (existingPopup) existingPopup.remove();
        if (existingOverlay) existingOverlay.remove();

        // 진행률 초기화 (실제로는 로컬 스토리지에서 불러올 수 있음)
        // 초기값: 40% 채워진 상태 (2개 답변 완료)
        answeredCount = 2;
        progress = 40;

        // 새 요소 생성 및 추가
        const fabContainer = createFAB();
        const popup = createPopup();
        const overlay = createOverlay();

        document.body.appendChild(overlay);
        document.body.appendChild(fabContainer);
        document.body.appendChild(popup);

        // 초기 진행률 표시 (40%)
        updateProgress(40);

        // FAB 클릭 이벤트
        const fab = document.getElementById('dadok-fab');
        if (fab) {
            fab.addEventListener('click', (e) => {
                e.stopPropagation();
                const popup = document.getElementById('dadok-popup');
                if (popup && popup.classList.contains('active')) {
                    closePopup();
                } else {
                    openPopup();
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

    // DOM이 완전히 로드된 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // SPA 페이지에서도 작동하도록 MutationObserver 사용
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

// 1. 팝업(퀵메뉴)에서 메시지가 오면 반응하는 리스너
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // "학번내놔"라는 요청이 오면
    if (request.action === "getStudentId") {

        // DOM에서 학번 추출 (아까 짠 로직)
        const targetElement = document.querySelector('.fullname');
        let studentId = "학번 미확인";

        if (targetElement) {
            const rawText = targetElement.textContent;
            const match = rawText.match(/\(\s*(\d+)\s*\)/);
            if (match) {
                studentId = match[1];
            }
        }

        // 팝업으로 결과 전송
        sendResponse({ studentId: studentId });
    }
});

