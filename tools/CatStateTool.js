import { useCatState } from "../stores/CatState"
import { storeToRefs } from "pinia";
import { computed } from "vue";

export const useCatStateTools = () =>{
  const catState = useCatState();
  const { baseValue, stateValue, maximum, probability, condition, appName, options  } = storeToRefs(catState);


  //基本狀態
  const foodValue  = computed(() => catState.baseValue.foodValue);
  const feelValue  = computed(() => catState.baseValue.feelValue);
  const sleepValue = computed(() => catState.baseValue.sleepValue);
  const cleanValue = computed(() => baseValue.value.cleanValue);

  const stated      = computed(() => stateValue.value.stated);
  const energy      = computed(() => stateValue.value.energy);
  const cleanState  = computed(() => stateValue.value.cleanState);
  const respond     = computed(() => stateValue.value.respond);

  const MAXfood   = computed(() => maximum.value.MAXfood);
  const MAXfeel   = computed(() => maximum.value.MAXfeel);
  const MAXsleep  = computed(() => maximum.value.MAXsleep);

  const proFail     = computed(() => probability.value.proFail);
  const proSuccess  = computed(() => probability.value.proSuccess);

  const recoverHealth = computed(() => condition.value.recoverHealth);
  const demon         = computed(() => condition.value.demon);
  const noSleep       = computed(() => condition.value.noSleep);

  //actions tools
  const stateChange = (state, value)=> catState.SET_STATE_CHANGE( state, value );
  const statePlus = (state, value) => catState.SET_STATE_PLUS( state, value );
  const randReaction= (Probability,...reactions) => 
    catState.RandomReaction( Probability,...reactions );
  const getrandNumber= (number) => 
    catState.getRandomNumbers(number);

  //共用設定
  //限制最大值
  const MaxValue = () =>{
    if( foodValue.value >= MAXfood.value ){
      stateChange( 'baseValue.foodValue',  MAXfood.value );
      stateChange( 'stateValue.respond', '牠已經比橘貓還大隻了 你是在養豬嗎?' )
    }
    if( feelValue.value >= MAXfeel.value ){
      stateChange( 'baseValue.feelValue',  MAXfeel.value );
    }
    if( sleepValue.value >= MAXsleep.value ){
      stateChange( 'baseValue.sleepValue',  MAXsleep.value );
    }
  }
  //乾淨值計算
  const howClean = () => catState.CLEANSTATE();
  //狀態
  const Howstate = ()=>{
    if(foodValue.value >= 100){
      stateChange( 'stateValue.stated','牠吃得像隻豬');
    }
  }

  return{
    foodValue,
    feelValue,
    sleepValue,
    cleanValue,
    stated,
    energy,
    cleanState,
    respond,
    MAXfood,
    MAXfeel,
    MAXsleep,
    proFail,
    proSuccess,
    recoverHealth,
    demon,
    noSleep,
    stateChange,
    statePlus,
    randReaction,
    getrandNumber,
    MaxValue,
    howClean,
    Howstate,
    appName,
    options,
  }
}