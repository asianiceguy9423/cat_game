import { defineStore } from "pinia"

export const useCatState = defineStore('CatState',{
    state: ()=>({
      appName: 'Cat Game',
      options: [
        { name: 'File' },
        { name: 'Options' },
        { name: 'Windows' },
        { name: 'Help' },
      ],
      baseValue:{
        foodValue:50,
        feelValue:50,
        sleepValue:50,
        cleanValue:7
      },
      stateValue:{
        stated:'正常',
        energy:'健康',
        cleanState:'乾淨',
        respond:'這是隻普通的貓'
      },    
      maximum:{
        MAXfood:150,
        MAXfeel:150,
        MAXsleep:150
      },
      probability:{
        proFail: 5,
        proSuccess: 95
      },
      condition:{
        recoverHealth:0,
        demon:0,
        noSleep:0,
      }      
    }),
    actions: {
      CLEANSTATE(){
        const mapping =[
          { limit:0, state:'黑色毛炭' },
          { limit:2, state:'骯髒' },
          { limit:4, state:'普通' },
          { limit:5, state:'乾淨' },
        ]
        const found = mapping.find(m => this.baseValue.cleanValue <= m.limit);
        this.stateValue.cleanState = found ? found.state : '乾淨';
      },
      SET_STATE_CHANGE(path, value){
        const keys = path.split('.');
        let target = this;
        for(let i = 0; i < keys.length -1; i++){
          target = target[keys[i]];
        }
        target[keys[keys.length -1]] = value;
      },
      SET_STATE_PLUS(path, value){
        const keys = path.split('.');
        let target = this;
        for(let i = 0; i < keys.length -1; i++){
          target = target[keys[i]];
        }
        target[keys[keys.length -1]] += value;
        // console.log('SET_STATE_PLUS', path, target[keys[keys.length -1]], '+', value);
      },
      getRandomNumbers(Probability){
        return Math.floor(Math.random()*Probability);
      },
      RandomReaction( Probability,...reactions ){
        const rand = this.getRandomNumbers(Probability);
        return reactions[rand] || '你的貓故障了，沒有反應'
      },
    },
     getters: {
    }
  })