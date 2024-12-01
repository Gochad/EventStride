import React from "react";
import OAuth2Login from "react-oauth2-login";

const OAuthLogin: React.FC = () => {
  const onSuccess = (response: any) => {
    console.log("Login Successful:", response);

    fetch("http://localhost:5000/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: response.authorizationCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Token:", data);
      })
      .catch(console.error);
  };

  const onFailure = (error: any) => {
    console.error("Login Failed:", error);
  };

  return (
    <OAuth2Login
      authorizationUrl="https://accounts.google.com/o/oauth2/auth"
      responseType="code"
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ""}
      redirectUri="http://localhost:3000"
      onSuccess={onSuccess}
      onFailure={onFailure}
    />
  );
};

export default OAuthLogin;
