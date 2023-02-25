<template>
  <div id="container"></div>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module'
let canvas = ref()
onMounted(()=>{
  //scene
  const scene = new THREE.Scene()
  //帧检测
  const stats = new Stats()
  const container = document.getElementById('container')
  container.appendChild(stats.dom)
  //常量参数
  const size = {
    width:innerWidth,
    height:innerHeight
  }
  const params = {
    color:'#ff0000'
  }
  window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width/size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
  })
   window.addEventListener('dblclick',()=>{
    if(!document.fullscreenElement){
      canvas.value.requestFullscreen()
    }else{
      document.exitFullscreen()
    }
  })



  //things
  const geo = new THREE.BoxGeometry(1,1,1)
  const mater = new THREE.MeshStandardMaterial({color:params.color})
  const mesh = new THREE.Mesh(geo,mater)
  mesh.castShadow = true
 
  scene.add(mesh)
  const plant = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10),
    new THREE.MeshStandardMaterial({
      color:'#ffffff'
    })
  )
  plant.rotation.x = -Math.PI *.5
  plant.position.y = -0.5
  plant.receiveShadow = true
  scene.add(plant)
  

  //light
  const abLight = new  THREE.AmbientLight('#FFFFFF',0.5)
  const dirLight = new THREE.DirectionalLight('#ffffff',0.6)
  dirLight.castShadow = true
  dirLight.shadow.mapSize.set(1024,1024)
  dirLight.shadow.camera.far = 10
  dirLight.position.set(1,1,1)
  scene.add(abLight,dirLight)

  //gui
  let gui = null
  if(gui){
    gui.destroy()
  }
  gui = new GUI();
  gui.add(mesh.position,'z',-10,10,0.1).name('正方形')
  gui.addColor(params,'color').onChange(()=>{
    mater.color.set(params.color)
  }).name('颜色')
  gui.open()



  //camera
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 3
  scene.add(camera)
  
  
  //renderer
  const renderer = new THREE.WebGLRenderer({canvas:canvas.value,antialias:true})
  renderer.setSize(size.width,size.height)
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.physicallyCorrectLights = true
  // renderer.outputEncoding = THREE.sRGBEncoding
  // renderer.toneMapping = THREE.ACESFilmicToneMapping
  // renderer.toneMappingExposure = 1
  //controls
  const controls = new OrbitControls(camera,canvas.value)
  controls.enableDamping = true
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
  



  //tick函数
  let n = 0
  const clock = new THREE.Clock()
  const tick = ()=>{
    window.requestAnimationFrame(tick)
    stats.begin()
    let t = clock.getElapsedTime()
    let d = t-n
    n=t   
    // mesh.position.x = t
    
   
    renderer.render(scene,camera)
    stats.end()
  }
  tick()
})


</script>

<style  scoped>

</style>