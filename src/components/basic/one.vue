<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
let canvas = ref()
onMounted(()=>{
  const box = {
    width:600,
    height:400
  }
  console.log(canvas);

  const scene = new THREE.Scene()
  const group = new THREE.Group()
  const cube1  = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:'#00ff00'})
  )
  cube1.position.z=1
  cube1.position.x = -1
  cube1.rotation.reorder('YXZ')
  
  cube1.rotation.x = Math.PI * 1/4
  cube1.rotation.y = Math.PI * 1/4
  group.add(cube1)
  scene.add(group)

  const camera = new THREE.PerspectiveCamera(75,box.width/box.height,1,1000)
  camera.position.z = 3
  camera.position.x = 0
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  renderer.setSize(box.width,box.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
})
</script>

<style  scoped>

</style>