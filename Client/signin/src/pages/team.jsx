import React, { useEffect, useState } from 'react';
import { Typography, Modal, Divider, Form, Input, Button, Select, message } from 'antd';
import MenuList from '../Components/sideBar/MenuList';
import TablesComponenet from '../Components/Table/TablesComponenet';
import axios from 'axios';

const { Title } = Typography;
const { Option } = Select;

const Team = () => {
    const [dataSource, setDataSource] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [employees, setEmployees] = useState([]); // Store employee data
    const [form] = Form.useForm();

    const showModal = () => {
        loadEmployees(); // Load employees when modal is shown
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    const handleFormSubmit = (values) => {
        const payload = {
            TeamName: values.TeamName,
            employeeIds: values.EmployeeId.map(id => ({ id, name: employees.find(emp => emp._id === id)?.name })), // Prepare new format
        };
    
        axios.post('http://localhost:8000/api/add-team', payload)
            .then(response => {
                message.success('Team created successfully');
                loadDataSource();
                handleCancel();
            })
            .catch(error => {
                message.error('Failed to create team');
            });
    };
    

    const loadDataSource = () => {
        axios.get('http://localhost:8000/api/get-team')
            .then(response => {
                setDataSource(response.data);
            })
            .catch(error => {
                console.log('Error loading teams:', error);
            });
    };

    const loadEmployees = () => {
        axios.get('http://localhost:8000/api/get-product') // Adjust the endpoint as necessary
            .then(response => {
                setEmployees(response.data); // Store employee data
            })
            .catch(error => {
                console.log('Error loading employees:', error);
            });
    };

    useEffect(() => {
        loadDataSource();
    }, []);

    return (
        <div>
            <MenuList />
            <TablesComponenet
                columns={[
                    {
                        title: 'Team Name',
                        dataIndex: 'TeamName',
                        sorter: (a, b) => a.TeamName.localeCompare(b.TeamName),
                        width: '200px',
                    },
                    {
                        title: 'Employees',
                        dataIndex: 'employees',
                        render: (employeeIds) => employeeIds.join(', '), // For now, display IDs until we fetch names
                        width: '250px',
                    },
                ]}
                dataSource={dataSource}
                showModal={showModal}
            />

            {/* Modal to create a team */}
            <Modal
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
                width="600px"
            >
                <Typography>
                    <Title level={3}>Create Team</Title>
                </Typography>
                <Divider />
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item label='Team Name' name='TeamName' rules={[{ required: true, message: 'Please enter the Team Name' }]}>
                        <Input size='large' placeholder='Enter Team Name' />
                    </Form.Item>
                    <Form.Item label='Employee' name='EmployeeId' rules={[{ required: true, message: 'Please select employees' }]}>
                        <Select
                            mode="multiple"
                            placeholder="Select Employees"
                            size='large'
                        >
                            {employees.map(employee => (
                                <Option key={employee._id} value={employee._id}>{employee.name}</Option> // Use employee name here
                            ))}
                        </Select>
                    </Form.Item>
                    <Divider />
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create
                        </Button>
                        <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Team;
