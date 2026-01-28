import requests
import json

class TistoryClient:
    def __init__(self, access_token, blog_name):
        self.access_token = access_token
        self.blog_name = blog_name
        self.base_url = "https://www.tistory.com/apis"

    def post_article(self, title, content, visibility=0, category_id=0):
        """
        Posts an article to Tistory.
        visibility: 0 (Private), 1 (Protected), 3 (Public)
        """
        url = f"{self.base_url}/post/write"
        params = {
            'access_token': self.access_token,
            'output': 'json',
            'blogName': self.blog_name,
            'title': title,
            'content': content,
            'visibility': visibility,
            'category': category_id
        }
        
        try:
            response = requests.post(url, data=params)
            response.raise_for_status()
            result = response.json()
            
            if result.get('tistory', {}).get('status') == '200':
                return result['tistory']['url']
            else:
                raise Exception(f"Tistory API Error: {result}")
                
        except Exception as e:
            print(f"Error posting to Tistory: {e}")
            return None

    def get_categories(self):
        url = f"{self.base_url}/category/list"
        params = {
            'access_token': self.access_token,
            'output': 'json',
            'blogName': self.blog_name
        }
        response = requests.get(url, params=params)
        return response.json()
