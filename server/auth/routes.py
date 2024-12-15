from flask import Flask, redirect, url_for, jsonify, session
from flask_dance.contrib.google import make_google_blueprint, google
from flask_cors import CORS
import os
import requests

google_bp = make_google_blueprint(
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    redirect_url="http://localhost:3000",
)

@google_bp.route("/authorized")
def google_login():
    try:
        if not google.authorized:
            print("User not authorized. Redirecting to Google login.")
            return redirect(url_for("google.login"))

        resp = google.get("/oauth2/v2/userinfo")
        if not resp.ok:
            print("Error fetching user info:", resp.text)
            return jsonify({"error": resp.text}), resp.status_code

        user_info = resp.json()
        session["user"] = user_info
        print("User info saved in session:", user_info)
        return redirect("http://localhost:3000")
    except Exception as e:
        print("Error during Google login:", str(e))
        return jsonify({"error": str(e)}), 500

@google_bp.route("/user", methods=["GET"])
def get_user():
    if "google_oauth_token" not in session:
        print("No OAuth token found in session. User not logged in.")
        return jsonify({"error": "User not logged in"}), 401

    try:
        resp = google.get("/oauth2/v2/userinfo")
        if not resp.ok:
            print("Error fetching user info from Google:", resp.text)
            return jsonify({"error": resp.text}), resp.status_code

        user_info = resp.json()
        print("User info fetched from Google:", user_info)
        return jsonify({"user": user_info})

    except Exception as e:
        print("Error during fetching user info:", str(e))
        return jsonify({"error": str(e)}), 500


@google_bp.route("/logout", methods=["GET"])
def logout():
    try:
        if google.authorized:
            token = session.get("google_oauth_token", {}).get("access_token")
            if token:
                revoke_url = "https://oauth2.googleapis.com/revoke"
                requests.post(revoke_url, params={"token": token}, headers={"content-type": "application/x-www-form-urlencoded"})
                print("Google token revoked.")

        session.clear()
        print("Session cleared. User logged out.")
        return jsonify({"message": "Successfully logged out"}), 200
    except Exception as e:
        print("Error during logout:", str(e))
        return jsonify({"error": str(e)}), 500


@google_bp.route("/debug/session", methods=["GET"])
def debug_session():
    return jsonify({"session": dict(session)})