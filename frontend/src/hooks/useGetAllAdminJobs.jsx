import { setAllAdminJobs, setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(()=> {
        const fetchAllJobs = async () => {
            try{
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {withCredentials: true});
                if(res.data.success){
                    dispatch(setAllAdminJobs(res.data.job));
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchAllJobs();
    },[])
}

export default useGetAllAdminJobs