<template>
  <canvas ref="canvas" class="can"></canvas>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
let canvas = ref()
onMounted(()=>{
  const scene = new THREE.Scene()
  
  const size = {
    width:window.innerWidth,
    height:window.innerHeight
  }
  //监听页面大小改变让render函数更新
  window.addEventListener('resize',()=>{
     size.width = window.innerWidth
     size.height =  window.innerHeight
     camera.aspect=size.width/size.height
     camera.updateProjectionMatrix()
     renderer.setSize(size.width,size.height)
  })
  //双击全屏
  window.addEventListener('dblclick',()=>{
    if(!document.fullscreenElement){
      canvas.value.requestFullscreen()
    }else{
      document.exitFullscreen()
    }
  })

  const geo = new THREE.BoxGeometry(1,1,1)
  const mater = new THREE.MeshBasicMaterial({color:'#ff0000'})
  const mesh = new THREE.Mesh(geo,mater)
  scene.add(mesh)
  
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.y = 1
  camera.position.z = 3
  scene.add(camera)
  
  //使用OrbitControls必须有计时器才有效果
  const controls = new OrbitControls(camera,canvas.value)
  controls.enableDamping = true

  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  renderer.setSize(size.width,size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
  
  let clock = new THREE.Clock()
  const tick = ()=>{
    let t = clock.getElapsedTime()
    requestAnimationFrame(tick)
    renderer.render(scene,camera)
  }
  tick()
})


</script>

<style  scoped>
.can{
  position: fixed;
  top: 0;
  left: 0;
}

</style>
