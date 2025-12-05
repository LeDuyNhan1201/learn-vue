import { defineStore } from "pinia";

export const useRefreshStateStore = defineStore("refreshState", {
  state: () => ({
    isModified: false as boolean,
  }),
  getters: {
    getModified: (state) => state.isModified,
  },
  actions: {
    setModified(state: boolean) {
      this.isModified = state;
    },
  },
});
