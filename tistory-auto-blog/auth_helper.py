import requests
import webbrowser

def get_access_token():
    print("=== Tistory Access Token 발급 도우미 ===")
    print("1. 티스토리 Open API(https://www.tistory.com/guide/api/manage/register)에서 앱을 등록하세요.")
    print("   - 서비스 URL: 본인 블로그 주소 (예: https://myblog.tistory.com)")
    print("   - Callback URL: 본인 블로그 주소로 설정하세요.")
    
    app_id = input("App ID (Client ID)를 입력하세요: ").strip()
    secret_key = input("Secret Key를 입력하세요: ").strip()
    redirect_uri = input("Callback URL (등록한 리디렉션 주소)을 입력하세요: ").strip()
    
    # 1. Authorization Code Request
    auth_url = f"https://www.tistory.com/oauth/authorize?client_id={app_id}&redirect_uri={redirect_uri}&response_type=code"
    print(f"\n[1단계] 아래 URL을 브라우저에서 열어 '허용하기'를 누르세요.\n{auth_url}")
    webbrowser.open(auth_url)
    
    code = input("\n[2단계] 리디렉션된 주소창의 URL 끝에 있는 'code=' 뒤의 값을 복사해서 입력하세요: ").strip()
    
    # 2. Access Token Request
    token_url = "https://www.tistory.com/oauth/access_token"
    params = {
        'client_id': app_id,
        'client_secret': secret_key,
        'redirect_uri': redirect_uri,
        'code': code,
        'grant_type': 'authorization_code'
    }
    
    response = requests.get(token_url, params=params)
    
    if response.status_code == 200:
        # Response text format: access_token=...
        token = response.text.split('=')[1]
        print(f"\n✅ Access Token 발급 성공!\n\n{token}\n")
        print("이 토큰을 .env 파일에 TISTORY_ACCESS_TOKEN 값으로 저장하세요.")
        return token
    else:
        print(f"\n❌ 발급 실패. 응답 내용: {response.text}")
        return None

if __name__ == "__main__":
    get_access_token()
