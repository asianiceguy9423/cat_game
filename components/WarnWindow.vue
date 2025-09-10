<template>
    <div 
    ref="warnWindowRef"
    class="WarnMessageWindow"
    v-if="warnWindowDisplay"
    :style="styleVars"
    @mousedown="startDrag"
  >
    <div class="control">
      <div class="left">     
        <div class="gameName">Cat Game Warn </div>        
      </div>
      <div class="right">
        <div class="controlButton close">
          <button type="button" @click="closeWarnWindow">
            <svg xmlns="http://www.w3.org/2000/svg" height="10" width="7.5" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
          </button>
        </div>
      </div>
    </div>

    <div class="WarnValue">
      <div class="WarnDiv">
        <div class="WarnImage">
          <img src="/image/warnIocn.png">
        </div>
        <div class="WarnMessage">這是個還在開發的貓遊戲，點下Ok開始遊戲</div>
      </div>
      <div class="buttonDiv">
        <button type="button" @click="closeWarnWindow">OK</button>
      </div>
    </div> 
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { draggableTool } from '../tools/appWindowsControl';

// Props
const props = defineProps({
  warnWindowDisplay:{
    type:Boolean,
    default:true,
  }
})

// Emit
const emit = defineEmits(['close'])

// Ref
const warnWindowRef = ref(null);

// 依螢幕尺寸決定初始位置
const getInitialPos = ( smallTop, smallLeft, top, left ) => {
  if (process.client){
    const small = window.innerWidth < 768;
    return small
      ? [ smallTop, smallLeft ]
      : [ top, left ];
    }
    return [top, left]
}

// 建立拖曳工具（元件內部自處理）
const { 
  position, 
  startDrag, 
  getWinRef: setWinRef
} = draggableTool(
  ...getInitialPos(
    window.innerHeight / 2 - 50,
    window.innerWidth / 2 - 190,
    window.innerHeight / 3,
    window.innerWidth / 2
  )
)

onMounted(()=>{
  if (warnWindowRef.value) setWinRef(warnWindowRef.value)
})

const styleVars = computed(() => ({
  position: 'absolute',
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
}))

//關閉視窗
const closeWarnWindow  = ()=>{
  emit('close')
}
</script>

<style lang="scss" scoped>
*{
  padding: 0;
}
$normalWindowColor:#c0c7c8;
$hoverWindowColor:#dcdcdc;
$borderColor:#87888f;
$Win95Blue:#0000a8;

.WarnMessageWindow::after{  
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
.WarnMessageWindow{  
  position: absolute;
  display: block;
  background-color: $normalWindowColor;
  padding: 2px;
  width: auto;
  min-width: 300px;
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
  .WarnValue{
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    padding: 12px;
    box-sizing: border-box;

    .WarnDiv{
      display: flex;
      column-gap: 12px;
      height: auto;
      width: auto;
      
      .WarnImage{
        height: 32px;
        widows: 32px;

        img{
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
        .WarnMessage{
          height: 100%;
          width: 100%;
        }
      }
    }
    .buttonDiv{
      display: flex;
      justify-content: center;

      button{
        padding:  4px 32px;
      }
    }
  }    
}
@media (max-width:1080px) {
  
}
</style>