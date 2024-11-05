import { Button, Layout, Menu, Modal, Input, message, Form } from 'antd';
import {
    HomeOutlined,
    FireFilled,
    UserOutlined,
    LogoutOutlined,
    UsergroupAddOutlined,
    SunOutlined,
    MoonOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LockOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext'; // Ensure this hook provides the logout function
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import axios from 'axios';
import './MenuList.css';

const { Sider } = Layout;

const MenuList = () => {
    const { logout } = useAuth(); // Fetch logout function from context
    const navigate = useNavigate(); // For navigation after logout
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });

    const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm(); // Use Form instance

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', newMode);
            document.body.classList.toggle('dark-mode', newMode);
            return newMode;
        });
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    const handleChangePassword = async (values) => {
        const { email, currentPassword, newPassword } = values;

        try {
            const response = await axios.post('http://localhost:8000/api/change-password', {
                email,
                currentPassword,
                newPassword
            });
            message.success('Password updated successfully!');
            setIsModalVisible(false);
            form.resetFields(); // Clear input fields after successful password update
        } catch (error) {
            message.error('Failed to update password. Please try again.');
        }
    };

    const handleLogout = () => {
        logout(); // Call the logout function
        message.success('You have logged out successfully.'); // Optional success message
        navigate('/login'); // Redirect to the login page after logout
    };

    return (
        <Layout className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
            <Sider
                className={`sidebar ${isDarkMode ? 'dark-mode' : ''}`}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="md"
                collapsedWidth={window.innerWidth < 768 ? 0 : 80}
                style={{ position: 'relative', width: '100px' }}
            >
                <div
                    className="collapse-icon"
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        cursor: 'pointer',
                        fontSize: '13px',
                        position: 'absolute',
                        top: '50px',
                        left: collapsed ? '10px' : '23px',
                        background: isDarkMode ? '#001529' : 'primary',
                        padding: '8px',
                        borderRadius: '4px',
                        zIndex: 1
                    }}
                >
                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>

                <div className='logo'>
                    <div className="logo-icon d-flex">
                        <FireFilled /> {!collapsed && 'Stylz'}
                    </div>
                </div>

                <Menu theme={isDarkMode ? 'dark' : 'light'} mode='inline' className={`menu-bar custom-menu`}>
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="Employees" icon={<UserOutlined />}>
                        <Link to="/employee">Employees</Link>
                    </Menu.Item>
                    <Menu.Item key="Customer" icon={<UsergroupAddOutlined />}>
                        <Link to="/customer">Customer</Link>
                    </Menu.Item>
                    <Menu.Item key="Team" icon={<UsergroupAddOutlined />}>
                        <Link to="/team">Team</Link>
                    </Menu.Item>
                    <Menu.Item key="Logout" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Logout
                    </Menu.Item>
                    <Menu.Item icon={<LockOutlined />} onClick={() => setIsModalVisible(true)}>
                        Change Password
                    </Menu.Item>
                </Menu>

                <Button
                    style={{ marginLeft: '15px', marginTop: '10px' }}
                    className="theme-toggle"
                    onClick={toggleTheme}
                    icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                />
            </Sider>

            {/* Change Password Modal */}
            <Modal
                title="Change Password"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()} // Submit form on OK
                okText="Update"
                cancelText="Cancel"
                width={'600px'}
            >
                <Form form={form} onFinish={handleChangePassword} layout="vertical">
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please provide your email.' },
                            { type: 'email', message: 'Please enter a valid email address.' },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item
                        name="currentPassword"
                        label="Current Password"
                        rules={[{ required: true, message: 'Please provide your current password.' }]}
                    >
                        <Input.Password placeholder="Current Password" />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            { required: true, message: 'Please provide a new password.' },
                            { min: 6, message: 'New password must be at least 6 characters long.' },
                        ]}
                    >
                        <Input.Password placeholder="New Password" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default MenuList;
