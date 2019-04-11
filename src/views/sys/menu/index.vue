<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-perm="['/sys/menu/view']" v-model="filterText" placeholder="菜单名" style="width: 200px;" class="filter-item" />
      <!-- <el-button v-waves class="filter-item" type="primary" :size="btnsize" icon="el-icon-search" v-perm="['/sys/menu/view']" @click="handleFilter">查询</el-button> -->
      <el-button v-perm="['/sys/menu/add']" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <!-- tableData.filter( data => !filterText || filterData(data, function(item){return item.title.includes(filterText) })) -->
    <el-table ref="TreeTable" :data="tableData" row-key="id" highlight-current-row stripe @selection-change="selectChange">
      <el-table-column prop="title" label="菜单名称" align="left" min-width="120" />
      <el-table-column prop="id" label="菜单ID" align="center" />
      <el-table-column prop="path" label="菜单路由" align="center" />
      <el-table-column prop="name" label="路由别名" align="center" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type===0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type===1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type===2" size="small" type="info">功能</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="component" label="组件" align="center" />
      <el-table-column prop="redirect" label="重定向" align="center" />
      <el-table-column prop="listorder" label="排序" align="center" />

      <el-table-column prop="operation" label="操作" align="center" min-width="180" fixed="right">
        <template slot-scope="scope">
          <el-button v-perm="['/sys/menu/edit']" :size="btnsize" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-perm="['/sys/menu/del']" :size="btnsize" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
          <treeselect v-model="temp.pid" :multiple="false" :clearable="false" :disable-branch-nodes="false" :show-count="true" :normalizer="normalizer" :options="TreeSelectOptions" placeholder="请选择上级菜单..." />
        </el-form-item>
        <el-form-item label="路由" prop="path">
          <el-input v-model.trim="temp.path" :placeholder="menuTypeList[temp.type] + '路由, 例 /sys, /sys/menu'" />
        </el-form-item>
        <el-form-item v-if="dialogStatus !=='create'" label="路由别名" prop="name">
          <el-input v-model.trim="temp.name" placeholder="@view component name 必须与该路由别名一致" />
        </el-form-item>
        <el-form-item v-if="temp.type===1" label="组件" prop="component">
          <el-input v-model.trim="temp.component" placeholder="对应 @/views 目录, 例 sys/menu/index" />
        </el-form-item>
        <el-form-item v-if="temp.type !==2" label="重定向URL">
          <el-input v-model.trim="temp.redirect" placeholder="面包屑组件重定向,例 /sys/menu, 可留空" />
        </el-form-item>
        <el-form-item v-if="temp.type !==2" label="图标">
          <el-input v-model.trim="temp.icon" placeholder="系统管理/图标管理里复制名称, 例 email">
            <i slot="suffix" class="el-input__icon el-icon-eye">
              <svg-icon :icon-class="temp.icon" />
            </i>
          </el-input>
        </el-form-item>
        <el-form-item label="排序ID">
          <!-- onkeypress 防止录入e 及其他字符 -->
          <el-input-number v-model.trim="temp.listorder" :min="0" controls-position="right" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create' ?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive
import perm from '@/directive/perm/index.js' // 权限判断指令
import TreeTable from '@/components/TreeTable'
// import data from './data.js'
// import treemenu from './treemenu.js'
import { createMenu, updateMenu, deleteMenu, getTreeOptions, getMenuTree } from '@/api/menu'

// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import random from 'string-random'

