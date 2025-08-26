import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

AIMLAPI_KEY = os.getenv("AIMLAPI_KEY")

def test_aimlapi(prompt: str):
    headers = {
        "Authorization": f"Bearer {AIMLAPI_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post("https://api.aimlapi.com/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        reply = response.json()['choices'][0]['message']['content']
        print("AIMLAPI Response:", reply)
    except Exception as e:
        print("🚨 Failed to connect to AIMLAPI:", e)
        import traceback
        traceback.print_exc()

# Test
test_aimlapi("What's the capital of Kenya?")
