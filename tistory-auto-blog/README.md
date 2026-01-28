# 티스토리 트렌드 이슈 자동 포스팅 봇

매일 아침 구글 트렌드(Google Trends)를 분석하여 전일자 한국 인기 검색어들을 티스토리에 자동으로 포스팅하는 프로그램입니다.

## 기능
- **트렌드 수집**: 구글 트렌드 RSS를 통해 한국의 실시간/일간 트렌드를 수집합니다.
- **포스팅 생성**: 트렌드 키워드, 관련 뉴스, 간단한 설명을 포함한 HTML 블로그 글을 생성합니다.
- **자동 업로드**: 티스토리 Open API를 사용하여 블로그에 글을 발행합니다.
- **스케줄링**: 매일 아침 07:00에 자동으로 동작합니다.

## 설치 방법

1. **프로젝트 폴더 이동**
   ```bash
   cd tistory-auto-blog
   ```

2. **가상환경 생성 및 패키지 설치**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   ```

3. **환경 변수 설정**
   `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다.
   ```bash
   cp .env.example .env
   ```
   `.env` 파일을 열어 `BLOG_NAME` (티스토리 주소 앞부분)을 입력합니다. Access Token은 다음 단계에서 발급받습니다.

## 티스토리 API 설정 및 토큰 발급

1. **앱 등록**
   - [티스토리 Open API](https://www.tistory.com/guide/api/manage/register) 접속.
   - 앱 등록을 통해 `App ID`와 `Secret Key`를 발급받습니다.
   - **서비스 URL**과 **Callback URL**은 본인의 블로그 주소(예: `https://myblog.tistory.com`)로 설정하세요.

2. **토큰 발급 도우미 실행**
   아래 명령어를 실행하고 화면의 안내를 따르세요.
   ```bash
   python auth_helper.py
   ```
   - 발급받은 `Access Token`을 `.env` 파일의 `TISTORY_ACCESS_TOKEN` 에 붙여넣고 저장하세요.

## 실행 방법

### 스케줄러 실행 (매일 07:00)
```bash
python main.py
```
프로그램이 계속 실행되며, 설정된 시간에 자동으로 글을 작성합니다.

### 즉시 실행 (테스트)
```bash
python main.py --run-now
```
스케줄과 상관없이 프로그램을 즉시 1회 실행합니다.

## 주의사항
- 초기에 포스팅은 비공개(Private)로 설정되어 있습니다. `main.py`의 `visibility=0` 부분을 `3`으로 변경하면 공개로 발행됩니다.
- 구글 트렌드 API 호출이 잦으면 일시적으로 차단될 수 있습니다.
