<template>
  <basic-container>
    <a-tabs>
      <a-tab-pane key="audit-policies" tab="审核规则">
        <x-policies></x-policies>
      </a-tab-pane>
      <a-tab-pane key="gh-policies" tab="GH_OSC设置">
        <x-policies :type="GH_OSC"></x-policies>
      </a-tab-pane>
      <a-tab-pane key="pt-policies" tab="PT_OSC设置">
        <x-policies :type="PT_OSC"></x-policies>
      </a-tab-pane>
      <a-tab-pane key="cl-policies" tab="自定义审核级别">
        <x-policies :type="CUTSOM_LEVEL"></x-policies>
      </a-tab-pane>
    </a-tabs>
  </basic-container>
</template>

<script>
import XPolicies from './policies'
import { GH_OSC, PT_OSC, CUTSOM_LEVEL } from '@/api/settings'

export default {
  components: {
    XPolicies
  },
  data () {
    return {
      active: 'audit-policies',
      GH_OSC,
      PT_OSC,
      CUTSOM_LEVEL
    }
  }
}
</script>

<style>

</style>
