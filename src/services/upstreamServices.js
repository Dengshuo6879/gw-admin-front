/** 上游管理相关接口 */

import { request } from './requeset';
import api_url from '@/../config/api_url_config';
const { } = api_url;


// 角色相关接口错误码
export const upstreamErrCodeMsg = {

}

// 保存角色
export async function SaveRoleInfo(body) {
    return request(roleMgrBaseUrl + 'SaveRoleInfo', {
        method: 'POST',
        data: body
    });
}
