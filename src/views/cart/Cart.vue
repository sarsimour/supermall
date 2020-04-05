<template>
  <div id="cart">
    <nav-bar class="nav-bar"
      ><div slot="center">购物车({{ cartCount }})</div></nav-bar
    >
    <cart-list class="cart-list" :cart-list="cartList"></cart-list>
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import BottomBar from "./childComps/BottomBar";


export default {
  name: "Cart",
  data() {
    return {
      itemImgListener: null
    }
  },
  components: {
    NavBar,
    CartList,
    BottomBar,
  },
  computed: {
    cartList() {
      return this.$store.getters.cartList;
    },
    cartCount() {
      return this.$store.getters.cartCount;
    }
  },
};
</script>

<style scoped>
#cart {
  /*position: relative;*/
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
  position: fixed;
  width: 100%;
  z-index: 9;
}

.cart-list {
  position: absolute;
  top: 44px;
  bottom: 93px;
  width: 100%;
}

.clscroll {
  overflow: hidden;

  position: absolute;
  top: 0px;
  bottom: 93px;
  left: 0;
  right: 0;
}
</style>
