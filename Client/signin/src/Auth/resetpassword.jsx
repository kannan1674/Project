import React, { useState } from 'react';
import { Card, Button, Input, Spin, Typography, Alert } from 'antd';
import { useLocation } from 'react-router-dom';

const UpdatePassword = () => {
  const location = useLocation();
  const { email } = location.state || {}; // Get email from location state
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:8000/api/update-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }), // Sending email and new password
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password has been reset successfully.');
        setNewPassword(''); // Clear input field
      } else {
        setError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-container">
      <Card className='form-container'>
        <Typography.Title level={3} strong className='title'>Update Password</Typography.Title>
        <Input.Password
          size='large'
          placeholder='Enter Your New Password'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          type='primary'
          className='btn'
          size='large'
          onClick={handleSubmit}
          loading={loading}
          disabled={loading || !newPassword}
        >
          {loading ? <Spin /> : 'Update Password'}
        </Button>
        {error && <Alert description={error} type='error' showIcon closable />}
        {success && <Alert description={success} type='success' showIcon closable />}
      </Card>
    </div>
  );
};

export default UpdatePassword;
