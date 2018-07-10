<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索区域 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <!-- 搜索功能
          1. 绑定搜索文本框
          2. 给按钮搜索按钮
         -->
        <el-input v-model="searchValue" class="searchInput" clearable placeholder="请输入内容">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="addUserDialogVisible = true" type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <template slot-scope="scope">
          <!-- 当前行绑定到的数据对象 -- 用户对象 -->
          <!-- {{ scope.row }} -->
          <!-- <hr> -->
          <!-- 当前行的索引 -->
          <!-- {{ scope.$index }} -->
          <!-- <hr> -->
          <!-- 当前列的配置内容 -->
          <!-- {{ scope.column }} -->
          <!-- <hr> -->
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态" width="100">
        <template slot-scope="scope">
          <!-- scope.row 就是当前行绑定的数据对象 -->
          <el-switch
            @change="handleSwitchChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleShowEditDialog(scope.row)" plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button @click="handleDelete(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
          <el-button plain size="mini" type="success" icon="el-icon-check" ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- @size-change 每页多少条数据发生改变 触发的事件 -->
    <!-- @current-change 当前页码改变发生 -->
    <!-- current-page 当前页码 -->
    <!-- page-sizes 每页多少条数据的下拉框 -->
    <!-- page-size 每页显示多少条数据 -->

    <!-- total  总条数 -->
    <!-- layout 分页所支持的功能 -->
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户的弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible">
      <el-form
        ref="myform"
        :rules="formRules"
        label-width="100px"
        :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserDialogVisible">
      <el-form
        ref="myform"
        :rules="formRules"
        label-width="100px"
        :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 用户列表数据
      list: [],
      // true显示正在加载，false的时候不显示
      loading: true,
      // 分页相关数据
      // 页码
      pagenum: 1,
      // 每页条数
      pagesize: 4,
      // 总共的数据条数，从服务器获取
      total: 0,
      // 绑定搜索文本框
      searchValue: '',
      // 控制添加用户的对话框显示或者隐藏
      addUserDialogVisible: false,
      // 绑定表单数据
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单的验证规则
      formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 控制编辑用户的对话框显示或者隐藏
      editUserDialogVisible: false
    };
  },
  created() {
    // 发送请求获取数据
    this.loadData();
  },
  methods: {
    // 分页事件
    handleSizeChange(val) {
      // 每页条数改变的时候
      this.pagesize = val;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 页码改变的时候
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 发送异步请求，获取数据
    async loadData() {
      // 发送异步请求之前
      this.loading = true;

      // 发送请求之前，获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;

      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);

      // 异步请求结束
      this.loading = false;

      // 获取响应数据
      const data = res.data;
      // meta中的msg 和 status
      const { meta: { msg, status } } = data;
      if (status === 200) {
        const { data: { users, total } } = data;
        this.list = users;
        // 获取总共多少条数据
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    },
    // 搜索按钮
    handleSearch() {
      // 带上查询参数
      this.loadData();
    },
    // 当开关的状态发生改变
    async handleSwitchChange(user) {
      // console.log(user);
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);

      // 响应对象 res = { data, status }
      // 服务器返回的数据格式 res.data  = { data: {}, meta: {} }
      const data = res.data;
      const { meta: { status, msg } } = data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除
    // 1. 给删除按钮，注册事件
    // 2. 提示是否删除
    // 3. 发送请求
    async handleDelete(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 包裹 await 的函数都需要加上async
        // 点击确定按钮执行
        const res = await this.$http.delete(`users/${id}`);

        // 服务器返回的数据
        const data = res.data;
        // meta内部的status和msg
        const { meta: { status, msg } } = data;
        if (status === 200) {
          // 删除成功 重新加载数据
          this.pagenum = 1;
          this.loadData();

          this.$message({
            type: 'success',
            message: msg
          });
        } else {
          this.$message.error(msg);
        }
      }).catch(() => {
        // 点击取消按钮执行
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 添加用户的对话框中的确定按钮，要执行添加用户的操作
    async handleAdd() {
      // 表单的 DOM对象 this.$refs.myform
      this.$refs.myform.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请完整输入内容');
        }
        // 表单验证成功，添加的操作
        const res = await this.$http.post('users', this.formData);

        // 相当于回调函数中的处理
        const data = res.data;
        const { meta: { status, msg } } = data;
        if (status === 201) {
          // 添加成功
          // 隐藏对话框
          this.addUserDialogVisible = false;
          // 提示成功
          this.$message.success(msg);
          // 重新加载数据
          this.loadData();
          // 清空文本框的值
          for (let key in this.formData) {
            this.formData[key] = '';
          }
        } else {
          this.$message.error(msg);
        }
      });
    },
    // 点击编辑按钮，弹出编辑的对话框
    handleShowEditDialog(user) {
      // 显示对话框
      this.editUserDialogVisible = true;
      // 文本框显示用户信息
      this.formData = user;
    },
    // 点击确定按钮，实现修改用户
    async handleEdit() {
      // console.log(this.formData);
      const res = await this.$http.put(`users/${this.formData.id}`, {
        mobile: this.formData.mobile,
        email: this.formData.email
      });
      // 解析数据
      const data = res.data;
      const { meta: { status, msg } } = data;
      // 判断
      if (status === 200) {
        // 修改成功
        // 提示成功
        this.$message.success(msg);
        // 关闭对话框
        this.editUserDialogVisible = false;
        // 重新加载列表
        this.loadData();
        // 清空文本框
        for (let key in this.formData) {
          this.formData[key] = '';
        }
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
