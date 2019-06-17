<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// export default {
//   name: 'App'
// }
</script>

<style>
html,body{
  /* height: 100%; */
  height: auto;
  overflow-x:hidden;
  background-color: rgb(220, 242, 245);
  font-family: 'microsoft yahei','Avenir', Helvetica, Arial, sans-serif;
}
#app {
  height: 100%;
  
}
#app .v-note-wrapper{
  z-index: 1000;
} 
</style>
