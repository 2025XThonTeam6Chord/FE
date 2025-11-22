#!/bin/bash

# MockAPI 테스트 스크립트
API_BASE="https://6921c361512fb4140be14416.mockapi.io/v3/api-docs"
USER_ID="admin"

echo "🧪 Dashboard API 테스트 시작..."
echo "📍 API Base URL: $API_BASE"
echo ""

# 1. total-summary 테스트
echo "1️⃣ total-summary 테스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$API_BASE/total-summary" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: $USER_ID" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat
echo ""
echo ""

# 2. filtered-score 테스트 (단과대별 - filter=0)
echo "2️⃣ filtered-score 테스트 (단과대별, filter=0)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$API_BASE/filtered-score?filter=0" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: $USER_ID" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat
echo ""
echo ""

# 3. filtered-score 테스트 (학과별 - filter=1)
echo "3️⃣ filtered-score 테스트 (학과별, filter=1)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$API_BASE/filtered-score?filter=1" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: $USER_ID" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat
echo ""
echo ""

# 4. filtered-score 테스트 (학년별 - filter=2)
echo "4️⃣ filtered-score 테스트 (학년별, filter=2)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$API_BASE/filtered-score?filter=2" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: $USER_ID" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat
echo ""
echo ""

# 5. average-score 테스트
echo "5️⃣ average-score 테스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$API_BASE/average-score" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: $USER_ID" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat
echo ""
echo ""

# 6. reserve-list 테스트
echo "6️⃣ reserve-list 테스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -X GET "$API_BASE/reserve-list" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: $USER_ID" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat
echo ""
echo ""

echo "✅ 모든 API 테스트 완료!"

