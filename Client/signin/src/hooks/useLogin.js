import { message } from 'antd';
import { useState } from 'react';
import { useAuth } from '../context/authContext'; // Corrected import of useAuth

const useLogin = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Initialize loading to false

    const loginUser = async (values) => {
        try {
            setError(null);
            setLoading(true);
            
            const res = await fetch('http://localhost:8000/api/login', { // Fixed typo in URL
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // Added proper headers for JSON data
                },
                body: JSON.stringify(values),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.status === 200) {
                message.success(data.message);
                login(data.token, data.user); // Using login to handle token and user data
            } else if (res.status === 404) {
                setError(data.message);
                message.error(data.message);
            } else {
                message.error(data.message || 'An unexpected error occurred');
            }
        } catch (error) {
            message.error(error.message || 'Something went wrong, please try again');
        } finally {
            setLoading(false); // Ensure loading is stopped in both success and failure cases
        }
    };

    return { loading, error, loginUser };
};

export default useLogin;
