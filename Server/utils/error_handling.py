from flask import jsonify

def handle_bad_request(message="Bad request."):
    """Handle 400 Bad Request errors."""
    response = jsonify({
        "error": "Bad Request",
        "message": message
    })
    response.status_code = 400
    return response

def handle_unauthorized(message="Unauthorized access."):
    """Handle 401 Unauthorized errors."""
    response = jsonify({
        "error": "Unauthorized",
        "message": message
    })
    response.status_code = 401
    return response

def handle_forbidden(message="Forbidden access."):
    """Handle 403 Forbidden errors."""
    response = jsonify({
        "error": "Forbidden",
        "message": message
    })
    response.status_code = 403
    return response

def handle_not_found(message="Resource not found."):
    """Handle 404 Not Found errors."""
    response = jsonify({
        "error": "Not Found",
        "message": message
    })
    response.status_code = 404
    return response

def handle_internal_error(message="An unexpected error occurred."):
    """Handle 500 Internal Server errors."""
    response = jsonify({
        "error": "Internal Server Error",
        "message": message
    })
    response.status_code = 500
    return response

def handle_validation_error(errors):
    """Handle validation errors."""
    response = jsonify({
        "error": "Validation Error",
        "message": "The request contains invalid data.",
        "details": errors
    })
    response.status_code = 400
    return response
