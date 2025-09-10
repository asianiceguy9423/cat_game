<template>
  <div v-if="currentTime === 'calculateThisDay'">
    <button @click="goToNextDay">結束這一天</button>
  </div>
</template>

<script setup>
import { useCatStateTools } from '../tools/CatStateTool';
import { useTimeStateTools } from '../tools/TimeStateTools';

const { 
  stateChange,
} = useCatStateTools();

const { 
  currentTime,
  storyContinue,
} = useTimeStateTools();

const goToNextDay = ()=>{
  stateChange( 'stateValue.respond' , '' );
  storyContinue();
}
</script>

<style>  
</style>