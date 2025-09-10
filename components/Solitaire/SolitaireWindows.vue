<template>
  <div 
  ref="solitaireRef"
    class="SolitGameWindow"
    :style="styleVars"
    @mousedown="startDrag"
  >
    <div class="control">
      <div class="left">
        <div class="logo">
          <img src="/image/solitaireIcon.png">
        </div>        
        <div class="gameName">{{ appName }}</div>        
      </div>
      <div class="right">
        <div class="controlButton">
          <button 
            class="minimize" 
            type="button" 
            @click="clickMinButton"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="10" 
              width="10" 
              viewBox="0 0 512 512"
            >
              <path d="M24 432c-13.3 0-24 10.7-24 24s10.7 24 24 24l464 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L24 432z"/>
            </svg>
          </button>
        </div>
        <div class="controlButton close">
          <button type="button">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="10" 
              width="7.5" 
              viewBox="0 0 384 512"
            >
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/>
            </svg>
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
      <div class="gameDisplay">
        <img src="/image/接龍畫面.jpg">
      </div>
    </div> 
  </div>
</template>

<script setup>
import { draggableTool } from '../tools/appWindowsControl';
import { useSolitaire } from '../stores/Solitaire';
import { UseControlWindowsShow } from '../tools/appWindowsControl';
import { computed, onMounted, onUnmounted, ref, toRef } from 'vue';

// Props
const props = defineProps({
  SolitairGameShow:{
      type:Boolean,
      default:true,
    }
})

// Emit
const emit = defineEmits(['minimize'])

// Ref
const solitaireRef = ref(null);
const {appName, options} = useSolitaire();

// 建立拖曳工具
const { 
  position, 
  startDrag, 
  getWinRef: setWinRef
} = draggableTool(
  50,
  200
)

// 視窗顯示控制
const SolitGameWindowShow = UseControlWindowsShow(toRef(props, 'SolitairGameShow'));

//計算是否顯示視窗
const checkScreenSizeDisplay = ()=>{
  if(window.innerWidth < 768){
    SolitGameWindowShow.value = false;
  }else{
    SolitGameWindowShow.value = true;
  }
}

//lifecycle
onMounted(()=>{
  checkScreenSizeDisplay();
  window.addEventListener('resize', checkScreenSizeDisplay);
  if (solitaireRef.value) setWinRef(solitaireRef.value)
});

onUnmounted(()=>{
  window.removeEventListener('resize', checkScreenSizeDisplay);
})

//最小化按鈕互動
const clickMinButton = ()=>{
  emit('minimize');
}

// 綁定 style
const styleVars = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  display: SolitGameWindowShow.value ? 'block' : 'none'
}));
</script>

<style lang="scss" scoped>
*{
  padding: 0;
}
$normalWindowColor:#c0c7c8;
$hoverWindowColor:#dcdcdc;
$borderColor:#87888f;
$Win95Blue:#0000a8;

.SolitGameWindow::after{  
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
.SolitGameWindow{  
  position: relative;
  display: block;
  background-color: $normalWindowColor;
  padding: 2px;
  width: auto;
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
      align-items: center;

      .logo{
        height: 15px;
        width: 15px;
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

    .gameDisplay{
      height: 460px;
      width: 700px;

      img{
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }    
}
@media (max-width:1080px) {
  .SolitGameWindowShandow{
    position: flex;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
  }  
}
</style>