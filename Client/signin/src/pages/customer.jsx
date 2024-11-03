import React, { useEffect, useState } from 'react';
import { Typography, Modal, Divider, Form, Input, Button, Row, Col, Space, message, Popconfirm } from 'antd';
import MenuList from '../Components/sideBar/MenuList';
import TablesComponenet from '../Components/Table/TablesComponenet';
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';

const { Title } = Typography;

const Customer = () => {
  const [dataSource, setDataSource] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setSelectedCustomer(null);
  };

  const handleFormSubmit = (values) => {
    const payload = {
      CustomerName: values.CustomerName,
      Email: values.email,
      TotalOrders: values.TotalOrders,
      PendingOrders: values.PendingOrders,
      TotalAmount: values.TotalAmount,
      Address: values.Address,
    };

    const apiEndpoint = selectedCustomer
      ? `http://localhost:8000/api/update-customer/${selectedCustomer._id}`
      : 'http://localhost:8000/api/add-customer';

    const axiosMethod = selectedCustomer ? axios.put : axios.post;

    axiosMethod(apiEndpoint, payload)
      .then(response => {
        message.success(selectedCustomer ? 'Customer updated successfully' : 'Customer created successfully');
        loadDataSource();
        handleCancel();
      })
      .catch(error => {
        message.error('Failed to create or update customer');
        console.error('Update error:', error.response ? error.response.data : error.message);
      });
  };

  const loadDataSource = () => {
    axios.get('http://localhost:8000/api/get-customer')
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

  const handleNameClick = (customer) => {
    setSelectedCustomer(customer);
    setDetailModalVisible(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalVisible(false);
    setSelectedCustomer(null);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setModalVisible(true);
    form.setFieldsValue({
      CustomerName: customer.CustomerName,
      email: customer.Email,
      TotalOrders: customer.TotalOrders,
      PendingOrders: customer.PendingOrders,
      TotalAmount: customer.TotalAmount,
      Address: customer.Address,
    });
  };

  const handleDelete = (customer) => {
    axios.delete(`http://localhost:8000/api/delete-customer/${customer._id}`)
      .then(() => {
        setDataSource(prevData => prevData.filter(item => item._id !== customer._id));
        message.success(`Customer ${customer.CustomerName} deleted successfully`);
      })
      .catch(error => {
        message.error('Failed to delete customer');
        console.log('Error:', error);
      });
  };

  return (
    <div>
      <MenuList />
      <TablesComponenet
        columns={[
          {
            title: 'Customer Name',
            dataIndex: 'CustomerName',
            sorter: (a, b) => a.CustomerName.localeCompare(b.CustomerName),
            render: (text, record) => (
              <a href="#" style={{ color: 'rgb(0, 158, 247)' }} onClick={() => handleNameClick(record)}>
                {text}
              </a>
            ),
            width: '200px',
          },
          {
            title: 'Email',
            dataIndex: 'Email',
            width: '250px',
          },
          {
            title: 'Pending Orders',
            dataIndex: 'PendingOrders',
            width: '250px',
          },
          {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
              <Space size="middle">
                <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                <Popconfirm
                  title="Are you sure you want to delete this customer?"
                  onConfirm={() => handleDelete(record)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>Delete</Button>
                </Popconfirm>
              </Space>
            ),
            width: '200px',
          },
        ]}
        dataSource={dataSource}
        showModal={showModal}
      />

      {/* Modal to add or edit customer */}
      <Modal
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width="900px"
      >
        <Typography>
          <Title level={3}>{selectedCustomer ? 'Edit Customer' : 'Create Customer'}</Title>
        </Typography>
        <Divider />
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Customer Name' name='CustomerName' rules={[{ required: true, message: 'Please enter your Customer Name' }]}>
                <Input size='large' placeholder='Enter Your Customer Name' />
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
              <Form.Item label='Total Orders' name='TotalOrders' rules={[{ required: true, message: 'Please enter your Total Orders' }]}>
                <Input size='large' placeholder='Enter Your Total Orders' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='Pending Orders' name='PendingOrders' rules={[{ required: true, message: 'Please enter your Pending Orders' }]}>
                <Input size='large' placeholder='Enter Your Pending Orders' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label='Total Amount' name='TotalAmount' rules={[{ required: true, message: 'Please enter your Total Amount' }]}>
                <Input size='large' placeholder='Enter Your Total Amount' />
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
          <Divider />
          <Form.Item style={{ marginLeft: '670px' }}>
            <Button type="primary" htmlType="submit" style={{ backgroundColor: '#6130c7' }}>
              {selectedCustomer ? 'Update' : 'Create'}
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
          <Title level={4}>Customer Details</Title>
        </Typography>
        <Divider />
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Customer Name</div>
            <div className="fw-bold fs-6">{selectedCustomer?.CustomerName || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Email</div>
            <div className="fw-bold fs-6">{selectedCustomer?.Email || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Total Orders</div>
            <div className="fw-bold fs-6">{selectedCustomer?.TotalOrders || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Pending Orders</div>
            <div className="fw-bold fs-6">{selectedCustomer?.PendingOrders || 'Not Provided'}</div>
          </Col>
          <Col xs={24} md={12}>
            <div className="text-gray fs-6">Total Amount</div>
            <div className="fw-bold fs-6">{selectedCustomer?.TotalAmount ? `₹ ${selectedCustomer.TotalAmount}` : 'Not Provided'}</div>
          </Col>
          <Col xs={24}>
            <div className="text-gray fs-6">Address</div>
            <div className="fw-bold fs-6">{selectedCustomer?.Address || 'Not Provided'}</div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Customer;
