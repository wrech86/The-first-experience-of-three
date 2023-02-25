<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import {ref,onMounted} from 'vue'
import {total} from './class';
let canvas = ref()
onMounted(()=>{
  let t = new total(canvas.value)
})

</script>

<style  scoped>

</style>