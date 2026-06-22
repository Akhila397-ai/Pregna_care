import { data, useNavigate } from "react-router-dom";
import { useAppDispatch,useAppSelector } from "../../../store/hooks";

import { doctorApplyThunk,getApplicationThunk,getMyProfileThunk,doctorLogout,clearDoctorError } from "../store/doctor.slice";

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

    const fetchApplication = () => {
        dispatch(getApplicationThunk())
    };

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
        token,
        loading,
        error,
        apply,
        fetchApplication,
        fetchProfile,
        logout,
        clearError: () => dispatch(clearDoctorError())
    }
}