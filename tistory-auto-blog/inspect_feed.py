import feedparser
import requests

url = "https://trends.google.com/trending/rss?geo=KR"
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

resp = requests.get(url, headers=headers)
feed = feedparser.parse(resp.content)

if feed.entries:
    e = feed.entries[0]
    print("Keys:", e.keys())
    print("Title:", e.title)
    print("Approx Traffic:", getattr(e, 'ht_approx_traffic', 'Not Found'))
    print("News Title:", getattr(e, 'ht_news_item_title', 'Not Found'))
    print("News URL:", getattr(e, 'ht_news_item_url', 'Not Found'))
else:
    print("Feed parsed but no entries found.")
