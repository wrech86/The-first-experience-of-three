<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted,ref } from 'vue';
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as dat from 'dat.gui'
import { AnimationMixer, sRGBEncoding } from 'three';
import { hyphenate } from '@vue/shared';

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
  //function
  const reallyRender = ()=>{
    //scene中的每一个object3d对象
    scene.traverse((child)=>{
       if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
         child.castShadow = true
         child.receiveShadow = true
       }
    })
   
  }
  //evnMap
  const cubeTL = new THREE.CubeTextureLoader()
  cubeTL.setPath('/envMap/1/')
  const env = cubeTL.load([
    'px.png','nx.png',
    'py.png','ny.png',
    'pz.png','nz.png',
  ])
  //黑到白的显示
  env.encoding = THREE.sRGBEncoding
  scene.background = env
  //设置环境贴图都是env
  scene.environment = env
  //model
  let mixer = null
  const loader = new GLTFLoader()
  loader.load(
    '/public/models/leopard/scene.gltf',
    (gltf)=>{
      gltf.scene.scale.set(10,10,10)
      //动画 需要model有动画数组支持
      mixer = new THREE.AnimationMixer(gltf.scene)
      const action = mixer.clipAction(gltf.animations[0])
      action.play()
      gltf.scene.castShadow = true

      scene.add(gltf.scene)
      reallyRender()
    }
    )


  //things
  const plant = new THREE.Mesh(
    new THREE.PlaneGeometry(50,50),
    new THREE.MeshStandardMaterial({
      color:'#ffffff'
    })
  )
  plant.rotation.x = -Math.PI *.5
  plant.position.y = -0.5
  scene.add(plant)


  //light

  const dirLight = new THREE.SpotLight('#ffffff',1)

  dirLight.position.set(10, 20, 10 )
  dirLight.castShadow = true
  dirLight.distance = 100
  dirLight.decay = 0.01
  dirLight.shadow.camera.near = 0.5
  dirLight.shadow.camera.far = 500
  dirLight.shadow.mapSize.set(1024,1024)
  dirLight.shadow.focus = 1
  scene.add(dirLight)
  
  const helper = new THREE.CameraHelper( dirLight.shadow.camera );
  scene.add( helper );
  //gui
  const gui = new dat.GUI();
  




  //camera
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 40
  camera.position.y = 7
  scene.add(camera)
  
  
  //renderer
  const renderer = new THREE.WebGLRenderer({
    canvas:canvas.value,
    //抗锯齿
    antialias:true
  })
  
  //controls
  const controls = new OrbitControls(camera,canvas.value)
  controls.enableDamping = true
  renderer.setSize(size.width,size.height)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.physicallyCorrectLights = true
  renderer.outputEncoding = THREE.sRGBEncoding
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
  



  //tick函数
  let n = 0
  let clock = new THREE.Clock()
  const tick = ()=>{
    let t = clock.getElapsedTime()
    let d = t-n
    n = t
    // mesh.position.x = t
    if(mixer){
      mixer.update(d)
    }
    
    window.requestAnimationFrame(tick)
    renderer.render(scene,camera)
  }
  tick()
})


</script>

<style  scoped>

</style>