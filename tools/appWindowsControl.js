import { onUnmounted, ref, watch } from "vue";

export const useDraggable = (topValue, leftValue, windowRef) => {
  const position  = ref({ top:topValue, left:leftValue });
  const dragging  = ref(false);
  const offset    = ref({ x:0, y:0 });

  //開始移動
  const  startDrag = (event)=>{
    // console.log('startDrag')
    if(!event.target.closest('.control')) return;

    dragging.value = true;
    offset.value = {
      x:event.clientX - position.value.left,
      y:event.clientY - position.value.top,
    }

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  }

  //計算移動位置
  const onDrag = (event)=>{
    // console.log('onDrag')
    if (!dragging.value || !windowRef.value) return;

    const parentRect = windowRef.value.parentNode.getBoundingClientRect();
    const WindowRect = windowRef.value.getBoundingClientRect();

    //限制範圍
    const minX = parentRect.left;
    const maxX = parentRect.right - WindowRect.width;
    const minY = parentRect.top;
    const maxY = parentRect.bottom - WindowRect.height - 36;

    const newLeft = Math.min(Math.max(event.clientX - offset.value.x,minX), maxX);
    const newTop = Math.min(Math.max(event.clientY - offset.value.y, minY), maxY);

    position.value = {
      left: newLeft,
      top: newTop,
    }
    // console.log(position.value)
  }

  //停止移動
  const stopDrag = ()=>{
    // console.log('stopDrag')
    dragging.value = false;
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  }

  onUnmounted(() => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  });

  return {
    position,
    startDrag,
  }
}

export const draggableTool = (height, width) =>{
  const externalWinRef  = ref(null);
  const getWinRef = (el)=>{
    // console.log("✅ 現在 getWinRef 綁定:", el)
    externalWinRef.value = el;
  }

  const { position, startDrag } = useDraggable(
    height,
    width,
    externalWinRef,
  )
  
  return {
    externalWinRef,
    getWinRef,
    position,
    startDrag,
  }
}

export const UseControlWindowsShow = (propsValue)=>{
  const WindowShow = ref(true)

  watch(()=> propsValue.value,()=>{
    WindowShow.value =! WindowShow.value;
  })
  return WindowShow
}
