import React from "react"
import { Link, useNavigate } from "react-router-dom";
import '../style/header.css'
import log from '../assest/blog_logo.png';


const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

   const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); //go to home after logout
  };

    return (
    <header>
        <div className="logo">
           <Link to="/">
            <img src={log}  alt="Blog Logo"/>
           </Link>
        </div>
        <div className="nav">
            <Link to="/">About</Link>
            {token ? (
                    <div>
                        <Link to="/myPost">My Post</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Sign Up</Link>
                    </div>
            )}
        </div>
    </header>
    );
}

export default Header;