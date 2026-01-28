import requests

urls = [
    "https://trends.google.com/trends/trendingsearches/daily/rss?geo=KR",
    "https://trends.google.co.kr/trends/trendingsearches/daily/rss?geo=KR",
    "https://trends.google.com/trending/rss?geo=KR",
    "https://trends.google.com/trends/hottrends/atom/feed?pn=p23",
    "https://trends.google.com/trends/api/dailytrends?hl=ko&geo=KR",
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Connection': 'keep-alive',
}

for url in urls:
    try:
        print(f"Testing {url}...")
        resp = requests.get(url, headers=headers, timeout=5)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Content start:", resp.text[:100])
            print("SUCCESS w/ URL:", url)
        else:
            print("Failed.")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)
