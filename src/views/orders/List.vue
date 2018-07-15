<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>

    <!-- 表格 -->
    <el-table
      class="tb"
      border
      stripe
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="180">
      </el-table-column>
      <el-table-column
        label="是否付款"
        width="180">
        <template slot-scope="scope">
           <span v-if="scope.row.order_pay === '0'">未付款</span>
           <span v-else-if="scope.row.order_pay === '1'">已付款</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="180">
      </el-table-column>
      <el-table-column
        label="下单时间"
        width="180">
        <template slot-scope="scope">
           {{ scope.row.create_time | fmtDate('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button>编辑</el-button>
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
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$http({
        url: '/orders',
        method: 'get',
        params: {
          pagenum: 1,
          pagesize: 10
        }
      });

      const { data, meta } = res.data;

      if (meta.status === 200) {
        this.list = data.goods;
      } else {
        this.$message({
          type: 'warning',
          message: '加载数据失败'
        });
      }
    }
  }
};
</script>

<style>

.tb {
  margin-top: 10px;
}
</style>
