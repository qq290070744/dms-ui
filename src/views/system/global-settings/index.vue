<template>
  <basic-container>
    <x-form @submit="submit" :fields="fields"></x-form>
  </basic-container>
</template>

<script>
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
      ]
    }
  },
  methods: {
    submit (values) {
      console.log(values)
    }
  }
}
</script>

<style>

</style>
