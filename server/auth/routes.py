from flask import redirect, url_for, jsonify, request
from flask_dance.contrib.google import make_google_blueprint, google
import os
import requests

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_url="http://localhost:3000",
)

@google_bp.route("/login/google/authorized")
def google_login():
    try:
        if not google.authorized:
            return redirect(url_for("google.login"))
        resp = google.get("/oauth2/v2/userinfo")
        assert resp.ok, resp.text
        user_info = resp.json()
        return jsonify(user_info)
    except Exception as e:
        print("Error during Google login:", str(e))
        return jsonify({"error": str(e)}), 500


@google_bp.route("/login/user", methods=["GET"])
def get_user():
    if not google.authorized:
        return jsonify({"error": "User not authorized"}), 401
    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        return jsonify({"error": resp.text}), resp.status_code
    return jsonify(resp.json())

@google_bp.route("/oauth/token", methods=["POST"])
def exchange_token():
    code = request.json.get("code")
    token_url = "https://oauth2.googleapis.com/token"
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = "http://localhost:3000"

    data = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }

    resp = requests.post(token_url, data=data)
    return resp.json()
