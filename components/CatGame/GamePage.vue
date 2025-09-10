<template>
  <div 
    ref="catGameRef"
    class="gameWindow"
    :style="styleVars"
    @mousedown="startDrag"
  >
    <div class="control">
      <div class="left">
        <div class="logo">
          <img src="/image/huh-cat.gif">
        </div>        
        <div class="gameName">{{ appName }}</div>        
      </div>
      <div class="right">
        <div class="controlButton">
          <button 
            ref="minimizeRef"
            class="minimize" 
            type="button" 
            @click="clickMinButton"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 512 512"><path d="M24 432c-13.3 0-24 10.7-24 24s10.7 24 24 24l464 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 432z"/></svg>
          </button>
        </div>
        <div class="controlButton close">
          <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" height="10" width="7.5" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
          </button>
        </div>        
      </div>
    </div>

    <div class="Options">
      <div v-for="(option, index) in options" :key="index">
        {{ option.name }}
      </div>
    </div>

    <div class="AllGameValue">
      <div class="toolValue">
        <div class="nameBox whiteBox">名稱:貓咪</div>
        <div class="buttonBox">
          <CatGameToolFeed v-if="day !== 8"/>
          <CatGameToolPlay v-if="day !== 8"/>
          <CatGameToolBath v-if="day !== 8"/>
          <CatGameToolSleep v-if="day !== 8"/>
          <CatGameToolNextDay v-if="day !== 8"/>

          <CatGameToolRestart v-if="day == 8"/>
        </div>
      </div>

      <div class="gameValue">
        <div class="AllState">
          <h1 class="greyBox">狀態</h1>
          <div class="whiteBox">
            <span>日期:第{{ day }}天</span>
            <span>時間:{{ WhatTimeNow }}</span>
            <span>外觀:看起來很{{ stated }}</span>
            <span>身體:{{ cleanState }}</span>
          </div>
        </div>
        <div class="catValue">
          <h1 class="greyBox"></h1>
          <div></div>
          <div class="whiteBox">
            <div>
              <div v-if="day !== 8">
                {{ respond }}
              </div>
              <div  v-if="day === 8">
                一周過去，你的貓成為了{{ whatCatYouHave() }}
              </div>
            </div>              
            <div class="imageBox">
              <img v-if="day !== 8" src="/image/就是貓.jpg" >
              <img v-if="day === 8" :src="whatCatImgURL()" >
            </div>              
          </div>
        </div>
      </div>
      
      <div class="Info">
        <div>
          <span>飽足感:{{ foodValue }}</span>
          <span>心情:{{ feelValue }}</span>
          <span>疲勞感:{{ sleepValue }}</span>
        </div>
      </div>    
    </div>
  </div>
</template>

<script setup>
import { UseControlWindowsShow } from '../tools/appWindowsControl';
import { computed, onMounted, onUnmounted, ref, toRef } from 'vue';
import { draggableTool } from '../tools/appWindowsControl';
import { useCatStateTools } from '../tools/CatStateTool';
import { useTimeStateTools } from '../tools/TimeStateTools';

//子元件
import CatGameToolFeed from './CatGameToolFeed.vue';
import CatGameToolPlay from './CatGameToolPlay.vue';
import CatGameToolBath from './CatGameToolBath.vue';
import CatGameToolSleep from './CatGameToolSleep.vue';
import CatGameToolNextDay from './CatGameToolNextDay.vue';
import CatGameToolRestart from './CatGameToolRestart.vue';

// Props
const props = defineProps({
catGameShow:{
      type: Boolean,
      default:true,
    }
})

// Emit
const emit = defineEmits(['minimize']);

// Ref
// 狀態工具
const {
  appName,
  options,

  foodValue,
  feelValue,
  sleepValue,
  cleanValue,

  stated,
  energy,
  cleanState,
  respond,

  demon,
  noSleep,
} = useCatStateTools();

const { day, WhatTimeNow } = useTimeStateTools();

