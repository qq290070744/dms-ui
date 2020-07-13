<template>
  <div class="query-area">
    <h3 class="title">
      <span>当前选中数据库：<slot name="title"></slot></span>
      <a-tooltip placement="right" v-if="tips">
        <template slot="title">
          <slot name="tips"></slot>
        </template>
        <span class="tips"><a-icon type="question-circle" ></a-icon> 查询需知 </span>
      </a-tooltip>
    </h3>
    <a-tabs v-model="activeKey" type="editable-card" size="small" @edit="onEdit">
      <a-tab-pane
        v-for="pane in finalPanes"
        :key="pane.key"
        :tab="pane.title"
        :closable="!pane.fixed && pane.key === activeKey"
      >
        <slot :uid="pane.key" :type="pane.key"></slot>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
export default {
  props: {
    fixedPanes: {
      type: Array,
      default: () => [],
    },
    tips: {
      type: Object,
      default: null
    },
  },
  data () {
    return {
      activeKey: 'tab',
      panes: [
        { key: 'tab', title: '查询窗口' }
      ],
      newTabIndex: 1
    }
  },
  mounted () {
    this.tips && this.showTips()
  },
  computed: {
    finalPanes () {
      return [...this.fixedPanes, ...this.panes]
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
    },
    showTips () {
      if (!this.$ls.get('mysql-tips-hidden')) {
        this.$notification.info({
          message: '查询需知',
          description: (
            <div>
              <query-tips />
              <a-checkbox onChange={(v) => {
                this.$ls.set('mysql-tips-hidden', v.target.checked)
              }}>
                不再提示
              </a-checkbox>
            </div>
          )
        })
      }
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
