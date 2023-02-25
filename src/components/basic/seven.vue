<template>
  <canvas ref="canvas"></canvas>
  <section class="section">
      <h1>Hello</h1>
    </section>
    <section class="section">
      <h2>My projects</h2>
    </section>
    <section class="section">
      <h2>Contact me</h2>
    </section>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
let canvas = ref()
onMounted(()=>{
  //scene
  const scene = new THREE.Scene()
  //常量参数
  const size = {
    width:innerWidth,
    height:innerHeight
  }

  let params = {
    disX:5,
    disY:18,
    count:10000,
    rad:20,
    spin:2,
    branch:7,
    inC:'#FF6666',
    outC:'#9933FF'
  }
  let cam = {
    y:0
  }
  let cursor = {
    x:0,
    y:0
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
  window.addEventListener('scroll',()=>{
     cam.y = window.scrollY/size.height
    
  })
  window.addEventListener('mousemove',(e)=>{
    cursor.x = (e.clientX/size.width)-0.5
    cursor.y = -((e.clientY/size.height)-0.5)
  })
  //纹理
  const texture = new THREE.TextureLoader()
  const t1 = texture.load('/seven/PaperCrumpled002_COL_VAR1_6K.jpg')
  const t3 = texture.load('/seven/PaperCrumpled002_NRM_6K.jpg')
  //things
  //MeshStandardMaterial需要光
  const material = new THREE.MeshStandardMaterial({ 
    map:t1,
    normalMap:t3,
 
    
  });
  const geometry1 = new THREE.TorusGeometry( 3, 1, 16, 100 );
  const torus = new THREE.Mesh( geometry1, material );
  torus.position.x = 2*params.disX
  scene.add( torus );

  const geometry2 = new THREE.SphereGeometry( 4, 32, 16 );
  const knot = new THREE.Mesh( geometry2, material );
  knot.position.y = -params.disY
  knot.position.x = -2*params.disX
  scene.add( knot );
  
  const geometry3 = new THREE.IcosahedronGeometry(4,1)
  const ico = new THREE.Mesh(geometry3,material)
  ico.position.y = -2*params.disY
  ico.position.x = 2*params.disX
  scene.add(ico)
  const arrMesh = [torus,knot,ico]



  //粒子
  const particleF = new Float32Array(params.count*3)
  const color = new Float32Array(params.count*3)
  const colorIn = new THREE.Color(params.inC)
  const colorOut = new THREE.Color(params.outC)
  for(let i = 0 ; i< params.count ; i++){
    let i3 = i*3
    let angle = (i%params.branch/params.branch)*Math.PI*2
    let radius = Math.random()*params.rad
    let spinA = radius * params.spin
    particleF[i3] =Math.sin(angle+spinA)*radius
    particleF[i3+1] = (-Math.random()*params.disY*3)+params.disY/2
    particleF[i3+2] = Math.cos(angle+spinA)*radius
    let mixColor = colorIn.clone()
    mixColor.lerp(colorOut,radius/params.rad)
    color[i3] = mixColor.r
    color[i3+1] = mixColor.g
    color[i3+2] = mixColor.b
  }
  const particleG = new THREE.BufferGeometry()
  particleG.setAttribute('position',new THREE.BufferAttribute(particleF,3))
  particleG.setAttribute('color',new THREE.BufferAttribute(color,3))
  const particleM = new THREE.PointsMaterial({
    color:'#ffffff',
    size:0.03,
    depthWrite:true,
    vertexColors:true,
    blending:THREE.AdditiveBlending
  })
  const particle = new THREE.Points(particleG,particleM)
  scene.add(particle)
  //light
  const aLight = new THREE.AmbientLight('#ffffff',1)
  scene.add(aLight)
  const dLight = new THREE.DirectionalLight('#ffffff',1)
  dLight.position.set(0,1,0)
  scene.add(dLight)
  
  //gui





  //camera
  const cameraG = new THREE.Group()
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 15
  cameraG.add(camera)

  scene.add(cameraG)
  
  
  //renderer
  const renderer = new THREE.WebGLRenderer({
    canvas:canvas.value,
    alpha:true
  })
  renderer.setSize(size.width,size.height)
  //controls
  // const controls = new OrbitControls(camera,canvas.value)
  // controls.enableDamping = true
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.setClearColor('#000000')
  renderer.render(scene,camera)
  let currentY = 0
  window.addEventListener('scroll',()=>{
    let newY = Math.round(cam.y)
    if(newY!=currentY){
      currentY = newY 
      gsap.to(
        arrMesh[currentY].rotation,
        {
          duration:1.5,
          z:'+=20'
        }
      )
    }
    
  })



  //tick函数
  let clock = new THREE.Clock()
  let n = 0
  const tick = ()=>{
    let t = clock.getElapsedTime()
    let d = t - n
    n=t
    //相机在组里移动，组跟着鼠标动
    camera.position.y = -(cam.y * params.disY)
    
    let camX = cursor.x
    let camY = cursor.y
    //用时差来保证帧率不同的pc上有相同的效果
    cameraG.position.x += (camX-cameraG.position.x) * 5 * d
    cameraG.position.y += (camY-cameraG.position.y) * 5 * d
    for(let item of arrMesh){
      item.rotation.x += d *0.1
      item.rotation.y += d *0.1
     
    }
   
    particle.rotation.y = t*.2
    window.requestAnimationFrame(tick)
    renderer.render(scene,camera)
  }
  tick()
})


</script>

<style  scoped>
canvas{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  outline: none;
}
.section {
  padding-left: 10%;
  padding-right: 10%;
  display: flex;
  align-items: center;
  height: 100vh;
  font-size: 7vmin;
  position: relative;
  color: #fff;
}

section:nth-child(odd) {
  justify-content: flex-end;
}
</style>