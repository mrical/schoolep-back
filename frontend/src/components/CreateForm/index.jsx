import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectCreatedItem } from '@/redux/crud/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

export default function CreateForm({ config, formElements }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;
  const [form] = Form.useForm();
  const onSubmit = (fieldsValue) => {
    console.log('🚀 ~ file: index.jsx ~ line 19 ~ onSubmit ~ fieldsValue', fieldsValue);

    // Manually trim values before submission
    let newValues = fieldsValue;

    let trimmedValues = Object.keys(newValues).reduce((acc, key) => {
      acc[key] = typeof fieldsValue[key] === 'string' ? fieldsValue[key].trim() : fieldsValue[key];
      return acc;
    }, {});
    if (entity === 'package') {
      trimmedValues = {
        name: trimmedValues.name,
        highlighted: trimmedValues.highlighted,
        features: trimmedValues.features,
        requestLimit: trimmedValues.requestLimit,
        prices: [
          { amount: trimmedValues['monthlyAmountINR'], interval: 'month', currency: 'inr' },
          { amount: trimmedValues['monthlyAmountUSD'], interval: 'month', currency: 'usd' },
          { amount: trimmedValues['yearlyAmountINR'], interval: 'year', currency: 'inr' },
          { amount: trimmedValues['yearlyAmountUSD'], interval: 'year', currency: 'usd' },
        ],
      };
    }
    console.log(trimmedValues);
    dispatch(crud.create({ entity, jsonData: trimmedValues }));
  };

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'create' }));
      dispatch(crud.list({ entity }));
    }
  }, [isSuccess]);

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {formElements}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Loading>
  );
}
