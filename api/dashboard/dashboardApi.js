/**
 * 대시보드 관련 API 호출 함수들
 * Swagger UI 명세서 기반
 */

// API 베이스 URL (환경 변수에서 가져오거나 기본값 사용)
// MockAPI 테스트용: https://6921c361512fb4140be14416.mockapi.io/v3/api-docs
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://6921c361512fb4140be14416.mockapi.io/v3/api-docs";

// 디버깅용: 현재 사용 중인 API 베이스 URL 로그
if (import.meta.env.DEV) {
  console.log("🔗 Dashboard API Base URL:", API_BASE_URL);
}

/**
 * 전체 정신건강 지표 요약 조회
 * GET /dashboard/total-summary
 * @param {string} userId - 유저 ID (X-USER-ID 헤더에 포함)
 * @returns {Promise<{
 *   averageScore: number,
 *   averageScoreChanged: string,
 *   highRiskNum: number,
 *   highRiskNumChanged: string,
 *   responseNum: number,
 *   responseNumChanged: string,
 *   counselingReserveCount: number,
 *   counselingReserveCountChanged: string
 * }>}
 */
export const getTotalSummary = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": userId || "",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("관리자가 아닙니다.");
      }
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("전체 정신건강 지표 요약 조회 실패:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("ERR_CONNECTION_REFUSED")
    ) {
      throw new Error(
        `서버에 연결할 수 없습니다. ${API_BASE_URL} 서버가 실행 중인지 확인해주세요.`
      );
    }

    throw error;
  }
};

/**
 * 상담 신청 목록 조회
 * GET /dashboard/reserve-list
 * @param {string} userId - 유저 ID (X-USER-ID 헤더에 포함)
 * @returns {Promise<{
 *   counselingUsers: Array<{
 *     name: string,
 *     userKey: string,
 *     univ: string,
 *     major: string
 *   }>
 * }>}
 */
export const getReserveList = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reserve-list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": userId || "",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("관리자가 아닙니다.");
      }
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("상담 신청 목록 조회 실패:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("ERR_CONNECTION_REFUSED")
    ) {
      throw new Error(
        `서버에 연결할 수 없습니다. ${API_BASE_URL} 서버가 실행 중인지 확인해주세요.`
      );
    }

    throw error;
  }
};

/**
 * 집단별 점수 조회
 * GET /dashboard/filtered-score
 * @param {number} filter - 필터 타입 (0: 단과대별, 1: 학과별, 2: 학년별)
 * @param {string} userId - 유저 ID (X-USER-ID 헤더에 포함)
 * @returns {Promise<{
 *   filteredGroups: Array<{
 *     groupX: string,
 *     scoreY: string
 *   }>
 * }>}
 */
export const getFilteredScore = async (filter = 0, userId) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/filtered-score?filter=${filter}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-USER-ID": userId || "",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("관리자가 아닙니다.");
      }
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("집단별 점수 조회 실패:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("ERR_CONNECTION_REFUSED")
    ) {
      throw new Error(
        `서버에 연결할 수 없습니다. ${API_BASE_URL} 서버가 실행 중인지 확인해주세요.`
      );
    }

    throw error;
  }
};

/**
 * 주차별 전체 학생들의 평균 심리 점수 추이 조회
 * GET /dashboard/average-score
 * @param {string} userId - 유저 ID (X-USER-ID 헤더에 포함)
 * @returns {Promise<{
 *   averageScores: Array<{
 *     dateX: string,
 *     scoreY: string
 *   }>
 * }>}
 */
export const getAverageScore = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/average-score`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-USER-ID": userId || "",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("관리자가 아닙니다.");
      }
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("주차별 평균 심리 점수 추이 조회 실패:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("ERR_CONNECTION_REFUSED")
    ) {
      throw new Error(
        `서버에 연결할 수 없습니다. ${API_BASE_URL} 서버가 실행 중인지 확인해주세요.`
      );
    }

    throw error;
  }
};

/**
 * API 에러 핸들링을 위한 기본 설정
 */
export const dashboardApiConfig = {
  baseURL: API_BASE_URL,
};

/**
 * 개발 환경에서 모든 API 엔드포인트 테스트
 * 브라우저 콘솔에서 사용: await testAllDashboardAPIs()
 */
export const testAllDashboardAPIs = async () => {
  const userId = "admin";
  const results = {
    totalSummary: null,
    filteredScore: null,
    averageScore: null,
    reserveList: null,
  };

  console.log("🧪 Dashboard API 테스트 시작...");
  console.log("📍 API Base URL:", API_BASE_URL);

  try {
    // 1. total-summary 테스트
    console.log("\n1️⃣ total-summary 테스트...");
    results.totalSummary = await getTotalSummary(userId);
    console.log("✅ total-summary 성공:", results.totalSummary);
  } catch (error) {
    console.error("❌ total-summary 실패:", error.message);
  }

  try {
    // 2. filtered-score 테스트 (단과대별)
    console.log("\n2️⃣ filtered-score 테스트 (단과대별)...");
    results.filteredScore = await getFilteredScore(0, userId);
    console.log("✅ filtered-score 성공:", results.filteredScore);
  } catch (error) {
    console.error("❌ filtered-score 실패:", error.message);
  }

  try {
    // 3. average-score 테스트
    console.log("\n3️⃣ average-score 테스트...");
    results.averageScore = await getAverageScore(userId);
    console.log("✅ average-score 성공:", results.averageScore);
  } catch (error) {
    console.error("❌ average-score 실패:", error.message);
  }

  try {
    // 4. reserve-list 테스트
    console.log("\n4️⃣ reserve-list 테스트...");
    results.reserveList = await getReserveList(userId);
    console.log("✅ reserve-list 성공:", results.reserveList);
  } catch (error) {
    console.error("❌ reserve-list 실패:", error.message);
  }

  console.log("\n📊 테스트 결과 요약:", results);
  return results;
};

// 개발 환경에서만 전역으로 노출 (브라우저 콘솔에서 사용)
if (import.meta.env.DEV && typeof window !== "undefined") {
  window.testDashboardAPI = testAllDashboardAPIs;
  console.log(
    "💡 브라우저 콘솔에서 'await testDashboardAPI()'를 실행하여 모든 API를 테스트할 수 있습니다."
  );
}