// 遊戲結算邏輯
const whatCatYouHave = ()=>{
  if( demon.value >=12){
    return '殺手貓'
  } else if ( cleanValue.value >=10 ){
    return '潔癖貓'
  } else if ( noSleep.value >=6 ){
    return '熬夜貓'
  } else if ( sleepValue.value >=150 && feelValue.value >=150 ){
    return '死靈貓'
  } else if ( foodValue.value >=100){
    return '大胖貓'
  } else if ( foodValue.value <=10 ){
    return '骷髏弓箭貓'
  } else if ( feelValue.value >=130 ){
    return '活力貓'
  } else if ( sleepValue.value >=150 ){
    return '嗜睡貓'
  } else if (energy.value === '健康' && feelValue.value >= 80 && sleepValue.value >= 60){
    return '健康貓'
  } else {
    return '快樂貓'
  }
}

const whatCatImgURL = ()=>{
  if(whatCatYouHave() === '殺手貓'){
    return '/image/殺手貓.jpg'
  } else if(whatCatYouHave() === '潔癖貓'){
    return '/image/潔癖貓.gif'
  } else if(whatCatYouHave() === '熬夜貓'){
    return '/image/熬夜貓.jpg'
  } else if(whatCatYouHave() === '死靈貓'){
    return '/image/死靈貓.jpg'
  } else if(whatCatYouHave() === '大胖貓'){
    return '/image/大胖貓.jpg'
  } else if(whatCatYouHave() === '骷髏弓箭貓'){
    return '/image/骷髏弓箭貓.jpg'
  } else if(whatCatYouHave() === '活力貓'){
    return '/image/活力貓.jpg'
  } else if(whatCatYouHave() === '嗜睡貓'){
    return '/image/嗜睡貓.jpg'
  } else if(whatCatYouHave() === '健康貓'){
    return '/image/健康貓.jpg'
  } else if(whatCatYouHave() === '快樂貓'){
    return '/image/快樂貓.jpg'
  }
}    

//控制視窗
const catGameRef = ref(null);
const minimizeRef = ref(null);

// 依螢幕尺寸決定初始位置
const {
  position,
  startDrag,
  getWinRef: setWinRef
} = draggableTool(100, 350); // 提供一個預設的起始位置

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  if (catGameRef.value) setWinRef(catGameRef.value)

  const getInitialPos = ( smallTop, smallLeft, top, left ) => {
    const small = window.innerWidth < 768;
    return small
      ? [ smallTop, smallLeft ]
      : [ top, left ];
  }

  // 使用實際的視窗大小計算初始位置，並更新 position
  const [newTop, newLeft] = getInitialPos(
    window.innerHeight / 5,
    0,
    100,
    350,
  );
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const isSmallScreen = ref(false); 
const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth < 768;
};

//最小化按鈕互動
const clickMinButton = ()=>{
  emit('minimize');
}

// 控制是否顯示
const gameWindowShow = UseControlWindowsShow(toRef(props, 'catGameShow'))

// 綁定 style
const styleVars = computed(() => {
  if (isSmallScreen.value) {
    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '100vw',
      display: gameWindowShow.value ? 'block' : 'none'
    }
  }
  return {
    top:`${position.value.top}px`, 
    left:`${position.value.left}px`,
    width: isSmallScreen.value ? '100vw' : '640px',
    display: gameWindowShow.value ? 'block' : 'none' 
  }
})
</script>

<style lang="scss" scoped>
*{
  padding: 0;
}
$normalWindowColor:#c0c7c8;
$hoverWindowColor:#dcdcdc;
$borderColor:#87888f;
$Win95Blue:#0000a8;

.gameWindow::after{  
  position: absolute;
  content: '';
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-top: 1px solid $normalWindowColor;
  border-left: 1px solid $normalWindowColor;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  z-index: -1;
}

