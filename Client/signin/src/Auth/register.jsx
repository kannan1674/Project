import { Alert, Button, Card, Flex, Form, Input,Spin, Typography } from 'antd'
import { Link } from 'react-router-dom'
import React ,{useEffect}from 'react'
import RegisterImage from '../assets/Register.png';
import useSignup from '../hooks/useSignup';
import './login.css'


const Register = () => {

  const {loading, error, registerUser} = useSignup();

  const handleRegister = (values) => {
    registerUser(values);

  }
  useEffect(() => {
    document.body.style.backgroundImage = `url('https://img.freepik.com/free-vector/tropical-leaves-background-zoom_23-2148580778.jpg?t=st=1730306011~exp=1730309611~hmac=df35c890ae763a6036e3ddcf94f5901d42c2a6339e7dd0a7b33d701b3fbd6481&w=740')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';

    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);

  return (
    
    <div className='login-page' >
    <Card className='form-container'>
      <Flex gap='large' >
        {/* Form Flex */}
        <Flex vertical flex={1}>
          <Typography.Title level={3} strong className='title'>  Create an Account</Typography.Title>
          <Form layout='vertical' onFinish={handleRegister} autoComplete='off'>
            <Form.Item label='Full Name' name='name' rules={[{
              required: true,
              message: 'Kindly Input your Name'
            }]}>
              <Input size='large' placeholder='Enter Your Name' />
            </Form.Item>
            <Form.Item label='Email' name='email' rules={[{
              required: true,
              message: 'Kindly Input your Email'
            }, {
              type: 'email',
              message: "The Input is not vaild Email"
            }]}>
              <Input size='large' placeholder='Enter Your Email' />
            </Form.Item>
            <Form.Item label='Password' name='password' rules={[{
              required: true,
              message: 'Kindly Input your password'
            }]}>
              <Input.Password size='large' placeholder='Enter Your Password' />
            </Form.Item>
            <Form.Item label='Confirm Password' name='Confirmpassword' rules={[{
              required: true,
              message: 'Kindly Input your Confirm password'
            }]}>
              <Input.Password size='large' placeholder='Re-enter Your  Password' />
            </Form.Item>
             {error && <Alert description={error} type='error' showIcon closable className='alert '/>} 

            <Form.Item>
              <Button 
              type={`${loading ? "" : 'primary'}`} 
              htmlType='submit' 
              className='btn' 
              style={{backgroundColor:'#7239ea ',color:'white'}}
              size='large'> 
                {loading ? <Spin/> : "Create Account"} 
             </Button>
            </Form.Item>
            <Form.Item>
              <Link to="/login">
                <Button size='large' className='btn'  > Sign In</Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>
        {/* Img Flex */}
        <Flex flex={1}>
          <img src={RegisterImage} className="auth-image" />
        </Flex>

      </Flex>
    </Card>
    </div>
  )
}

export default Register
