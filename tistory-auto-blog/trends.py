import feedparser
import requests
import datetime
import re

def get_google_trends(geo='KR'):
    """
    Fetches daily search trends from Google Trends RSS for the specified geo.
    Returns a list of dictionaries containing keyword, traffic, and related news.
    """
    rss_url = f"https://trends.google.com/trending/rss?geo={geo}"
    
    # Use requests with a browser-like User-Agent to avoid blocking
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(rss_url, headers=headers)
        response.raise_for_status()
        feed = feedparser.parse(response.content)
    except Exception as e:
        print(f"Error fetching RSS: {e}")
        return []
    
    trends = []
    
    for entry in feed.entries:
        # Extract traffic (approximate)
        # feedparser puts custom tags like ht:approx_traffic in 'ht_approx_traffic' usually
        traffic = getattr(entry, 'ht_approx_traffic', 'N/A')
        
        # Extract news title and link
        news_title = getattr(entry, 'ht_news_item_title', '')
        news_url = getattr(entry, 'ht_news_item_url', '')
        
        # PubDate
        pub_date = getattr(entry, 'published', '')
        
        trends.append({
            'keyword': entry.title,
            'traffic': traffic,
            'news_title': news_title,
            'news_url': news_url,
            'pub_date': pub_date
        })
        
    return trends

if __name__ == "__main__":
    # Test execution
    data = get_google_trends()
    print(f"Fetched {len(data)} trends.")
    for item in data[:5]:
        print(item)
