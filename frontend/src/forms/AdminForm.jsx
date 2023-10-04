import SelectAsync from '@/components/SelectAsync';
import { Form, Input, Select } from 'antd';

export default function AdminForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
    </>
  );
}
