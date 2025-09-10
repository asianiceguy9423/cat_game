<template>
  <div class="computerAllIcon">  
    <div 
      v-for="(app, index) in apps" :key="index"
      class="icon"
    >
      <div class="iconImage">
        <img :src= "app.icon">
      </div>
      <div class="iconName">{{ app.name }}</div>
    </div>
  </div>
</template>

<script setup>
import { useWindows } from '../stores/Windows';

const WindowsStore = useWindows();
const { apps } = WindowsStore;
</script>

<style lang="scss" scoped>
.computerAllIcon{
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  align-items: center;

  .icon{
    display: flex;
    width: 100px;
    flex-direction: column;
    align-items: center;

    .iconImage{
      height: 44px;
      width: 44px;

      img{
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
    .iconName{
      text-align: center;
      color: #fff;
      margin-top: 8px;
    }
  }
}
</style>