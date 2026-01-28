from datetime import datetime

def generate_blog_post(trends_data):
    """
    Generates an HTML blog post from the provided trends data.
    """
    now = datetime.now()
    date_str = now.strftime("%Y년 %m월 %d일")
    title = f"{date_str} 한국 실시간 트렌드 검색어 TOP 20"
    
    html_content = f"""
    <div style="font-family: 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333;">
        <h2>📅 {date_str} 오늘의 핫 이슈</h2>
        <p>안녕하세요! 매일 아침, 어제와 오늘 한국에서 가장 뜨거웠던 검색어를 정리해 드립니다.</p>
        <p>구글 트렌드 데이터를 기반으로 선정된 주요 이슈들을 확인해보세요.</p>
        <hr style="border: 0; height: 1px; background: #ccc; margin: 20px 0;">
        <ul style="list-style: none; padding: 0;">
    """
    
    for idx, item in enumerate(trends_data, 1):
        keyword = item.get('keyword', '알 수 없음')
        traffic = item.get('traffic', '')
        news_title = item.get('news_title', '')
        news_url = item.get('news_url', '#')
        
        # Style for traffic badge
        traffic_display = f"<span style='background-color: #f1f3f5; color: #495057; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 8px;'>🔥 {traffic}</span>" if traffic != 'N/A' else ""

        html_content += f"""
        <li style="margin-bottom: 24px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; color: #000;">
                <span style="color: #fa5252; margin-right: 8px;">{idx}.</span> {keyword} {traffic_display}
            </h3>
            {f'<p style="margin: 4px 0;"><a href="{news_url}" target="_blank" style="text-decoration: none; color: #228be6; font-weight: bold;">📰 관련 뉴스: {news_title}</a></p>' if news_title else ''}
        </li>
        """
        
    html_content += """
        </ul>
        <hr style="border: 0; height: 1px; background: #ccc; margin: 20px 0;">
        <p style="text-align: center; color: #868e96; font-size: 0.9em;">
            본 포스팅은 구글 트렌드 데이터를 기반으로 자동 생성되었습니다.<br>
            데이터 집계 시점에 따라 순위가 변동될 수 있습니다.
        </p>
    </div>
    """
    
    return title, html_content

if __name__ == "__main__":
    # Dummy data for testing
    dummy_data = [
        {'keyword': '손흥민', 'traffic': '100,000+', 'news_title': '손흥민 멀티골 폭발', 'news_url': 'http://example.com'},
        {'keyword': '비트코인', 'traffic': '50,000+', 'news_title': '비트코인 신고가 경신', 'news_url': 'http://example.com'},
    ]
    t, c = generate_blog_post(dummy_data)
    print("Title:", t)
    print("Content Length:", len(c))
