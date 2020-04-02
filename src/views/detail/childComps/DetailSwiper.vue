<template>
  <swiper class="detail-swiper">
    <swiper-item v-for="item in topImages" v-bind:key="item">
        <img :src="item" alt="">
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: "DetailSwiper",
  data() {
    return {
      isload: false
    };
  },
  props: {
    topImages: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {}
};
</script>

<style scoped>
.detail-swiper {
  height: 300px;
  overflow: hidden;
}
</style>
