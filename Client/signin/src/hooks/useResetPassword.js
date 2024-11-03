import { message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useReset = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleResetPassword = async (values, userId) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http:localhost:8000/reset-password/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword: values.newPassword }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(errorText || 'Failed to reset password');
            }

            message.success('Password has been reset successfully.');
            navigate('/login');
        } catch (err) {
            console.error('Password reset error:', err);
            setError(err.message || 'An error occurred. Please try again later.');
            message.error(err.message || 'An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return { handleResetPassword, loading, error };
};

export default useReset;
