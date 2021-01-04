import { Tooltip, Tag } from 'antd';
import { Settings as ProSettings } from '@ant-design/pro-layout';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectProps, SelectLang } from 'umi';
import { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import LoginRegister from './LoginRegisterDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';
import { CurrentUser } from '@/models/user';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';

export interface GlobalHeaderRightProps extends Partial<ConnectProps>, Partial<ProSettings> {
  theme?: ProSettings['navTheme'] | 'realDark';
  currentUser?: CurrentUser;
}
const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const Authorized = RenderAuthorized(getAuthority());    //管理员权限

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout} = props;
  let className = styles.right;
  

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const UseDropdown = () =>{

    const token = localStorage.getItem('token');
    const isLogin = (props.currentUser && props.currentUser.userid) || token;
    
    if (isLogin) {
      return (
          <Authorized authority={['admin', 'user']}>
            <NoticeIconView />
            <Avatar menu />
          </Authorized>
      )
 
    } else {
      return (<LoginRegister menu />)
    }

  }


  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue="Foundation"
        options={[
          {
            label: <a href="/catalog/books">books</a>,
            value: 'Foundation',
          },
          {
            label: <a href="/catalog/genres">genres</a>,
            value: 'history ',
          },
          {
            label: <a href="/catalog/authors">authors</a>,
            value: 'Isaac',
          },
          {
            label: <a href="/catalog/bookInstances">book instances</a>,
            value: '可供借阅',
          },
        ]} 
        onSearch={value => {
        console.log('input', value);
      }}
      />
      {/* <Tooltip title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://pro.ant.design/docs/getting-started"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip> */}

     {UseDropdown()}
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
}))(GlobalHeaderRight);
