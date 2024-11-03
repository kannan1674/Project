import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, message } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers, faShoppingCart, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import MenuList from '../Components/sideBar/MenuList';
import axios from 'axios';

const { Title } = Typography;

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [pendingOrder, setPendingOrder] = useState(0);

  useEffect(() => {
    fetchEmployeeData();
    fetchCustomerData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get-product');
      const employees = response.data;

      const total = employees.length;
      const male = employees.filter(emp => emp.Gender === 'Male').length;
      const female = employees.filter(emp => emp.Gender === 'Female').length;

      setTotalEmployees(total);
      setMaleCount(male);
      setFemaleCount(female);
    } catch (error) {
      message.error('Failed to fetch employee data');
      console.error('Fetch error:', error);
    }
  };

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get-customer');
      const customers = response.data;

      const total = customers.length;
      const pendingOrder = customers.reduce((sum, customer) => sum + (customer.PendingOrders || 0), 0);
      const totalOrder = customers.reduce((sum, customer) => sum + (customer.TotalOrders || 0), 0);

      setTotalCustomer(total);
      setPendingOrder(pendingOrder);
      setTotalOrder(totalOrder);
    } catch (error) {
      message.error('Failed to fetch customer data');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="dashboard-container" style={{ padding: '16px', marginLeft: '130px' }}>
      <MenuList />

      <Row gutter={[16, 16]} className="d-flex justify-content-between" style={{ width: '100%' }}>
        {/* Employee Section */}
        <Col xs={24} md={12}>
          <Title level={2} style={{textAlign:'center'}}>Employee</Title>
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: '16px' }}>
            <Col xs={24} sm={12} md={10}>
              <Card
                title="Total Employees"
                bordered
                style={{ textAlign: 'center', borderColor: 'gray' }}
              >
                <TeamOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                <Title level={3}>{totalEmployees}</Title>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={8}>
              <Card
                title="Total Males"
                bordered
                style={{ textAlign: 'center', borderColor: 'gray' }}
              >
                <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                <Title level={3} style={{ color: '#1890ff' }}>{maleCount}</Title>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={8}>
              <Card
                title="Total Females"
                bordered
                style={{ textAlign: 'center', borderColor: 'gray', marginTop: '12px' }}
              >
                <UserOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />
                <Title level={3} style={{ color: '#eb2f96' }}>{femaleCount}</Title>
              </Card>
            </Col>
          </Row>
        </Col>

        {/* Customer Section */}
        <Col xs={24} md={12}>
          <Title level={2}  style={{textAlign:'center'}}>Customer</Title>
          <Row gutter={[16, 16]} justify="center" style={{ marginTop: '16px' }}>
            <Col xs={24} sm={12} md={10}>
              <Card
                title="Total Customers"
                bordered
                style={{ textAlign: 'center', borderColor: 'gray' }}
              >
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: '48px', color: '#1890ff' }} />
                <Title level={3}>{totalCustomer}</Title>
              </Card>
            </Col>
            <Col xs={12} sm={8} md={8}>
              <Card
                title="Total Orders"
                bordered
                style={{ textAlign: 'center', borderColor: 'gray' }}
              >
                <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '48px', color: '#1890ff' }} />
                <Title level={3} style={{ color: '#1890ff' }}>{totalOrder}</Title>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={10}>
              <Card
                title="Pending Orders"
                bordered
                style={{ textAlign: 'center', borderColor: 'gray', marginTop: '12px' }}
              >
                <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: '48px', color: '#eb2f96' }} />
                <Title level={3} style={{ color: '#eb2f96' }}>{pendingOrder}</Title>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
