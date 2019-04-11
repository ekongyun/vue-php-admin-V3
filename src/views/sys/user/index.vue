<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-perm="['/sys/user/view']" v-model="filters[0].value" placeholder="角色名" style="width: 200px;" class="filter-item" />
      <el-select v-perm="['/sys/user/view']" v-model="filters[1].value" clearable class="filter-item">
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
      <el-button v-perm="['/sys/user/add']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>

    <data-tables-server :data="list" :search-def="searchDef" :total="total" :filters="filters" :table-props="tableProps" :loading="listLoading" :page-size="5" :pagination-props="{ background: true, pageSizes: [5,10,20] }" layout="table,pagination" @query-change="fetchData">
      <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label" sortable="custom" />
      <el-table-column label="状态" min-width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter" size="small">{{ scope.row.status | statusChange }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-button v-perm="['/sys/user/edit']" :size="btnsize" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-perm="['/sys/user/del']" :size="btnsize" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </data-tables-server>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="temp.username" :readonly="readonly" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="密码" prop="password">
          <el-input v-model="temp.password" :type="passwordType">
            <i slot="suffix" class="el-input__icon el-icon-eye" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model.trim="temp.email" placeholder="请输入email" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <!-- <el-select v-model="temp.role" class="filter-item" multiple="multiple" @remove-tag="removeTag()">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" :disabled="item.disabled" />
          </el-select> -->
          <treeselect v-model="temp.role" :multiple="true" :clearable="false" :normalizer="normalizer" :options="roleOptions" placeholder="请选择角色..." />
        </el-form-item>
        <el-form-item label="排序ID">
          <!-- onkeypress 防止录入e 及其他字符 -->
          <el-input-number v-model.trim="temp.listorder" :min="0" controls-position="right" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="temp.status" inactive-color="#ff4949" active-value="1" inactive-value="0" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import perm from '@/directive/perm/index.js' // 权限判断指令

import { createUser, updateUser, deleteUser, getUserList, getRoleOptions } from '@/api/user'

// import random from 'string-random'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'SysUserPhjc',
  // 所以在编写路由 router 和路由对应的 view component 的时候一定要确保 两者的 name 是完全一致的。
  // register the component Treeselect, TreeTable
  components: { Treeselect },
  directives: { waves, perm },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    statusChange(status) {
      const statusMapx = {
        1: '启用',
        0: '禁用'
      }
      return statusMapx[status]
    }
  },
  data() {
    // TODO: 参考login页面 引入校验函数 参考党建app mine-password 页面修改密码强度
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }

    return {
      value: null,
      // define treeselect options
      TreeSelectOptions: [],
      // 自定义treeselect key id,label
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      passwordType: 'password',
      searchDef: {
        show: true,
        debounceTime: 3000
      },
      defaultQueryInfo: '',
      filters: [{
        prop: 'username',
        value: ''
      }, {
        prop: 'status',
        value: ''
      }],
      list: [],
      total: 0,
      listLoading: true,
      titles: [
        {
          prop: 'id',
          label: 'ID'
        },
        {
          prop: 'username',
          label: '用户名'
        },
        {
          prop: 'email',
          label: 'Email'
        },
        {
          prop: 'listorder',
          label: '排序'
        }
      ],
      tableProps: {
        border: false,
        stripe: true,
        highlightCurrentRow: true,
        defaultSort: {
          prop: 'listorder',
          order: 'ascending'
        }
      },
      roleOptions: [],
      currentUserRoles: [],
      btnsize: 'mini',
      dialogFormVisible: false,
      dialogStatus: '',
      readonly: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        username: '',
        password: '',
        email: '',
        role: [],
        status: '1',
        listorder: 1000
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        role: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      }
    }
  },

  created() {
    // this.fetchData()
    this.initRoleOptions()
  },
  methods: {
    removeTag(args) {
      console.log('removeTag...')
      console.log(args)
      return
    },
    // 获取数据
    fetchData(queryInfo) {
      console.log('queryInfo', queryInfo)
      if (!queryInfo) {
        queryInfo = this.defaultQueryInfo
        console.log(queryInfo)
      }
      // init 类型比较特殊在 created 时发射，保存默认的查询信息，更新数据后调用 fetchData 时 queryInfo为空时调用
      if (queryInfo.type === 'init') {
        this.defaultQueryInfo = queryInfo
        console.log('defaultQueryInfo', this.defaultQueryInfo)
      }
      this.listLoading = true
      getUserList(queryInfo).then(res => {
        console.log('getUserList', res)
        this.list = res.data.items
        this.total = res.data.total
        this.listLoading = false
      })
    },

    initRoleOptions() {
      getRoleOptions().then(res => {
        console.log('getRoleOptions', res)
        this.roleOptions = res.data
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        password: '',
        email: '',
        role: [],
        status: '1',
        listorder: 1000
      }
      this.readonly = false
    },
    handleCreate() {
      console.log('handleCreate...click')
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('createData valid done...', this.temp)

          // 调用api创建数据入库
          createUser(this.temp).then(res => {
            // 成功后 关闭窗口
            console.log('createUser...', res)
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              message: res.message,
              type: res.type
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.readonly = true // 用户名不能修改, 只能删除

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 调用api编辑数据入库
          updateUser(this.temp).then(res => {
            if (res.type === 'success') {
              // 后台重新更新数据
              this.fetchData()
              // this.$refs.TreeTable.updateTreeNode(this.temp) // 只能更新自身以下的节点
              this.dialogFormVisible = false
            }
            this.$notify({
              //  title: '错误',
              message: res.message,
              type: res.type
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('确认删除选中记录吗？[用户: ' + row.username + ']', '提示', {
        type: 'warning'
      }).then(() => {
        const tempData = {
          'id': row.id,
          'username': row.username
        }
        // 调用api删除数据
        deleteUser(tempData).then(res => {
          // 如果删除成功，后台重新更新数据,否则不更新数据
          if (res.type === 'success') {
            this.fetchData()
          }
          this.dialogFormVisible = false
          this.$notify({
            //  title: '错误',
            message: res.message,
            type: res.type
          })
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      // this.getList()
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    }
  }
}
</script>
