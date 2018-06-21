import axios from 'axios';
import appStore from 'stores/appStore';
import { notification, message } from 'antd';
import { routerRedux } from 'react-router-dom';

axios.defaults.timeout = 180000;
axios.defaults.withCredentials = true;

const redirectToLogin = () => {
  window.localStorage.clear();
  window.location.href = '/user/login';
};

axios.interceptors.request.use(
  (config) => {
    if (config.method === 'post' && config.data) {
      if (config.headers['Content-Type'] !== 'application/json') {
        config.headers['Content-Type'] = 'multipart/form-data';
        const formData = new FormData();
        const object = config.data;

        Object.keys(object).forEach((key) => {
          if (object[key]) {
            if (object[key].constructor !== Array) {
              formData.append(key, object[key]);
            } else {
              const fileList = object[key];
              for (let i = 0; i < fileList.length; i += 1) {
                const item = fileList[i];
                formData.append(key, item);
              }
            }
          }
        });
        config.data = formData;
      }
    }
    if (config.method === 'get') {
      if (config.url.indexOf('unauthorizedError') > -1) {
        config.url.replace('unauthorizedError', 'api/unauthorizedError');
      }

      if (config.responseType === 'blob') {
        config.headers.Accept = '*/*';
        config.headers['Content-Type'] =
          'application/x-www-form-urlencoded;charset=UTF-8';
      } else if (config.url.endsWith('List')) {
        if (!config.params.page) {
          config.params.page = -1;
        }
        if (!config.params.pageLength) {
          config.params.pageLength = 50;
        }
      }
    }

    const isLoginded = window.localStorage.getItem('isLogined');
    const authToken = window.localStorage.getItem('token');
    if (isLoginded && authToken) {
      config.headers.common.Authorization = authToken;
    }
    config.withCredentials = true;
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => {
    appStore.hideLoading();
    return response.data;
  },
  (error) => {
    appStore.hideLoading();
    Promise.reject(error);
    redirectToLogin();
  }
);

export default function request(opt) {
  // 调用 axios api，统一拦截
  return axios(opt)
    .then((response) => {
      // 打印业务错误提示
      if (response.data && response.data.code !== '0000') {
        message.error(response.data.message);
      }

      return { ...response.data };
    })
    .catch((error) => {
      // 响应时状态码处理
      const { status } = error.response;

      notification.error({
        message: `请求错误 ${status}`
      });

      // 存在请求，但是服务器的返回一个状态码，它们都在2xx之外
      const { dispatch } = appStore;

      if (status === 401) {
        dispatch(routerRedux.push('/user/login'));
      } else if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
      } else if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
      } else if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }

      return { code: status };
    });
}

