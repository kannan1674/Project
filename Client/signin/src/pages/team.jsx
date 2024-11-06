// import React, { useState, useEffect } from 'react';
// import { Typography, Modal, Form, Input, Button, Select, message } from 'antd';
// import axios from 'axios';
// import MenuList from '../Components/sideBar/MenuList';
// import TablesComponenet from '../Components/Table/TablesComponenet';

// const { Title } = Typography;
// const { Option } = Select;

// const TeamPage = () => {
//     const [teams, setTeams] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [form] = Form.useForm();

//     // Load teams and employees when the component mounts
//     useEffect(() => {
//         loadTeams();
//         loadEmployees();
//     }, []);

//     const loadTeams = async () => {
//         try {
//             const response = await axios.get('http://localhost:8000/api/get-team');
//             setTeams(response.data);
//         } catch (error) {
//             console.error('Error loading teams:', error);
//         }
//     };

//     const loadEmployees = async () => {
//         try {
//             const response = await axios.get('http://localhost:8000/api/get-product');
//             setEmployees(response.data);
//         } catch (error) {
//             console.error('Error loading employees:', error);
//         }
//     };

//     const showModal = () => {
//         setModalVisible(true);
//     };

//     const handleCancel = () => {
//         setModalVisible(false);
//         form.resetFields();
//     };

//     const handleFormSubmit = async (values) => {
//         const payload = {
//             TeamName: values.TeamName,
//             employeeIds: values.EmployeeId.map(id => ({
//                 id,
//                 name: employees.find(emp => emp._id === id)?.Name
//             })),
//         };

//         try {
//             await axios.post('http://localhost:8000/api/add-team', payload);
//             message.success('Team created successfully');
//             loadTeams(); // Refresh the teams list
//             handleCancel();
//         } catch (error) {
//             message.error('Failed to create team');
//         }
//     };

//     const columns = [
//         {
//             title: 'Team Name',
//             dataIndex: 'TeamName',
//             key: 'TeamName',
//         },
//         {
//             title: 'Employee Count',
//             dataIndex: 'employees',
//             key: 'employees',
//             render: (employeeIds) => employeeIds.length, // Display the count of employees
//         },
//     ];

//     return (
//         <div style={{ padding: '20px' }}>
//             <MenuList />
            
//             <TablesComponenet columns={columns} dataSource={teams} rowKey="_id" />

//             <Modal
//                 visible={modalVisible}
//                 onCancel={handleCancel}
//                 footer={null}
//                 title="Create Team"
//             >
//                 <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
//                     <Form.Item
//                         label="Team Name"
//                         name="TeamName"
//                         rules={[{ required: true, message: 'Please enter the Team Name' }]}
//                     >
//                         <Input placeholder="Enter Team Name" />
//                     </Form.Item>
//                     <Form.Item
//                         label="Employees"
//                         name="EmployeeId"
//                         rules={[{ required: true, message: 'Please select employees' }]}
//                     >
//                         <Select
//                             mode="multiple"
//                             placeholder="Select Employees"
//                         >
//                             {employees.map(employee => (
//                                 <Option key={employee._id} value={employee._id}>
//                                     {employee.Name}
//                                 </Option>
//                             ))}
//                         </Select>
//                     </Form.Item>
//                     <Form.Item>
//                         <Button type="primary" htmlType="submit">
//                             Create
//                         </Button>
//                         <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>
//                             Cancel
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default TeamPage;
import React, { useState, useEffect } from 'react';
import { Typography, Modal, Divider, Form, Input, Button, Select, message, Table } from 'antd';
import axios from 'axios';
import MenuList from '../Components/sideBar/MenuList';

const { Title } = Typography;
const { Option } = Select;

const Team = () => {
    const [teams, setTeams] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Load teams and employees when the component mounts
    useEffect(() => {
        loadTeams();
        loadEmployees();
    }, []);
    
    // Load teams with employees
    const loadTeams = async () => {
        try {
            const teamResponse = await axios.get('http://localhost:8000/api/get-team');
            const employeeResponse = await axios.get('http://localhost:8000/api/get-product');
    
            // Create a map for easy employee name lookup
            const employeesMap = employeeResponse.data.reduce((map, employee) => {
                map[employee._id] = employee.Name;
                return map;
            }, {});
    
            // Map team employees to include employee names
            const teamsWithEmployeeNames = teamResponse.data.map(team => ({
                ...team,
                employees: team.employees.map(employeeId => ({
                    _id: employeeId,
                    Name: employeesMap[employeeId] || 'Unknown'  // Handle missing names if needed
                }))
            }));
    
            setTeams(teamsWithEmployeeNames);
        } catch (error) {
            console.error('Error loading teams:', error);
        }
    };

    // Load employee data
    const loadEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/get-product');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    };

    // Show modal for creating a new team
    const showModal = () => {
        setModalVisible(true);
    };

    // Hide modal and reset form
    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    // Handle form submission to create a new team
    const handleFormSubmit = async (values) => {
        const payload = {
            TeamName: values.TeamName,
            employeeIds: values.EmployeeId.map(id => ({
                id,
                name: employees.find(emp => emp._id === id)?.Name
            })),
        };

        try {
            await axios.post('http://localhost:8000/api/add-team', payload);
            message.success('Team created successfully');
            loadTeams(); // Refresh the teams list
            handleCancel();
        } catch (error) {
            message.error('Failed to create team');
        }
    };

    // Filter teams based on search term
    const filteredTeams = teams.filter(team =>
        team.TeamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Columns for team table
    const columns = [
        {
            title: 'Team Name',
            dataIndex: 'TeamName',
            key: 'TeamName',
        },
        {
            title: 'Employees',
            dataIndex: 'employees',
            key: 'employees',
            render: (employees) => employees.map(employee => employee.Name).join(', ')
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <MenuList />

            {/* Search Box for teams */}
            <Input
                placeholder="Search teams"
                style={{ marginBottom: 20, width: 300 }}
                onChange={e => setSearchTerm(e.target.value)}
            />

            {/* Create Button */}
            <Button
                type="primary"
                onClick={showModal}
                style={{ marginBottom: 20 }}
            >
                Create Team
            </Button>

            {/* Teams Table */}
            <Table columns={columns} dataSource={filteredTeams} rowKey="_id" />

            {/* Modal to Create a Team */}
            <Modal
                visible={modalVisible}
                onCancel={handleCancel}
                footer={null}
                title="Create Team"
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                        label="Team Name"
                        name="TeamName"
                        rules={[{ required: true, message: 'Please enter the Team Name' }]}
                    >
                        <Input placeholder="Enter Team Name" />
                    </Form.Item>

                    <Form.Item
                        label="Employees"
                        name="EmployeeId"
                        rules={[{ required: true, message: 'Please select employees' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Select Employees"
                        >
                            {employees.map(employee => (
                                <Option key={employee._id} value={employee._id}>
                                    {employee.Name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

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
