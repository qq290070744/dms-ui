<template>
  <page-view :avatar="avatar" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ user.name }}<span class="welcome-text">，{{ welcome }}</span></div>
      <div></div>
    </div>
    <div slot="extra">
      <a-row class="more-info"> </a-row>
    </div>

    <x-statistics></x-statistics>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'

import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import XStatistics from './components/statistics'
export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    XStatistics
  },
  data () {
    return {
      timeFix: timeFix(),
      avatar: '',
      user: {}
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.user.nickname,
      welcome: (state) => state.user.welcome
    }),
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="less" scoped>

</style>
