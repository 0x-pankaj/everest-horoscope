
"use client";

import React, { createContext, useState } from "react";

export const AuthContext = createContext<{
    authStatus: boolean;
    setAuthStatus: (status: boolean) => void;
    // setAuthStatus: React.Dispatch<React.SetStateAction<boolean>>
}>({
    authStatus: false,
    setAuthStatus: () => {}
});

export const AuthProvider = AuthContext.Provider;

// export function AuthProvider({children}: {children: React.ReactNode}) {
//     const [authStatus, setAuthStatus] = useState(false);

//     return (
//         <AuthContext.Provider value={{authStatus, setAuthStatus}} >
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const data = useContext(AuthContext);
//     return data;
// }

export default AuthContext;