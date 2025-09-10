<template>
  <div class="windowsBar">
    <div>
      <div class="StartDiv">        
        <button>
          <div class="imageDiv">
            <img src="/image/win95Icon.png">
          </div>
          Start
        </button>
      </div>
      <div class="buttonDiv">
        <button 
        :class="[
          isHidden ? 'buttonUseHidden' : 'buttonUse',
          activeWindow === 'gameWindow' ? 'buttonUse' : 'buttonUseHidden']"
        class="AppDiv" 
        @click="clickMinButton">
          <div class="logo">
            <img src="/image/huh-cat.gif">
          </div>
          <div>Cat Game</div>
        </button>
        <button 
        v-if="solitaireDisplay"
        :class="[
          isSolitHidden ? 'buttonUseHidden' : 'buttonUse',
          activeWindow === 'Solitaire' ? 'buttonUse' : 'buttonUseHidden'
        ]"
        class="AppDiv solitaire"
        @click="clickSolitMinButton">
          <div class="logo">
            <img src="/image/solitaireIcon.png">
          </div>
          <div>接龍</div>
        </button>
      </div>      
    </div>
    <div>
      <div class="timeShow greyBox">{{formattedTime}}</div>
    </div>    
  </div>  
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

// Props
const props = defineProps({
  catGameShow:{
    type:Boolean,
    default:true,
  },
  SolitairGameShow:{
    type:Boolean,
    default:true,
  },
  activeWindow:{
    default:'gameWindow',
  }
})

// Emit
const emit = defineEmits([
  'minimize',
  'minimizeSolit',
])

//控制程式顯示
const clickMinButton = ()=>{
  emit('minimize');
}
const isHidden = ref(false);
watch(()=> props.catGameShow,()=>{
  isHidden.value = ! isHidden.value;
})

const clickSolitMinButton = ()=>{
  emit('minimizeSolit');
}
const isSolitHidden = ref(false);
watch(()=> props.SolitairGameShow,()=>{
  isSolitHidden.value = ! isSolitHidden.value;
})

//取得時間
const now = ref(new Date()) ;

let timer;
onMounted(()=>{
  timer = setInterval(()=>{
    now.value = new Date();
  }, 1000);
});
onMounted(()=>{
  clearInterval(timer);
});

const formattedTime = computed(()=>{
  let hours = now.value.getHours();
  const minutes = now.value.getMinutes();
  const amPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return `${hours}:${formattedMinutes} ${amPm}`
})

//RWD控制接龍顯示
const solitaireDisplay = ref('true');
const checkScreenSizeDisplay = ()=>{
  if(window.innerWidth < 768){
    solitaireDisplay.value = false;
  }else{
    solitaireDisplay.value = true;
  }
}
onMounted(()=>{
  checkScreenSizeDisplay();
  window.addEventListener('resize', checkScreenSizeDisplay);
});
onUnmounted(()=>{
  window.removeEventListener('resize', checkScreenSizeDisplay);
})
</script>

<style  lang="scss" scoped>
$normalWindowColor:#c0c7c8;
$hoverWindowColor:#dcdcdc;
$borderColor:#87888f;
$Win95Blue:#0000a8;

.buttonUse{
  position: relative;
  display: flex;
  height: 30px !important;
  top: 1px;
  justify-content: center;
  align-items: center;
  background-color: $hoverWindowColor;
  border-top: 1px solid $borderColor;
  border-left: 1px solid $borderColor;
  border-bottom: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
}
.buttonUse::after{
  position: absolute;
  content: '';
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-top: 1px solid #000;
  border-left: 1px solid #000;
  border-bottom: 1px solid #fff;
  border-right: 1px solid #fff;
  z-index: -1;
}
.buttonUse:hover{
  background-color: #fff;
}
.buttonUse:active{
  background-color: $normalWindowColor;
  border-top: 1px solid $borderColor;
  border-left: 1px solid $borderColor;
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}

.buttonUseHidden{
  top: 0px;
  background-color: $normalWindowColor;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-bottom: 1px solid $borderColor;
  border-right: 1px solid $borderColor;
}
.buttonUseHidden::after{
  position: absolute;
  content: '';
  top: -1px;
  left: -1px;
  right: -2px;
  bottom: -2px;
  border-top: 1px solid #fff;
  border-left: 1px solid #fff;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  z-index: -1;
}
.buttonUseHidden:hover{
  background-color: $hoverWindowColor;
}
.buttonUseHidden:active{
  background-color: $normalWindowColor;
  border-top: 1px solid $borderColor;
  border-left: 1px solid $borderColor;
  border-bottom: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}
.windowsBar{
  position: relative;
  background-color: #c0c7c8;
  display: flex;
  justify-content: space-between;
  height: 36px;
  padding: 2px 4px;
  box-sizing: border-box;
  border-top: 1px solid #fff;
  z-index: 0;

  div{
    display: flex;
    height: 100%;
    align-items: center;

    .StartDiv{
      margin-right: 8px;
      display: flex;

      button{
        .imageDiv{
          height: 18px;
          width: 18px;
          margin-right: 2px;

          img{
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
      }
    }
    .buttonDiv{
      display: flex;
      column-gap: 4px;
      .AppDiv{
        padding: 4px 8px;
        box-sizing: border-box;
        height: 100%;

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
      }
      .solitaire{
        display: flex;
        margin: 4px;
        box-sizing: border-box;
        align-items: center;
        .logo{
          height: 15px;
          width: 15px;
        }

      }
    }
    button{
      height: 100%;
    }
    .timeShow{
      padding: 4px 8px;
      box-sizing: border-box;
      
    }
  }
}
.windowsBar::after{
  position: absolute;
  width: auto;
  content: '';
  top: -2px;
  border-top: 1px solid #c0c7c8;
  z-index: -1;
}
</style>