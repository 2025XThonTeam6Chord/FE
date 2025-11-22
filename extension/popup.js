document.addEventListener('DOMContentLoaded', () => {
    // 1. 현재 탭 찾기
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];

        // 2. 동국대 이클래스인지 확인 (URL 체크)
        if (currentTab.url.includes("eclass.dongguk.edu")) {

            // 3. content.js에 "학번 내놔" 메시지 전송
            chrome.tabs.sendMessage(
                currentTab.id,
                { action: "getStudentId" },
                (response) => {
                    // 4. 응답 처리
                    const resultArea = document.getElementById('result-area');

                    if (chrome.runtime.lastError) {
                        // 페이지 로딩 전이거나 에러 발생 시
                        resultArea.innerText = "페이지를 새로고침 해주세요.";
                    } else if (response && response.studentId) {
                        // 성공!
                        resultArea.innerText = `학번: ${response.studentId}`;
                    } else {
                        resultArea.innerText = "학번을 찾을 수 없습니다.";
                    }
                }
            );
        } else {
            document.getElementById('result-area').innerText = "이클래스 페이지가 아닙니다.";
        }
    });
});