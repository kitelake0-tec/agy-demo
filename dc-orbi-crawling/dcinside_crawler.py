# =============================================================================
# [디시인사이드 크롤러 - 본문 추출 강화 & 커스텀 정렬 버전]
# - 기능: 키워드 검색 + 날짜 지정 + 중복 제거 + CSV 저장
# - 로컬(Antigravity) 작동용: 구글 코랩 관련 라이브러리(files) 제거
# =============================================================================

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
import re
from datetime import datetime
from urllib.parse import quote, urlparse, parse_qs
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ==========================================
# 1. 설정 및 키워드
# ==========================================

# 1-1. 검색할 키워드 (크롤링 대상)
SEARCH_KEYWORDS = [
    "러셀", "대성", "이투스", "메가", "재종", 
    "관리형독서실", "관독", "시대인재", "독학재수", "기숙학원"
]

# 1-2. 정렬 순서 (CSV 저장 시 이 순서대로 정렬됨)
CUSTOM_SORT_ORDER = [
    "러셀", "대성", "이투스", "메가", "재종",
    "관리형독서실", "관독", "시대인재", "독학재수", "기숙학원", "기타"
]

# 1-3. 포함할 URL 키워드 (화이트리스트)
TARGET_URL_KEYWORDS = [
    "russelmg", "hanmath", "itall", "exam_new2",
    "csatlecture", "sdijn", "dshw", "etoos",
    "kanganedu", "hwatwo", "waterlee1"
]

# 1-4. 제외할 URL 키워드 (블랙리스트)
EXCLUDE_URL_KEYWORDS = [
    "whiskey", "americanbasketball", "jumbos", "jworg", 
    "volleyballman", "nasdaq", "stockus", "tenbagger", 
    "krstock", "sls", "loleague1", "of", "formula1", 
    "dow100", "m2liquidity", "w_entertainer", "bigbangvip", 
    "aichatting", "flowerroad", "hiphop_new1", "daesung", "blackwhites2"
]

# 1-5. 옵션
FETCH_BODY = True       
BODY_MAX_CHARS = 5000   
POST_DELAY = (0.5, 1.2) 

# ==========================================
# 2. 크롤링 엔진 (URL 변환 및 본문 추출 로직 이식)
# ==========================================

def clean_text(text: str) -> str:
    if not text: return ""
    text = text.strip()
    text = re.sub(r'[\u200b\u3000]', ' ', text)
    text = re.sub(r'[\r\n]+', '\n', text)
    return text

def build_session() -> requests.Session:
    s = requests.Session()
    retry = Retry(
        total=3, backoff_factor=1, 
        status_forcelist=[500, 502, 503, 504], allowed_methods=["GET"]
    )
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.headers.update({
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
        "Referer": "https://m.dcinside.com/"
    })
    return s

def is_valid_url(link: str) -> bool:
    if not link: return False
    for exc in EXCLUDE_URL_KEYWORDS:
        if exc in link: return False
    if TARGET_URL_KEYWORDS:
        found = False
        for tgt in TARGET_URL_KEYWORDS:
            if tgt in link: 
                found = True
                break
        if not found: return False
    return True

# [추가됨] URL에서 id와 no 파싱 (모바일 변환용)
def parse_id_no(link: str):
    try:
        u = urlparse(link)
        q = parse_qs(u.query)
        gid = q.get("id", [None])[0]
        no = q.get("no", [None])[0]
        
        # 쿼리 파라미터에 없으면 경로에서 탐색
        if not gid or not no:
            parts = u.path.split('/')
            if 'id' in parts and 'no' in parts: 
                gid = parts[parts.index('id')+1]
                no = parts[parts.index('no')+1]
            elif 'board' in parts and len(parts) >= 4:
                 # /board/id/no 형식일 경우
                 try:
                    gid = parts[parts.index('board')+1]
                    no = parts[parts.index('board')+2]
                 except: pass
                 
        return gid, no
    except:
        return None, None

