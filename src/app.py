from flask import Flask, render_template, jsonify, request
import requests
import json
import time
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

# Configure OAuth2 access token for authorization
ACCESS_TOKEN = os.getenv('STRAVA_ACCESS_TOKEN')

@app.route('/')
def home():
    return render_template('layout.html')

@app.route('/activities')
def activities_page():
    return render_template('activities.html')

@app.route('/api/get_activities')
def get_activities():
    # Parameters for the API call
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=10, type=int)
    
    # Prepare the API request
    url = "https://www.strava.com/api/v3/athlete/activities"
    
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    params = {
        "page": page,
        "per_page": per_page
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 400

@app.route('/api/create_activity', methods=['POST'])
def create_activity():
    data = request.json
    
    # Extract parameters from request with defaults
    name = data.get('name', 'idk')
    sport_type = data.get('sportType', 'run_ex')
    start_date_local = data.get('startDateLocal', '2023-10-01T00:00:00Z')
    elapsed_time = data.get('elapsedTime', 56)
    activity_type = data.get('type', 'run_ex')
    description = data.get('description', 'n/a')
    distance = data.get('distance', 3.4)
    trainer = data.get('trainer', 56)
    commute = data.get('commute', 56)
    
    # Prepare the API request
    url = "https://www.strava.com/api/v3/activities"
    
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "name": name,
        "sport_type": sport_type,
        "start_date_local": start_date_local,
        "elapsed_time": elapsed_time,
        "type": activity_type,
        "description": description,
        "distance": distance,
        "trainer": bool(trainer),
        "commute": bool(commute)
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()  # Raise an exception for 4XX/5XX responses
        return jsonify(response.json()), 201
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    try:
        app.run(host='127.0.0.1', port=8080, debug=True)
    except PermissionError:
        print("Permission denied when accessing port 909.")
        print("Try using a different port (e.g., 8080) or running with sudo/admin privileges.")
        # Alternative: Try a different port that doesn't require elevated permissions
        print("Attempting to use alternative port 8080...")
        app.run(host='127.0.0.1', port=8080, debug=True)