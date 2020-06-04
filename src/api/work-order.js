import { axios } from '@/utils/request'
import { genPage, transform } from './utils'

export function createWorkOrder (params) {
  return axios.post('/work_order/submit_work_order', params)
}

export function changeAuditor (params) {
  return axios.post('/work_order/mod_assigned', params)
}

export function cancelWorkOrder (params) {
  return axios.post('/work_order/undo_work_order', params)
}

export function myReviewWorkOrder (params) {
  return axios.get('/work_order/my_assigned_order', { params: transform(params) }).then((data) => {
    return genPage(data, params)
  })
}

export function mySubmitWorkOrder (params) {
  return axios.get('/work_order/my_order', { params: transform(params) }).then((data) => {
    return genPage(data, params)
  })
}

export function getWorkOrder (workId) {
  return axios.get('/work_order/get_audit_order_details', { params: { work_id: workId } })
}

export function getRollbackSql (workId) {
  return axios.get('/work_order/get_order_rollbacks', { params: { work_id: workId } })
}

export function workOrderByKey (keyname) {
  return axios.post('/work_order/q_redis_key', { keyname })
}

export function execWorkOrder (id, type) {
  return axios.post(`/work_order/${type}/exec`, { work_id: id })
}

export function rejectWorkOrder (id, rejected) {
  return axios.post(`/work_order/rejected_work_order`, { work_id: id, rejected })
}

export function queryWorkOrderExection (id) {
  return axios.get(`/work_order/get_order_exec_info`, { params: { work_id: id } })
}

export function beautySql (params) {
  return axios.post('/work_order/mysql/beauty', params)
}

export function mergeAlterSql (params) {
  return axios.post('/work_order/mysql/alter_merge', params)
}

// 获取sql优化建议 信息
export function sqlSuggestions (params) {
  return axios.post('/work_order/mysql/get_optimization_suggestions', params)
}

const checkedResultColumns = [
  { title: '检测语句', dataIndex: 'sql' },
  { title: '错误等级', dataIndex: 'error_level' },
  { title: '错误信息', dataIndex: 'error_message' },
  { title: '执行时间', dataIndex: 'execute_time' },
  { title: '影响行数', dataIndex: 'affected_rows' },
  { title: '阶段', dataIndex: 'stage' },
  { title: '阶段状态', dataIndex: 'stage_status' },
]

export function checkSql (params) {
  return new Promise((resolve, reject) => {
    axios.post('/work_order/mysql/check_sql', params, {
      customErrorHandler ({ data }) {
        return data
      }
    }).then((result) => {
      if (result.code) {
        // eslint-disable-next-line
        reject({ records: result.data, title: checkedResultColumns })
      } else {
        resolve({ records: result, title: checkedResultColumns })
      }
    })
  })
}

export function getDDLOsc (workId) {
  return axios.get('/work_order/mysql/get_osc', { params: { work_id: workId } })
}
export function operateOsc (SQLSHA1, action) {
  return axios.post(`/work_order/mysql/${action}_osc`, { SQLSHA1 })
}
