<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="名称" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" :size="btnsize" icon="el-icon-search" v-perm="['/sys/role/view']" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" :size="btnsize" icon="el-icon-plus" v-perm="['/sys/role/add']" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" highlight-current-row style="width: 100%" :default-sort="{prop: 'id', order: 'ascending'}">
      <el-table-column prop="id" label="ID" align="center" width="100px" sortable>
      </el-table-column>
      <el-table-column prop="name" label="角色名称" align="center" sortable>
      </el-table-column>
      <el-table-column prop="remark" label="说明" align="center">
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="100px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status | statusChange }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="listorder" label="排序" align="center" sortable>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-button :size="btnsize" type="success" v-perm="['/sys/role/edit']" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button :size="btnsize" type="danger" v-perm="['/sys/role/del']" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--角色菜单，表格树内容栏-->
    <div class="menu-container" :v-if="true">
      <div class="menu-header">
        <span>
          <B>角色授权</B>
        </span>
      </div>
      <!-- <el-tree :data="menuData" size="mini" show-checkbox node-key="id" :props="defaultProps" style="width: 100%;pading-top:20px;" ref="menuTree" :render-content="renderContent" v-loading="menuLoading" element-loading-text="拼命加载中" :check-strictly="true" @check-change="handleMenuCheckChange">
      </el-tree>
      <div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
        <el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.selectRole.id == null">
          <b>全选</b>
        </el-checkbox>
      </div>
      <div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
        <kt-button :label="$t('action.reset')" perms="sys:role:edit" type="primary" @click="resetSelection" :disabled="this.selectRole.id == null" />
        <kt-button :label="$t('action.submit')" perms="sys:role:edit" type="primary" @click="submitAuthForm" :disabled="this.selectRole.id == null" :loading="authLoading" />
      </div> -->
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="" label-width="90px" style="width: 400px; margin-left:50px;">

        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="temp.name" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色说明" prop="remark">
          <el-input v-model.trim="temp.remark" placeholder="请输入角色备注" />
        </el-form-item>
        <el-form-item label="排序ID">
          <!-- onkeypress 防止录入e 及其他字符 -->
          <el-input-number v-model.trim="temp.listorder" controls-position="right" :min="0" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
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
import TreeTable from '@/components/TreeTable'

import { createRole, updateRole, deleteRole, getRoleList } from '@/api/role'

// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import random from 'string-random'

export default {
  name: 'CkoF_sys_role',
  // 所以在编写路由 router 和路由对应的 view component 的时候一定要确保 两者的 name 是完全一致的。
  // register the component Treeselect, TreeTable
  components: { TreeTable, Treeselect },
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
    return {
      // 'href': windows.location.href,
      // path: this.$route.path,
      // params: this.$route.params,
      btnsize: "mini",
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      temp: {
        id: undefined,
        name: '',
        remark: '',
        status: '1',
        listorder: 99
      },
      rules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // import { createRole, getRoleList } from '@/api/menu'
      getRoleList().then(res => {
        console.log('getRoleList', res)
        this.list = res.data
        this.listLoading = false
      })

    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        remark: '',
        status: '1',
        listorder: 99
      }
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
          createRole(this.temp).then(res => {
            // 成功后 关闭窗口
            console.log('createRole...', res)
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
          updateRole(this.temp).then(res => {
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
      this.$confirm("确认删除选中记录吗？[角色: " + row.name + "]", "提示", {
        type: "warning"
      }).then(() => {
        const tempData = {
          'id': row.id,
          'name': row.name
        }

        // 调用api删除数据
        deleteRole(tempData).then(res => {
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

    }
  }
}
</script>
 <style scoped>
.menu-container {
  margin-top: 10px;
}
.menu-header {
  padding-left: 8px;
  padding-bottom: 5px;
  text-align: left;
  font-size: 16px;
  color: rgb(20, 89, 121);
}
</style>