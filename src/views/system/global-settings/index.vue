<template>
  <basic-container>
    <x-form @submit="submit" :fields="fields" :registerForm="registerForm"></x-form>
  </basic-container>
</template>

<script>
import { getGlobalConfig, setGlobalConfig } from '@/api/settings'

export default {
  data () {
    return {
      fields: [
        ['insulate_word_list', '脱敏字段', {
          component: 'a-textarea',
          props: {
            placeholder: '以逗号分隔'
          }
        }],
        ['max_limit', '查询最大Limit限制', {
          component: 'a-input-number',
          props: {
            min: 1
          }
        }],
        ['query_timeout', '查询超时时间/秒', {
          component: 'a-input-number',
          props: {
            min: 30
          }
        }],
      ],
      formVm: null
    }
  },
  mounted () {
    getGlobalConfig()
      .then((config) => {
        const { insulate_word_list, ...rest } = config
        this.formVm.setFieldsValue({
          ...rest,
          insulate_word_list: insulate_word_list.join(',')
        })
      })
  },
  methods: {
    submit (values) {
      values.insulate_word_list = values.insulate_word_list.split(',').filter(Boolean)
      setGlobalConfig(values)
        .then(() => {
          this.$message.success('更新成功')
        })
    },
    registerForm (formVm) {
      this.formVm = formVm
    }
  }
}
</script>

<style>

</style>
