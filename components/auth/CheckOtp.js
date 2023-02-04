import AuthContext from "@/context/AuthContext";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const CheckOtp = () => {
    
    const { checkOtp, loading } = useContext(AuthContext);
    const [otp, setOtp] = useState('');

    const handleCheckOtp = async () => {
        if (otp === '') {
            toast.error('کد ورود الزامی است');
            return;
        };

        const pattern = /^[0-9]{6}$/;
        if (!pattern.test(otp)) {
            toast.error("فرمت کد ورود معتبر نیست")
            return;
        };

        await checkOtp(otp);
    }

    return (
        <div className="form_container">
            <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">کد ورود </label>
            <input onChange={(e) => setOtp(e.target.value)} type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <button onClick={handleCheckOtp} disabled={loading} className="btn btn-primary btn-auth">
              ارسال
              {loading && <div className="spinner-border spinner-border-sm ms-2"></div>}
            </button>
    </div>
  );
};

export default CheckOtp;
