import { history } from 'umi';
import { message } from 'antd';
import { extend } from 'umi-request';
const _extend = extend({
    timeout: 1000 * 60,
    headers: {
        'Content-Type': 'application/json',
    },
    errorHandler: function (error) {
        const errorData = error.data;
        if (errorData) {
            // 请求已发送但服务端返回状态码非 2xx 的响应
            const { errorCode, errorMessage } = errorData;
            // 令牌失效
            if (errorCode === 1004000) {
                message.error('访问令牌失效，请重新登录！', () => {
                    history.push('/login/');
                })
            }
        } else {
            // 请求初始化时出错或者没有响应返回的异常
            console.log('request error:', error.message);
        }

        return errorData || {}
    }
});

export const request = (url, obj) => {
    // 获取accessToken
    obj.headers = { ...obj.headers, accessToken: JSON.parse(localStorage.getItem('localStaffInfo') || '{}').accessToken }

    return _extend(url, obj)
}