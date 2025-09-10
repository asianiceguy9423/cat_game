import { defineStore } from "pinia";
import { useRuntimeConfig } from '#app';

export const useWindows = defineStore('Windows',{
  state: ()=>({
    apps:[
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/computer.png`,
        name: 'My Computer'
      },
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/network.png`,
        name: 'Network Nwighborhood'
      },
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/inbox.png`,
        name: 'Inbox'
      },
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/Recycling.png`,
        name: 'Recycle Bin'
      },
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/internet.png`,
        name: 'The internet'
      },
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/Folder.png`,
        name: 'Online Services'
      },
      {
        icon: `${useRuntimeConfig().app.baseURL}/image/msn.png`,
        name: 'Set Up The Micrisoft Network'
      },
    ]

  }),
  actions: {

  },
  getters: {

  }
})