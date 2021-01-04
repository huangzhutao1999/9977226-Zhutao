import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { GenresListItemDataType } from './data';
import { List, Avatar } from 'antd';
import moment from 'moment';

interface GenresProps {
  dispatch: Dispatch,
  genresList: GenresListItemDataType,
}

const genresListMap = (genresList: GenresListItemDataType) => {
  if (genresList.hasOwnProperty('data')) {
    return (
        <List
          itemLayout="horizontal"
          split
          dataSource={genresList['data']['genre_list']}
          renderItem={(item:GenresListItemDataType) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href={`/catalog/books/${item._id}`}>{item.name}</a>}
              />
              <div><a href="/user/login">BooksList</a></div>
            </List.Item>
          )}
        />
    )

  } else {
    return (<div>no Genre found!!</div>)

  }
}

class Genres extends PureComponent<GenresProps> {
  // 连接models层
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'genresList/getGenresList',
      payload: "",
    });
  }

  render() {
    const { genresList } = this.props;
    const data = genresList['data'];
    console.log(data);


    return (
      <PageHeaderWrapper>
        <div>{genresListMap(genresList)}</div>

      </PageHeaderWrapper>
    );
  }
}

export default connect((genresList: any) => ({
  ...genresList,
}))(Genres);