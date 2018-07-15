<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品添加"></my-breadcrumb>

    <el-row class="row-add">
    </el-row>

    <!-- 步骤条 -->
    <el-steps :active="stepActive" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- /步骤条 -->

    <!-- 标签页 -->
    <el-tabs
      tab-position="left"
      v-model="activeName"
      @tab-click="handleTabClick">
      <el-tab-pane label="基本信息" name="0">
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
          <!-- <el-form-item>
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item> -->
        </el-form>
        <el-button @click="handleNextStep">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <!--
          上传组件封装的非常完整，你只要告诉它把图片上传到哪个接口路径就可以了
          action 用来指定图片上传的地址
          上传组件跟你的 axios 没有任何关系，所以你在 axios 中配置的基准路径在这里是无效
          所以 action 我们要写完整的 url 路径
          on-preview 预览图片的时候触发
          on-remove 删除列表图片的时候触发
          file-list 存储上传的图片数组
            {name: xxx, url: xxx}
          由于上传组件不是使用的 axios 发出的请求，所以你在 axios 中配置的请求拦截器也是无效的
          所以 token 也就没有，需要我们自己来配置，使用 headers 属性
         -->
        <el-upload
          action="http://localhost:8888/api/private/v1/upload"
          :on-preview="handlePreview"
          :headers="headers"
          :on-remove="handleRemove"
          :on-success="handleUploadSuccess"
          :file-list="fileList2"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-row>
          <el-col :span="4">
            <el-button @click="handleNextStep">下一步</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品详情" name="2">
        <quill-editor
          v-model="form.goods_introduce"
          ref="myQuillEditor"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @ready="onEditorReady($event)">
        </quill-editor>
        <el-row style="margin-top: 75px;">
          <el-col :span="4">
            <el-button type="primary" @click="handleAdd">立即创建</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!-- /标签页 -->
  </el-card>
</template>

<script>
import CategoryCascader from '@/components/CategoryCascader';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';

export default {
  data () {
    return {
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        goods_introduce: '',
        pics: [
          // { pic: '图片路径' },
          // { pic: '图片路径' },
          // { pic: '图片路径' },
          // { pic: '图片路径' },
          // { pic: '图片路径' },
          // { pic: '图片路径' },
        ]
      },
      activeName: '0',
      stepActive: 0,
      fileList2: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
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
      });
      const { meta } = res.data;
      if (meta.status === 201) { // 添加成功
        this.$message({
          type: 'success',
          message: meta.msg
        });
      } else if (meta.status === 400) {
        this.$message({
          type: 'warning',
          message: meta.msg
        });
      }
    },
    handleGaiBianLe (data) {
      this.form.goods_cat = data.join(',');
    },
    onEditorBlur () {
      console.log('onEditorBlur');
    },
    onEditorFocus () {
      console.log('onEditorFocus');
    },
    onEditorReady () {
      console.log('onEditorReady');
    },

    /**
     * 处理点击下一步
     */
    handleNextStep () {
      this.activeName = Number.parseInt(this.activeName) + 1 + '';
      this.stepActive++;
    },

    /**
     * 处理 tabs 标签点击事件
     */
    handleTabClick (tab, event) {
      this.stepActive = tab.index - 0;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },

    handlePreview(file) {
      console.log(file);
    },

    handleUploadSuccess (response, file, fileList) {
      // response 接口响应结果对象
      // file 上传的文件对象
      // fileList 文件列表数组
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    }
  },
  components: {
    CategoryCascader,
    quillEditor
  }
};
</script>

<style>
.row-add {
  margin-top: 10px;
  margin-bottom: 10px;
}

.quill-editor {
  height: 300px;
  margin-bottom: 15px;
}
</style>
