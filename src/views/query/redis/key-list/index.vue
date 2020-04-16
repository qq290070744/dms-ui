<template>
  <div class="redis-key">
    <p class="redis-key--title">对象列表</p>
    <div class="redis-key--function-area">
      <a-row :gutter="8">
        <a-col :span="18">
          <a-select :options="redis.list" v-model="redis.curr" size="small" style="width: 100%"></a-select>
        </a-col>
        <a-col :span="6">length</a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :span="18">
          <a-input-search placeholder="输入关键字，按回车搜索" @pressEnter="doSearch" size="small"></a-input-search>
        </a-col>
        <a-col :span="6">
          <a-checkbox v-model="exactSearch">精确搜索</a-checkbox>
        </a-col>
      </a-row>
    </div>
    <redis-key-list></redis-key-list>
  </div>
</template>

<script>
import RedisKeyList from './content-list'
export default {
  components: {
    RedisKeyList
  },
  data () {
    return {
      redis: {
        curr: '',
        list: [{ label: 'DBO', value: 'DBO' }]
      },
      exactSearch: false
    }
  },
  methods: {
    doSearch (e) {
      // exactSearch
      console.log(e.target.value)
    }
  }
}
</script>

<style>
</style>
