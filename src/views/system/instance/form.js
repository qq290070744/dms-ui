import { DMS_INSTANCE_TYPE } from '@/utils/const'

const base = () => [
  ['name', '名称', {
    required: true,
  }],
  ['username', '用户名', {
    required: true
  }],
  ['password', '密码', {
    component: 'a-input-password',
    attrs: { autocomplete: 'new-password' },
  }],
  ['host', '主机名', {
    required: true,
  }],
  ['type', '类型', {
    required: true,
    component: 'a-select',
    props: {
      options: DMS_INSTANCE_TYPE.$items
    },
    onChange: (v, _, { show, hide, isInit }) => {
      if (v === DMS_INSTANCE_TYPE.Redis) {
        hide(['username'])
      } else {
        show(['username'])
      }
      if (!isInit) {
        _.setFieldsValue({
          port: DMS_INSTANCE_TYPE.$map[v].port
        })
      }
    }
  }],
  ['port', '端口', {
    component: 'a-input-number',
    props: {
      max: 65536,
      min: 0,
    },
    required: true
  }],
  ['remark', '备注'],
]

export const redisFields = base()
