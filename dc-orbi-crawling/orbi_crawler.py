import requests
from bs4 import BeautifulSoup
import datetime
from datetime import datetime
import time
import re
import json
import csv
import os

class OrbiCrawler:
    def __init__(self, keywords, end_date):
        self.keywords = keywords
        self.end_date = datetime.strptime(end_date, "%Y-%m-%d")
        self.base_url = "https://orbi.kr"
        self.search_url = "https://orbi.kr/search"
        self.results = []
        self.crawled_urls = set() # 중복 수집 방지용
        
        # 세션 유지를 위해 Session 객체 사용
        self.session = requests.Session()
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://orbi.kr/"
        }

    def parse_date(self, date_str):
        try:
            if "T" in date_str:
                return datetime.fromisoformat(date_str).replace(tzinfo=None)
            return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")
        except:
            return datetime.now()

    def crawl_keyword(self, keyword):
        print(f"\n>>> '{keyword}' 키워드 크롤링 시작...")
        page = 1
        keep_crawling = True

        while keep_crawling:
            # type=keyword 파라미터 필수 (태그+제목+내용 검색 모드)
            params = {"q": keyword, "type": "keyword", "page": page}
            try:
                response = self.session.get(self.search_url, params=params, headers=self.headers, timeout=10)
                if response.status_code != 200: break

                soup = BeautifulSoup(response.text, "html.parser")
                # ul.post-list 아래의 li 항목들
                post_list = soup.select("ul.post-list > li")

                if not post_list:
                    print(f"더 이상 결과가 없습니다. (페이지 {page})")
                    break

                for post_li in post_list:
                    try:
                        title_elem = post_li.select_one("p.title > a")
                        if not title_elem: continue
                        
                        title = title_elem.get_text(strip=True)
                        href = title_elem['href']
                        # href가 이미 절대 경로거나 /로 시작하는지 확인
                        link = self.base_url + href if href.startswith('/') else f"{self.base_url}/{href}"
                        
                        # 중요: 이미 수집한 URL은 건너뜀 (중복 방지 핵심)
                        # 단, 쿼리 스트링(?q=...)을 제거한 순수 게시글 ID 기반 비교 권장
                        clean_link = link.split('?')[0]
                        if clean_link in self.crawled_urls:
                            continue
                        
                        date_elem = post_li.select_one("p.date abbr")
                        if not date_elem: continue
                        
                        # abbr title에서 @2025-10-09 20:55:29 형식 추출
                        full_date_str = date_elem.get('title', '').replace('@', '').strip()
                        post_date = self.parse_date(full_date_str)

                        if post_date < self.end_date:
                            print(f"설정한 날짜({self.end_date.date()}) 이전 데이터 도달. 중단합니다.")
                            keep_crawling = False
                            break

                        content = self.get_content(link)
                        
                        self.results.append({
                            "연": post_date.year,
                            "월": post_date.month,
                            "일": post_date.day,
                            "커뮤니티(오르비)": "오르비",
                            "타사명/키워드(크롤링 단어)": keyword,
                            "제목": title,
                            "본문(내용)": content,
                            "URL": clean_link,
                            "_date": post_date # 정렬을 위한 임시 필드
                        })
                        self.crawled_urls.add(clean_link)
                        
                    except Exception as e:
                        print(f"항목 파싱 에러: {e}")

                print(f"[{keyword}] {page} 페이지 완료 (누적 수집: {len(self.results)})")
                page += 1
                time.sleep(1.5) # 서버 부하 방지를 위해 지연 시간 소폭 증가
            except Exception as e:
                print(f"네트워크 오류: {e}")
                break

    def get_content(self, url):
        try:
            response = self.session.get(url, headers=self.headers, timeout=10)
            if response.status_code != 200:
                return f"에러(HTTP {response.status_code})"
                
            soup = BeautifulSoup(response.text, "html.parser")
            
            # 본문 추출 로직 강화
            content_wrap = soup.select_one(".content-wrap")
            if content_wrap:
                for unwanted in content_wrap.select(".rare-wrap, .tag-wrap, .author-action-wrap"):
                    unwanted.decompose()
                return content_wrap.get_text("\n", strip=True)
            
            article = soup.select_one("article")
            if article:
                return article.get_text("\n", strip=True)
                
            return "본문 태그를 찾을 수 없음"
        except Exception as e:
            return f"오류 발생: {str(e)}"

    def save_to_csv(self):
        if not self.results:
            print("수집된 데이터가 없습니다.")
            return None
        
        # 정렬: 1순위 날짜(일자), 2순위 키워드 제공 순서, 3순위 상세 시간
        self.results.sort(key=lambda x: (
            x["_date"].date(), 
            self.keywords.index(x["타사명/키워드(크롤링 단어)"]),
            x["_date"]
        ))

        filename = f"orbi_crawl_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        # 헤더에서 임시 필드 제외
        keys = [k for k in self.results[0].keys() if k != "_date"]
        
        with open(filename, 'w', encoding='utf-8-sig', newline='') as f:
            dict_writer = csv.DictWriter(f, fieldnames=keys, extrasaction='ignore')
            dict_writer.writeheader()
            dict_writer.writerows(self.results)
            
        print(f"\n[성공] CSV 파일이 저장되었습니다: {os.path.abspath(filename)}")
        return filename

if __name__ == "__main__":
    import sys
    keywords = ["러셀", "대성", "이투스", "메가", "재종", "관리형독서실", "관독", "독재", "시대인재", "독학재수", "기숙학원"]
    print("========================================")
    print("        오르비 검색 크롤러 v1.2 (CSV)")
    print("========================================")
    
    if len(sys.argv) > 1:
        end_date_input = sys.argv[1]
    else:
        end_date_input = "2026-02-12" # 기본값

    crawler = OrbiCrawler(keywords, end_date_input)
    for kw in keywords:
        crawler.crawl_keyword(kw)
    
    crawler.save_to_csv()
