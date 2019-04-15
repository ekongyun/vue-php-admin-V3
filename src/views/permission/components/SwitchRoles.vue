<template>
  <div>
    <div style="margin-bottom:15px;">{{ $t('permission.roles') }}： {{ roles }}</div>
    {{ $t('permission.switchRoles') }}：
    <el-radio-group v-model="switchRoles">
      <el-radio-button label="editor" />
      <el-radio-button label="admin" />
    </el-radio-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      options: [{
        value: '1',
        label: '超级管理员'
      }, {
        value: '2',
        label: '测试角色'
      }],
      roleValue: '1'
    }
  },
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    switchRoles: {
      get() {
        return this.roles[0]
      },
      set(val) {
        this.$store.dispatch('ChangeRoles', val).then(() => {
          // this.$router.push({ path: '/'})
          this.$emit('change') // 调用父组件page.vue中的自定义事件change 中的函数 handleRolesChange
        })
      }
    }
  }
}
</script>
