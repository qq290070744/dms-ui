<template>
  <div class="dbtb">
    <a-row v-if="instId" :gutter="10">
      <a-col :span="9">
        <div class="dbtb-tree">
          <div class="dbtb-tree-title">可选库表</div>
          <div class="dbtb-tree-content">
            <div
              v-for="d in dbtbList"
              :class="[
                'dbtb-db',
                {
                  'is-table': d.parent,
                  expanded: (!!d.children && expandedMap[d.key]) || (d.parent && expandedMap[d.parent.key])
                }
              ]"
              :key="d.key"
            >
              <a-icon type="right" v-if="!d.parent" @click="collapse(d)"></a-icon>
              <a-tag size="small" :color="d.parent ? '': '#2db7f5'">{{ d.parent ? '表' : '库' }}</a-tag>
              <a-checkbox
                :indeterminate="!!indeterminate[d.key]"
                :checked="!!selectedMap[d.key]"
                @change="(e) => check(e, d)"
              >
                {{ d.name }}
              </a-checkbox>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="15">
        <div class="dbtb-selected">
          <a-table
            :scroll="{y: 370}"
            :columns="columns"
            :dataSource="list"
            :pagination="pagination"
            bordered
          />
        </div>
      </a-col>
    </a-row>
    <a-empty v-else description="请先选择实例"/>
  </div>
</template>

<script>
import { getDatabaseSchema } from '@/api/perms'
export default {
  props: {
    instId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      columns: [{
        title: '库名',
        dataIndex: 'db_name',
      }, {
        title: '表名',
        dataIndex: 'name',
      }, {
        title: '操作',
        width: 80,
        customRender: (_, record) => {
          return <a onClick={() => this.rmSelect(record)}>删除</a>
        }
      }],
      pagination: { size: 'small' },
      expandedMap: {},
      selectedMap: {},
      selectedDBCount: {},
      indeterminate: {},
      dbtbList: []
    }
  },
  computed: {
    list () {
      return Object.values(this.selectedMap).filter(v => typeof v === 'object' && v !== null)
    }
  },
  watch: {
    instId: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getDBTB(val)
        }
      }
    }
  },
  methods: {
    getDBTB (instId) {
      this.expandedMap = {}
      this.selectedMap = {}
      this.selectedDBCount = {}
      this.indeterminate = {}
      getDatabaseSchema(instId)
        .then((res) => {
          this.dbtbList = res
        })
    },

    check (e, d) {
      const currStatus = !this.selectedMap[d.key]
      if (d.children) {
        this.$set(this.selectedMap, d.key, currStatus)
        for (const child of d.children) {
          this.$set(this.selectedMap, child.key, currStatus ? child : null)
        }
        this.$set(this.selectedDBCount, d.key, currStatus ? d.children.length : 0)
        this.$set(this.indeterminate, d.key, false)
      } else {
        this.$set(this.selectedMap, d.key, currStatus ? d : null)
      }

      if (d.parent) {
        const pKey = d.parent.key
        const count = this.selectedDBCount[pKey] || 0
        const currCount = count + (currStatus ? 1 : -1)
        this.$set(this.selectedDBCount, d.parent.key, currCount)

        this.$set(this.selectedMap, pKey, currCount === d.parent.children.length)
        this.$set(this.indeterminate, pKey, currCount > 0 && currCount < d.parent.children.length)
      }

      const list = Object.values(this.selectedMap).filter(v => typeof v === 'object' && v !== null)
      this.$emit('change', list.map(o => o.key))
    },

    collapse (d) {
      this.$set(this.expandedMap, d.key, !this.expandedMap[d.key])
    },

    rmSelect (d) {
      this.$set(this.selectedMap, d.key, null)
      const pKey = d.parent.key
      const count = this.selectedDBCount[pKey] || 0
      const currCount = count - 1
      this.$set(this.selectedDBCount, pKey, currCount)

      this.$set(this.selectedMap, pKey, false)
      this.$set(this.indeterminate, pKey, currCount > 0 && currCount < d.parent.children.length)
    }
  }
}
</script>

<style scoped lang="less">
.dbtb {
  border: 1px solid #e8e8e8;
  padding: 4px;
  height: 485px;
  .dbtb-tree {
    border: 1px solid #e8e8e8;
    &-title {
      background: #fafafa;
      border-bottom: 1px solid #e8e8e8;
      height: 54px;
      padding-bottom: 20px;
      padding-left: 12px;
      padding-top: 8px;
    }
    &-content {
      height: 420px;
      padding: 4px 0;
      overflow: auto;
    }
  }
}
.dbtb-db {
  height: 36px;
  overflow: hidden;
  white-space: nowrap;
  color: rgba(0,0,0,.45);
  // border-bottom: 1px solid #ccc;

  .anticon.anticon-right {
    transition: .3s all;
    margin-left: 8px;
    cursor: pointer;
  }

  &.expanded {
    .anticon.anticon-right {
      transform: rotate(90deg);
    }
  }

  .ant-tag {
    margin-left: 8px;
    margin-right: 4px;
  }

  &:hover {
    background: #f5f5f5;
  }
}
.dbtb-db.is-table {
  padding-left: 32px;
  transition: .3s all;
  display: none;
  &.expanded {
    display: block;
  }
}
.ant-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
