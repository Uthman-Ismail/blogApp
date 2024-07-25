import React from "react"
import { Link } from "react-router-dom";
import '../style/header.css'
import log from '../assest/blog_logo.png';
const Header = () => {
    return (
    <header>
        <div className="logo">
           <Link to="/">
            <img src={log}  alt="Blog Logo"/>
           </Link>
        </div>
        <div className="nav">
            <Link to="/">About</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
        </div>
    </header>
    );
}

export default Header;