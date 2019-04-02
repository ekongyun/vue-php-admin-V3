<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name:{{ name }}</div>
    <div class="dashboard-text">roles:
      <span v-for="role in roles" :key="role">{{ role }}</span>
    </div>
    <hr>
    <hr> -->

    <div>
      <h1 v-if="goods.length==0">没商品云购物
        <a href="jd.com">去购物吧</a>
      </h1>
      <div v-if="goods.length>0">
        <h1>购物车</h1>
        <el-table :data="goods" stripe height="250" style="width: 100%">
          <el-table-column prop="id" label="编号" width="50" />
          <el-table-column prop="title" label="名称" width="150" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="num" label="数量">
            <template slot-scope="scope">
              <!-- onkeypress 防止录入e 及其他字符 -->
              <el-input v-model.number="scope.row.num" size="small" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="合计" />
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row, goods)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      </div>
    </div>

    <div v-if="totalPrice>0">
      <h1 class="footerCart"> 总计: {{ totalPrice }}</h1>
    </div>
    <h3>
      mapGetters 辅助函数 相当于 this.$store.getters.valueName对派生出来的状态进行访问。或者直接使用辅助函数mapGetters将其映射到本地计算属性中去。 getters里面的方法里获取得到对应的属性，可以在组件中使用，类型的还有 mapMutations,mapState 等 vuex调试时出现 在vuex bindings里面
    </h3>
    <h3>
      计算属性与data()一样， 操作store里的数据时使用计算属性 会发生变化 这是计算属性的特性 计算机属性里的数组 相当于初次 将store里的变量进行了绑定，修改计算机属性里的数据时，相当于修改store里的数据会同时发生更改
    </h3>
    <h3>
      return this.$store.state.goods.goods this.$store.state.goods.goods 里面没有单一商品总价 但是初始挂载的时候却能计算到得到 并没有使用getters里的goodsx函数获取 ？？？？？？？？？？？？？ this.$store.getters.goods 此函数添加了一项单一商品总价 return this.$store.getters.goodsx
    </h3>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SysxXiangjunAles',
  data() {
    return {
    }
  },
  computed: {
    // mapGetters 辅助函数 相当于 this.$store.getters.valueName对派生出来的状态进行访问。或者直接使用辅助函数mapGetters将其映射到本地计算属性中去。
    // getters里面的方法里获取得到对应的属性，可以在组件中使用，类型的还有 mapMutations,mapState 等 vuex调试时出现 在vuex bindings里面
    ...mapGetters([
      'name',
      'roles',
      'phone',
      'identify'
    ]),
    // 计算属性与data()一样， 操作store里的数据时使用计算属性 会发生变化 这是计算属性的特性
    // 计算机属性里的数组 相当于初次 将store里的变量进行了绑定，修改计算机属性里的数据时，相当于修改store里的数据会同时发生更改
    totalPrice() {
      return this.$store.getters.totalPrice
    },
    goods() {
      console.log('goods computed.....', this.$store.state.goods.goods)
      // return this.$store.state.goods.goods
      // this.$store.state.goods.goods 里面没有单一商品总价
      //  但是初始挂载的时候却能计算到得到 并没有使用getters里的goodsx函数获取 ？？？？？？？？？？？？？
      // this.$store.getters.goods 此函数添加了一项单一商品总价
      return this.$store.getters.goodsx
    }
  },
  mounted() {
    console.log('xiangjun mounted')
    // mounted组件加载时 只执行一次，异步获取goods数据
    this.$store.dispatch('loadGoods')
    // console.log(this.$store.state.goods.goods)
  },
  methods: {
    handleDelete(index, rows, tabledata) {
      console.log(index)
      console.log(rows)
      console.log(rows.id)
      tabledata.splice(index, 1) // 直接删除 计算属性里的 goods数组的元素 与 mutations使用效果一样
      // 调用$store里的mutations里的方法 使用commit
      // 也可以在actions里定义函数，此处使用this.$store.dispatch 调用，在actions里直接使用 commit 提交 这种可能比较标准
      // this.$store.commit('DEL_GOODS', { id: id })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.footerCart {
  background: #999;
  color: #fff;
}
</style>