# [추가됨] PC 주소 등을 모바일 주소로 강제 변환
def convert_to_mobile_url(link: str) -> str:
    gid, no = parse_id_no(link)
    if gid and no:
        return f"https://m.dcinside.com/board/{gid}/{no}"
    return link

def extract_body_mobile(html: str) -> str:
    if not html: return ""
    soup = BeautifulSoup(html, "lxml")

    if "삭제된 게시물" in html: return "[삭제된 게시물]"
    if "존재하지 않는 게시물" in html: return "[존재하지 않는 게시물]"
    
    # [요청하신 선택자 반영]
    selectors = [
        "div.thum-txt",         
        "div.thum-txtin",       
        "div.writing_view_box", 
        "div.view_content_wrap" 
    ]
    
    body_el = None
    for sel in selectors:
        body_el = soup.select_one(sel)
        if body_el: break
            
    if not body_el: return "" 

    for tag in body_el.select("script, style, img, video, iframe, .recomm_btn_box"):
        tag.decompose()

    text = body_el.get_text("\n", strip=True)
    return clean_text(text)[:BODY_MAX_CHARS]

def fetch_post_body(session, link: str):
    # [수정됨] URL을 모바일로 변환 후 요청
    target_url = convert_to_mobile_url(link)
    
    try:
        time.sleep(random.uniform(*POST_DELAY))
        resp = session.get(target_url, timeout=10)
        
        if resp.status_code == 200:
            return extract_body_mobile(resp.text)
        return ""
    except Exception:
        return ""

def parse_date(date_str):
    now = datetime.now()
    date_str = date_str.strip()
    try:
        match_full = re.search(r'(\d{4})\.(\d{1,2})\.(\d{1,2})', date_str)
        if match_full:
            year, month, day = map(int, match_full.groups())
            return datetime(year, month, day)

        match_short = re.search(r'(\d{1,2})\.(\d{1,2})', date_str)
        if match_short:
            month, day = map(int, match_short.groups())
            parsed_date = datetime(now.year, month, day)
            if parsed_date > now:
                parsed_date = parsed_date.replace(year=now.year - 1)
            return parsed_date

        if ':' in date_str:
            return datetime(now.year, now.month, now.day)
            
        return now
    except:
        return now

# ==========================================
# 3. CSV 저장 (로컬 환경 맞춤 수정)
# ==========================================
def save_local_csv(df):
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    filename = f"dcinside_crawling_{timestamp}.csv"
    
    print(f"\n💾 CSV 파일로 저장 중... ({filename})")
    df.to_csv(filename, index=False, encoding='utf-8-sig')
    print(f"✅ 파일 저장이 완료되었습니다: {filename}")
    print("💡 작업 경로에서 확인하실 수 있습니다.")

# ==========================================
# 4. 메인 실행 로직
# ==========================================
def get_user_cutoff_date():
    while True:
        print("\n" + "="*50)
        print("💡 팁: '2026-01-05' 입력 시, 1월 5일 글까지 수집합니다.")
        date_input = input("📅 언제까지의 데이터를 수집할까요? (YYYY-MM-DD)\n👉 입력: ").strip()
        
        if not date_input:
            print("⚠️ 날짜를 입력해주세요.")
            continue
        try:
            return datetime.strptime(date_input, "%Y-%m-%d")
        except ValueError:
            print("❌ 형식이 올바르지 않습니다.")

