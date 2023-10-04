import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button } from 'antd';
import { useSelector } from 'react-redux';

import dayjs from 'dayjs';

import { useCrudContext } from '@/context/crud';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { valueByString } from '@/utils/helpers';

export default function ReadItem({ config }) {
  let { readColumns, entity } = config;
  const { result: currentResult } = useSelector(selectCurrentItem);
  const { state } = useCrudContext();
  const { isReadBoxOpen } = state;
  const [listState, setListState] = useState([]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const list = [];
    readColumns.map((props) => {
      const propsKey = props.dataIndex;
      const propsTitle = props.title;
      const isDate = props.isDate || false;
      let value =
        currentResult && typeof currentResult[propsKey] === 'object'
          ? currentResult[propsKey]
          : valueByString(currentResult, propsKey);
      value = isDate ? dayjs(value).format('DD/MM/YYYY') : value;
      list.push({ propsKey, label: propsTitle, value: value });
    });
    console.log(currentResult, list);
    // if(entity==='package'){
    //   list.push({propsKey:})
    // }
    setListState(list);
  }, [currentResult]);

  const show = isReadBoxOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };

  const itemsList = listState.map((item) => {
    return (
      <Row key={item.propsKey} gutter={12}>
        <Col className="gutter-row" span={8}>
          <p>{item.label}</p>
        </Col>
        <Col className="gutter-row" span={2}>
          <p> : </p>
        </Col>
        <Col className="gutter-row" span={14}>
          {item.propsKey === 'prices' && entity === 'package' ? (
            item.value &&
            item.value.map((p) => (
              <Row>
                <Col className="gutter-row" span={8}>
                  <p> {p.currency}</p>
                </Col>
                <Col className="gutter-row" span={8}>
                  <p>{p.amount}</p>
                </Col>
                <Col className="gutter-row" span={8}>
                  <p> {p.interval}</p>
                </Col>
              </Row>
            ))
          ) : item.propsKey === 'features' && entity === 'package' ? (
            item.value &&
            item.value.map((p) => (
              <Row>
                <Col className="gutter-row" span={24}>
                  <p> {p.name}</p>
                </Col>
              </Row>
            ))
          ) : (
            <p>{item.value}</p>
          )}
        </Col>
      </Row>
    );
  });

  return <div style={show}>{itemsList}</div>;
}
