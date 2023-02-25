<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import vertexShader from '../../glsl/sea/vertex.glsl'
import fragmentShader from '../../glsl/sea/fragment.glsl'

let canvas = ref()
onMounted(()=>{
  //scene
  const scene = new THREE.Scene()
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
  // const geo = new THREE.BoxGeometry(1,1,1)
  // const mater = new THREE.MeshStandardMaterial({color:params.color})
  // const mesh = new THREE.Mesh(geo,mater)
  // mesh.castShadow = true
 
  // scene.add(mesh)
  const plant = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2,128,128),
    new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms:{
        uTime:{value:0},
        amplitude:{value:new THREE.Vector2(5,3)},
        depthColor:{value:new THREE.Color('#0066CC')},
        surfaceColor:{value:new THREE.Color('#CCFFFF')}
      }
    })
  )
  plant.rotation.x = -Math.PI *.5
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
  const gui = new dat.GUI();
  let color = {
    d:'#0066CC',
    s:'#CCFFFF'
  }
  gui.addColor(color,'d').onChange(()=>{
    plant.material.uniforms.depthColor.value.set(color.d)
  })
  gui.addColor(color,'s').onChange(()=>{
    plant.material.uniforms.depthColor.value.set(color.s)
  })
  // gui.add(mesh.position,'z',-10,10,0.1).name('正方形')
  // gui.addColor(params,'color').onChange(()=>{
  //   mater.color.set(params.color)
  // }).name('颜色')




  //camera
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 5
  camera.position.y = 3
  camera.position.x = -3
  scene.add(camera)
  
  
  //renderer
  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  renderer.setSize(size.width,size.height)
  renderer.shadowMap.enabled = true
  //controls
  const controls = new OrbitControls(camera,canvas.value)
  controls.enableDamping = true
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
  



  //tick函数
  let n = 0
  const clock = new THREE.Clock()
  const tick = ()=>{
    let t = clock.getElapsedTime()
    let d = t-n
    n=t   
    plant.material.uniforms.uTime.value = t
    // mesh.position.x = t
    
    window.requestAnimationFrame(tick)
    renderer.render(scene,camera)
  }
  tick()
})


</script>

<style  scoped>

</style>