export default {
  name: 'SysMenuSnIc',
  // 所以在编写路由 router 和路由对应的 view component 的时候一定要确保 两者的 name 是完全一致的。
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
      filterText: '',
      btnsize: 'mini',
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
      tableDatax: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      menuTypeList: ['目录', '菜单', '功能'],
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
        name: [{ required: true, message: '请输入唯一路由别名', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件url', trigger: 'blur' }]
      },
      // define treeselect options
      TreeSelectOptions: [],
      // 自定义treeselect key id,label
      normalizer(node) {
        return {
          id: node.id,
          label: node.title,
          children: node.children
        }
      }
    }
  },
  watch: {
    filterText(val) {
      if (!val) {
        //  为空 重置初始值
        this.tableData = this.tableDatax
      } else {
        // console.log(this.tableData)
        // console.log(this.filterData(this.tableData, function (item) {
        //   return item.title.includes(val)
        // }))
        this.tableData = this.filterData(this.tableData, item => { return item.title.includes(val) })
      }
    }
  },
  created() {
    // console.log('this.$route.path...', this.$route.path)
    // console.log('this.$store.state.user.ctrlperm', this.$store.state.user.ctrlperm)
    this.getData()
  },
  methods: {
    // 递归过滤树形数据
    filterData(data, predicate) {
      // if no data is sent in, return null, otherwise transform the data
      return !data ? null : data.reduce((list, entry) => {
        let clone = null
        if (predicate(entry)) {
          // if the object matches the filter, clone it as it is
          clone = Object.assign({}, entry)
        } else if (entry.children != null) {
          // if the object has childrens, filter the list of children
          const children = this.filterData(entry.children, predicate)
          if (children.length > 0) {
            // if any of the children matches, clone the parent object, overwrite
            // the children list with the filtered list
            clone = Object.assign({}, entry, { children: children })
          }
        }
        // if there's a cloned object, push it to the output list
        clone && list.push(clone)
        return list
      }, [])
    },
    getData() {
      // import { createMenu, getTreeOptions, getMenuTree } from '@/api/menu'
      getMenuTree().then(res => {
        console.log('getMenuTree', res)
        this.tableData = res.data
        this.tableDatax = res.data
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
    deleteItem(row) {
      this.$refs.TreeTable.delete(row)
    },
    selectChange(val) {
      console.log(val)
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    stringToCamel(str) {
      // var str="border-bottom-color";
      const temp = str.split('/')
      for (var i = 1; i < temp.length; i++) {
        temp[i] = temp[i][0].toUpperCase() + temp[i].slice(1)
      }
      return temp.join('')
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 处理路由别名生成唯一 /sys/menu
          this.temp.name = this.stringToCamel(this.temp.path + '/' + random(4, { specials: false, numbers: false, letters: 'abcdefghijklmnopqrstuvwxyz' }))
          console.log('createData valid done...', this.temp)

          // 调用api创建数据入库
          createMenu(this.temp).then(res => {
            // 成功后 关闭窗口
            console.log('createMenu...', res)
            this.getData()
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
          // const tempData = Object.assign({}, this.temp)
          // TODO: 处理 Uncaught TypeError: Converting circular structure to JSON 问题
          const tempData = {
            id: this.temp.id,
            path: this.temp.path,
            name: this.temp.name,
            title: this.temp.title,
            icon: this.temp.icon,
            type: this.temp.type,
            pid: this.temp.pid,
            component: this.temp.component,
            redirect: this.temp.redirect,
            listorder: this.temp.listorder
          }
          console.log(tempData)
          // TODO: 增加校验 rules:
          if (tempData.pid === tempData.id) {
            this.$notify({
              title: '错误',
              message: '上级菜单不能选择自身',
              type: 'error',
              duration: 2000
            })
            return
          }
          // console.log(this.temp)
          // 调用api编辑数据入库
          updateMenu(tempData).then(res => {
            if (res.type === 'success') {
              // 后台重新更新数据
              this.getData()
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
      // this.$refs.TreeTable.delete(row)
      this.$confirm('确认删除选中记录吗？[菜单名称: ' + row.title + ']', '提示', {
        type: 'warning'
      }).then(() => {
        if (row.children) {
          this.$notify({
            //  title: '错误',
            message: row.title + ' - 存在子节点不能删除',
            type: 'error'
          })
          return
        }
        const tempData = {
          'id': row.id,
          'title': row.title
        }
        // 调用api删除数据
        deleteMenu(tempData).then(res => {
          // 如果删除成功，后台重新更新数据,否则不更新数据
          if (res.type === 'success') {
            this.getData()
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
      console.log('handleFilter')
      console.log(this.tableData)
      // const result = this.deal(this.tableData, node => node.title.toLowerCase().includes(this.searfilterTextch.toLowerCase()))
      // // console.log('result', result)
      // this.tableData.filter = result
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-icon-arrow-right:before {
}
</style>
