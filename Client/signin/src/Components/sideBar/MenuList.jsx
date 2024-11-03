// MenuList.js
import { Button, Layout, Menu } from 'antd';
import {
    HomeOutlined,
    FireFilled,
    UserOutlined,
    LogoutOutlined,
    UsergroupAddOutlined,
    SunOutlined,
    MoonOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import { Link } from 'react-router-dom';
import './MenuList.css';

const { Sider } = Layout;

const MenuList = () => {
    const { logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode === 'true';
    });

    const [collapsed, setCollapsed] = useState(window.innerWidth < 768); // Collapse if screen is narrow

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', newMode);
            document.body.classList.toggle('dark-mode', newMode);
            return newMode;
        });
    };

    useEffect(() => {
        // Adjust sidebar collapse on screen resize
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

    return (
        <Layout className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
            <Sider
                className={`sidebar ${isDarkMode ? 'dark-mode' : ''}`}
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="md" // Automatically collapse at medium screens and below
                collapsedWidth={window.innerWidth < 768 ? 0 : 80} // Hide completely on very small screens
                style={{ position: 'relative', width: '100px' }}
            >
                {/* Collapse/Expand Icon */}
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

                {/* Logo */}
                <div className='logo'>
                    <div className="logo-icon d-flex">
                        <FireFilled /> {!collapsed && 'Stylz'}
                    </div>
                </div>

                {/* Menu Items */}
                <Menu theme={isDarkMode ? 'dark' : 'light'} mode='inline' className='menu-bar'>
                    <Menu.Item key="home" icon={<HomeOutlined />}>
                        <Link to="/">Home</Link>
                    </Menu.Item>
                    <Menu.Item key="Employees" icon={<UserOutlined />}>
                        <Link to="/employee">Employees</Link>
                    </Menu.Item>
                    <Menu.Item key="Customer" icon={<UsergroupAddOutlined />}>
                        <Link to="/customer">Customer</Link>
                    </Menu.Item>
                    <Menu.Item key="Logout" icon={<LogoutOutlined />} onClick={logout}>
                        Logout
                    </Menu.Item>
                </Menu>

                {/* Theme Toggle Button */}
                <Button 
                    style={{ marginLeft: '15px', marginTop: '10px' }}
                    className="theme-toggle"
                    onClick={toggleTheme}
                    icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                />
            </Sider>
        </Layout>
    );
};

export default MenuList;
