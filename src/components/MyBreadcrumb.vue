<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <!-- 遍历用户传递的导航路径 -->
    <el-breadcrumb-item>{{ this.level1 }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ this.level2 }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
// <MyBreadcrumb :paths="[{name: 'xxx', path: 'xxx'}]"></MyBreadcrumb>
export default {
  name: 'MyBreadcrumb',
  props: ['level1', 'level2']
};
</script>

<style>

</style>
