import { Navigate } from "react-router-dom";

interface AdminRouteProps{
    children: React.ReactNode;
}

export default function AdminRoute({
    children,
}:AdminRouteProps){
    const user=JSON.parse(localStorage.getItem("user")||"null");
    if(!user){
        return <Navigate to="/login" replace/>;
    }

    if(user.role!=="Admin"){
        return <Navigate to="/" replace/>;
    }
    return <>{children}</>
}