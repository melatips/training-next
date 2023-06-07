import { useSession } from "next-auth/react"
import { axiosClient } from "./axios"
import { useEffect } from "react";


export function useAuthAxios () {
    const {data:session} = useSession;

}