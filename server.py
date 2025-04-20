from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import jwt
import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'  # Change this in production

# Configure CORS to allow requests from Live Server
CORS(app, resources={r"/*": {"origins": ["http://localhost:5500", "http://127.0.0.1:5500"]}})

# In-memory user database (replace with a real database in production)
users = {
    "user1": {
        "id": "user1",
        "name": "Test User"
    }
}

# Serve static files
@app.route('/<path:path>')
def serve_static(path):
    if path == "" or path == "/":
        return send_from_directory('.', 'index.html')
    return send_from_directory('.', path)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'token' not in data:
        return jsonify({"error": "Missing token"}), 400
    
    # In a real application, you would verify the token against the user's secret
    # Here we just accept any token that was already verified client-side
    
    # Generate JWT
    token = jwt.encode({
        'userId': 'user1',  # In a real app, use actual user ID
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }, app.config['SECRET_KEY'])
    
    return jsonify({"token": token})

@app.route('/validate-token', methods=['GET'])
def validate_token():
    auth_header = request.headers.get('Authorization')
    
    if not auth_header:
        return jsonify({"error": "Missing authorization header"}), 401
    
    try:
        # Extract the token from the Authorization header
        token = auth_header.split(" ")[1]
        
        # Decode and verify the token
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        
        # Get user data
        user_id = data['userId']
        
        if user_id not in users:
            return jsonify({"error": "User not found"}), 404
        
        return jsonify({
            "userId": user_id,
            "name": users[user_id]["name"]
        })
    
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except (jwt.InvalidTokenError, IndexError):
        return jsonify({"error": "Invalid token"}), 401

if __name__ == '__main__':
    app.run(debug=True, port=5000)