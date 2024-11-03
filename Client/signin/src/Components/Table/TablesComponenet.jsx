import { Table, Input, Button } from 'antd';
import React, { useState, useEffect } from 'react';

const TablesComponenet = ({ columns, dataSource, showModal, onSearch = () => {} }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (value) => {
    setSearchText(value);
    onSearch(value);
  };

  const filteredData = dataSource.filter(item =>
    (item.Name && item.Name.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.Email && item.Email.toLowerCase().includes(searchText.toLowerCase())) ||
    (item.MobileNumber && item.MobileNumber.toString().includes(searchText))
  );

  return (
    <div className='table-container'>
      <div className='table-controls' style={{ marginTop: '18px', marginLeft: '750px' }}>
        <Input.Search
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '200px', marginBottom: '5px' }}
        />
        <Button type='primary' className='mx-4' onClick={showModal}>Create</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        bordered
        style={{ marginTop: '15px', marginLeft: '195px' }}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
};


export default TablesComponenet;
