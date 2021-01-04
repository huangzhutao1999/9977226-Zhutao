import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { BookInstancesListItemDataType } from './data';
import { List, Avatar } from 'antd';
import moment from 'moment';

interface BookInstancesProps {
  dispatch: Dispatch,
  bookInstancesList: BookInstancesListItemDataType,
}


const bookInstancesListMap = (bookInstancesList: BookInstancesListItemDataType) => {
  if (bookInstancesList.hasOwnProperty('data')) {
    return (
        <List
          itemLayout="horizontal"
          split
          dataSource={bookInstancesList['data']['bookinstance_list']}
          renderItem={(item:BookInstancesListItemDataType) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href={`/catalog/bookInstances/${item._id}`}>{item.book['title']}</a>}
                description={
                  <div>
                    <p>Author: {item.book['author']}</p>
                    <p>ISBN:{item.book['isbn']}</p>
                    <p><a href="/user/login">{item.status}</a>(Due: {moment(item.due_back).format("MMMM Do YYYY")})</p>
                    <p>{item.imprint}</p>
                    <p>{item.book['summary']}</p>
                    
                  </div>
                  
                }  
              />
            </List.Item>
          )}
        />
    )

  } else {
    return (<div>no book found!!</div>)

  }
}

class Books extends PureComponent<BookInstancesProps> {
  // 连接models层
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bookInstancesList/getBookInstancesList',
      payload: "",
    });
  }

  render() {
    const { bookInstancesList } = this.props;
    const data = bookInstancesList['data'];
    console.log(data);


    return (
      <PageHeaderWrapper>
        <div>{bookInstancesListMap(bookInstancesList)}</div>
      </PageHeaderWrapper>
    );
  }
}

export default connect((bookInstancesList: any) => ({
  ...bookInstancesList,
}))(Books);