<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import *as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
let canvas = ref(null)
onMounted(() => {
  console.log(canvas.value);
  const screen = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  window.addEventListener('resize', () => {
    screen.width = window.innerWidth
    screen.height = window.innerHeight
    renderer.setPixelRatio(window.devicePixelRatio || 2)
    renderer.setSize(screen.width, screen.height)
    camera.aspect = screen.width / screen.height
    camera.updateProjectionMatrix()
  })

  //world
  const scene = new THREE.Scene()
  const manager = new THREE.LoadingManager()
  // manager.onStart = function (url, itemsLoaded, itemsTotal) {

  //   console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

  // };

  // manager.onLoad = function () {

  //   console.log('Loading complete!');

  // };


  // manager.onProgress = function (url, itemsLoaded, itemsTotal) {

  //   console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

  // };
  const TLoader = new THREE.TextureLoader()
  const queer = TLoader.load('models/queer/queer.jpg')
  queer.flipY = false
  const GLoader = new GLTFLoader(manager)
  const DLoader = new DRACOLoader(manager)
  DLoader.setDecoderPath('models/draco/')
  GLoader.setDRACOLoader(DLoader)

  const bMaterial = new THREE.MeshBasicMaterial({map:queer})
  GLoader.loadAsync('models/queer/queer.glb').then((item) => {
    item.scene.traverse((child)=>{
        child.material = bMaterial
        if(child.children instanceof THREE.Mesh){
          child.children.material = bMaterial
        }
    })
    scene.add(item.scene)
    console.log(item.scene);
  })
  // const mesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(1,1,1),
  //   new THREE.MeshBasicMaterial({color:'#ff0000'})
  // )
  // scene.add(mesh)

  //
  let gui = null
  if (gui) {
    gui.destroy()
  }
  gui = new GUI()
  gui.open()
  const camera = new THREE.PerspectiveCamera(45, screen.width / screen.height, 0.1, 1000)
  camera.position.y = 1
  camera.position.z = 3
  scene.add(camera)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true
  })
  const orbControl = new OrbitControls(camera, canvas.value)
  orbControl.enableDamping = true
  renderer.render(scene, camera)
  renderer.setSize(screen.width, screen.height)
  const clock = new THREE.Clock()
  let last = 0
  function init() {
    window.requestAnimationFrame(init)
    let now = clock.getElapsedTime()
    let interval = now - last
    last = now

    renderer.render(scene, camera)
  }
  init()
})
</script>

<style  scoped>

</style>