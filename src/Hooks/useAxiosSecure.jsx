import React from 'react';
import axios from 'axios';

const axiosSecure = axios.create({
  baseURL: `http://localhost:5000`,
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
});

const useAxiosSecure = () => {
    return axiosSecure
};

export default useAxiosSecure;