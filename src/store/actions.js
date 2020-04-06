import { ADD_CART } from './mutation-types'

const actions = {
    addCartAction(context, payload) {
      return new Promise((resolve) => {
        context.commit(ADD_CART, payload);
        resolve("add success");
      });
    }
  };
  
  export default actions;

