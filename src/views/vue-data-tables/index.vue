<template>
  <div>
    <div style="margin-left: 10px;margin-top: 10px;margin-bottom: 10px">
      <el-row>
        <el-col :span="18">
          <el-button @click="onCreate">create 1 row</el-button>
          <el-button @click="onCreate100">create 100 row</el-button>
          <el-button @click="bulkDelete">bulk delete</el-button>
        </el-col>

        <el-col :span="4">
          <el-input v-model="filters[0].value" placeholder="search NO." />
        </el-col>
      </el-row>
    </div>

    <data-tables :data="data" :action-col="actionCol" :filters="filters" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop" sortable="custom" />
    </data-tables>

    <data-tables ref="multipleTable" :data="tableData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column v-for="title in rtitles" :prop="title.prop" :label="title.label" :key="title.prop" sortable="custom" />
    </data-tables>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelection(tableData)">全选</el-button>
      <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>

      <el-button @click="toggleSelection()">取消选择</el-button>
    </div>
    <el-alert>
      vue-data-tables - 基于element-ui的Vue2.0数据表 本库导出了2个组件 data-tables 和 data-tables-server. 在一些业务场景中，数据量并不大（比如500条数据）， 可以把所有数据加载到前台，甚至于直接写在前台代码里， 此时数据分页和过滤均发生在前台，data-tables 适用于这种场景。
    </el-alert>
    <el-alert>
      在另外的业务场景中，数据量很大，不可能一次性的返回给前台，此时数据分页和过滤均发生在后台， data-tables-server 则适用于这种场景。
    </el-alert>
    <el-alert>
      正如前文中提到的，本库依赖于 element-ui 的 el-table, el-table-column, el-button 和 el-pagination 组件 ， 所以在引入 vue-data-tables 之前, 我们需要先完整的引入 element-ui 或者按需引入 el-table, el-table-column, el-button 和 el-pagination 这4个组件。
    </el-alert>
    <el-alert>
      # npm install vue-data-tables main.js 里 _在引入 element-ui 后面 引入_ // 同时使用 DataTables 和 DataTablesServer import VueDataTables from 'vue-data-tables' Vue.use(VueDataTables)
    </el-alert>
    <el-tag>
      引用方法时 使用双层$refs 来引用el-table的方法： this.$refs.multipleTable.$refs.elTable.toggleRowSelection(row);
    </el-tag>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      titles: [
        {
          prop: 'flow_no',
          label: 'No.'
        },
        {
          prop: 'content',
          label: '内容'
        },
        {
          prop: 'flow_type',
          label: '类型'
        }
      ],
      rtitles: [
        {
          prop: 'date',
          label: 'date.'
        },
        {
          prop: 'name',
          label: 'name'
        },
        {
          prop: 'address',
          label: 'address'
        }
      ],
      filters: [{
        prop: 'flow_no',
        value: ''
      }],
      actionCol: {
        props: {
          label: '操作'
        },
        buttons: [{
          props: {
            type: 'primary'
          },
          handler: row => {
            this.$message('Edit clicked')
            row.flow_no = 'hello word' + Math.random()
            row.content = Math.random() > 0.5 ? 'Water flood' : 'Lock broken'
            row.flow_type = Math.random() > 0.5 ? 'Repair' : 'Help'
          },
          label: '编辑'
        }, {
          handler: row => {
            this.data.splice(this.data.indexOf(row), 1)
            this.$message('delete success')
          },
          label: '删除'
        }]
      },
      selectedRow: [],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },
  methods: {
    toggleSelection(rows) {
      console.log('rows', rows)
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.$refs.elTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.$refs.elTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.selectedRow = val
    },
    onCreate() {
      this.data.push({
        content: 'new created',
        flow_no: 'FW201601010003' + Math.floor(Math.random() * 100),
        flow_type: 'Help',
        flow_type_code: 'help'
      })
    },
    onCreate100() {
      [...new Array(100)].map(_ => {
        this.onCreate()
      })
    },
    bulkDelete() {
      this.selectedRow.map(row => {
        this.data.splice(this.data.indexOf(row), 1)
      })
      this.$message('bulk delete success')
    }
  }
}
</script>
