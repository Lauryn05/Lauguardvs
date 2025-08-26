from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import traceback

from custom_adversarial_detector.detector import is_adversarial

load_dotenv()

# Point Flask to React files
app = Flask(
    __name__,
    static_folder=os.path.join(os.path.dirname(__file__), '../Lauguard/dist'),
    static_url_path=''
)
CORS(app)

# QUERY AIML API FUNCTION
def query_aimlapi(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {os.getenv('AIMLAPI_KEY')}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}]
    }
    response = requests.post("https://api.aimlapi.com/v1/chat/completions",
                             headers=headers, json=payload)
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

# API ENDPOINTS
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    prompt = data.get("message", "")

    if is_adversarial(prompt):
        return jsonify({"response": "This prompt has been blocked by the system's security filters."})

    try:
        response = query_aimlapi(prompt)
        return jsonify({"response": response})
    except Exception as e:
        print("Error querying AIMLAPI:", e)
        traceback.print_exc()
        return jsonify({"response": "There was an error processing your request."}), 500


# FRONTEND ROUTE (React build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
