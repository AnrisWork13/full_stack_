from flask import Flask, jsonify, request
import psycopg2
import jwt
import os
from flask_cors import CORS
from datetime import datetime, timedelta
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuring environment variables (DB credentials, JWT secret)
SECRET_KEY = os.getenv('SECRET_KEY', '8f1ddff15a0e11772a53a4a3fc552c16afebad52ca2389df')  # Use environment variable for secret key
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', 5432)
DB_NAME = os.getenv('DB_NAME', 'sales_weather_cognitive_')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'Anris177')  # Use environment variable for password

app = Flask(__name__)

# CORS setup: Allow requests from React frontend running on 127.0.0.1:3000
CORS(app, origins=["http://127.0.0.1:3000"], methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

# Creating a database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    return conn

# Decorator for JWT token verification
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            expiration_time = datetime.utcfromtimestamp(decoded_token['exp'])
            if expiration_time < datetime.utcnow():
                return jsonify({"message": "Token has expired!"}), 403
            if decoded_token['sub'] != 'admin':
                return jsonify({"message": "Unauthorized!"}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 403
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 403

        return f(*args, **kwargs)

    return decorated_function

# Validate data before insertion
def validate_data(data):
    required_fields = [
        "date", "Sales (Units)", "Temperature", "Rainfall", "Humidity",
        "Wind Speed", "Mood Score", "Stress", "Productivity",
        "Sleep Quality", "Social Interaction", "Cognitive Focus"
    ]

    for field in required_fields:
        if field not in data:
            return f"Missing field: {field}"

    if not isinstance(data["Sales (Units)"], int) or data["Sales (Units)"] <= 0:
        return "Sales (Units) must be a positive integer."

    if not isinstance(data["Temperature"], (int, float)) or data["Temperature"] < -100 or data["Temperature"] > 100:
        return "Temperature should be a valid number between -100 and 100."

    return None  # Return None if no errors

# API to fetch data (GET)
@app.route('/data', methods=['GET'])
@token_required
def get_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM sales_weather_cognitive_data LIMIT 10')
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    if data:
        return jsonify(data)
    else:
        return jsonify({"message": "No data found"}), 404

# API to fetch specific column data (GET)
@app.route('/data/<column_name>', methods=['GET'])
@token_required
def get_column_data(column_name):
    try:
        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get data for the specific column
        query = f"""
        SELECT "date", "{column_name}" 
        FROM sales_weather_cognitive_data;
        """
        
        cursor.execute(query)
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        # Check if data is found
        if data:
            return jsonify(data), 200
        else:
            return jsonify({"message": f"No data found for column: {column_name}"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to add data (POST)
@app.route('/data', methods=['POST'])
@token_required
def add_data():
    data = request.get_json()

    # Validate data before insertion
    validation_error = validate_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
        INSERT INTO sales_weather_cognitive_data(
            "date", "Sales (Units)", "Temperature", "Rainfall", "Humidity",
            "Wind Speed", "Mood Score", "Stress", "Productivity", "Sleep Quality", 
            "Social Interaction", "Cognitive Focus"
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """

        cursor.execute(insert_query, (
            data['date'],
            data['Sales (Units)'],
            data['Temperature'],
            data['Rainfall'],
            data['Humidity'],
            data['Wind Speed'],
            data['Mood Score'],
            data['Stress'],
            data['Productivity'],
            data['Sleep Quality'],
            data['Social Interaction'],
            data['Cognitive Focus']
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Data added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to update data by id (PUT)
@app.route('/data/<int:data_id>', methods=['PUT'])
@token_required
def update_data(data_id):
    data = request.get_json()

    # Validate data before updating
    validation_error = validate_data(data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        update_query = """
        UPDATE sales_weather_cognitive_data
        SET "date" = %s, "Sales (Units)" = %s, "Temperature" = %s, "Rainfall" = %s, 
            "Humidity" = %s, "Wind Speed" = %s, "Mood Score" = %s, "Stress" = %s, 
            "Productivity" = %s, "Sleep Quality" = %s, "Social Interaction" = %s, "Cognitive Focus" = %s
        WHERE id = %s;
        """

        cursor.execute(update_query, (
            data['date'],
            data['Sales (Units)'],
            data['Temperature'],
            data['Rainfall'],
            data['Humidity'],
            data['Wind Speed'],
            data['Mood Score'],
            data['Stress'],
            data['Productivity'],
            data['Sleep Quality'],
            data['Social Interaction'],
            data['Cognitive Focus'],
            data_id
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Data updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to delete data by id (DELETE)
@app.route('/data/<int:data_id>', methods=['DELETE'])
@token_required
def delete_data(data_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        delete_query = """
        DELETE FROM sales_weather_cognitive_data WHERE id=%s;
        """

        cursor.execute(delete_query, (data_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Data deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# API to login and get JWT token (POST)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if data['username'] == 'admin' and data['password'] == 'password':
        token = jwt.encode({
            'sub': 'admin',
            'exp': datetime.utcnow() + timedelta(hours=1),
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({"access_token": token})
    return jsonify({"message": "Invalid credentials"}), 401

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://127.0.0.1:3000')  # React frontend
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=5000)
