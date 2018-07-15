import Vue from 'vue';
import Router from 'vue-router';
import { Message } from 'element-ui';
import NProgress from 'nprogress';

// 导入组件
const Login = () => import('@/views/Login');
const Home = () => import('@/views/Home');
const Users = () => import('@/views/users/Users.vue');
const Rights = () => import('@/views/roles/Rights');
const Roles = () => import('@/views/roles/Roles');
const Category = () => import('@/views/goods/Category');
const GoodsList = () => import('@/views/goods/List');
const GoodsAdd = () => import('@/views/goods/Add');
const OrderList = () => import('@/views/orders/List');
const Reports = () => import('@/views/reports/Index');

Vue.use(Router);

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      // 子路由，将来子路由的切换 是在Home组件中完成的
      // 子路由使用之前，home组件已经创建完毕
      children: [
        // 用户列表
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'category',
          path: '/categories',
          component: Category
        },
        {
          name: 'goods-list',
          path: '/goods',
          component: GoodsList
        },
        {
          name: 'goods-add',
          path: 'goods/add',
          component: GoodsAdd
        },
        {
          name: 'order-list',
          path: 'orders',
          component: OrderList
        },
        {
          name: 'reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
});

// 路由的前置守卫
// 全局守卫：任何视图的导航都会经过这里
router.beforeEach((to, from, next) => {
  // 每一次页面的导航都让 NProgress 启动
  NProgress.start();
  // console.log(to, from);
  // 判断当前访问的路由是否是login，如果是login直接next
  if (to.name === 'login') {
    next();
  } else {
    // 判断有没有token
    const token = sessionStorage.getItem('token');
    if (!token) {
      // 跳转到登录页面
      router.push({ name: 'login' });
      // 提示
      Message.warning('请先登录');
      return;
    }
    next();
  }
});

router.afterEach((to, from) => {
  NProgress.done();
});

export default router;
