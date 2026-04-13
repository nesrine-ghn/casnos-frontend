import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Loginform from "../components/Loginform"
import "../styles/register.css"
import bgImage from "../assets/images/blue.jpg"
import logo from "../assets/images/logo-01.png"

function Login(){
    
  return(
    <div className="register-page">

      {/* LEFT IMAGE */}
      <div className="left-section">
        <img src={bgImage} className="bg-img" />
        <img src={logo} className="logo" />

        <div className="side-menu">

            <NavLink 
                to="/" 
                className={({isActive}) => 
                isActive ? "menu-item active" : "menu-item"
                }
            >
                Register
            </NavLink>

            <NavLink 
                to="/login" 
                className={({isActive}) => 
                isActive ? "menu-item active" : "menu-item"
                }
            >
                Log in
            </NavLink>

        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="right-section">
        <Loginform />
      </div>
      
    </div>
  )
}

export default Login