import { Autocomplete, TextField } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import api from "../utils/axios";
import {useEffect, useState } from "react";
import "../styles/Regiform.css";

function Regiform() {
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [department, setDepartment] = useState(null);
    const [role, setRole] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});
    const validateEmail = (email) => {
        return /^[^\s@]+@gmail\.com$/.test(email);
    };

    const validate = () => {
    let newErrors = {};

    if (!firstname.trim()) {
        newErrors.firstname = "Firstname is required";
    } else if (/\d/.test(firstname)) {
            newErrors.firstname = "Firstname cannot contain numbers";
        }

    if (!lastname.trim()) {
        newErrors.lastname = "Lastname is required";
    } else if (/\d/.test(lastname)) {
            newErrors.lastname = "Lastname cannot contain numbers";
        }

    if (!phone.match(/^[0-9]{10}$/)) {
        newErrors.phone = "Phone must be 10 digits";
    }

    if (!validateEmail(email)) {
        newErrors.email = "Enter a valid email";
    }

    if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (!department) {
        newErrors.department = "Select a department";
    }

    if (!role) {
        newErrors.role = "Select a role";
    }

    return newErrors;
};

    useEffect(() => {
        
        api.get("/meta/departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.log(err));

        api.get("/meta/roles")
            .then(res => setRoles(res.data))
            .catch(err => console.log(err));
    }, []);

    
    const register = async (event) => {
        event.preventDefault();

        //if (password !== confirmPassword) {
          //  setMessage("Passwords do not match");
            //setOpen(true);
           // return;
        //}



        try {
                
            const validationErrors = validate();

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                setMessage("Please fix the errors");
                setOpen(true);
                return;
            }
            //if (!department || !role) {
                //  setMessage("Please select department and role");
                //  setOpen(true);
                //  return;
                //}
                const response = await api.post("/users/register", {
                    firstname,
                    lastname,
                    department_id: department,
                    role_id: role,
                    email,
                    password,
                    phone
                });

                setMessage(response.data.message); // reads the actual backend message
                setOpen(true);
                setErrors({});
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration failed");
            setOpen(true);
        }
    };
    
  return (
    <>
        <div className="reg-form">
            <h1>Register</h1>
            <form onSubmit={register}>
                <div className="row">
                    <div className="field">
                        <label htmlFor="firstname">Firstname:</label>
                        <input
                            type="text"
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                        {errors.firstname && <p className="error">{errors.firstname}</p>}
                    </div>
                    <div className="field">
                        <label htmlFor="lastname">Lastname:</label>
                        <input
                            type="text"
                            id="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                        {errors.lastname && <p className="error">{errors.lastname}</p>}
                    </div>
                </div>
                <div className="row">
                    <div className="field">
                        <label htmlFor="dep">Department:</label>
                        <Autocomplete
                            options={departments}
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(event, newValue) => setDepartment(newValue?.id)}
                            renderInput={(params) => (
                                <TextField {...params} label="Department" error={!!errors.department} helperText={errors.department} />
                            )}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="role">Role:</label>
                        <Autocomplete
                            options={roles}
                            getOptionLabel={(option) => option.name || ""}
                            onChange={(event, newValue) => setRole(newValue?.id)}
                            renderInput={(params) => (
                                <TextField {...params} label="Role" error={!!errors.role} helperText={errors.role} />
                            )}
                        />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="phoneNum">Phone Number:</label>
                    <input
                        type="tel"
                        id="phoneNum"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    {errors.phone && <p className="error">{errors.phone}</p>}
                </div>
                <div className="field">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>
                <div className="field">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>
                <div className="field">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                </div>
                
                <button type="submit" >Sign up</button>
            </form>
            {/* ✅ Snackbar goes HERE */}
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message={message}
            />

        </div>
        
    </>   
    );
}

export default Regiform;