.gameWindow{  
  position: relative;
  display: block;
  background-color: $normalWindowColor;
  padding: 2px;
  width: 640px;
  height: auto;
  box-sizing: border-box;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-bottom: 1px solid $borderColor;
  border-right: 1px solid $borderColor;

  .control{
    display: flex;
    height: 28px;
    justify-content: space-between;
    align-items: center;
    background-color: $Win95Blue;

    .left{
      display: flex;
      margin: 4px;
      box-sizing: border-box;

      .logo{
        height: 18px;
        width: 18px;
        margin-right: 4px;

        img{
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
      .gameName{
        font-weight: bolder;
        color: #fff;
      }
    }
    .right{
      display: flex;
      margin: 4px;
      box-sizing: border-box;

      .close{
          margin-left: 4px;
        }              
      .controlButton{
        
        button{
          height: 18px;
          width: 18px;
        }
      }
    }
  }
  .Options::after{
    position: absolute;
    background-color: #fff;
    height: 1px;
    width: 100%;
    content: '';
    bottom: -2px;
  }
  .Options{
    position: relative;
    display: flex;
    column-gap: 2px;
    border-bottom: 1px solid $borderColor;
    margin-bottom: 4px;

    div{
      height: 19px;
      padding: 2px 4px;
      cursor: pointer;
      margin: 2px 0;
    }
    div:hover{
      background-color: $hoverWindowColor;
    }
    div:active{
      background-color: $Win95Blue;
      color: #fff;
    }
    div::first-letter{
      display: inline-block;
      border-bottom: 1.4px solid;
    }
  }
  .AllGameValue{
    display: flex;
    flex-direction: column;
    row-gap: 3px;

    .toolValue{
      height: 28px;
      display: flex;
      justify-content: space-between;
      margin: 1px 1px;
      column-gap: 10px;

      .nameBox{
        width: 40%;
        position: relative;
        z-index: 0;
      }
      .nameBox::after{
        position: absolute;
        content: '';
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border-top: 1px solid $borderColor;
        border-left: 1px solid $borderColor;
        border-bottom: 1px solid #fff;
        border-right: 1px solid #fff;
        bottom: -2px;
        z-index: -1;
      }
      .buttonBox{
        margin-top: -1px;
        width: 60%;
        // padding-left: 8px;
        box-sizing: border-box;

        :deep(div){
          display: flex;
          column-gap: 1px;
          height: 29px;

          button{
            padding: 0 4px;
          }
        }
      }
    }
    .gameValue{
      display: flex;
      justify-content: space-between;
      column-gap: 4px;

      .AllState{
        display: flex;
        width: 40%;
        flex-direction: column;

        h1{
          width: 100%;
          height: 32px;
          font-weight: normal;
          font-size: 16px;
          align-content: center;
          display: flex;
          padding: 4px;
          margin: 0;
          box-sizing: border-box;
        }
        .whiteBox{
          display: flex;
          min-height: 200px;
          flex-direction: column;
        }
      }
    }
    .catValue{
      display: flex;
      width: 60%;
      flex-direction: column;

      h1{
        width: 100%;
        height: 32px;
        font-weight: normal;
        font-size: 16px;
        display: flex;
        padding: 4px;
        margin: 0;
        box-sizing: border-box;
      }
      .whiteBox{
        display: flex;
        min-height: 200px;
        flex-direction: column;
        justify-content: space-between;

        .imageBox{
          width: 150px;
          height: 150px;            

          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }
    .Info{
    
      div{
        display: flex;
        height: 34px;
        column-gap: 4px;

        span{
          display: flex;
          border-top: 1px solid #87888f;
          border-left: 1px solid #87888f;
          border-bottom: 1px solid #fff;
          border-right: 1px solid #fff;
          padding: 4px;
          content:'';
        }
      }      
    }
  }    
}

@media (max-width:768) {
  .gameWindow {
    width: 100vw;
    // left: 0;
    transform: none;
    max-width: 100%; // 确保在小屏幕时宽度不会溢出
    max-height: 100%; // 确保高度不会溢出
    overflow: hidden; // 避免内容溢出
    box-sizing: border-box;
  }  
}
</style>