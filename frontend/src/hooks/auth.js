import React from 'react';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Route, Navigate } from 'react-router-dom';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;

export const useSignUp = () => {
    return useMutation({
        mutationFn: async (userData) => {
            console.log('User Data:', userData);
            const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, userData, {
                headers: {
                    'Access-Control-Allow-Credentials': '',

                },
                withCredentials: true, // If your backend uses cookies for auth
            });
            return response.data;
        },
        onError: (error) => {
            console.error('Sign Up Error:', error);
        },

        onSuccess: (data) => {
            console.log('Sign Up Success:', data);
        },
    });
};
export const useSigin = () => {
    return useMutation({
        mutationFn: async (userData) => {
            console.log(userData);
            
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, userData, {
                // headers: {
                //     'Access-Control-Allow-Credentials': '',

                // },
                withCredentials: true, // If your backend uses cookies for auth
            });
            return response.data;
        },
        onError: (error) => {
            console.error('Sign Up Error:', error);
        },

        onSuccess: (data) => {
            console.log('Sign Up Success:', data);
        },
    });
};
export const useOauth = () => {
    return useMutation({
        mutationFn: async (provider) => {

            window.open(`${API_BASE_URL}/api/auth/${provider}`, "_self")
        },
        onError: (error) => {
            console.error('OAuth Error:', error);
        },

        // onSuccess: (data) => {
        //     console.log('Sign Up Success:', data);
        // },
    });
};




// export default PrivateRoute;