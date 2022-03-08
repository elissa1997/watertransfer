import {instance_api, instance_test_local} from "../axios.js";

export function waterVolList(params) {
  return instance_api({
    url: 'gateway/only.do',
    method: 'get',
    params
  })
}

export function publish(params, data) {
  return instance_api({
    url: 'gateway/only.do',
    method: 'post',
    params,
    data
  })
}

export function update(params, data) {
  return instance_api({
    url: 'gateway/only.do',
    method: 'post',
    params,
    data
  })
}