import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { AuthorsListItemDataType } from './data';
import { List, Avatar } from 'antd';
import moment from 'moment';

interface AuthorsProps {
  dispatch: Dispatch,
  authorsList: AuthorsListItemDataType,
}

const authorsListMap = (authorsList: AuthorsListItemDataType) => {
  if (authorsList.hasOwnProperty('data')) {
    return (
        <List
          itemLayout="horizontal"
          split
          dataSource={authorsList['data']['author_list']}
          renderItem={(item:AuthorsListItemDataType) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href={`/catalog/books/${item._id}`}>{item['family_name']}{item['first_name']}</a>}
                description={
                  <div>
                    <p>BirthDay:{moment(`${item.date_of_birth}`).format("YYYY-MM-DD")}    -----    DeathDay:{moment(`${item.date_of_death}`).format("YYYY-MM-DD")}</p>
                  </div>
                  
                }  
              />
              <div><a href="/user/login">BooksList</a></div>
            </List.Item>
          )}
        />
    )

  } else {
    return (<div>no Author found!!</div>)

  }
}

class Authors extends PureComponent<AuthorsProps> {
  // 连接models层
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authorsList/getAuthorsList',
      payload: "",
    });
  }

  render() {
    const { authorsList } = this.props;
    const data = authorsList['data'];
    console.log(data);


    return (
      <PageHeaderWrapper>
        <div>{authorsListMap(authorsList)}</div>

      </PageHeaderWrapper>
    );
  }
}

export default connect((authorsList: any) => ({
  ...authorsList,
}))(Authors);