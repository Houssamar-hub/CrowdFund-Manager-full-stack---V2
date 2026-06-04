import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import { FiGrid, FiFolder, FiPlusCircle, FiLogOut, FiPieChart, FiCreditCard } from "react-icons/fi";

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
    const isInvestor = user?.role === "investor";
    const isOwner = user?.role === "owner";

    return (
        <div className="sidebar">
            <div>
                <div className="logo">
                    <h1>CrowdFund</h1>
                    <p>PROJECT MANAGER</p>
                </div>

                <nav className="nav-links">
                    {/* Dashboard - visible pour tous */}
                    <NavLink to="/" className="nav-item">
                        <FiGrid />
                        <span>Dashboard</span>
                    </NavLink>

                    {/* Projects - visible pour tous */}
                    <NavLink to="/projects" className="nav-item">
                        <FiFolder />
                        <span>Projects</span>
                    </NavLink>

                    {/* Create Project - visible seulement pour les owners */}
                    {isOwner && (
                        <NavLink to="/create-project" className="nav-item">
                            <FiPlusCircle />
                            <span>Create Project</span>
                        </NavLink>
                    )}

                    {/* Portfolio - visible seulement pour les investors */}
                    {isInvestor && (
                        <NavLink to="/portfolio" className="nav-item">
                            <FiPieChart />
                            <span>Portfolio</span>
                        </NavLink>
                    )}

                    {/* Wallet - visible seulement pour les investors */}
                    {isInvestor && (
                        <NavLink to="/wallet" className="nav-item">
                            <FiCreditCard />
                            <span>Wallet</span>
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
                        {/* Afficher le rôle */}
                        <p style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                            {user?.role === 'owner' ? '👑 Project Owner' : '💰 Investor'}
                        </p>
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