const uploadimg = {
  state: {
    fileLists: []
  },
  mutations: {
    SET_FILELISTS: (state, filelists) => {
      state.fileLists = filelists
    }
  },
  actions: {
    SetFileLists({ commit }, filelists) {
      commit('SET_FILELISTS', filelists)
    }
  }
}

export default uploadimg
