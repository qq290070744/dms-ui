<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell--input-wrapper">
      <a-textarea class="editable-cell--input" v-focus @blur="onSave" @change="onChange" :value="currValue"/>
    </div>
    <div v-else class="editable-cell--text-wrapper" @dblclick="doStartEdit">
      {{ value || ' ' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: undefined
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data () {
    return {
      modify: null,
      editable: false
    }
  },
  computed: {
    currValue () {
      return this.modify !== null ? this.modify : this.value
    }
  },
  methods: {
    onChange (e) {
      this.modify = e.target.value || ''
    },
    doStartEdit () {
      this.editable = true
    },
    onSave () {
      this.editable = false
      this.modify = null
    }
  }
}
</script>

<style lang="less">
.editable-cell{
  &--input-wrapper {
    width: 100%;
    height: 100%;
  }
  &--input.ant-input {
    height: 100%;
    resize: none;
  }
}
</style>
