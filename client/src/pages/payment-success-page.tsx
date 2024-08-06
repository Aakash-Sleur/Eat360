// PaymentSuccess.tsx
import axios from 'axios';
import React, { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';
import { instance } from '@/lib/config';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchSession = async () => {
            const params = new URLSearchParams(location.search);
            const sessionId = params.get('session_id');
            const recipeId = params.get('recipeId');

            if (sessionId && recipeId) {
                try {
                    await axios.get(`${instance.defaults.baseURL}/session/${sessionId}`);
                    setTimeout(() => {
                        navigate(`/recipes/${recipeId}?status=success`);
                    }, 3000);
                } catch (error) {
                    console.error('Error fetching session data', error);
                }
            }
        };

        fetchSession();
    }, [navigate, location]);

    return (
        <div className="relative flex items-center justify-center w-full h-screen">

            <div className="z-50 p-8 text-center bg-white rounded-lg shadow-lg">
                <h1 className="mb-4 text-2xl font-bold text-green-500">Payment Successful!</h1>
                <p className="text-gray-700">Thank you for your purchase. You will be redirected shortly.</p>
                <img src="/icons/tick.svg" className="w-16 h-16 mx-auto mt-4 text-green-500" alt="tick" />
            </div>
        </div>
    )
};

export default PaymentSuccess;
