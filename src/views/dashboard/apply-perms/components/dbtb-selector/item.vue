<template>
  <div
    :class="[
      'dbtb-db',
      {
        'is-table': source.parent,
        expanded: (!!source.children && expandedMap[source.key]) || (source.parent && expandedMap[source.parent.key])
      }
    ]"
  >
    <a-icon type="right" v-if="!source.parent" @click="collapse(source)"></a-icon>
    <a-tag size="small" :color="source.parent ? '': '#2db7f5'">{{ source.parent ? '表' : '库' }}</a-tag>
    <a-checkbox
      :indeterminate="!!indeterminate[source.key]"
      :checked="!!selectedMap[source.key]"
      @change="(e) => check(e, source)"
    >
      {{ source.name }}
    </a-checkbox>
  </div>
</template>

<script>
export default {
  name: 'ItemComponent',
  props: {
    source: {
      type: Object,
      default () {
        return {}
      }
    },
    expandedMap: {
      type: Object,
      default: () => ({})
    },
    indeterminate: {
      type: Object,
      default: () => ({})
    },
    selectedMap: {
      type: Object,
      default: () => ({})
    },
    collapse: {
      type: Function,
      default: () => () => undefined
    },
    check: {
      type: Function,
      default: () => () => undefined
    }
  }
}
</script>

<style scoped lang="less">
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
</style>
