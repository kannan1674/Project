import { message } from 'antd';
import { useState } from 'react';
import { useAuth } from '../context/authContext'; // Corrected import of useAuth

const useSignup = () => {
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null); // Set initial state to false for loading

    const registerUser = async (values) => {
        if (values.password !== values.Confirmpassword) {
            return setError('Password and Confirm Password do not match');
        }

        try {
            setError(null);
            setLoading(true);
            
            const res = await fetch('http://localhost:8000/api/signup', { // Fixed typo in URL
                method: "POST",
                headers: {
                    'Content-Type': 'application/json', // Added proper headers for JSON data
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (res.status === 201) {
                message.success(data.message);
                login(data.token, data.user); // Using login to handle token and user data
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error('Registration failed');
            }
        } catch (error) {
            setError('An error occurred during registration');
            message.error(error.message);
        } finally {
            setLoading(false); // Ensure loading is stopped in both success and failure cases
        }
    };

    return { loading, error, registerUser };
};

export default useSignup;
