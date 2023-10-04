import React from 'react';
import { Tag, Row, Col } from 'antd';

import { DashboardLayout } from '@/layout';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';

import RecentTable from './components/RecentTable';

import SummaryCard from './components/SummaryCard';
import PreviewCard from './components/PreviewCard';
import CustomerPreviewCard from './components/CustomerPreviewCard';

const dataTableColumns = [
  {
    title: 'Number',
    dataIndex: 'number',
  },
  {
    title: 'Client',
    dataIndex: ['customer_email'],
  },
  {
    title: 'Total',
    dataIndex: ['total'],

    render: (...params) => {
      const [total, data] = params;
      if (data) {
        // const realTotal = `${total}`;
        // realTotal.slice(realTotal.length - 2);
        return `${data?.currency.toUpperCase()} ${total}`.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      } else {
        return `$ ${total}`;
      }
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status) => {
      let color = status === 'Draft' ? 'volcano' : 'green';

      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
];

function formatCurrency(value) {
  return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default function DashboardModule() {
  const { result: invoiceResult, isLoading: invoiceLoading } = useFetch(() =>
    request.summary({ entity: 'invoice' })
  );

  const { result: clientResult, isLoading: clientLoading } = useFetch(() =>
    request.summary({ entity: 'client' })
  );

  const entityData = [
    {
      result: invoiceResult,
      isLoading: invoiceLoading,
      entity: 'invoice',
    },
  ];

  const cards = entityData.map((data, index) => {
    const { result, entity, isLoading } = data;

    console.log(invoiceResult);
    return (
      <SummaryCard
        key={index}
        title={data?.entity === 'paymentInvoice' ? 'Payment' : data?.entity}
        tagColor={
          data?.entity === 'invoice' ? 'cyan' : data?.entity === 'quote' ? 'purple' : 'green'
        }
        prefix={'This month'}
        isLoading={isLoading}
        tagContent={result?.total}
      />
    );
  });

  const statisticCards = entityData.map((data, index) => {
    const { result, entity, isLoading } = data;

    if (entity === 'payment') return null;

    return (
      <PreviewCard
        key={index}
        title={`${data?.entity.charAt(0).toUpperCase() + data?.entity.slice(1)} Preview`}
        isLoading={isLoading}
        entity={entity}
        statistics={
          !isLoading &&
          result?.performance?.map((item) => ({
            tag: item?.status,
            color: 'blue',
            value: item?.percentage,
          }))
        }
      />
    );
  });

  return (
    <DashboardLayout>
      <Row gutter={[24, 24]}>
        {cards}
        <SummaryCard
          title={'Total Customers'}
          tagColor={'green'}
          prefix={'Customers'}
          isLoading={clientLoading}
          tagContent={clientResult?.numberOfCustomers}
        />
        <SummaryCard
          title={'Active Subscriptions'}
          tagColor={'green'}
          prefix={'Active'}
          isLoading={clientLoading}
          tagContent={clientResult?.activeSubscriptions}
        />
        <SummaryCard
          title={'Ended Subscriptions'}
          tagColor={'red'}
          prefix={'Ended'}
          isLoading={clientLoading}
          tagContent={clientResult?.endedSubscriptions}
        />
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 18 }}>
          <div className="whiteBox shadow" style={{ minHeight: '380px', height: '100%' }}>
            <Row className="pad10" gutter={[0, 0]}>
              {statisticCards}
            </Row>
          </div>
        </Col>
        <Col className="gutter-row w-full" sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 6 }}>
          <CustomerPreviewCard
            isLoading={clientLoading}
            activeCustomer={clientResult?.active}
            newCustomer={clientResult?.new}
          />
        </Col>
      </Row>
      <div className="space30"></div>
      <Row gutter={[24, 24]}>
        <Col className="gutter-row w-full" sm={{ span: 24 }} lg={{ span: 24 }}>
          <div className="whiteBox shadow" style={{ height: '100%' }}>
            <div className="pad20">
              <h3 style={{ color: '#22075e', marginBottom: 5 }}>Recent Invoices</h3>
            </div>

            <RecentTable entity={'invoice'} dataTableColumns={dataTableColumns} />
          </div>
        </Col>
      </Row>
    </DashboardLayout>
  );
}
