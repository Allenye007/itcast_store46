<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="分类名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="级别"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="是否有效">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
        </template>
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
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
