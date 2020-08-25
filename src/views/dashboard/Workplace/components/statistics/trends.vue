<template>
  <x-wrapper :title="title" :loading="!data" :empty="data && !data.length">
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" :padding="[20, 50, 20, 50]">
      <v-tooltip />
      <v-axis />
      <v-line position="date*count" />
      <v-point position="date*count" shape="circle" />
    </v-chart>
  </x-wrapper>
</template>

<script>
import XWrapper from '../wrapper'
const scale = [{
  dataKey: 'date',
}, {
  dataKey: 'count',
  min: 0,
}]

export default {
  components: {
    XWrapper
  },
  props: {
    data: {
      type: Array,
      default: () => null
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scale,
      height: 300
    }
  }
}
</script>
