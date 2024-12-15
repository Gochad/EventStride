from flask import redirect, url_for, jsonify, request, session
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
        session["user"] = user_info
        return jsonify(user_info)
    except Exception as e:
        print("Error during Google login:", str(e))
        return jsonify({"error": str(e)}), 500


@google_bp.route("/login/user", methods=["GET"])
def get_user():
    if "user" in session:
        return jsonify({"user": session["user"]})
    elif not google.authorized:
        print("User not authorized in Google session")
        return jsonify({"error": "User not authorized"}), 401

    resp = google.get("/oauth2/v2/userinfo")
    if not resp.ok:
        print("Error fetching user info from Google:", resp.text)
        return jsonify({"error": resp.text}), resp.status_code

    user_info = resp.json()
    session["user"] = user_info
    return jsonify(user_info)


@google_bp.route("/logout", methods=["GET"])
def logout():
    try:
        if google.authorized:
            token = session.get("google_oauth_token")["access_token"]
            revoke_url = "https://oauth2.googleapis.com/revoke"
            requests.post(revoke_url, params={"token": token}, headers={"content-type": "application/x-www-form-urlencoded"})
        
        session.clear()
        return jsonify({"message": "Successfully logged out"}), 200

    except Exception as e:
        print("Error during logout:", str(e))
        return jsonify({"error": str(e)}), 500
