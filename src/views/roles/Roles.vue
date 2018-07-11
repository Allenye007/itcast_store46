<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button>添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载角色列表
    async loadData() {
      // 获取响应对象 response  { data: {...}, status: }
      // const res = await this.$http.get('roles');
      // console.log(res);

      // resData 是服务器返回的数据
      const { data: resData } = await this.$http.get('roles');

      // data, status, msg
      const { data, meta: { status, msg } } = resData;
      if (status === 200) {
        this.list = data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
