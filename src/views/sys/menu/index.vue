<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="名称1" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" v-perm="['/sys/menu/view']" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" v-perm="['/sys/menu/add']" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" v-perm="['/sys/menu/download']" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <tree-table ref="TreeTable" :data="tableData" :default-expand-all="true" :columns="columns" border default-children="children" @selection-change="selectChange">

      <!-- <template slot="selection">
        <el-table-column type="selection" align="center" width="55" />
      </template>

      <template slot="pre-column">
        <el-table-column type="expand" width="55">
          <template>
            <el-tag type="info">
              Here is just a placeholder slot, you can display anything.
            </el-tag>
          </template>
        </el-table-column>
      </template> -->
      <!-- <template slot="timeline" slot-scope="{scope}">
        <el-tooltip :content="scope.row.timeLine+'ms'" effect="dark" placement="left">
          <div class="processContainer">
            <div :style="{ width:(scope.row.timeLine||0) * 3+'px',
                          background:scope.row.timeLine>50?'rgba(233,0,0,.5)':'rgba(0,0,233,0.5)',
                          marginLeft:scope.row._level * 50+'px' }" class="process">
              <span style="display:inline-block" />
            </div>
          </div>
        </el-tooltip>
      </template> -->
      <template slot="icon" slot-scope="{scope}">
        <svg-icon :icon-class="scope.row.icon" />
      </template>
      <template slot="type" slot-scope="{scope}">
        <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
        <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
        <el-tag v-else-if="scope.row.type === 2" size="small" type="info">功能</el-tag>
      </template>
      <!-- <template slot="append" slot-scope="{scope}">
        <el-button size="mini" type="primary" @click="addMenuItem(scope.row,'brother')">Append Brother
        </el-button>
        <el-button size="mini" type="primary" @click="addMenuItem(scope.row,'children')">Append Child
        </el-button>
      </template> -->
      <template slot="operation" slot-scope="{scope}">
        <el-button size="mini" type="success" v-perm="['/sys/menu/edit']" @click="handleUpdate(scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" v-perm="['/sys/menu/del']" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </tree-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="" label-width="90px" style="width: 400px; margin-left:50px;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="temp.type">
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[temp.type] + '名称'" prop="title">
          <el-input v-model.trim="temp.title" :placeholder="menuTypeList[temp.type] + '名称'" />
        </el-form-item>
        <el-form-item label="上级菜单">
          <treeselect v-model="temp.pid" :multiple="false" :clearable="false" :disable-branch-nodes="false" :show-count="true" :normalizer="normalizer" :options="TreeSelectOptions" />
        </el-form-item>
        <el-form-item label="路由" prop="path">
          <el-input v-model.trim="temp.path" :placeholder="menuTypeList[temp.type] + '路由, 例 /sys, /sys/menu'" />
        </el-form-item>
        <el-form-item v-if="temp.type === 1" label="组件" prop="component">
          <el-input v-model.trim="temp.component" placeholder="@/views/目录下相对组件路径, 如 sys/menu/index" />
        </el-form-item>
        <el-form-item v-if="temp.type !== 2" label="重定向URL">
          <el-input v-model.trim="temp.redirect" placeholder="面包屑组件重定向,例 /sys/menu, 可留空" />
        </el-form-item>
        <el-form-item v-if="temp.type !== 2" label="图标">
          <el-input v-model.trim="temp.icon" placeholder="系统管理/图标管理里复制图标名称,如 email" />
        </el-form-item>
        <el-form-item label="排序ID">
          <!-- onkeypress 防止录入e 及其他字符 -->
          <el-input-number v-model.trim="temp.listorder" controls-position="right" :min="0" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-alert :closable="false" title="menu 2 测试" /> hello data() 函数 return
    <li>
      路由路径 this.$route.path: {{path}}
    </li>
    <li>
      路由路径参数 this.$route.params: {{params}}
    </li>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import perm from '@/directive/perm/index.js' // 权限判断指令
import TreeTable from '@/components/TreeTable'
import data from './data.js'
import treemenu from './treemenu.js'
import { createMenu, getTreeOptions, getMenuTree } from '@/api/menu'

// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  // register the component Treeselect, TreeTable
  components: { TreeTable, Treeselect },
  directives: { waves, perm },
  filters: {

  },
  data() {
    return {
      // 'href': windows.location.href,
      // 'total': '100',
      path: this.$route.path,
      params: this.$route.params,
      size: "small",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      downloadLoading: false,
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      menuTypeList: ["目录", "菜单", "功能"],
      temp: {
        id: undefined,
        path: '',
        name: '',
        title: '',
        icon: '',
        type: 1,
        pid: 0,
        component: '',
        redirect: '',
        listorder: 99
      },
      rules: {
        title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入菜单url', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件url', trigger: 'blur' }]
      },
      columns: [
        {
          label: '菜单名称',
          key: 'title',
          expand: true,
          width: 180,
          align: 'left'
        },
        {
          label: '菜单路由',
          key: 'path'
        },
        {
          label: '图标',
          key: 'icon'
        },
        {
          label: '类型',
          key: 'type'
        },
        {
          label: '组件',
          key: 'component'
        },
        {
          label: '重定向',
          key: 'redirect'
        },
        {
          label: '排序',
          key: 'listorder'
        },
        // {
        //   label: 'Append',
        //   key: 'append',
        //   width: 300
        // },
        {
          label: '操作',
          key: 'operation',
          width: 160
        }
      ],

      // define treeselect options
      TreeSelectOptions: [],
      // 自定义treeselect key id,label
      normalizer(node) {
        return {
          id: node.id,
          label: node.title,
          children: node.children,
        }
      }
    }
  },

  created() {
    console.log('this.$route.path...', this.$route.path)
    console.log('this.$store.state.user.ctrlperm', this.$store.state.user.ctrlperm)
    this.getData()
  },
  methods: {
    getData() {
      // import { createMenu, getTreeOptions, getMenuTree } from '@/api/menu'
      getMenuTree().then(res => {
        this.tableData = res.data
      })
      getTreeOptions().then(res => {
        this.TreeSelectOptions = res.data
      })
    },
    editItem(row) {
      this.tempItem = Object.assign({}, row)
      console.log(row)
      console.log(row.id)
      this.dialogFormVisible = true
    },
    async updateItem() {
      await this.$refs.TreeTable.updateTreeNode(this.tempItem)
      this.dialogFormVisible = false
      console.log(this.tempItem.id)
    },
    addMenuItem(row, type) {
      if (type === 'children') {
        this.$refs.TreeTable.addChild(row, { name: 'child', timeLine: this.randomNum() })
      }

      if (type === 'brother') {
        this.$refs.TreeTable.addBrother(row, { name: 'brother', timeLine: this.randomNum() })
      }
    },
    deleteItem(row) {
      this.$refs.TreeTable.delete(row)
    },
    selectChange(val) {
      console.log(val)
    },
    randomNum() {
      // return 1~100
      const max = 4194240
      const min = 1000000
      return Math.floor(Math.random() * (max - min + 1) + min)
    },
    message(row) {
      this.$message.info(row.event)
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        path: '',
        name: '',
        title: '',
        icon: '',
        type: 1,
        pid: 0,
        component: '',
        redirect: '',
        listorder: 99
      }
    },
    handleCreate() {
      console.log('handleCreate...click')
      this.resetTemp()
      console.log(this.temp)
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('createData...valid')
          // 数据预处理
          // 菜单类型为目录
          if (!this.temp.type) {
            this.temp.component = 'Layout'
          }
          // 处理路由别名生成唯一
          this.temp.name = this.temp.path.replace(/\//g, '_') + '_' + this.randomNum()
          console.log(this.temp)

          // 调用api创建数据入库
          createMenu(this.temp).then(res => {
            // 成功后 关闭窗口
            console.log('createMenu...', res)
            this.getData()
            this.dialogFormVisible = false
            this.$message({
              message: res.message,
              type: res.type
            })
            // this.$notify({
            //   title: '成功',
            //   message: '创建成功',
            //   type: 'success',
            //   duration: 2000
            // })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate...')
      console.log(row)
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      console.log(this.temp.type)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log('updateData...valid')
          console.log(tempData)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          // updateArticle(tempData).then(() => {
          //   for (const v of this.list) {
          //     if (v.id === this.temp.id) {
          //       const index = this.list.indexOf(v)
          //       this.list.splice(index, 1, this.temp)
          //       break
          //     }
          //   }
          //  await this.$refs.TreeTable.updateTreeNode(this.tempData)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '更新成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      // this.getList()

    }
  }
}
</script>
 