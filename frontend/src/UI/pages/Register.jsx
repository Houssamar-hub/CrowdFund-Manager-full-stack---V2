import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/slices/authSlice";
import "../../style/Auth.css";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("investor");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            console.log("✅ User registered, redirecting to dashboard...");
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearError());

        if (!fullName || !email || !password) {
            alert("Please fill in all fields");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            dispatch(
                registerUser({
                    name: fullName,
                    email,
                    password,
                    role
                }),
            );
            const result = registerUser.fulfilled;
            if (registerUser.fulfilled.match(result)) {
                navigate("/login");
            }
            // navigate("/dashboard");
        } catch (err) {
            console.error("Register error:", err);
            // Afficher un message d'erreur plus clair
            if (err?.message && err.message.includes("duplicate key")) {
                alert(
                    "This email is already registered. Please use a different email or login.",
                );
            } else if (err?.message) {
                alert(err.message);
            } else {
                alert("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Get Started</h1>
                <p className="subtitle">
                    Create your account to start managing projects
                </p>

                {error && (
                    <div className="error-message">
                        {error.includes("duplicate")
                            ? "This email is already registered. Please login instead."
                            : error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create password (min 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Role</label>

                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            disabled={isLoading}
                        >
                            <option value="investor">Investor</option>
                            <option value="owner">Project Owner</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className="bottom-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
