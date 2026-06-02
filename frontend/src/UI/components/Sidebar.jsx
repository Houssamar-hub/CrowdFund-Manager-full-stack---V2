import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { FiGrid, FiFolder, FiPlusCircle, FiLogOut } from "react-icons/fi";

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }
    console.log("USER =>", user);
    return (
        <div className="sidebar">
            <div>
                <div className="logo">
                    <h1>CrowdFund</h1>
                    <p>PROJECT MANAGER</p>
                </div>

                <nav className="nav-links">
                    <NavLink to="/" className="nav-item">
                        <FiGrid />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/projects" className="nav-item">
                        <FiFolder />
                        <span>Projects</span>
                    </NavLink>
                    {user?.role !== "investor" && (
                        <NavLink to="/create-project" className="nav-item">
                            <FiPlusCircle />
                            <span>Create Project</span>
                        </NavLink>
                    )}
                </nav>
            </div>

            <div className="bottom-section">
                <div className="profile">
                    <div className="avatar">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                        <h4>{user?.name || "User"}</h4>
                        <p>{user?.email || "user@example.com"}</p>
                    </div>
                </div>

                <button className="logout-btn" onClick={handleLogout}>
                    <FiLogOut />
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
