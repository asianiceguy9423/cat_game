import { defineStore } from "pinia";

export const useSolitaire = defineStore('Solitaire',{
  state: ()=>({
    appName: '接龍',
    options:[
      {
        name: 'Game'
      },
      {
        name: 'Help'
      },
    ]
  }),
  actions: {

  },
  getters: {

  }
})