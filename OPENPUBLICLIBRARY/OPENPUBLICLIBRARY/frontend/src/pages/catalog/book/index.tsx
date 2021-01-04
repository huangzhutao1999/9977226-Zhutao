import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import { BooksListItemDataType } from './data';
import { List, Avatar } from 'antd';

interface BooksProps {
  dispatch: Dispatch,
  booksList: BooksListItemDataType,
}

// const BookItem = List.create()

const booksListMap = (booksList: BooksListItemDataType) => {
  if (booksList.hasOwnProperty('data')) {
    // return  booksList['data']['book_list'].map((value: any, key: any) => {
    //   return (
    //     <div className="col-sm-6" key={key}>
    //         <div className="media">
    //             <div style={{position:"relative"}}><h4 className="media-heading">{value.title}</h4></div>
    //             <div style={{position:"relative"}} className="media-body">
    //                 <h5>author</h5>
    //                 <span>{value.author['family_name']}{value.author['first_name']}</span>
    //                 <br />

    //             </div>
    //             <div style={{position:"relative"}}>
    //                 <a style={{bottom:"0",right:"0"}} href={`/catalog/books/${value._id}`} className="btn btn-primary vertical-bottom">详情</a>
    //                 <br />
    //             </div>
    //             <hr />
    //         </div>
    //     </div>
    //   );
    // })
    return (
        <List
          itemLayout="horizontal"
          split
          dataSource={booksList['data']['book_list']}
          renderItem={(item:BooksListItemDataType) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href={`/catalog/books/${item._id}`}>{item.title}</a>}
                description={
                  <div>
                    <a href={`/catalog/authors`}>Author:</a> <a href={`/catalog/authors/author`}>{item.author['family_name']}{item.author['first_name']}</a>
                  </div>
                  
                }  
              />
              <div><a href="/user/login">Loan</a></div>
            </List.Item>
          )}
        />
    )

  } else {
    return (<div>no book found!!</div>)

  }
}

class Books extends PureComponent<BooksProps> {
  // 连接models层
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'booksList/getBooksList',
      payload: "",
    });
  }

  render() {
    const { booksList } = this.props;
    const data = booksList['data'];
    console.log(data);


    return (
      <PageHeaderWrapper>
        <div>{booksListMap(booksList)}</div>

      </PageHeaderWrapper>
    );
  }
}

export default connect((booksList: any) => ({
  ...booksList,
}))(Books);