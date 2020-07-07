const username = [
  ['username', '用户名', {
    required: true
  }],
]
const base = (username = []) => [
  ['name', '名称', {
    required: true
  }],
  ...username,
  ['password', '密码', {
    component: 'a-input-password',
    attrs: { autocomplete: 'new-password' },
  }],
  ['host', '主机名', {
    required: true,
  }],
  ['port', '端口', {
    component: 'a-input-number',
    props: {
      max: 65536,
      min: 0,
    },
    defaultValue: username.length ? '3306' : '6379',
    required: true
  }],
  ['remark', '备注'],
]

export const mysqlFields = base(username)
export const redisFields = base()
