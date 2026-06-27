import { data, useNavigate } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "../../../store/hooks";

import { doctorApplyThunk,getApplicationThunk,getMyProfileThunk,doctorLogout,clearDoctorError, getMyStatusThunk } from "../store/doctor.slice";

import { DoctorApplyRequest } from "../types/doctor.types";
import { clearError } from "../../../store/slices/auth.slice";

export const useDoctor = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        application,
        profile,
        token,
        loading,
        error
    } = useAppSelector((state)=> state.doctor);

    //apply
    const apply = async (data: DoctorApplyRequest) => {
        const result = await dispatch(doctorApplyThunk(data))
        if(doctorApplyThunk.fulfilled.match(result)){
            navigate('/doctor/pending')
        }
    };

    const checkStatusAndRedirect = async () => {
        const result = await dispatch(getMyStatusThunk())
        if(getMyStatusThunk.fulfilled.match(result)){
            const {status} = result.payload;
            if(status === 'approved'){
                navigate('/doctor/dashboard')
            }else if(status === 'rejected'){
                navigate('/doctor/rejected')
            }
        }
    }

    const fetchStatus = () => dispatch(getMyStatusThunk())
    const fetchApplication = () => dispatch(getApplicationThunk())
    

    //Get profile

    const fetchProfile = () => {
        dispatch(getMyProfileThunk());
    }

    const logout = () => {
        dispatch(doctorLogout())
        navigate('/login')
    };

    return {
        application,
        profile,
        status,
        token,
        loading,
        error,
        apply,
        checkStatusAndRedirect,
        fetchStatus,
        fetchApplication,
        fetchProfile,
        logout,
        clearError: () => dispatch(clearDoctorError())
    }
}