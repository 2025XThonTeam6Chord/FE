# CORS 에러 리포트

## 문제 상황
Chrome Extension의 Background Script에서 POST 요청을 보낼 때 서버에서 `403 Forbidden`과 "Invalid CORS request" 에러가 발생합니다.

## 요청 정보

### 요청 URL
```
POST https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app/questions
```

### 요청 헤더
```
Content-Type: application/json
X-USER-ID: 1
```

### 요청 Body
```json
{
  "answer": "yes",
  "userId": 1,
  "questionId": 3
}
```

### 서버 응답
- **상태 코드**: `403 Forbidden`
- **에러 메시지**: `Invalid CORS request`

## 요청 Origin
Chrome Extension의 Background Script는 `chrome-extension://` Origin을 사용합니다.
예: `chrome-extension://cdhepfchdehlobigcaafcekogjegej.jg`

## 해결 방법

### 1. CORS 설정 확인
서버의 CORS 설정에서 다음을 확인해주세요:

1. **Preflight 요청 (OPTIONS) 처리**
   - `Content-Type: application/json` 헤더가 있으면 브라우저가 자동으로 OPTIONS 요청을 보냅니다.
   - OPTIONS 요청에 대해 올바른 CORS 헤더를 반환해야 합니다.

2. **Access-Control-Allow-Origin 헤더**
   - `chrome-extension://` Origin을 허용하거나
   - `*` (모든 Origin 허용) 또는
   - 특정 Extension ID를 허용 목록에 추가

3. **필요한 CORS 헤더**
   ```
   Access-Control-Allow-Origin: chrome-extension://cdhepfchdehlobigcaafcekogjegej.jg
   Access-Control-Allow-Methods: POST, GET, OPTIONS
   Access-Control-Allow-Headers: Content-Type, X-USER-ID
   Access-Control-Allow-Credentials: false (또는 true, 필요시)
   ```

### 2. Spring Boot 예시 (참고)
```java
@CrossOrigin(origins = "*") // 또는 특정 Origin
@PostMapping("/questions")
public ResponseEntity<?> submitAnswer(@RequestBody UserAnswerReq request) {
    // ...
}
```

또는 전역 설정:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/questions")
                    .allowedOrigins("*") // 또는 특정 Origin
                    .allowedMethods("POST", "GET", "OPTIONS")
                    .allowedHeaders("Content-Type", "X-USER-ID")
                    .allowCredentials(false);
            }
        };
    }
}
```

## 추가 확인 사항

### questionId가 1로 들어가는 문제
클라이언트에서는 `questionId: 3`을 정상적으로 전송하고 있습니다.
만약 서버에서 `questionId`가 항상 1로 저장된다면:

1. **서버 코드 확인**
   - `UserAnswerReq`의 `questionId` 필드가 제대로 매핑되는지 확인
   - 기본값이 1로 설정되어 있지 않은지 확인

2. **요청 Body 파싱 확인**
   - 서버 로그에서 실제로 받은 `questionId` 값 확인
   - JSON 파싱이 제대로 되는지 확인

## 테스트 방법

### curl로 테스트
```bash
curl -X POST "https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app/questions" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: 1" \
  -d '{"answer":"test","userId":1,"questionId":4}' \
  -v
```

### OPTIONS 요청 테스트 (Preflight)
```bash
curl -X OPTIONS "https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app/questions" \
  -H "Origin: chrome-extension://cdhepfchdehlobigcaafcekogjegej.jg" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-user-id" \
  -v
```

## 참고
- Chrome Extension의 Background Script는 `chrome-extension://` Origin을 사용합니다.
- Background Script는 일반적으로 CORS 제한을 받지 않지만, 서버가 명시적으로 CORS를 체크하는 경우 허용 목록에 추가해야 합니다.

