<template>
  <div>
    <p>
      1. 字段含有中文请添加单引号，例如 '测试'。
    </p>
    <p>
      2. 不支持 group by 显示排序语法，请使用 order by 排序，例如 group by 'date' order by 'date'。
    </p>
    <p>
      3. 查询结果最多返回 1000 条数据。
    </p>
    <p>
      4. 查询结果如果列数过多，可长按 ctrl + 鼠标滚动来横向滚动快捷查看数据。
    </p>
    <p>
      5. ctrl + enter 可以快捷查询。
    </p>
    <p>
      6. 可连续输入多条语句，分号隔开，然后用 ctrl + enter 查询鼠标光标所在的一条语句或选中的一条语句。如果选取了多条语句则只执行第一条。
    </p>
    <p>
      7. DML 工单如果有需要大量（500条以上）插入语句，最好使用文件工单进行提交。
    </p>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
