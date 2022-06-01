import {instance_api} from "./axios.js";

// 获取通知内容
export function userInfo() {
  return instance_api({
    url: process.env.VUE_APP_API + 'gateway/only.do',
    method: 'get',
    params: { action: "getUser" }
  })
}