<template>
  <span>
    <a-auto-complete
      v-if="editing"
      placeholder="搜索"
      @select="onSelect"
      @search="onSearch"
    >
      <template slot="dataSource">
        <a-select-option v-for="item in dataSource" :key="item.id" :user="item">
          <a-avatar :src="item.avatar" v-if="item.avatar"></a-avatar>
          {{ item.name }}
        </a-select-option>
      </template>
    </a-auto-complete>
    <span v-else-if="leader">{{ leader }} <a-icon type="edit" @click="editing = true" /> </span>
    <a v-else @click="editing = true">设置组长</a>
  </span>
</template>

<script>
import { getUserList } from '@/api/userList'
import { setOutsouringLeader } from '@/api/outsourcing'
export default {
  props: {
    group: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dataSource: [],
      editing: false,
      timer: null,
      tempName: ''
    }
  },
  computed: {
    leader () {
      return this.tempName || (this.group && this.group.leader_id ? this.group.leader_name : '')
    }
  },
  methods: {
    onSelect (value, option) {
      const user = option.data.attrs.user
      this.editing = false
      this.tempName = user.name
      setOutsouringLeader({
        leader_id: value,
        group_id: this.group.id
      }).then(() => {
        this.$message.success('设置成功')
      })
    },
    onSearch (name) {
      if (!name) {
        this.dataSource = []
        return
      }
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        getUserList({ q: name, page_size: 50 })
          .then((res) => {
            this.dataSource = res.records || []
          })
      }, 200)
    }
  }
}
</script>

<style>

</style>
