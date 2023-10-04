import SelectAsync from '@/components/SelectAsync';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, InputNumber, Select, Space } from 'antd';

export default function PackageForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input Package Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      <Space>
        <Form.Item
          label="Monthly Amount(in INR)"
          name="monthlyAmountINR"
          rules={[
            {
              required: true,
              message: 'Please input a Amount!',
            },
          ]}
        >
          <InputNumber autoComplete="off" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Yearly Amount(in INR)"
          name="yearlyAmountINR"
          rules={[
            {
              required: true,
              message: 'Please input a Amount!',
            },
          ]}
        >
          <InputNumber autoComplete="off" style={{ width: '100%' }} />
        </Form.Item>
      </Space>
      <Space>
        <Form.Item
          label="Monthly Amount(in USD)"
          name="monthlyAmountUSD"
          rules={[
            {
              required: true,
              message: 'Please input a Amount!',
            },
          ]}
        >
          <InputNumber autoComplete="off" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Yearly Amount(in USD)"
          name="yearlyAmountUSD"
          rules={[
            {
              required: true,
              message: 'Please input a Amount!',
            },
          ]}
        >
          <InputNumber autoComplete="off" style={{ width: '100%' }} />
        </Form.Item>
      </Space>
      <Space style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Form.Item
          label="AI Chat Requests Limit"
          name="requestLimit"
          rules={[
            {
              required: true,
              message: 'Please input Requests Limit!',
            },
          ]}
        >
          <InputNumber autoComplete="off" />
        </Form.Item>
        <Form.Item
          label="Highlighted"
          name="highlighted"
          initialValue={false}
          valuePropName="checked"
          rules={[]}
        >
          <Checkbox defaultChecked={false} />
        </Form.Item>
      </Space>
      <Form.List
        name="features"
        label="Features"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('At least 1 feature'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Space align="baseline">
                <Form.Item
                  // label="Feature"
                  label={index === 0 ? 'Feature' : ''}
                  name={[field.name, 'name']}
                  rules={[
                    {
                      required: true,
                      message: 'Please input a Feature!',
                    },
                  ]}
                >
                  <Input autoComplete="off" style={{ width: '100%' }} />
                </Form.Item>
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                ) : null}
              </Space>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '100%' }}
                icon={<PlusOutlined />}
              >
                Add Feature
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
