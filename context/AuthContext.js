import axios from "axios";
import { handleError } from "lib/helper";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const checkOtp = async (otp) => {

    }

    const login = async (cellphone) => {
        try {
            setLoading(true);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_API_URL}/auth/login`, {
                cellphone
            });

            toast.success(res.data.message);

        } catch (error) {
            toast.error(handleError(error));

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ login, loading, checkOtp }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;