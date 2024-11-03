import { Alert, Button, Card, Typography, Form, Input, Spin } from 'antd';
import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import LoginImage from '../assets/Signin.jpg';
import useLogin from '../hooks/useLogin';
import './login.css'; 

const Login = () => {
  useEffect(() => {
    document.body.style.backgroundImage = `url('https://img.freepik.com/free-vector/tropical-leaves-background-zoom_23-2148580778.jpg?t=st=1730306011~exp=1730309611~hmac=df35c890ae763a6036e3ddcf94f5901d42c2a6339e7dd0a7b33d701b3fbd6481&w=740')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';

    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  const { loading, error, loginUser } = useLogin();

  const handleLogin = async (values) => {
    try {
      await loginUser(values);
    } catch (err) {
      console.error(err); // Log the error for debugging
    }
  };

  return (
    <div className="container">
      <Card className='form-container' >
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Img Flex */}
          <div style={{ flex: 1 }}>
            <img src={LoginImage} alt="Sign In" className="auth-image" />
          </div>
          {/* Form Flex */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
            <Typography.Title level={3} strong className='title'>Sign In</Typography.Title>
            <Form layout='vertical' onFinish={handleLogin} autoComplete='off'>
              <Form.Item 
                label='Email' 
                name='email' 
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'The input is not a valid email!' },
                ]}
              >
                <Input size='large' placeholder='Enter your email' />
              </Form.Item>
              <Form.Item 
                label='Password' 
                name='password' 
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password size='large' placeholder='Enter your password' />
              </Form.Item>
              <Link to='/forgotpassword' className='forgot'>Forgot Password?</Link>
              {error && <Alert description={error} type='error' showIcon closable className='alert' />}
              <Form.Item>
              <Button 
              type={`${loading ? "" : 'primary'}`} 
              htmlType='submit' 
              className='btn' 
              style={{backgroundColor:'#7239ea ',color:'white'}}
              size='large'> 
                {loading ? <Spin/> : "Signin"} 
             </Button>
              </Form.Item>
              <Form.Item>
                <Link to="/">
                  <Button size='large' className='btn'>Create an Account</Button>
                </Link>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
