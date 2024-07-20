

import { useContext } from "react"
import AuthContext from "./authContext"

const useAuth = () => {
    const data = useContext(AuthContext);
    console.log("data: ", data);
    return data;
}


export default useAuth;