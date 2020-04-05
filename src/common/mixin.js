import {POP, NEW, SELL} from "./const";
import { debounce } from "common/utils";


export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null
    };
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 100);

    this.itemImgListener = () => {
      refresh();
    };
    this.$bus.$on(this.loadevent, this.itemImgListener);
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

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}