import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { notify } from "../utils/notify";

export default function Register(){
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const navigate=useNavigate();

    const handleRegister=async(e:React.SubmitEvent)=>{
        e.preventDefault();
        try{
            await api.post("/auth/register",
                {
                    name,email,password,
                }
            );
            notify.success("Registration successful!");
            navigate("/login");
        }catch(error){
            console.error(error);
            notify.error("Registration failed");
        }
    };

    return(
        <div className="auth-page">
            <h1>Sign Up</h1>
            <form onSubmit={handleRegister}>
                <div className="form-group">
                <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className="form-group">
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="btn-primary">Sign Up</button>
            </form>
        </div>
    );
}