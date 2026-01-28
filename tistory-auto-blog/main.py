import schedule
import time
import os
import sys
from dotenv import load_dotenv
from datetime import datetime

# Local modules
from trends import get_google_trends
from content import generate_blog_post
from tistory_api import TistoryClient

# Load environment variables
load_dotenv()

TISTORY_ACCESS_TOKEN = os.getenv("TISTORY_ACCESS_TOKEN")
BLOG_NAME = os.getenv("BLOG_NAME")

def job():
    print(f"\n[Job Started] {datetime.now()}")
    
    # 1. Fetch Trends
    try:
        print("Fetching Google Trends...")
        trends = get_google_trends()
        if not trends:
            print("No trends found. Aborting.")
            return
        print(f"Fetched {len(trends)} trends.")
    except Exception as e:
        print(f"Error fetching trends: {e}")
        return

    # 2. Generate Content
    try:
        print("Generating blog post content...")
        title, content = generate_blog_post(trends)
    except Exception as e:
        print(f"Error generating content: {e}")
        return

    # 3. Post to Tistory
    if not TISTORY_ACCESS_TOKEN or not BLOG_NAME:
        print("Missing TISTORY_ACCESS_TOKEN or BLOG_NAME in .env. Skipping upload.")
        print("Generated Title:", title)
        # print("Generated Content:", content[:100] + "...")
        return

    try:
        print("Posting to Tistory...")
        client = TistoryClient(TISTORY_ACCESS_TOKEN, BLOG_NAME)
        # Default visibility=0 (Secret), set to 3 for Public
        url = client.post_article(title, content, visibility=0)
        
        if url:
            print(f"Successfully posted! URL: {url}")
        else:
            print("Failed to post article.")
    except Exception as e:
        print(f"Error posting to Tistory: {e}")

    print(f"[Job Finished] {datetime.now()}")

def run_scheduler():
    print("=== Tistory Automation Bot Started ===")
    print("Scheduling job for 07:00 KST daily.")
    
    # Schedule the job
    schedule.every().day.at("07:00").do(job)
    
    # Initial check (optional: run immediately for test if arg provided)
    if len(sys.argv) > 1 and sys.argv[1] == '--run-now':
        print("Running immediately due to --run-now flag.")
        job()

    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    run_scheduler()
