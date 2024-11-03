import React, { useState } from 'react';
import '../Verifyotp/otp.css';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import { Card, Flex, Button, Typography } from 'antd';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/api/otp-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        navigate('/reset-password/:otp');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-container">
      <Card className='form-container'>
        <Flex gap='large'>
          <div className='otp_form_container'>
            <div className="top">
              <Typography.Title level={3} strong className='title'>Forgot Password</Typography.Title>
              <h1 className="title">OTP Verification</h1>
              <p style={{backgroundColor:'green',color:'gray'}}>Enter OTP</p>
            </div>
            <div className="middle" >
              <div className="wrapper" >
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderSeparator={<span> </span>}
                  renderInput={(props) => <input {...props} type="text" />}
                  style={{marginLeft:'20px'}}
                />
              </div>
              <p className='text_muted'>Didn't Receive Code</p>
              <a href='#'>Resend Code</a>
            </div>
            <div className="bottom">
              <Button
                className='btn'
                type='primary'
                onClick={handleSubmit}
                loading={loading}
              >
                Verify OTP
              </Button>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>{success}</p>}
            </div>
          </div>
        </Flex>
      </Card>
    </div>
  );
}

export default OTP;
