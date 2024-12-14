import React from "react";

const Login: React.FC = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:5001/login/google";
    };

    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:5001/login/user", {
                credentials: "include",
            });
            if (response.ok) {
                const userData = await response.json();
                console.log("User data:", userData);
            } else {
                console.error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Login with Google</h1>
            <button onClick={handleLogin} style={{ marginRight: "10px", padding: "10px 20px" }}>
                Login
            </button>
            <button onClick={fetchUserData} style={{ padding: "10px 20px" }}>
                Fetch User Data
            </button>
        </div>
    );
};

export default Login;
