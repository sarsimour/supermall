<template>
  <swiper>
    <swiper-item v-for="item in banners" v-bind:key="item.title">
      <a :href="item.link">
        <img :src="item.image" alt="" @load="homeswipperload">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    data() {
      return {
        isload: false
      }
    },
    props: {
      banners: {
        type: Array,
        default() {
          return []
        }
      }
    },
    components: {
      Swiper,
      SwiperItem
    },
    methods: {
      homeswipperload() {
        if (! this.isload) {
          this.$emit('swipperImageLoad');
          this.isload = true;
        }
        
      }
    },
  }
</script>

<style scoped>

</style>
