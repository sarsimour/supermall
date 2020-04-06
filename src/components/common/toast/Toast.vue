<template>
  <div class="toast" v-show="show">
      <div>{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {};
  },
  props: {
      message: {
          type: String,
          default: ''
      },
      show: {
          type: Boolean,
          default: false
      }
  },
  components: {}
};
</script>

<style scoped>
.toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 8px 10px;

    color: #fff;
    background-color: rgba(0, 0, 0, .75);
}
</style>
