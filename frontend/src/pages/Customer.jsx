import React from 'react';

import CrudModule from '@/modules/CrudModule';
import CustomerForm from '@/forms/CustomerForm';

function Customer() {
  const entity = 'client';
  const searchConfig = {
    displayLabels: ['company'],
    searchFields: 'company,managerSurname,managerName',
    outputValue: 'id',
  };

  const entityDisplayLabels = ['company'];

  const readColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'User Id',
      dataIndex: 'id',
    },
    {
      title: 'Package',
      dataIndex: 'packageType',
    },
    {
      title: 'Package expiry',
      dataIndex: 'expiryDate',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Ban',
      dataIndex: 'ban',
    },
    {
      title: 'Block',
      dataIndex: 'block',
    },
  ];
  const dataTableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'User Id',
      dataIndex: 'id',
    },
    {
      title: 'Package',
      dataIndex: 'packageType',
    },
    {
      title: 'Package expiry',
      dataIndex: 'expiryDate',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];

  const ADD_NEW_ENTITY = 'Add new customer';
  const DATATABLE_TITLE = 'Customers List';
  const ENTITY_NAME = 'customer';
  const CREATE_ENTITY = 'Create customer';
  const UPDATE_ENTITY = 'Update customer';
  const PANEL_TITLE = 'Customer Panel';

  const config = {
    entity,
    PANEL_TITLE,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    readColumns,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <CrudModule
      createForm={<CustomerForm />}
      updateForm={<CustomerForm isUpdateForm={true} />}
      config={config}
    />
  );
}

export default Customer;
