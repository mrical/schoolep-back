import PackageForm from '@/forms/PackageForm';
import CrudModule from '@/modules/CrudModule';
import React from 'react';

const Packages = () => {
  const entity = 'package';
  const searchConfig = {
    displayLabels: ['name', 'surname'],
    searchFields: 'email,name,surname',
    outputValue: 'id',
  };

  const PANEL_TITLE = 'Packages';
  const dataTableTitle = 'Package Lists';
  const entityDisplayLabels = ['email'];

  const readColumns = [
    { title: 'Id', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Highlighted', dataIndex: 'highlighted' },
    { title: 'Features', dataIndex: 'features' },
    { title: 'Prices', dataIndex: 'prices' },
  ];

  const dataTableColumns = [
    { title: 'Id', dataIndex: 'id' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Highlighted', dataIndex: 'highlighted' },
  ];
  const ADD_NEW_ENTITY = 'Add new package';
  const DATATABLE_TITLE = 'Package List';
  const ENTITY_NAME = 'package';
  const CREATE_ENTITY = 'Create package';
  const UPDATE_ENTITY = 'Update package';

  const config = {
    entity,
    PANEL_TITLE,
    dataTableTitle,
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
      createForm={<PackageForm />}
      // updateForm={<PackageForm isUpdateForm={true} />}
      config={config}
    />
  );
};

export default Packages;
