import React from 'react';
import axios from 'axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

const useAxiosSecure = () => {

  const {user} = useAuth()
  const navigate = useNavigate()
  
    axiosSecure.interceptors.request.use( config =>{
      config.headers.Authorization = `Bearer ${user.accessToken}`
      return config;
    }, error =>{
      return Promise.reject(error)
    })

    axiosSecure.interceptors.response.use(res =>{
      return res;
    }, error => {
      console.log('inside res interceptor',error.status);
      const status = error.status;
      if (status === 402) {
        navigate('/forbidden')
      }
      return Promise.reject(error);
    })

    return axiosSecure
};

export default useAxiosSecure;