// PaymentFailure.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentFailure: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const recipeId = params.get('recipeId');

        setTimeout(() => {
            navigate(`/recipes/${recipeId}?status=failure`);
        }, 3000);
    }, [navigate, location]);

    return (
        <div className="relative flex items-center justify-center w-full h-screen">
            <div className="p-8 text-center bg-white rounded-lg shadow-lg">
                <h1 className="mb-4 text-2xl font-bold text-red-500">Payment Failed</h1>
                <p className="text-gray-700">There was an issue with your payment. Please try again.</p>
                <img src="/icons/wrong.svg" className="w-16 h-16 mx-auto mt-4 text-red-500" alt="cross" />
            </div>
        </div>
    )
};

export default PaymentFailure;
