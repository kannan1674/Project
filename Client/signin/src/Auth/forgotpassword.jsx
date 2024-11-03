import React, { useState,useEffect } from 'react';
import { Alert, Button, Card, Form, Input, Spin, Typography } from 'antd';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import LoginImage from '../assets/Signin.jpg';

const ResetPassword = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `url('https://img.freepik.com/free-vector/tropical-leaves-background-zoom_23-2148580778.jpg?t=st=1730306011~exp=1730309611~hmac=df35c890ae763a6036e3ddcf94f5901d42c2a6339e7dd0a7b33d701b3fbd6481&w=740')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';

    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState('');
  const [step, setStep] = useState(1);

  const handleEmailSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/get-user/${email}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.id);
        await sendOtp(email);
        setStep(2);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch user ID.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email) => {
    const response = await fetch(`http://localhost:8000/api/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to send OTP');
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/otp-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        setSuccess('OTP verified. Please enter your new password.');
        setStep(3);
      } else {
        const errorData = await response.json();
        // Handle specific errors for OTP
        if (errorData.message.includes('no OTP found') || errorData.message.includes('expired')) {
          setError('No OTP found for this email or OTP has expired. Please request a new OTP.');
        } else {
          setError(errorData.message || 'Failed to verify OTP.');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/api/update-password/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        setSuccess('Password has been reset successfully.');
        setUserId('');
        navigate('/login'); // Redirect to login page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className='form-container'>
      <div style={{ display: 'flex', gap: 'large' }}>
        <div style={{ flex: 1 }}>
          <img src={LoginImage} className="auth-image" alt="Reset Password" />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography.Title level={3} strong className='title'>Reset Password</Typography.Title>
          <Form layout='vertical' onFinish={step === 3 ? handleSubmit : step === 2 ? handleOtpSubmit : handleEmailSubmit} autoComplete='off'>
            {step === 1 && (
              <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input style={{marginLeft:'10px'}} size='large' placeholder='Enter Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Item>
            )}
            {step === 2 && (
              <div className="otp_form_container">
                <div className="top">
                  <h1 className="title">OTP Verification</h1>
                  <p className="text_muted">Enter OTP</p>
                </div>
                <div className="middle">
                  <div className="wrapper">
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={4}
                      renderSeparator={<span> </span>}
                      renderInput={(props) => <input {...props} type="text" />}
                    />
                  </div>
                  <p className='text_muted'>Didn't Receive Code</p>
                  <a href='#' onClick={() => sendOtp(email)}>Resend Code</a>
                </div>
                <div className="bottom">
                  <Button style={{backgroundColor:'#7239ea ',color:'white'}} className='btn' type='primary' onClick={handleOtpSubmit} loading={loading}>
                    Verify OTP
                  </Button>
                </div>
              </div>
            )}
            {step === 3 && (
              <Form.Item label='New Password' name='newPassword' rules={[{ required: true, message: 'Kindly input your new password' }]}>
                <Input.Password size='large' placeholder='Enter Your New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </Form.Item>
            )}
            {error && <Alert description={error} type='error' showIcon closable className='alert' />}
            {success && <Alert description={success} type='success' showIcon closable className='alert' />}
            {step !== 2 && (
              <Form.Item>
                <Button style={{marginLeft:'10px',backgroundColor:'#7239ea ',color:'white'}} type='primary' htmlType='submit' className='btn' size='large' loading={loading} disabled={loading}>
                  {loading ? <Spin /> : step === 3 ? "Update Password" : "Send OTP"}
                </Button>
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    </Card>
  );
};

export default ResetPassword;
