import React, { useEffect, useState } from 'react';
import { Typography, Modal, Divider, Form, Input, Select, DatePicker, Button, Row, Col, Space, message, Popconfirm, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons'; // Import Filter icon
import axios from 'axios';
import moment from 'moment';
import MenuList from '../Components/sideBar/MenuList';
import TablesComponenet from '../Components/Table/TablesComponenet';

const { Title } = Typography;
const { Option } = Select;

const Employee = () => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();
  const [teams, setTeams] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false); // State for controlling the Drawer
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Fetch teams data from the server
  useEffect(() => {
    axios.get('http://localhost:8000/api/get-team')
      .then(response => {
        if (Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch(error => console.error('Failed to load teams:', error));
  }, []);

  const loadDataSource = (teamId) => {
    const apiUrl = teamId
      ? `http://localhost:8000/api/get-product?teamId=${teamId}` // Modify API to accept filtering by teamId
      : 'http://localhost:8000/api/get-product';

    console.log('Fetching data with URL:', apiUrl); // Log the URL being called

    axios.get(apiUrl)
      .then((response) => {
        console.log('API Response:', response.data); // Log the response from the API
        setDataSource(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  useEffect(() => {
    loadDataSource();
  }, []);

  const handleFilterClick = () => {
    setFilterDrawerVisible(true);
  };

  const handleFilterDrawerClose = () => {
    setFilterDrawerVisible(false);
  };

  const handleTeamFilterSubmit = () => {
    if (selectedTeam) {
      loadDataSource(selectedTeam); // Call the API to filter by team
      handleFilterDrawerClose(); // Close the filter drawer
    } else {
      message.warning('Please select a team.');
    }
  };

  useEffect(() => {
    if (dataSource.length === 0) {
      message.info('No employees found for the selected team.');
    }
  }, [dataSource]);

  const handleNameClick = (employee) => {
    setSelectedEmployee(employee);
    setDetailModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedEmployee(null);
  };

  const handleFormSubmit = (values) => {
    const payload = {
      Name: values.name,
      Email: values.email,
      MobileNumber: values.mobileNumber,
      Gender: values.gender,
      dob: values.dob.format('YYYY-MM-DD'),
      Address: values.Address,
      Team: values.Team
    };

    const apiEndpoint = selectedEmployee
      ? `http://localhost:8000/api/update-product/${selectedEmployee._id}`
      : 'http://localhost:8000/api/add-product';

    const axiosMethod = selectedEmployee ? axios.put : axios.post;

    axiosMethod(apiEndpoint, payload)
      .then(response => {
        message.success(selectedEmployee ? 'Employee updated successfully' : 'Employee created successfully');
        loadDataSource();
        handleCancel();
      })
      .catch(error => {
        message.error('Failed to create or update employee');
        console.error('Update error:', error.response ? error.response.data : error.message);
      });
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setModalVisible(true);
    form.setFieldsValue({
      name: employee.Name,
      email: employee.Email,
      mobileNumber: employee.MobileNumber,
      gender: employee.Gender,
      dob: moment(employee.dob),
      Address: employee.Address,
      Team: employee.Team
    });
  };

  const handleDelete = (employee) => {
    axios.delete(`http://localhost:8000/api/delete-product/${employee._id}`)
      .then(() => {
        setDataSource(prevData => prevData.filter(item => item._id !== employee._id));
        message.success(`Employee ${employee.Name} deleted successfully`);
      })
      .catch(error => {
        message.error('Failed to delete employee');
        console.log('Error:', error);
      });
  };

  return (
    <div>
      <MenuList />

      {/* Search Box with Filter Icon */}
      <Button
        icon={<FilterOutlined />}
        type="primary"
        onClick={handleFilterClick}
      >
        Filter
      </Button>

      <TablesComponenet
        columns={[
          {
            title: 'Name',
            dataIndex: 'Name',
            sorter: (a, b) => a.Name.localeCompare(b.Name),
            render: (text, record) => (
              <a href="#" style={{ color: 'rgb(0, 158, 247)' }} onClick={() => handleNameClick(record)}>
                {text}
              </a>
            ),
            width: '200px'
          },
          {
            title: 'Email',
            dataIndex: 'Email',
            width: '250px'
          },
          {
            title: 'Mobile Number',
            dataIndex: 'MobileNumber',
            width: '250px'
          },
          {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
              <Space size="middle">
                <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                <Popconfirm
                  title="Are you sure you want to delete this employee?"
                  onConfirm={() => handleDelete(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>Delete</Button>
                </Popconfirm>
              </Space>
            ),
            width: '200px'
          }
        ]}
        dataSource={dataSource}
      />

      {/* Filter Drawer */}
      <Drawer
        title="Filter Employees by Team"
        placement="right"
        onClose={handleFilterDrawerClose}
        visible={filterDrawerVisible}
        width={300}
      >
        <Form onFinish={handleTeamFilterSubmit}>
          <Form.Item
            name="team"
            label="Select Team"
            rules={[{ required: true, message: 'Please select a team' }]}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select Team"
              onChange={(value) => setSelectedTeam(value)}
            >
              {teams.map(team => (
                <Option key={team._id} value={team._id}>
                  {team.TeamName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Search</Button>
            <Button type="default" onClick={handleFilterDrawerClose} style={{ marginLeft: '8px' }}>Cancel</Button>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Modal to add or edit employee */}
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width="900px"
      >
        <Typography>
          <Title level={3}>{selectedEmployee ? 'Edit Employee' : 'Create Employee'}</Title>
        </Typography>
        <Divider />
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please enter your Name' }]}>
                <Input size='large' placeholder='Enter Your Name' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please enter your Email' }, { type: 'email', message: "Invalid Email" }]}>
                <Input size='large' placeholder='Enter Your Email' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Mobile Number' name='mobileNumber' rules={[{ required: true, message: 'Please enter your Mobile Number' }]}>
                <Input size='large' placeholder='Enter Mobile Number' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Gender' name='gender'>
                <Select size='large' placeholder='Select Gender'>
                  <Option value='Male'>Male</Option>
                  <Option value='Female'>Female</Option>
                  <Option value='Other'>Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='DOB' name='dob' rules={[{ required: true, message: 'Please select your Date of Birth' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Team' name='Team' rules={[{ required: true, message: 'Please select your Team' }]}>
                <Select size='large' placeholder='Select Team'>
                  {teams.map(team => (
                    <Option key={team._id} value={team._id}>
                      {team.TeamName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Address" name="Address" rules={[{ required: true, message: "Please enter your Address" }]}>
            <Input.TextArea size="large" placeholder="Enter your address" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{selectedEmployee ? 'Update Employee' : 'Create Employee'}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
