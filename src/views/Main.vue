<template>
  <dev>
    <h1>主页</h1>
  </dev>
</template>

<script>
export default {
  name: "Main",
  beforeRouteEnter: (to, from, next) => {
    console.log("进入路由之前")
    next(vm => {
      vm.getData()
    });
  },
  beforeRouteLeave: (to, from, next) => {
    console.log("进入路由之后")
    next();
  },
  methods: {
    getData() {
      this.axios({
        method : "get",
        url : "http://localhost:8080/static/mock/data.json"
      }).then(function (response) {
        console.log(response)
      });
    }
  }
}
</script>

<style scoped>

</style>
