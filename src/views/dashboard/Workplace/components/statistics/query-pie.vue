<template>
  <x-wrapper :title="title" :loading="!dataSource" :empty="dataSource && !dataSource.length">
    <v-chart :forceFit="true" :height="height" :data="dataSource" :scale="scale">
      <v-tooltip :showTitle="false" dataKey="name*percent" />
      <v-axis />
      <v-legend dataKey="name" />
      <v-pie position="percent" color="name" :v-style="pieStyle" :label="labelConfig" />
      <v-coord type="theta" />
    </v-chart>
  </x-wrapper>
</template>

<script>
import XWrapper from '../wrapper'
const DataSet = require('@antv/data-set')

const scale = [{
  dataKey: 'percent',
  min: 0,
  formatter: '.0%',
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
      height: 270,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      labelConfig: ['percent', {
        formatter: (val, item) => {
          const { name, count } = item.point
          return `${name}: ${count}(${val})`
        }
      }],
    }
  },
  computed: {
    dataSource () {
      if (!this.data) {
        return null
      }
      const dv = new DataSet.View().source(this.data)
      dv.transform({
        type: 'percent',
        field: 'count',
        dimension: 'name',
        as: 'percent'
      })
      const data = dv.rows
      return data
    }
  }
}
</script>
