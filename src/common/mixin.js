import { debounce } from "common/utils";


export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    };
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);

    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on("itemImageLoad", this.itemImgListener);
  }
};


export const backTopMixin = {
  data: function () {
    return {
      showBackTop: false
    }
  },

  methods: {
    mbackTop: function () {
      this.$refs.scroll.scrollTo(0, 0, 300);
    }
  }
};