def run_keyword_crawler(cutoff_date_str=None):
    if cutoff_date_str:
        cutoff_dt = datetime.strptime(cutoff_date_str, "%Y-%m-%d")
    else:
        cutoff_dt = get_user_cutoff_date()
    cutoff_str = cutoff_dt.strftime("%Y-%m-%d")
    
    session = build_session()
    all_results = []
    
    print("\n" + "="*60)
    print(f"🚀 크롤링 시작 (목표: {cutoff_str} 까지)")
    print(f"🔍 키워드: {', '.join(SEARCH_KEYWORDS)}")
    print("="*60)

    for keyword in SEARCH_KEYWORDS:
        print(f"\n▶️ [{keyword}] 수집 중...")
        page = 1
        keep_crawling = True
        
        while keep_crawling:
            encoded_keyword = quote(keyword)
            # 검색은 모바일 페이지가 아닌 PC 검색 페이지를 사용 (정렬 및 페이징이 용이함)
            url = f"https://search.dcinside.com/post/p/{page}/sort/date/q/{encoded_keyword}"
            
            try:
                time.sleep(random.uniform(*POST_DELAY))
                # 검색 페이지 요청 시 헤더를 잠시 PC용으로 변경하거나 호환 헤더 사용
                search_headers = session.headers.copy()
                search_headers['User-Agent'] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                
                resp = session.get(url, headers=search_headers, timeout=10)
                if resp.status_code != 200: break
                
                soup = BeautifulSoup(resp.text, 'html.parser')
                posts = soup.select(".sch_result_list > li")
                
                if not posts: break
                
                valid_count = 0
                for post in posts:
                    date_tag = post.select_one("span.date_time")
                    if not date_tag: continue
                    
                    post_date = parse_date(date_tag.text)
                    
                    if post_date < cutoff_dt:
                        print(f"   🛑 {post_date.strftime('%Y-%m-%d')} 발견. 설정일 도달로 정지.")
                        keep_crawling = False
                        break
                    
                    title_tag = post.select_one("a.tit_txt")
                    if not title_tag: continue
                    title = clean_text(title_tag.text)
                    link = title_tag['href']

                    if not is_valid_url(link): continue

                    body = ""
                    if FETCH_BODY:
                        # 여기서 convert_to_mobile_url이 포함된 fetch_post_body 실행
                        body = fetch_post_body(session, link)
                    
                    row = {
                        "월": str(post_date.month),
                        "일": str(post_date.day),
                        "커뮤니티": "디시인사이드",
                        "타사명/키워드": keyword,
                        "제목": title,
                        "본문(내용)": body,
                        "URL": link,
                        "_sort_date": post_date # 정렬용 임시 컬럼
                    }
                    all_results.append(row)
                    valid_count += 1
                
                print(f"   ✅ {page}페이지: {valid_count}건")
                page += 1
                if page > 50: break
                    
            except Exception as e:
                print(f"   ❌ 에러: {e}")
                break

    if not all_results:
        print("\n⚠️ 수집된 데이터가 없습니다.")
        return

    df = pd.DataFrame(all_results)
    
    # 중복 제거
    df.drop_duplicates(subset=['제목', '본문(내용)'], keep='first', inplace=True)
    
    # ==========================================
    # [중요] 사용자 지정 정렬 로직 적용
    # ==========================================
    # 1. '타사명/키워드'를 Categorical 타입으로 변환하여 순서 지정
    df['타사명/키워드'] = pd.Categorical(
        df['타사명/키워드'], 
        categories=CUSTOM_SORT_ORDER, 
        ordered=True
    )
    
    # 2. 정렬: 날짜 오름차순(True) -> 키워드 지정순서(True)
    # 날짜 오름차순: 1월 5일이 1월 6일보다 먼저 나옴
    df = df.sort_values(by=['_sort_date', '타사명/키워드'], ascending=[True, True])
    
    # 최종 저장용 컬럼 정리 (본문이 먼저 나오도록)
    final_cols = ['월', '일', '커뮤니티', '타사명/키워드', '제목', '본문(내용)', 'URL']
    
    # 없는 컬럼 채우기
    for col in final_cols:
        if col not in df.columns: df[col] = ""
    
    # 로컬 경로에 CSV 저장 호출
    save_local_csv(df[final_cols])

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        run_keyword_crawler(sys.argv[1])
    else:
        run_keyword_crawler()
