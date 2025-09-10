import { defineStore } from "pinia"

export const useWhatTimeStore = defineStore('WhatTime',{
  state: ()=>({
    day: 1,
    time: {
      breakfast: '早餐時間',
      morning: '早上',
      lunch: '午餐時間',
      afternoon: '下午',
      bath: '洗澡時間',
      dinner: '晚餐時間',
      night: '晚上',
      sleep: '睡覺時間',
      calculateThisDay:'睡覺時間'
    },
    currentTime: 'breakfast',  // 新增屬性來儲存當前時間段
  }),
  actions: {
    plusDay( amount ){
      this.day += amount
    },
    SET_TIME( timeKey ){
      this.currentTime = timeKey
    },
    SET_DAY( thisday ){
      this.day = thisday
    },
    
    storyContinue(){
      const timeKeys = Object.keys(this.time);
      const currentIndex = timeKeys.indexOf(this.currentTime);

      if( currentIndex === timeKeys.length -1 ) {
        // 如果已經是 "睡覺時間"，則將天數加 1，並重置為 "早餐時間"
        this.day +=1;
        this.currentTime = timeKeys[0];
      } else {
        //進入下一個時間段
        this.currentTime = timeKeys[(currentIndex +1)]
      }
    },
    whatTimeNow(){
      return this.time[this.currentTime]
    },
  },
  getters: {
  }
})