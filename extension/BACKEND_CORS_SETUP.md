# 크롬 익스텐션 CORS 설정 가이드

## 문제 상황
크롬 익스텐션의 Background Script에서 API를 호출할 때, 서버가 `403 Invalid CORS request` 에러를 반환합니다.

## 원인
서버가 `chrome-extension://` origin을 허용하지 않아 발생하는 문제입니다.

## 해결 방법

### 1. Spring Boot (Java) 설정

#### 방법 A: `@CrossOrigin` 어노테이션 사용
```java
@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = {
    "*",  // 모든 origin 허용 (개발 환경)
    "chrome-extension://*"  // 모든 크롬 익스텐션 허용
})
public class QuestionController {
    // ...
}
```

#### 방법 B: 전역 CORS 설정 (권장)
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")  // 모든 origin 허용
                .allowedOriginPatterns("chrome-extension://*")  // 크롬 익스텐션 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false);  // 크롬 익스텐션은 credentials 불필요
    }
}
```

#### 방법 C: Security 설정 (Spring Security 사용 시)
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*", "chrome-extension://*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 2. Node.js/Express 설정

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// CORS 설정
app.use(cors({
    origin: function (origin, callback) {
        // 모든 origin 허용 또는 크롬 익스텐션 허용
        if (!origin || origin.startsWith('chrome-extension://')) {
            callback(null, true);
        } else {
            callback(null, true);  // 또는 특정 origin만 허용
        }
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-USER-ID']
}));
```

### 3. Python (Flask) 설정

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

# CORS 설정
CORS(app, 
     origins=["*", "chrome-extension://*"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "X-USER-ID"],
     supports_credentials=False)
```

### 4. Python (FastAPI) 설정

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "chrome-extension://*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 중요 사항

### 1. Origin 형식
- 크롬 익스텐션의 origin은 `chrome-extension://[확장프로그램ID]` 형식입니다
- 예: `chrome-extension://cdhepfchdehlobigcaafcekogjegejjg`
- 와일드카드로 `chrome-extension://*`를 사용하면 모든 크롬 익스텐션을 허용합니다

### 2. Preflight 요청 (OPTIONS)
- 브라우저가 CORS 요청 전에 OPTIONS 요청을 보냅니다
- 서버가 OPTIONS 요청에 대해 적절한 CORS 헤더를 반환해야 합니다

### 3. Credentials
- 크롬 익스텐션은 일반적으로 credentials를 사용하지 않습니다
- `allowCredentials: false` 또는 `supports_credentials: False`로 설정

### 4. 헤더 허용
- `Content-Type: application/json`
- `X-USER-ID` (커스텀 헤더)

## 테스트 방법

### curl로 테스트
```bash
# OPTIONS 요청 (Preflight)
curl -X OPTIONS \
  -H "Origin: chrome-extension://cdhepfchdehlobigcaafcekogjegejjg" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,x-user-id" \
  https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app/questions

# POST 요청
curl -X POST \
  -H "Origin: chrome-extension://cdhepfchdehlobigcaafcekogjegejjg" \
  -H "Content-Type: application/json" \
  -H "X-USER-ID: 1" \
  -d '{"answer":"1","userId":1,"questionId":10}' \
  https://port-0-naega-mia4lxbq959f2b64.sel3.cloudtype.app/questions
```

### 응답 헤더 확인
서버 응답에 다음 헤더가 포함되어야 합니다:
- `Access-Control-Allow-Origin: chrome-extension://cdhepfchdehlobigcaafcekogjegejjg` 또는 `*`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, X-USER-ID`

## 현재 상황
- **요청 Origin**: `chrome-extension://cdhepfchdehlobigcaafcekogjegejjg`
- **서버 응답**: `403 Forbidden` + `Invalid CORS request`
- **문제**: 서버가 `chrome-extension://` origin을 허용하지 않음

## 권장 사항
1. **개발 환경**: `allowedOrigins: ["*"]` 사용 (모든 origin 허용)
2. **프로덕션 환경**: `allowedOriginPatterns: ["chrome-extension://*"]` 사용 (모든 크롬 익스텐션 허용)
3. **보안**: 특정 크롬 익스텐션 ID만 허용하려면 정확한 origin을 지정

## 참고 자료
- [Chrome Extension CORS](https://developer.chrome.com/docs/extensions/mv3/xhr/)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Spring CORS](https://spring.io/guides/gs/rest-service-cors/)

