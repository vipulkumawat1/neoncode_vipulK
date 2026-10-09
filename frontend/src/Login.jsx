import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");

    if (!formData.email || !formData.password) {
      setMessage("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      localStorage.setItem(
        "neoncode_token",
        data.token
      );

      localStorage.setItem(
        "neoncode_user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);

    } catch (error) {
      console.error(error);

      setMessage(
        "Cannot connect to the backend. Make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-brand">
          <span>&gt;_</span>
          NEONCODE
        </div>

        <div className="auth-label">
          &gt; AUTHENTICATION_REQUIRED
        </div>

        <div className="login-card">

          <div className="login-header">
            <h1>Welcome back.</h1>
            <p>Sign in to continue your coding journey.</p>
          </div>

          <div className="divider"></div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>EMAIL</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group password-group">
              <label>PASSWORD</label>

              <div className="input-wrapper">
                <span className="input-icon">♙</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            {message && (
              <div className="login-message">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
              <span>→</span>
            </button>

          </form>

          <div className="register-section">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create account
            </Link>
          </div>

          <div className="security-section">
            <span className="security-dot"></span>
            SECURE CONNECTION
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;