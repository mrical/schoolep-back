import React from 'react';
// import {
//   DesktopOutlined,
//   SettingOutlined,
//   CustomerServiceOutlined,
//   FileTextOutlined,
//   FileSyncOutlined,
//   DashboardOutlined,
//   TeamOutlined,
//   UserOutlined,
//   CreditCardOutlined,
//   BankOutlined,
// } from "@ant-design/icons";

// export const IconMenu = ({ name }) => {
//   const components = {
//     DesktopOutlined: DesktopOutlined,
//     SettingOutlined: SettingOutlined,
//     CustomerServiceOutlined: CustomerServiceOutlined,
//     FileTextOutlined: FileTextOutlined,
//     FileSyncOutlined: FileSyncOutlined,
//     DashboardOutlined: DashboardOutlined,
//     TeamOutlined: TeamOutlined,
//     UserOutlined: UserOutlined,
//     CreditCardOutlined: CreditCardOutlined,
//     BankOutlined: BankOutlined,
//     Default: DesktopOutlined,
//   };

//   const IconTag = components[name || "Default"] || SettingOutlined;
//   return <IconTag />;
// };

export const routesConfig = [
  {
    path: '/',
    component: 'Dashboard',
  },
  {
    path: '/customer',
    component: 'Customer',
  },
  {
    path: '/invoice',
    component: 'Invoice/index',
  },
  {
    path: '/invoice/create',
    component: 'Invoice/InvoiceCreate',
  },
  {
    path: '/invoice/read/:id',
    component: 'Invoice/InvoiceRead',
  },
  {
    path: '/invoice/update/:id',
    component: 'Invoice/InvoiceUpdate',
  },
  {
    path: '/invoice/pay/:id',
    component: 'Invoice/InvoiceRecord',
  },
  {
    path: '/packages',
    component: 'Packages',
  },
  {
    path: '/settings',
    component: 'Settings/Settings',
  },
  {
    path: '/profile',
    component: 'Profile',
  },
];
