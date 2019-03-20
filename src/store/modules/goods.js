import { getgoods } from '@/api/goods'

const goods = {
  state: {
    goods: [
      // { id: 1, title: 'iphone 7 ', price: 399, num: 1 },
      // { id: 2, title: 'hdcms 7 ', price: 2000, num: 2 }
    ]
  },
  mutations: {
    // 删除购物车里的商品 操作仓库数据
    DEL_GOODS: (state, param) => {
      let k
      for (let i = 0; i < state.goods.length; i++) {
        if (param.id === state.goods[i].id) {
          k = i
          break
        }
      }
      state.goods.splice(k, 1)
    },
    SET_GOODS: (state, goods) => {
      state.goods = goods
      console.log('state.goods##############', state.goods)
    }
  },
  actions: {
    // vue 前端抓取后台数据 异步消息 在根组件 mounted 里触发 loadGoods事件
    loadGoods({ commit }) {
      return new Promise((resolve, reject) => {
        getgoods().then(response => {
          const data = response.data
          // console.log('---------------goods----------------', data.items)
          commit('SET_GOODS', data.items)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default goods
