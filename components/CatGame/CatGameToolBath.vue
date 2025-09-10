<template>
  <div  v-if="currentTime === 'bath'">
    <button @click="washIt">洗澡</button>
    <button @click="DontWashIt">不洗澡</button>
  </div>
</template>

<script setup>
import { useCatStateTools } from '../tools/CatStateTool';
import { useTimeStateTools } from '../tools/TimeStateTools';

const { 
  cleanState,
  howClean,
  stateChange,
  statePlus,
} = useCatStateTools();

const { 
  currentTime,
  storyContinue,
} = useTimeStateTools();

//洗澡
const washCat = ( respond,clean )=>{
  if( cleanState.value === '乾淨' ){
    stateChange( 'stateValue.respond', respond.cleanCat );
    statePlus('baseValue.cleanValue', clean.cleanCat );
  } else if ( cleanState.value  === '普通' ){
    stateChange( 'stateValue.respond', respond.normalCat );
    statePlus('baseValue.cleanValue', clean.normalCat );
  } else if ( cleanState.value === '骯髒' ){
    stateChange( 'stateValue.respond', respond.dirtyCat );
    statePlus('baseValue.cleanValue', clean.dirtyCat );
  } else if ( cleanState.value === '黑色毛炭' ){
    stateChange( 'stateValue.respond', respond.SuperDirtyCat );
    statePlus('baseValue.cleanValue', clean.SuperDirtyCat );
  }
  howClean();
  storyContinue();
}
const washIt = ()=>{
  washCat(
    { cleanCat: '儘管牠很乾淨，但你還是要給牠洗一洗',
      normalCat: '你把牠洗了洗',
      dirtyCat:  '你把牠又洗又刷',
      SuperDirtyCat: '"這是神影少女裡面的煤炭球嗎?"你心裡這麼想著同時用力地洗刷這團黑球',
    },
    { cleanCat: 1,
      normalCat: 7,
      dirtyCat: 7,
      SuperDirtyCat: 7,
    }
  )
}

const DontWashIt = ()=>{
  washCat(
    { cleanCat: '牠看起來很乾淨 不需要洗澡',
      normalCat: '你把牠拿起來聞了聞，一股貓味但不臭，所以你決定今天不幫牠洗澡',
      dirtyCat:  '儘管牠聞起來比臭臭泥還臭，但你懶得幫牠洗澡，任由牠繼續臭下去',
      SuperDirtyCat: '"這東西繼續放著不知道會部會變成其他生物"你這樣想著',
    },
    { cleanCat: 0,
      normalCat:0,
      dirtyCat: 0,
      SuperDirtyCat: 0,
    }
  )
}
</script>

<style>  
</style>