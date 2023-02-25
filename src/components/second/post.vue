<template>
  <div id="container"></div>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { CubeTexturePass } from 'three/examples/jsm/postprocessing/CubeTexturePass'
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { TexturePass } from 'three/examples/jsm/postprocessing/TexturePass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
//import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

let canvas = ref()
onMounted(() => {
  //scene
  const scene = new THREE.Scene()
  //帧率检测
  const stats = new Stats()
  const container = document.getElementById('container')
  container.appendChild(stats.dom)

  //常量参数
  const size = {
    width: innerWidth,
    height: innerHeight
  }
  const params = {
    clearPass: true,
    clearColor: 'white',
    clearAlpha: 1.0,

    texturePass: true,
    texturePassOpacity: 1.0,

    cubeTexturePass: true,
    cubeTexturePassOpacity: 1.0,

    renderPass: true

  }
  window.addEventListener('resize', () => {
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width / size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
    composer.setSize(size.width, size.height)
  })
  // window.addEventListener('dblclick', () => {
  //   if (!document.fullscreenElement) {
  //     canvas.value.requestFullscreen()
  //   } else {
  //     document.exitFullscreen()
  //   }
  // })



  //things
  // const geo = new THREE.BoxGeometry(1, 1, 1)
  // const mater = new THREE.MeshStandardMaterial()
  // const mesh = new THREE.Mesh(geo, mater)
  // mesh.castShadow = true

  // scene.add(mesh)
  // const plant = new THREE.Mesh(
  //   new THREE.PlaneGeometry(10, 10),
  //   new THREE.MeshStandardMaterial({
  //     color: '#ffffff'
  //   })
  // )
  // plant.rotation.x = -Math.PI * .5
  // plant.position.y = -0.5
  // plant.receiveShadow = true
  // scene.add(plant)


  //light
  // const abLight = new THREE.AmbientLight('#FFFFFF', 0)
  // const dirLight = new THREE.DirectionalLight('#ffffff', 1)
  // dirLight.castShadow = true
  // dirLight.shadow.mapSize.set(1024, 1024)
  // dirLight.shadow.camera.far = 10
  // dirLight.position.set(1, 1, 1)
  // scene.add(abLight, dirLight)

  //gui
  function clearGui() {
    let gui = null
    if (gui) gui.destroy()

    gui = new GUI();
    gui.add(params, 'clearPass');
    gui.add(params, 'clearColor', ['black', 'white', 'blue', 'green', 'red']);
    gui.add(params, 'clearAlpha', 0, 1);

    gui.add(params, 'texturePass');
    gui.add(params, 'texturePassOpacity', 0, 1);

    gui.add(params, 'cubeTexturePass');
    gui.add(params, 'cubeTexturePassOpacity', 0, 1);

    gui.add(params, 'renderPass');
    gui.open()
  }





  //camera
  const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 1, 1000)
  camera.position.z = 3
  scene.add(camera)


  //renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true })
  const renderTarget = new THREE.WebGLRenderTarget(size.width,size.height,{
    minFilter:THREE.LinearFilter,
    magFilter:THREE.LinearFilter,
    format:THREE.RGBAFormat,
    encoding:THREE.sRGBEncoding
  })
  renderer.setSize(size.width, size.height)
  // renderer.shadowMap.enabled = true
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // renderer.physicallyCorrectLights = true
  // renderer.outputEncoding = THREE.sRGBEncoding
  // renderer.toneMapping = THREE.ACESFilmicToneMapping
  // renderer.toneMappingExposure = 0.5
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene, camera)


  //controls
  const controls = new OrbitControls(camera, canvas.value)
  controls.enableDamping = true

  //loader
  const gltf = new GLTFLoader()
  gltf.load('/models/star/scene.gltf', (star) => {
    star.scene.scale.set(0.01, 0.01, 0.01)
    scene.add(star.scene)
  })

  //postprocessing
  let composer = new EffectComposer(renderer,renderTarget)
  console.log(composer);
  let clearPass = new ClearPass(params.clearColor, params.clearAlpha)
  composer.addPass(clearPass)
  let texturePass = new TexturePass()
  composer.addPass(texturePass)
  const texture = new THREE.TextureLoader()
  texture.load('/seven/starDiff.jpg', (tt) => {
    texturePass.map = tt
  })
  let cubeTexturePass = null
  const cube = new THREE.CubeTextureLoader()
  cube.setPath('/envMap/2/')
  cube.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], (cube) => {
    cubeTexturePass = new CubeTexturePass(camera, cube)
    composer.insertPass(cubeTexturePass, 2)
    scene.background = cube
  })


  let renderPass = new RenderPass(scene, camera)
  renderPass.clear = false
  composer.addPass(renderPass)
  const CopyShader = {

    uniforms: {

      'tDiffuse': { value: null },
      'opacity': { value: 0.9 },
      'time':{value:0.0}

    },

    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
     vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,

    fragmentShader: /* glsl */`
  uniform float opacity;
  uniform sampler2D tDiffuse;
  uniform float time;
  varying vec2 vUv;
  void main() {
    vec2 newUv = vec2(
      vUv.x,
      vUv.y+sin(vUv.x*10.0+time)*0.1
    );
    gl_FragColor = texture2D( tDiffuse, newUv );
    gl_FragColor.a *= opacity;
  }`

  };
  const copyPass = new ShaderPass(CopyShader);
  composer.addPass(copyPass);




  //tick函数
  let n = 0
  const clock = new THREE.Clock()
  const tick = () => {
    window.requestAnimationFrame(tick)
    stats.begin()
    let t = clock.getElapsedTime()
    let d = t - n
    n = t
    CopyShader.uniforms.time.value = t
    camera.updateMatrixWorld(true);
    let newColor = clearPass.clearColor;

    switch (params.clearColor) {

      case 'blue': newColor = 0x0000ff; break;
      case 'red': newColor = 0xff0000; break;
      case 'green': newColor = 0x00ff00; break;
      case 'white': newColor = 0xffffff; break;
      case 'black': newColor = 0x000000; break;

    }

    clearPass.enabled = params.clearPass;
    clearPass.clearColor = newColor;
    clearPass.clearAlpha = params.clearAlpha;

    texturePass.enabled = params.texturePass;
    texturePass.opacity = params.texturePassOpacity;

    if (cubeTexturePass !== null) {

      cubeTexturePass.enabled = params.cubeTexturePass;
      cubeTexturePass.opacity = params.cubeTexturePassOpacity;
    }
    renderPass.enabled = params.renderPass;

    composer.render()
    // 不能有renderer.render(scene, camera)

    stats.end()
  }
  tick()
  clearGui()
})


</script>

<style  scoped>

</style>