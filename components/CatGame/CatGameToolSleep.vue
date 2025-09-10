<template>
  <div v-if="currentTime ==='sleep'">
    <button @click="letCatSleep">叫牠睡覺</button>
    <button @click="doNotLetCatSleep">讓牠自由活動</button>
  </div>
</template>

<script setup>
import { useCatStateTools } from '../tools/CatStateTool';
import { useTimeStateTools } from '../tools/TimeStateTools';

const { 
  sleepValue,
  getrandNumber,
  MaxValue,
  stateChange,
  statePlus,
} = useCatStateTools();
const { 
  currentTime,
  storyContinue,
} = useTimeStateTools();

//睡覺
const sleepCat = ( sleepProbability,respond,food,feel,sleep,nosleep ) =>{
  if(sleepValue.value >= sleepProbability){
    const randomNumber = getrandNumber(3);
    if( randomNumber === 0 ){
      stateChange( 'stateValue.respond' ,respond.one );
      statePlus( 'baseValue.foodValue', food.one );
      statePlus( 'baseValue.feelValue', feel.one );
      statePlus( 'baseValue.sleepValue', sleep.one );
    } else if( randomNumber === 1 ){
      stateChange( 'stateValue.respond' ,respond.two );
      statePlus( 'baseValue.foodValue', food.two );
      statePlus( 'baseValue.feelValue', feel.two );
      statePlus( 'baseValue.sleepValue', sleep.two );
    } else if( randomNumber === 2 ){
      stateChange( 'stateValue.respond' ,respond.three );
      statePlus( 'baseValue.foodValue', food.three );
      statePlus( 'baseValue.feelValue', feel.three );
      statePlus( 'baseValue.sleepValue', sleep.three );
    }
  } else{
    stateChange( 'stateValue.respond' , respond.four );
    statePlus( 'baseValue.foodValue', food.four );
    statePlus( 'baseValue.feelValue', feel.four );
    statePlus( 'baseValue.sleepValue', sleep.four );
  }
  statePlus( 'condition.noSleep', nosleep );
  MaxValue();
  storyContinue();
}

const letCatSleep = ()=>{
  sleepCat(
    60,
    {
      one: '半夜牠突然在你身上吐貓毛，溼溼熱熱的感覺把你弄醒，在你睡眼惺忪處理著牠的嘔吐物時，你看到牠爬到你枕頭上睡覺，你心裡暗罵"這可惡的小王八蛋"',
      two: '牠在你熟睡之後爬到你身上睡覺，雖然你一覺到天亮但卻做了個被大石頭壓著的夢',
      three: '牠乖乖地躺在你身邊睡覺並做了個吃雞腿的夢，早上起來你的臉頰和枕頭都是牠的口水',
      four: '牠乖乖地跑回自己的窩去睡覺，你也度過了熟睡的夜晚',
    },
    {
      one: -2,
      two: -2,
      three: -2,
      four: -2,
    },
    {
      one: 10,
      two: 10,
      three: 10,
      four: 10,
    },
    {
      one: -15,
      two: -15,
      three: -15,
      four: -15,
    },
    0
  )
}

const doNotLetCatSleep = ()=>{
  sleepCat(
    -1,
    {
      one: '牠在你睡覺的時候跑出去跟其他貓打架，並成為今晚的貓擂台冠軍',
      two: '牠在夜晚期協助外星人研發外星科技，為宇宙共同文明盡一份力，也因此取得了榮譽外星公民身分',
      three: '貓界編輯打電話來催牠稿，牠只好把今晚時間都用在牠的連載漫畫上',
      four: 'noHave',
    },
    {
      one: -5,
      two: -8,
      three: -5,
      four: 0,
    },
    {
      one: 15,
      two: 12,
      three: 8,
      four: 0,
    },
    {
      one: 7,
      two: 12,
      three: 7,
      four: 0,
    },
    1
  )
}
</script>

<style>  
</style>