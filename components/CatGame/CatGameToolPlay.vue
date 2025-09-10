<template>
<div 
  v-if="currentTime === 'morning' ||
  currentTime === 'afternoon' ||
  currentTime === 'night'
  ">
    <button 
    @click="TakeANap" 
    v-if="currentTime === 'afternoon'">
      睡午覺
    </button>
    <button 
      @click="TakeAWalk"
      v-if="currentTime === 'morning' ||
      currentTime === 'afternoon'"
    >
      帶去散步
    </button>
    <button 
      v-if="currentTime === 'morning' ||
      currentTime === 'night'"
      @click="playWithIt"
    >
      陪牠玩
    </button>
    <button 
      v-if="currentTime === 'morning' ||
      currentTime === 'afternoon'"
      @click="Grooming"
    >
      幫牠理毛
    </button>
    <button 
    @click="watchTV"
    v-if="currentTime === 'night'">
      看電視
    </button>
    <button 
    @click="readStories"
    v-if="currentTime === 'night'">
      念故事
    </button>
    <button @click="slapIt">欺負牠</button>
  </div>
</template>

<script setup>
import { useCatStateTools } from '../tools/CatStateTool';
import { useTimeStateTools } from '../tools/TimeStateTools';

const { 
  energy,

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

//編輯隨機反應
const whatPlaySickReaction = ()=>{
  return randReaction(
    3,
    '牠病懨懨的，在原地翻來翻去',
    '牠閉上眼在原地呻吟著，你看著都覺得心痛',
    '牠半睜開的眼看著你，似乎想告訴你牠需要休息'
  )
}

//活動事件
const playCat = (foodEffect, feelEffect, sleepEffect, responses)=>{
  if( energy.value === '健康'){
    const randomNumber = getrandNumber(3);
    if( randomNumber === 0 ){
      stateChange( 'stateValue.respond', responses.one );
      statePlus( 'baseValue.feelValue', feelEffect.one );
      statePlus( 'baseValue.foodValue', foodEffect.one );
      statePlus( 'baseValue.sleepValue', sleepEffect.one );
    } else if( randomNumber === 1 ){
      stateChange( 'stateValue.respond', responses.two );
      statePlus( 'baseValue.feelValue', feelEffect.two );
      statePlus( 'baseValue.foodValue', foodEffect.two );
      statePlus( 'baseValue.sleepValue', sleepEffect.two );
    } else if( randomNumber === 2 ){
      stateChange( 'stateValue.respond', responses.three );
      statePlus( 'baseValue.feelValue', feelEffect.three );
      statePlus( 'baseValue.foodValue', foodEffect.three );
      statePlus( 'baseValue.sleepValue', sleepEffect.three );
    }
  } else if ( energy.value === '生病'){
    stateChange( 'stateValue.respond', responses.four );
    statePlus( 'baseValue.feelValue', feelEffect.four );
    statePlus( 'baseValue.foodValue', foodEffect.four );
    statePlus( 'baseValue.sleepValue', sleepEffect.four );
  }
  MaxValue();
  Howstate();
  howClean();
  storyContinue();
}

const TakeANap = ()=>{
  playCat(
    { one: 0, two: 0, three: 0, four: 1 },
    { one: 0, two: 0, three:0, four: -2 },
    { one: 0, two: 0, three: 0, four: -5 },
    {
      one:'牠翻過來躺在地上，睡到流口水，看起來真的很舒服',
      two:'牠趴在你電腦鍵盤上呼呼大睡，看來是不打算讓你下午好過了',
      three:'牠乖乖地在自己的窩裡睡覺，這行為讓你訝異的以為牠吃壞肚子了',
      four:'在生病的時候還是好好休息吧',
    }
  )
}

const TakeAWalk = ()=>{
  statePlus( 'baseValue.cleanValue', -2 )
  playCat(
    { one: -3, two: -3, three: -5, four: -2 },
    { one: 3, two: 4, three:10, four: -5 },
    { one: 3, two: 3, three: 7, four: 5 },
    {
      one:'你帶著牠在附近溜搭，牠很乖配合。回到家你發現牠只撿了一隻路邊的小蟲回來',
      two:'你帶著牠去了公園。牠在那蹦蹦跳跳玩得全身是沙，你想著晚上該給牠洗澡了',
      three:'你帶著牠去公園溜搭，到了那發現公園只有你們，牠經歷了整個公園都是自己遊樂場的一段美好時光',
      four:whatPlaySickReaction(),
    }
  )
}

const playWithIt = ()=>{
  statePlus( 'baseValue.cleanValue', -1 )
  playCat(
    { one: -3, two: -3, three: -5, four: -2 },
    { one: 4, two: 4, three: 18, four: -5 },
    { one: 5, two: 5, three: 9, four: 5 },
    {
      one:'你拿了個綁著毛的棒子在牠面前揮舞，牠跟著搖了搖頭，接著把逗貓幫抓了起來',
      two:'你拿雷射筆在地上照了個紅點，牠追著紅點不亦樂乎',
      three:'你把一隻玩具老鼠丟給牠，但牠反應有點大，將這隻玩具老鼠殺了，弄得滿地棉花屑',
      four:whatPlaySickReaction(),
    }
  )
}

const Grooming = ()=>{
  playCat(
    { one: -2, two: -2, three: -2, four: -2 },
    { one: 3, two: 3, three: 6, four: -5 },
    { one: 2, two: 2, three: 2, four: 5 },
    {
      one:'你用手了摸牠的毛，牠很舒服的給你理毛',
      two:'你把牠抱到腿上摸了摸牠，牠一臉"你在幹甚麼"的看著你',
      three:'由於你高超的撫摸技巧，牠舒服地發出咕嚕咕嚕',
      four:whatPlaySickReaction(),
    }
  )      
}

const watchTV = ()=>{
  playCat(
    { one: -1, two: -1, three: -1, four: -2 },
    { one: 2, two: 2, three: 3, four: -5 },
    { one: 2, two: 2, three: 2, four: 5 },
    {
      one:'你打開電視撥放最愛的節目，牠在一旁跟著你一起看',
      two:'你打開電視撥放最愛的節目，由於牠不感興趣所以一直在煩你',
      three:'在你要打開電視前一刻，牠搶過遙控器並轉到動物星球頻道，牠一臉愉悅地看著你',
      four:whatPlaySickReaction(),
    }
  )   
}

const readStories = ()=>{
  playCat(
    { one: -1, two: -1, three: -1, four: -2 },
    { one: 3, two: 3, three: 6, four: -5 },
    { one: 2, two: 2, three: 2, four: 5 },
    {
      one:'你講了"睡美人"的故事給牠聽，但牠不感興趣睡著了',
      two:'你講了"白雪公主"的故事給牠聽，但牠似乎不感興趣',
      three:'你講了"鞋貓劍客"的故事給牠聽，之後牠興奮的跑進你的靴子裡流口水',
      four:whatPlaySickReaction(),
    }
  )
}

const slapIt = ()=>{
  statePlus( 'condition.demon', 1 )
  playCat(
    { one: -1, two: -1, three: -1, four: -2 },
    { one: 15, two: 15, three: 15, four: -5 },
    { one: -5, two: -5, three: -5, four: 5 },
    {
      one:'你舉起手故意拍牠，在你手拍到牠前，你的頭被牠手中的槍指著，"救命喔，牠想要我死"',
      two:'你拿起床上的枕頭想偷襲牠，卻感覺這觸感不對，一看你手中竟然拿著牠。安靜的空氣中，你的腦海中只有"我死定了"',
      three:'在你有這個念頭的同時，沒有任何警告、沒有線索、沒有任何聲音，牠直直地盯著你好像在說"你死定了"',
      four:whatPlaySickReaction(),
    }
  )
}
</script>

<style lang="scss" scoped>
@media (max-width:400px) {
  button{
    font-size: 12px;
    padding: 0;
  }    
}
</style>