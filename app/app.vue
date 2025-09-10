<template>
  <LoadingPage v-if="isLoading"/>
  <div class="backgronddIV">
    <!-- Game 視窗 -->
    <GamePage 
    class="gameWindow"
    :style="{ zIndex: activeWindow === 'gameWindow' ? 90 : 1 }"
    @click="setActiveWindow ('gameWindow')"
    @minimize="receiveMinimize"
    :catGameShow="catGameShow"
    />
    <!-- Solitaire 視窗 -->
    <SolitaireWindows 
    class="Solitaire"
    :style="{ zIndex: activeWindow === 'Solitaire' ? 90 : 1 }"
    @click="setActiveWindow ('Solitaire')"
    @minimize="receiveminimizeSolit"
    :SolitairGameShow="SolitairGameShow"
    />
    <!-- 警告視窗 -->
     <client-only placeholder="false">
    <WarnWindow 
      class="WarnWindow"
      :class="{ highlight: warnWindowHighlight }"
      :warnWindowDisplay="warnWindowDisplay"
      @close="closeWarnWindow"
    />
    </client-only>
    <div
      v-if="warnWindowDisplay"
      class="globalOverlay"
      @click="triggerWarnHighlight"
    ></div>
    <WindowBar class="WindowBar"
    @minimize="receiveMinimize"
    @minimizeSolit="receiveminimizeSolit"
    :catGameShow="catGameShow"
    :SolitairGameShow="SolitairGameShow"
    :activeWindow="activeWindow"
    />
    <backGround/>    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import backGround from '../components/backGround.vue';
import GamePage from '../components/CatGame/GamePage.vue';
import WindowBar from '../components/windowBar.vue';
import WarnWindow from '../components/WarnWindow.vue';
import SolitaireWindows from '../components/Solitaire/SolitaireWindows.vue';
import LoadingPage from '../components/Loading/LoadingPage.vue';
import { useHead } from '#imports'
import { useRuntimeConfig  } from '#app'

const runtimeConfig = useRuntimeConfig()

//title icon
useHead({
  title: 'Cat Game',
  link:[
    {
      rel: 'icon',
      type: '/image/png',
      href: `${runtimeConfig .app.baseURL}/icon.png`,
    }
  ]
})

const isLoading = ref(true);
const startLoadingTime = Date.now();

onMounted(()=>{
  const elapsed = Date.now - startLoadingTime;
  const remaining = Math.max(0, 1000 - elapsed)
  setTimeout(()=>{
    isLoading.value = false;
  },remaining)
})

const activeWindow = ref('gameWindow');
const catGameShow = ref(true);
const SolitairGameShow = ref(true);

const setActiveWindow  = (winName)=>{
  if(warnWindowDisplay.value) return;
  activeWindow.value = winName;
}
//處理視窗最小化    
const receiveMinimize = ()=>{
  if(warnWindowDisplay.value) return;
  catGameShow.value = !catGameShow.value;
  activeWindow.value = ('gameWindow');
}

const receiveminimizeSolit =()=>{
  if(warnWindowDisplay.value) return;
  SolitairGameShow.value = !SolitairGameShow.value;
  activeWindow.value = ('Solitaire');
}

const warnWindowDisplay = ref(true);
const closeWarnWindow = () =>{
  warnWindowDisplay.value = false;
}

//控制警告外框
const warnWindowHighlight  = ref(false);
const triggerWarnHighlight  = () => {
  warnWindowHighlight.value = true;
  setTimeout(()=>{
    warnWindowHighlight.value = false;
  }, 100);
  setTimeout(()=>{
    warnWindowHighlight.value = true;
  }, 200);
  setTimeout(()=>{
    warnWindowHighlight.value = false;
  }, 300);
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
*{
  margin: 0;
}
$normalWindowColor:#c0c7c8;
$hoverWindowColor:#dcdcdc;
$borderColor:#87888f;
$Win95Blue:#0000a8;

.whiteBox{
  background-color: #fff;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  border-bottom: 1px solid $normalWindowColor;
  border-right: 1px solid $normalWindowColor;
}
.greyBox{
  border-top: 1px solid #87888f;
  border-left: 1px solid #87888f;
  border-bottom: 1px solid #fff;
  border-right: 1px solid #fff;
}
button{
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $normalWindowColor;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-bottom: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
  cursor: pointer;
  z-index: 0;
}
button::after{
  position: absolute;
  content: '';
  top: -1px;
  left: -1px;
  right: -2px;
  bottom: -2px;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  z-index: -1;
}
button:hover{
  background-color: $hoverWindowColor;
}
button:active{
  background-color: $normalWindowColor;
  border-top: 1px solid $borderColor;
  border-left: 1px solid $borderColor;
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}

.backgronddIV{
  display: flex;
  box-sizing: border-box;
  padding: 4px 8px;
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden; // 限制溢出
  max-height: 100vh; // 父容器高度限制
  background-color: #b34c66;
  z-index: 0;

  .WindowBar{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
  }
  .gameWindow{
    position: absolute;
    z-index: 2;
  }
  .Solitaire{
    z-index: 1;
    position: absolute;
  }
  .WarnWindow{
    z-index: 99;
    position: absolute;
  }
  .WarnWindow.highlight{
    border: 3px solid red;
    box-shadow: 0 0 10px red;
    transition: border 0.3s box-shadow 0.3s;
  }
  .globalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.1); /* 可調整透明度，讓使用者知道後面不能操作 */
    z-index: 98; /* 比一般視窗低，但比背景高 */
    pointer-events: all; /* 擋住滑鼠點擊 */
  }
}
@media (max-width:1080px) {
  .backgronddIV{
    justify-items: center;
  }  
}
</style>
