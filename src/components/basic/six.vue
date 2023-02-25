<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
const canvas = ref()
const gui = new dat.GUI();
onMounted(()=>{
  const scene = new THREE.Scene()
  const size = {
    width:window.innerWidth,
    height:window.innerHeight
  }
  window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width/size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
  })
  // window.addEventListener('dblclick',()=>{
  //   if(!document.fullscreenElement){
  //     canvas.value.requestFullscreen()
  //   }else{
  //     document.exitFullscreen()
  //   }
  // })
   window.addEventListener('dblclick',()=>{
    if(!document.fullscreenElement){
      canvas.value.requestFullscreen()
    }else{
      document.exitFullscreen()
    }
  })
  const param = {
    count:10000,
    size:0.01,
    color:'#ff0000',
    radius:5,
    branch:3,
    spin:1,
    roughness:0.2,
    pow:2,
    inC:'#ff6030',
    outC:'#1b3984'
  }
  let geometry = null
  let material = null
  let point = null
  const Galaxy = () =>{
    if(point!==null){
      geometry.dispose()
      material.dispose()
      scene.remove(point)
    }
    geometry = new THREE.BufferGeometry()
    const position = new Float32Array(param.count*3)
    const colorS = new Float32Array(param.count*3)
    const colorIn = new THREE.Color(param.inC)
    const colorOut = new THREE.Color(param.outC)
    
    for(let i=0;i<param.count;i++){
      let i3 = i*3
      const angle = (i%param.branch/param.branch)*Math.PI*2
      const radius = Math.random()*param.radius
      const spin = radius * param.spin
      const randomX = Math.pow(Math.random(),param.pow) * (Math.random()<0.5?1:-1)*param.roughness*Math.pow(radius,1)
      const randomY = Math.pow(Math.random(),param.pow)* (Math.random()<0.5?1:-1)*param.roughness*Math.pow(radius,1)
      const randomZ = Math.pow(Math.random(),param.pow)* (Math.random()<0.5?1:-1)*param.roughness*Math.pow(radius,1)
      position[i3] = Math.sin(angle+spin)*radius  + randomX
      position[i3+1] = randomY
      position[i3+2] = Math.cos(angle+spin)*radius + randomZ
      //渐变
      const mixColor = colorIn.clone()
      mixColor.lerp(colorOut,radius/param.radius)
      colorS[i3] = mixColor.r
      colorS[i3+1] = mixColor.g
      colorS[i3+2] = mixColor.b
    }
    geometry.setAttribute('position',new THREE.BufferAttribute(position,3))
    geometry.setAttribute('color',new THREE.BufferAttribute(colorS,3))
    
    material = new THREE.PointsMaterial({
      depthWrite:true,
      size:param.size,
      sizeAttenuation:true,
      //让后面的背景透过来
      blending:THREE.AdditiveBlending,
      vertexColors:true
    })
    point = new THREE.Points(geometry,material)
    scene.add(point)
  }
  Galaxy()


  gui.add(param,'count').min(10000).max(1000000).step(10).onFinishChange(Galaxy)
  gui.add(param,'size').min(0.01).max(0.1).step(0.01).onFinishChange(Galaxy)
  gui.add(param,'radius').min(5).max(20).step(1).onFinishChange(Galaxy)
  gui.add(param,'branch').min(3).max(20).step(1).onFinishChange(Galaxy)
  gui.add(param,'spin').min(-5).max(5).step(0.001).onFinishChange(Galaxy)
  gui.add(param,'roughness').min(0).max(1).step(0.1).onFinishChange(Galaxy)
  gui.add(param,'pow').min(2).max(5).step(1).onFinishChange(Galaxy)
  gui.addColor(param,'inC').onFinishChange(Galaxy)
  gui.addColor(param,'outC').onFinishChange(Galaxy)

  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 5
  camera.lookAt(0,0,0)
  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  const controls = new OrbitControls(camera,canvas.value)
  renderer.setSize(size.width,size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
  const clock = new THREE.Clock()
  const init=()=>{
    const time = clock.getElapsedTime()
    controls.update()
    requestAnimationFrame(init)
    renderer.render(scene,camera)
  }
  init()

})
</script>

<style  scoped>

</style>