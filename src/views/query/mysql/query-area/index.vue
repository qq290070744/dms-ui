<template>
  <div class="query-area">
    <h3 class="title">
      <span>当前选中数据库：{{ database && database.name }}</span>
      <a-tooltip placement="right">
        <template #title>
          <p>
            1. 字段含有中文请添加单引号，例如 '测试'。
          </p>
          <p>
            2. 不支持 group by 显示排序语法，请使用 order by 排序，例如 group by 'date' order by 'date'。
          </p>
        </template>
        <span class="tips"><a-icon type="question-circle" ></a-icon> 查询限制 </span>
      </a-tooltip>
    </h3>
    <a-tabs v-model="activeKey" type="editable-card" size="small" @edit="onEdit">
      <a-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="!pane.fixed && pane.key === activeKey">
        <query-panel v-bind="$attrs" :uid="pane.key" :type="pane.key"></query-panel>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import QueryPanel from './panel'
export default {
  components: {
    QueryPanel
  },
  data () {
    return {
      activeKey: 'tab',
      panes: [
        { key: 'DDL', title: 'DDL窗口', fixed: true },
        { key: 'DML', title: 'DML窗口', fixed: true },
        { key: 'tab', title: '查询窗口' }
      ],
      newTabIndex: 1
    }
  },
  computed: {
    database () {
      return this.$attrs.database
    }
  },
  methods: {
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    add () {
      const panes = this.panes
      const index = this.newTabIndex++
      const activeKey = `tab${index}`
      panes.push({ title: `查询窗口${index}`, key: activeKey })
      this.panes = panes
      this.activeKey = activeKey
    },
    remove (targetKey) {
      let activeKey = this.activeKey
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.key !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key
        } else {
          activeKey = panes[0].key
        }
      }
      this.panes = panes
      this.activeKey = activeKey
    }
  }
}
</script>

<style lang="less" scoped>
.query-area {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  h3.title {
    margin: 8px;
  }
  .tips {
    margin-left: 12px;
    color: #ff6666;
  }
  .ant-tabs {
    flex: 1;
  }
  ::v-deep .ant-tabs-bar {
    margin: 0 8px;
  }
}
</style>
