import { NavLink } from "react-router-dom";
import MenuBar from "../components/MenuBar";

function UserDashboard() {  
    return (
        <div>
            <MenuBar />
            <h1>User Dashboard</h1>
            <p>This page is accessible to all logged-in users.</p>
        </div>
    );
}
export default UserDashboard;