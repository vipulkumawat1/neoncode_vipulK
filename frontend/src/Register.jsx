import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("neoncode_token", data.token);

      localStorage.setItem(
        "neoncode_user",
        JSON.stringify(data.user)
      );

      setMessage("Account created successfully!");

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
    <div className="register-page">
      <div className="register-container">

        <div className="register-brand">
          <span>&gt;_</span> NEONCODE
        </div>

        <div className="register-label">
          &gt; CREATE_ACCOUNT
        </div>

        <div className="register-card">

          <div className="register-header">
            <h1>Create your account.</h1>
          </div>

          <div className="register-divider"></div>

          <form onSubmit={handleSubmit}>

            <div className="register-input-group">
              <label>NAME</label>

              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="register-input-group">
              <label>EMAIL</label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="register-input-group">
              <label>PASSWORD</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="register-input-group">
              <label>CONFIRM PASSWORD</label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {message && (
              <div className="register-message">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
              <span>→</span>
            </button>

          </form>

          <div className="login-link">
            Already have an account?
            <Link to="/login"> Login</Link>
          </div>

          <div className="register-security">
            <span></span>
            SECURE CONNECTION
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;