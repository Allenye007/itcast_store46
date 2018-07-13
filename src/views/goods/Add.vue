<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品添加"></my-breadcrumb>

    <el-row class="row-add">
    </el-row>

    <!-- 步骤条 -->
    <el-steps :active="1" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- /步骤条 -->

    <!-- 标签页 -->
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">
        <el-form ref="form" :model="form" label-width="80px" label-position="top">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <CategoryCascader
              type="3"
              @gaibianle="handleGaiBianLe"></CategoryCascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
    <!-- /标签页 -->
  </el-card>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader'

export default {
  data () {
    return {
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: ''
      }
    };
  },
  created () {
  },
  methods: {
    async handleAdd () {
      const res = await this.$http({
        url: '/goods',
        method: 'post',
        data: this.form
      })
      const { data, meta } = res.data
      if (meta.status === 201) { // 添加成功
        this.$message({
          type: 'success',
          message: meta.msg
        })
      } else if (meta.status === 400) {
        this.$message({
          type: 'warning',
          message: meta.msg
        })
      }
    },
    handleGaiBianLe (data) {
      this.form.goods_cat = data.join(',')
    }
  },
  components: {
    CategoryCascader
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
