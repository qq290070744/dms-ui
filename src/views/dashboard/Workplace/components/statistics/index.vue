<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="8">
        <x-db-query-top5 title="查询前5的数据库" :data="statistics.DataTop5"></x-db-query-top5>
      </a-col>
      <a-col :span="8">
        <x-query-pie title="查询类型统计" :data="statistics.QueryStatistics"></x-query-pie>
      </a-col>
      <a-col :span="8">
        <x-query-pie title="工单类型统计" :data="statistics.WorkOrderSubmissionStatistics"></x-query-pie>
      </a-col>
    </a-row>
    <x-trends title="数据工单提交数量趋势" :data="statistics.DatabaseWorkordertrends"></x-trends>
    <x-trends title="权限工单提交数量趋势" :data="statistics.AuthorityWorkordertrends"></x-trends>
    <x-trends title="导出工单提交数量趋势" :data="statistics.DataExporworkordertrends"></x-trends>
  </div>
</template>

<script>
import { getStatistics } from '@/api/work-order'
import XTrends from './trends'
import XQueryPie from './query-pie'
import XDbQueryTop5 from './db-query-top5'

export default {
  components: {
    XTrends,
    XDbQueryTop5,
    XQueryPie
  },
  data () {
    return {
      statistics: {}
    }
  },
  mounted () {
    getStatistics()
      .then((data) => {
        this.statistics = data
      })
  }
}
</script>

<style>

</style>
