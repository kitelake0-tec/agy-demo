# Interview Scratchpad / 인터뷰 메모 - workflow

## Context / 맥락
- Date / 날짜: 2026-03-15
- Reference / 참고자료: None

## Emerging Themes / 주요 주제
(Update as patterns surface / 패턴이 나타나면 업데이트)
- 효율화 및 자동화 추구
- 현재 프로세스의 반복적인 작업 개선 의도
- 매우 큰 규모의 작업량 (일일 500건)
- 부분 자동화되었으나 최종 검증은 전부 수동

## Key Insights / 핵심 인사이트
(Important points stated by the interviewee / 인터뷰 대상자가 밝힌 중요한 사항)
- 업무를 보다 효율화하고 자동화하고 싶음

**게시판 답변 검수:**
- 일일 500건, 6시간 소요
- 규칙: Ver1.1.md에 명시 (수정 허용 범위, 용어 표기, 센터 명칭 통일 등)
- 프로세스: 1건씩 LLM 검수 → 최종 수동 검증
- 병목: LLM 검수 후 직접 검증하는 시간

**커뮤니티 모니터링:**
- 크롤링: 파이썬으로 자동화, 1일 1회 (크롤링 자체는 문제없음)
- 병목: 데이터 재추출에 1~2시간 소요
- 유의미한 데이터 기준: 인터넷강의, 학원, 경쟁사평판, 시장평판 등
- 문제: 무의미한 잡담, 욕설 등이 함께 크롤링되어 필터링/제거 필요
- 추출 데이터는 주간 보고서 작성에 사용

## Constraints & Boundaries / 제약사항 및 경계
(Non-negotiables, limitations, boundaries / 필수조건, 제한사항, 경계)
- 게시판 답변 검수: 일일 500건 (소요 시간: 6시간)
- 병목: LLM 검수 후 직접 검증하는 부분이 가장 오래 걸림
- 현재 부분 자동화: LLM을 사용하여 오탈자/표현력 수정
- LLM 입력 방식: 한 번에 전체 규칙을 입력
- 1건씩 처리 → 1건씩 수동 검증

## Decisions Made / 결정사항
(Things already decided / 이미 결정된 사항)
-

## Tensions / Trade-offs / 긴장관계 및 트레이드오프
(Conflicting goals or competing priorities / 상충하는 목표나 우선순위)
- 자동화와 정확성의 균형: LLM 자동화로 인한 오류 검증의 필요성
- 크롤링 데이터 필터링: 자동 필터링과 수동 검증 사이의 효율성

## Areas to Dig Deeper / 더 탐색할 영역
- [ ] 500건 검수에 소요되는 시간
- [ ] 현재 프로세스 중 가장 병목이 되는 부분
- [ ] 커뮤니티 사이트 모니터링의 현재 크롤링 방식
- [ ] 모니터링 결과 보고서 작성 프로세스

## Key Quotes / 핵심 인용
(Memorable phrasings worth preserving verbatim / 그대로 보존할 가치가 있는 표현)
-

## Open Questions / 미해결 질문
(Unresolved or deferred items / 해결되지 않았거나 보류된 항목)
-
