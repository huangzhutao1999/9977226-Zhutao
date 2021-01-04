import React, { useState, FC, useEffect } from 'react';
import { Button, Card, Col, Form, List, Row, Select, Tag } from 'antd';
import { LoadingOutlined, StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { connect, Dispatch } from 'umi';
import ArticleListContent from './components/ArticleListContent';
import { StateType } from './model';
import { SearchListItemDataType } from './data.d';
// import StandardFormRow from './components/StandardFormRow';
// import TagSelect from './components/TagSelect';
import styles from './style.less';

import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';

const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
      color: '#1890ff',
    }}
  />
);


const pageSize = 5;

interface ArticlesProps {
  dispatch: Dispatch<any>;
  catalogAndsearch: StateType;
  loading: boolean;
}
const Articles: FC<ArticlesProps> = ({ dispatch, catalogAndsearch: { list }, loading }) => {
  console.log(list);
  // useEffect(() => {
  //   // dispatch({
  //   //   type: 'catalogAndsearch/queryList',
  //   //   payload: list
  //   // });
  // }, []);

  const fetchMore = () => {
    dispatch({
      type: 'catalogAndsearch/appendFetch',
      payload: {
        count: pageSize,
      },
    });
  };

  const onSearch = (value: any) => {
    dispatch({
      type: 'catalogAndsearch/fetch',
      payload: {
        value: value,
      },
    });
  }

  const IconText: React.FC<{
    type: string;
    text: React.ReactNode;
  }> = ({ type, text }) => {
    switch (type) {
      case 'star-o':
        return (
          <span>
            <StarOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'like-o':
        return (
          <span>
            <LikeOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      case 'message':
        return (
          <span>
            <MessageOutlined style={{ marginRight: 8 }} />
            {text}
          </span>
        );
      default:
        return null;
    }
  };

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 12 },
    },
  };

  // const list = [];
  const loadMore = list.length > 0 && (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <Button onClick={fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
        {loading ? (
          <span>
            <LoadingOutlined /> 加载中...
          </span>
        ) : (
            '加载更多'
          )}
      </Button>
    </div>
  );

  return (
    <>
      <Card bordered={false}>
        <Search
          placeholder="input search text"
          defaultValue="Foundation"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
        />
      </Card>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '8px 32px 32px 32px' }}
      >
        <List<SearchListItemDataType>
          size="large"
          loading={list.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={list['books']}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              extra={<div className={styles.listItemExtra} />}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={item.href}>
                    {item.title}
                  </a>
                }
                description={
                  <div>
                    <p><a href={`/catalog/authors/${item.author['_id']}`}>{item.author['family_name']}{item.author['first_name']}</a></p>
                    <p><a href={`/catalog/genres/${item.genre['_id']}`}>{item.genre['name']}</a></p>
                    <p>{item.isbn}</p>
                    <p>{item.summary}</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <List<SearchListItemDataType>
          size="large"
          loading={list.length === 0 ? loading : false}
          rowKey="id"
          itemLayout="vertical"
          loadMore={loadMore}
          dataSource={list['bookinstances']}
          renderItem={(item) => (
            <List.Item
              key={item._id}
            >
              <List.Item.Meta
                title={
                  <a className={styles.listItemMetaTitle} href={`/catalog/books/${item.book['_id']}`}>
                    {item.book['title']}
                  </a>
                }
                description={
                  <div>
                    <p>{item.imprint}</p>
                    <p>{item.due_back}</p>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default connect(
  ({
    catalogAndsearch,
    loading,
  }: {
    catalogAndsearch: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    catalogAndsearch,
    loading: loading.models.catalogAndsearch,
  }),
)(Articles);
