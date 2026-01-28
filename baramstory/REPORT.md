# Baramstory 현황 보고서

## 1. 개요
이 문서는 `baramstory` 프로젝트의 현재 실행 상태와 원본 `rpg-game`과의 차이점, 그리고 확인된 문제점을 정리한 보고서입니다.

## 2. 현재 상태
- **실행 가능 여부**: 정상 실행 (Host: 5174)
- **기술 스택**: Vite + React + TypeScript + Phaser (원본은 Vanilla JS + HTML Canvas)

## 3. 주요 차이점 (vs 원본 `rpg-game`)

| 구분 | 원본 (`rpg-game`) | 현재 리메이크 (`baramstory`) |
| :--- | :--- | :--- |
| **그래픽** | 도트 이미지 에셋 (`assets/*.png`) 사용 | Phaser 기본 도형 (Rectangle, Circle) 사용 |
| **엔진** | 자체 제작 엔진 (Loop, Update, Draw) | Phaser 3 게임 엔진 |
| **UI** | Canvas `fillText`, `fillRect`로 직접 그리기 | React 컴포넌트 (`HUD`, `Inventory` 등) 오버레이 |

## 4. 확인된 문제점 (Known Issues)

### 🚨 입력 시스템 충돌 (Input Conflict)
- **증상**: `I` (인벤토리), `Q` (퀘스트), `K` (스킬), `M` (지도) 등 단축키가 작동하지 않음.
- **원인**: Phaser 게임 캔버스가 키보드 포커스를 독점(Consume)하여, 상위 React 컴포넌트로 이벤트가 전달되지 않는 것으로 추정됨.
- **시도된 해결책 (실패)**: React의 `window.addEventListener`에 `{ capture: true }` 옵션을 추가해보았으나 해결되지 않음.
- **권장 해결 방안**: 
    1. Phaser의 Input Plugin 설정에서 `stopImmediatePropagation` 관련 옵션 확인.
    2. 또는 React가 아닌 Phaser Scene 내부에서 키 입력을 감지하고 EventBus를 통해 React로 신호를 보내는 방식으로 구조 변경 필요.

### 🎨 그래픽 리소스 부재
- 현재 모든 캐릭터와 몬스터가 색깔 있는 네모/동그라미로 표현되어 있어, 원본의 시각적 느낌이 전혀 나지 않음.
- 원본 `rpg-game/assets` 폴더의 이미지를 `baramstory/public/assets`으로 이관하고 로딩 로직을 수정해야 함.

## 5. 향후 작업 제안
1. **입력 시스템 개편**: React 의존 키 입력을 Phaser 내부로 통합.
2. **에셋 연동**: 원본 이미지 파일 이식.
3. **게임 로직 동기화**: `game.js`의 세부 수치(공격력, 체력 등)를 `GameConfig`나 각 클래스 파일에 동일하게 적용.
