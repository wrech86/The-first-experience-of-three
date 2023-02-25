<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
let canvas = ref()
onMounted(()=>{
  const scene = new THREE.Scene()
  
  const size = {
    width:800,
    height:600
  }
 
  const geo = new THREE.BoxGeometry(1,1,1)
  const mater = new THREE.MeshBasicMaterial({color:'#ff0000'})
  const mesh = new THREE.Mesh(geo,mater)
  scene.add(mesh)
  
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 3
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  renderer.setSize(size.width,size.height)
  renderer.render(scene,camera)
  
})


</script>

<style  scoped>

</style>
