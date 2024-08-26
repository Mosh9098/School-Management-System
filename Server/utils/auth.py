from flask import current_app, jsonify, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import datetime

# Initialize JWT Manager
jwt = JWTManager()

def init_jwt(app):
    jwt.init_app(app)

    # Error Handling for JWT
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return make_response(jsonify({"msg": "Missing or invalid token"}), 401)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return make_response(jsonify({"msg": "Token has expired"}), 401)

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return make_response(jsonify({"msg": "Invalid token"}), 422)

def generate_jwt(user_id):
    """Generate a new JWT token."""
    access_token = create_access_token(identity=user_id, expires_delta=datetime.timedelta(hours=1))
    return access_token

def verify_jwt(token):
    """Verify a JWT token and return the user_id if valid."""
    try:
        decoded_token = jwt.decode_token(token)
        return decoded_token['identity']
    except Exception as e:
        print(f"Token verification error: {e}")
        return None
