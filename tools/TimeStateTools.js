import { useWhatTimeStore } from "../stores/WhatTime";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export const useTimeStateTools = () =>{
  const timeStore = useWhatTimeStore();
  const { day, currentTime } = storeToRefs(timeStore);

  const storyContinue = () => timeStore.storyContinue();
  const setDay = (value) => timeStore.SET_DAY(value);
  const setTime = (value) => timeStore.SET_TIME(value);
  const WhatTimeNow = computed(() => timeStore.whatTimeNow());     


  return{
    day,
    currentTime,
    storyContinue,
    setDay,
    setTime,
    WhatTimeNow,
  }
}