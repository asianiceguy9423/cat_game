<template>
  <div>
    <button @click="restartButton">重新開始</button>
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
  setDay,
  setTime,
} = useTimeStateTools();

const restartButton = () => {
  // 重置貓的狀態
  stateChange( 'baseValue.foodValue', 50);
  stateChange( 'baseValue.feelValue', 50);
  stateChange( 'baseValue.sleepValue', 50);
  stateChange( 'baseValue.cleanValue', 7);
  stateChange( 'stateValue.stated', '正常');
  stateChange( 'stateValue.energy', '健康');
  stateChange( 'stateValue.cleanState', '乾淨');
  stateChange( 'stateValue.respond', '這是隻普通的貓');
  stateChange( 'maximum.MAXfood', 150);
  stateChange( 'maximum.MAXfeel', 150);
  stateChange( 'probability.fail', 5);
  stateChange( 'probability.success', 95);
  stateChange( 'condition.recoverHealth', 0);
  stateChange( 'condition.demon', 0);
  stateChange( 'condition.noSleep', 0);
  // 重置遊戲的時間
  setDay(1);
  setTime('breakfast');
};
</script>

<style>  
</style>