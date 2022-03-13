/** 路由管理相关接口 */

import { request } from './requeset';
import api_url from '@/../config/api_url_config';
const { } = api_url;



// 成员相关接口错误码
export const routeErrCodeMsg = {

}

// 创建成员
export async function CreateStaff(body) {
  return request(staffMgrBaseUrl + 'CreateStaff', {
    method: 'POST',
    data: body
  });
}