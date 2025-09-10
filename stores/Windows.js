import { defineStore } from "pinia";

export const useWindows = defineStore('Windows',{
  state: ()=>({
    apps:[
      {
        icon: '/image/computer.png',
        name: 'My Computer'
      },
      {
        icon: '/image/network.png',
        name: 'Network Nwighborhood'
      },
      {
        icon: '/image/inbox.png',
        name: 'Inbox'
      },
      {
        icon: '/image/Recycling.png',
        name: 'Recycle Bin'
      },
      {
        icon: '/image/internet.png',
        name: 'The internet'
      },
      {
        icon: '/image/Folder.png',
        name: 'Online Services'
      },
      {
        icon: '/image/msn.png',
        name: 'Set Up The Micrisoft Network'
      },
    ]

  }),
  actions: {

  },
  getters: {

  }
})