import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { LogoutOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Divider, PageHeader, Row } from 'antd';
import { useSelector } from 'react-redux';
import history from '@/utils/history';
import { selectCurrentItem } from '@/redux/crud/selectors';

const AdminInfo = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { ENTITY_NAME } = config;

  const { result } = useSelector(selectCurrentItem);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={ENTITY_NAME}
        ghost={false}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Row align="middle">
        <Col xs={{ span: 24 }} sm={{ span: 7 }} md={{ span: 5 }}>
          <img
            className="last left circle pad5"
            src={result?.photo}
            style={{
              width: '100px',
              height: '100px',
              border: '2px solid #1B98F5',
            }}
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 18 }}>
          <Descriptions labelStyle={{ fontSize: '17px' }} size="small">
            <Descriptions.Item label="Name" span="3" style={{ paddingTop: '20px' }}>
              <h3
                style={{
                  color: '#22075e',
                  textTransform: 'capitalize',
                }}
              >
                {result?.name}
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Email" span="3">
              <h3
                style={{
                  color: '#22075e',
                }}
              >
                {result?.email}
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Role" span="3">
              <h3
                style={{
                  color: '#22075e',
                  textTransform: 'capitalize',
                }}
              >
                {result?.role}
              </h3>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />
      <Button
        key={`${uniqueId()}`}
        icon={<LogoutOutlined />}
        className="right"
        onClick={() => history.push('/logout')}
      >
        Logout
      </Button>
    </>
  );
};

export default AdminInfo;
