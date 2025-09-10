<template>
  <div 
  v-if="currentTime === 'breakfast' || 
    currentTime === 'lunch' ||
    currentTime === 'dinner'
  ">
    <button @click="feedFood">貓糧</button>
    <button @click="feedCanned">貓罐頭</button>
    <button @click="feedWater">水</button>
    <button @click="feedMedicine" v-if="energy==='生病'">藥</button>
  </div>
</template>

<script setup>
import { useCatStateTools } from '../tools/CatStateTool';
import { useTimeStateTools } from '../tools/TimeStateTools';

const { 
  foodValue,
  sleepValue,
  MAXfood,
  MAXsleep,
  energy,
  recoverHealth,
  proFail,
  proSuccess,

  MaxValue,
  howClean,
  Howstate,

  stateChange,
  statePlus,
  randReaction,
  getrandNumber,
} = useCatStateTools();

const { 
  currentTime,
  storyContinue,
} = useTimeStateTools();

//狀態設定
const whatFeedSickReaction = ()=>{
  return randReaction(
    3,
    '牠病懨懨的，吃不下任何東西',
    '牠毫無食慾，趴在窩裡看起來很難受',
    '牠半睜開的眼看著你，似乎想告訴你應該為牠吃藥'
  )
}
const whatFeedNormalReaction = ()=>{
  return randReaction(
    3,
    '在你弄飼料時牠在旁邊靜靜的看著，接著',
    '儘管你對牠滿滿的愛但牠眼中只有飼料，',
    '吃飯前牠對你喵喵叫了幾聲但你聽不懂牠想說甚麼，總之'
  )
}
const whatFeedSuccessReaction = ()=>{
  return randReaction(
    3,
    '在你弄飼料時電話響起，你一轉頭功夫，',
    '牠突然變成比你還要巨大，當你傻在原地時，',
    '牠指著左邊說"看那邊喵，你"蛤"了一聲轉過頭去，'
  )
}
const whatFeedFailReaction = ()=>{
  return randReaction(
    3,
    '牠突然打翻自己的碗，',
    '當你弄完飼料卻看到牠另在那一動不動，你搖了搖牠還是不動，幾分鐘後牠',
    '牠把飼料拿去給隔壁的狗吃，途中'
  )
}
const whaWaterReaction = ()=>{
  return randReaction(
    3,
    '牠一臉嫌棄地把它喝了',
    '牠喝了幾口"呸"了一聲走掉了',
    '牠舔了口就走掉了'
  )
}

//早午晚餐
const feedCat = (successProbability, failProbability, foodEffect, feelEffect, sleepEffect, responses)=>{
  if(energy.value === '生病'){
    stateChange( 'stateValue.respond', whatFeedSickReaction() )
  }
  //睡眠設定 
  else if(sleepValue.value >= MAXsleep.value){
    stateChange( 'stateValue.respond', responses.sleep );
  }
  else {
    const randomNumber = getrandNumber(101);
    statePlus( 'baseValue.sleepValue', sleepEffect );
    if(foodValue.value < MAXfood.value){
      if(randomNumber >= successProbability){
        statePlus( 'baseValue.foodValue', foodEffect.success );
        statePlus( 'baseValue.feelValue', feelEffect.success );
        stateChange( 'stateValue.respond', whatFeedSuccessReaction() + responses.success );
      } else if(randomNumber <= failProbability){
        statePlus( 'baseValue.feelValue', feelEffect.fail );
        stateChange( 'stateValue.respond', whatFeedFailReaction() + responses.fail );
        statePlus( 'baseValue.cleanValue', -1 );
      } else {
        statePlus( 'baseValue.foodValue', foodEffect.normal );
        statePlus( 'baseValue.feelValue', feelEffect.normal );
        stateChange( 'stateValue.respond', whatFeedNormalReaction() + responses.normal );
      }        
    }
  }
  MaxValue();
  howClean();
  Howstate();
  storyContinue();
}

const feedFood = ()=>{
  feedCat(
    Number(proSuccess.value + 3),
    Number(proFail.value - 3),
    { success: 16, normal: 8 },
    { success: 2, fail:2, normal: 1},
    3,
    {
      success: '牠衝進櫃子把另一包飼料全吃了',
      fail: '把飼料灑得滿地',
      normal: '牠吃得很開心',
      sleep: '牠累得像條狗，在你弄飼料期間就睡著了',
    }
  )
}

const feedCanned = ()=>{
  feedCat(
    proSuccess.value,
    proFail.value,
    { success: 8, normal: 6 },
    { success: 2, fail:2, normal: 1 },
    3,
    {
      success: '牠立刻打開了另一個罐頭吃了',
      fail: '把罐頭打翻並將裡面的肉泥沾得滿身都是',
      normal: '牠吃得很開心',
      sleep: '牠累得像條狗，在你弄飼料期間就睡著了',
    }
  )
}

const feedWater = ()=>{
  if( energy.value === '生病' ){
    stateChange( 'stateValue.respond', whatFeedSickReaction());
  } else {
    if( foodValue.value >= 100 ){
      statePlus( 'baseValue.foodValue', -5 );
      statePlus( 'baseValue.feelValue', -2 );
      stateChange( 'stateValue.respond', '由於他太胖又看起來不會餓，所以你給了牠碗水，' + whaWaterReaction() );
    } else if( foodValue.value <= -50 ){
      stateChange( 'stateValue.respond', '兄弟，你是在養貓還是養鬼' );
      stateChange( 'baseValue.foodValue', -50 );
    } else {
      statePlus( 'baseValue.foodValue', -3 );
      statePlus( 'baseValue.feelValue', -1 );
      stateChange( 'stateValue.respond', '你給了牠碗水，' + whaWaterReaction() );
      if( foodValue.value <= -50 ){
        stateChange( 'baseValue.foodValue', -50 );
      }
    }
  }
  howClean();
  Howstate();
  storyContinue();
}

const feedMedicine = ()=>{
  const recoverNumber = getrandNumber(3);
  statePlus( 'condition.recoverHealth' ,recoverNumber);
  if( recoverHealth.value >=5 ){
    stateChange( 'stateValue.respond','回復活力');
    stateChange( 'stateValue.energy' ,'健康');
    statePlus( 'baseValue.feelValue', 15 );
    stateChange( 'condition.recoverHealth' ,0);
  } else {
    stateChange( 'stateValue.respond','還是生病');
    statePlus( 'baseValue.foodValue', -1 );
    statePlus( 'baseValue.sleepValue', 5 );
  }
  storyContinue();
}
</script>

<style>  
</style>