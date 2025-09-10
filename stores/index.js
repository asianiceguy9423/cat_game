import { createStore } from "vuex";
import CatState from "./CatState";
import WhatTime from "./WhatTime";

const store = createStore({
  modules: {
    CatState,
    WhatTime,
  }
})

export default store