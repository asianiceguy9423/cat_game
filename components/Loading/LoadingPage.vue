<template>
  <div class="laoding">
    <h1>Loading_</h1>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.laoding{
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  height: 100vh;
  width: 100%;
  background-color: rgb(0, 0, 170);
  z-index: 999;

  h1{
    color: rgb(228, 228, 228);

  }
}
</style>