import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { Children, JSX } from "react";

interface Props {
    children: JSX.Element;
}


export const AdminRoute = ({children}: Props) => {
    const { isAuthenticated, role} = useAppSelector((state) => state.auth)

    if(!isAuthenticated || role !== "admin"){
        return <Navigate to="/admin/login"/>
    }

    return children
}