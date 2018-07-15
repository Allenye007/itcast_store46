<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
    <el-button @click="handleMapMove">点击移动地图</el-button>
    <!-- 地图容器，要有宽高 -->
    <div id="bmap_container"></div>

    <el-row>
      <el-col :span="8">
        <el-cascader
          size="large"
          :options="options"
          v-model="selectedOptions"
          @change="handleChange">
        </el-cascader>
      </el-col>
    </el-row>

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
import { regionData } from 'element-china-area-data';
// 对于非 window 默认成员，使用的时候都加上 window 前缀（为了避免代码规范的警告）
// 哪怕是 window 自己的成员，也建议加上 window 前缀（有利于代码阅读）
// document 对象可以不需要
// window.document.xxxx
// window.setTimeout
// window.setInterval
// window.alert
const { BMap } = window;

// 这段代码不能放到这里执行
// 因为此时的 HTML DOM 还没有生成呢
// 因为这里的模板是由 Vue 管理的
// 所以我们需要在保证 Vue 处理完成生成页面模板之后再去做 DOM 操作
// const map = new BMap.Map("container");
// const point = new BMap.Point(116.404, 39.915);
// map.centerAndZoom(point, 15);

export default {
  data() {
    return {
      list: [],
      options: regionData,
      selectedOptions: [],
      map: null
    };
  },
  created() {
    this.loadData();
  },
  mounted () { // ** 注意：操作 DOM 必须写到这个生命周期函数中 **
    this.map = new BMap.Map('bmap_container');
    const point = new BMap.Point(116.404, 39.915);
    this.map.centerAndZoom(point, 15);
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
    },

    handleChange () {
      console.log('change');
    },

    handleMapMove () {
      const { map } = this;
      var point = new BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
      var marker = new BMap.Marker(point); // 创建标注
      map.addOverlay(marker);
    }
  }
};
</script>

<style>

.tb {
  margin-top: 10px;
}

#bmap_container {
  width: 500px;
  height: 300px;
}
</style>
