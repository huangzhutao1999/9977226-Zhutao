import { LoginOutlined } from '@ant-design/icons';
import { Menu} from 'antd';
import React from 'react';
import { history, ConnectProps, connect } from 'umi';
import { CurrentUser } from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export interface LoginRegisterProps extends Partial<ConnectProps> {
  currentUser?: CurrentUser;
  menu?: boolean;
}


class LoginRegisterDropdown extends React.Component<LoginRegisterProps> {
  onMenuClick = (event: {
    key: React.Key;
    keyPath: React.Key[];
    item: React.ReactInstance;
    domEvent: React.MouseEvent<HTMLElement>;
  }) => {
    const { key } = event;

    if (key === 'login') {
      const { dispatch } = this.props;
    //   if (dispatch) {
    //     dispatch({
    //       type: 'user/login',
    //     });
    //   }

      return;
    }

    if (key === 'register') {
        const { dispatch} = this.props;
        // if(dispatch) {
        //     dispatch({
        //         type:'user/register'
        //     })
        // }
        return;
    }
  };



  render(): React.ReactNode {
    const menu = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="login">
            <LoginOutlined />
            <a href="/user/login">Login</a>
          </Menu.Item>
        )}
        {menu && <Menu.Divider />}

        <Menu.Item key="register">
          <LoginOutlined />
          <a href="/user/register">Register</a>
        </Menu.Item>
      </Menu>
    );
    return (
    <>
     <HeaderDropdown overlay={menuHeaderDropdown}>
        <a href="/user/login">Login/Register</a>
    </HeaderDropdown>
    </> 
    );
  }
}

export default LoginRegisterDropdown;
