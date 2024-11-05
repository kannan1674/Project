import React, { useEffect, useState } from 'react';
import { Typography, Modal, Divider, Form, Input, Select, DatePicker, Button, Row, Col, Space, message, Popconfirm } from 'antd';
import MenuList from '../Components/sideBar/MenuList';
import TablesComponenet from '../Components/Table/TablesComponenet';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const Employee = () => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();
  // const [status, setStatus] = useState(false); // New state for status checkbox

  const showModal = () => {
    setModalVisible(true);
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

  const loadDataSource = () => {
    axios.get('http://localhost:8000/api/get-product')
      .then((response) => {
        setDataSource(response.data);
      })
      .catch(error => {
        console.log('Error:', error);
      });
  };

  useEffect(() => {
    loadDataSource();
  }, []);

  const handleNameClick = (employee) => {
    setSelectedEmployee(employee);
    setDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedEmployee(null);
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
        showModal={showModal}
       
      />

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
                <Input size='large' type='number' placeholder='Enter Your Mobile Number' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true, message: 'Please select gender' }]}>
                <Select size='large'>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item name="dob" label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth' }]}>
                <DatePicker size='large' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item name="Address" label="Address" rules={[{ required: true, message: 'Please enter the address' }]}>
                <TextArea rows={2} size='large' />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row>
            <Col span={24}>
              <Checkbox checked={status} onChange={handleStatusChange}>Active</Checkbox>
            </Col>
          </Row> */}
          <Divider />
          <Form.Item style={{marginLeft:'670px'}}>
            <Button type="primary" htmlType="submit" style={{backgroundColor:'#6130c7'}}>
              {selectedEmployee ? 'Update' : 'Create'}
            </Button>
            <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        visible={detailModalVisible}
        onCancel={handleDetailModalClose}
        footer={null}
        width="800px"
      >
        <Typography>
          <Title level={4}>Employee Details</Title>
        </Typography>
        <Divider />
        <Row gutter={16}>
        <Col xs={24} md={12}>
            <div className="text-gray fs-6">Name</div>
            <div className="fw-bold fs-6">{selectedEmployee?.Name || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Email</div>
            <div className="fw-bold fs-6">{selectedEmployee?.Email || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Mobile Number</div>
            <div className="fw-bold fs-6">{selectedEmployee?.MobileNumber || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Gender</div>
            <div className="fw-bold fs-6">{selectedEmployee?.Gender || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Date of Birth</div>
            <div className="fw-bold fs-6">{selectedEmployee?.dob ? moment(selectedEmployee.dob).format('DD-MM-YYYY') : 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Address</div>
            <div className="fw-bold fs-6">{selectedEmployee?.Address || 'Not Provided'}</div>
          </Col>
          
        </Row>
      </Modal>
    </div>
  );
};

export default Employee;
