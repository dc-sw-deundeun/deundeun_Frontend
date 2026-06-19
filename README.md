# DeunDeun (든든) - Frontend

React Native와 Expo SDK 56을 기반으로 구축된 DeunDeun 앱의 프론트엔드 레포지토리입니다.

## 🛠 Tech Stack (기술 스택)

- **Framework**: [React Native](https://reactnative.dev/) (with [Expo SDK 56](https://docs.expo.dev/))
- **Language**: TypeScript
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (Native Stack)
- **HTTP Client**: Fetch API Wrapper

---

## Directory Structure (폴더 구조)

```text
src/
├── assets/         # 이미지, 아이콘, 폰트 등 정적 리소스
├── components/     # 재사용 가능한 공통 UI 컴포넌트 (예: Button 등)
├── screens/        # 독립된 화면 컴포넌트 (Home, Details 등)
├── hooks/          # 커스텀 훅 모음 (useBoolean 등)
├── navigation/     # React Navigation 내비게이터 설정 및 스택 구성
├── services/       # API 통신 클라이언트 및 외부 연동 서비스
├── store/          # Zustand 전역 상태 및 테마 스토어
├── utils/          # 숫자/날짜 포맷팅 등 범용 헬퍼 함수
├── constants/      # 테마 컬러, 여백 값 등 스타일 상수
└── types/          # 네비게이션 및 컴포넌트 TypeScript 타입 정의
```

---

## Getting Started (시작 가이드)

### 1. 패키지 설치
프로젝트 루트 폴더에서 패키지를 다운로드합니다.
```bash
npm install
```

### 2. 로컬 개발 서버 실행
Expo 개발 서버(Metro 번들러)를 가동합니다.
```bash
npm start
# 또는
npx expo start
```

### 3. 디바이스에서 확인하기
개발 서버가 정상 가동되면 아래 단계를 통해 가상 스마트폰(에뮬레이터)이나 실제 스마트폰에서 앱을 실행할 수 있습니다.

- **안드로이드 에뮬레이터**: 에뮬레이터 구동 상태에서 터미널에 `a` 키 입력
- **실제 폰 (iOS/Android)**: 스마트폰에 **Expo Go** 앱 설치 후 터미널의 QR 코드 스캔

---

## ⚙️ Path Aliases (경로 별칭)
보다 깔끔한 코드 가독성을 위해 `@/` 프리픽스를 사용해 상대 경로 대신 절대 경로 형태로 가져올 수 있습니다.
- 예: `import Button from '@/components/Button';`
