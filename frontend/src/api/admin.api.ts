import { api } from "./api"
import { IUser } from "../types/auth.types"



export const getAllUsers = async  ():Promise<{success:boolean,data:IUser[]}> => {
    const res = await api.get("/admin/users")
    return res.data
}

export const blockUser = async (id: string) => {
    const res = await api.patch(`/admin/block/${id}`)
    return res.data
}


