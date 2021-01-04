// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  // block:{
  //   defaultGitUrl: 'https://gitee.com/ant-design/ant-design-blocks.git'
  // },
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/',
          component: './home/layouts/HomeLayout',
          routes: [
            {
              path: '/',
              component: './welcome',
            },
            {
              name: 'home',
              icon: 'home',
              path: '/home',
              component: './home/index',
            },
            {
              name: 'catalog',
              icon: 'book',
              path: '/catalog',
              routes: [
                {
                  path: '/',
                  redirect: '/home',
                },
                {
                  name: 'genre',
                  icon: 'genre',
                  path: '/catalog/genres',
                  component: './catalog/genre/index',
                },
                {
                  name: 'book',
                  icon: 'book',
                  path: '/catalog/books',
                  component: './catalog/book/index',
                },
                {
                  name: 'author',
                  icon: 'author',
                  path: '/catalog/authors',
                  component: './catalog/author/index',
                },
                {
                  name: 'bookInstance',
                  icon: 'book',
                  path: '/catalog/bookInstances',
                  component: './catalog/bookinstance/index',
                },
                {
                  name: 'search',
                  icon: 'smile',
                  path: '/catalog/search',
                  component: './catalog/search/index',
                },
                {
                  component: '404',
                },
              ],
            },
            {
              path: '/user',
              // component: '../layouts/UserLayout',
              routes: [
                {
                  path: '/user',
                  redirect: '/user/login',
                },
                {
                  name: 'login',
                  icon: 'smile',
                  path: '/user/login',
                  component: './user/login',
                },
                {
                  name: 'register-result',
                  icon: 'smile',
                  path: '/user/register-result',
                  component: './user/register-result',
                },
                {
                  name: 'register',
                  icon: 'smile',
                  path: '/user/register',
                  component: './user/register',
                },
                {
                  component: '404',
                },
              ],
            },
            {
              name: 'account',
              icon: 'user',
              path: '/',
              Routes: ['src/pages/Authorized'],
              authority: ['admin', 'user'],
              routes: [
                {
                  name: 'account',
                  icon: 'user',
                  path: '/account',
                  routes: [
                    {
                      path: '/',
                      redirect: '/welcome',
                    },
                    {
                      name: 'center',
                      icon: 'smile',
                      path: '/account/center',
                      component: './account/center',
                    },
                    {
                      name: 'settings',
                      icon: 'smile',
                      path: '/account/settings',
                      component: './account/settings',
                    },
                  ],
                },
                {
                  path: '/profile',
                  name: 'profile',
                  icon: 'profile',
                  routes: [
                    {
                      path: '/',
                      redirect: '/welcomme',
                    },
                    {
                      name: 'basic',
                      icon: 'smile',
                      path: '/profile/basic',
                      component: './profile/basic',
                    },
                  ],
                },
                {
                  name: 'exception',
                  icon: 'warning',
                  path: '/exception',
                  routes: [
                    {
                      path: '/',
                      redirect: '/exception/403',
                    },
                    {
                      name: '403',
                      icon: 'smile',
                      path: '/exception/403',
                      component: './exception/403',
                    },
                    {
                      name: '404',
                      icon: 'smile',
                      path: '/exception/404',
                      component: './exception/404',
                    },
                    {
                      name: '500',
                      icon: 'smile',
                      path: '/exception/500',
                      component: './exception/500',
                    },
                  ],
                },
                {
                  component: '404',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  mock: {
    exclude: ['mock/user'],
  },
  manifest: {
    basePath: '/',
  },
  exportStatic: {},
  esbuild: {},
});
