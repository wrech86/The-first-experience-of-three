<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { h, onMounted,ref } from 'vue';
import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'



let canvas = ref()
onMounted(()=>{
  //scene+world
  const scene = new THREE.Scene()
  const world = new CANNON.World()
  world.gravity = new CANNON.Vec3(0,-9.82,0)
  world.broadphase = new CANNON.SAPBroadphase(world)
  world.allowSleep = true
  //加载纹理
  const texture = new THREE.CubeTextureLoader()
  texture.setPath('/envMap/')
  //声音
  const a = new Audio('/audio/impactWood_heavy_001.ogg')
  const env = texture.load([
   'px.png', 'nx.png',
	 'py.png', 'ny.png',
	 'pz.png', 'nz.png'
  ])
  const tex = new THREE.TextureLoader()
  const t = tex.load('/envMap/py.png')
 
  //常量参数
  const size = {
    width:innerWidth,
    height:innerHeight
  }
  const params = {
    color:'#ff0000'
  }
  const sphereArr = []
  const boxArr = []
  window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect = size.width/size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
  })
  //  window.addEventListener('dblclick',()=>{
  //   if(!document.fullscreenElement){
  //     canvas.value.requestFullscreen()
  //   }else{
  //     document.exitFullscreen()
  //   }
  // })

  //定义两个物体相撞会怎样
  const defaultMaterial = new CANNON.Material('default')
  const cm = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction:0.5,
      restitution:0.7
    }
  )
  world.addContactMaterial(cm)
  world.defaultContactMaterial = cm
  //things+ghost
  const createSphere = (radius,position)=>{
     const sphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius),
      new THREE.MeshLambertMaterial({envMap:env,roughness:0.2,metalness:0.7})
     )
     sphereMesh.scale.set(radius,radius,radius)
     sphereMesh.position.copy(position)
     sphereMesh.castShadow = true
     const sphereBody = new CANNON.Body({
      mass:1,
      shape:new CANNON.Sphere(radius),
      material:defaultMaterial
     })
     sphereBody.position.copy(position)
     sphereBody.addEventListener('collide',(collision)=>{//string:collide，wakeup，sleep
      if(collision.contact.getImpactVelocityAlongNormal()>1.5){
        a.volume = Math.random()
        a.currentTime = 0
        a.play()
      }
     })
     scene.add(sphereMesh)
     world.addBody(sphereBody)
     sphereArr.push({sphereMesh,sphereBody})
  }
  const createBox = (width,height,depth,position)=>{
     const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(width,height,depth),
      new THREE.MeshLambertMaterial({envMap:env,roughness:0.2,metalness:0.7})
     )
     boxMesh.scale.set(width,height,depth)
     boxMesh.position.copy(position)
     boxMesh.castShadow = true
     const boxBody = new CANNON.Body({
      mass:1,
      shape:new CANNON.Box(new CANNON.Vec3(width*.5,height*.5,depth*.5)),//size必须用vec3
      material:defaultMaterial
     })
     boxBody.position.set(position.x,position.y,position.z)
     scene.add(boxMesh)
     world.addBody(boxBody)
     boxArr.push({boxMesh,boxBody})
  }


  // const sphereGeo = new THREE.SphereGeometry(1)
  // const sphereMater = new THREE.MeshLambertMaterial({envMap:env,roughness:0.2,metalness:0.7})
  // const sphereMesh = new THREE.Mesh(sphereGeo,sphereMater)
  
  // scene.add(sphereMesh)

  // const SphereShape = new CANNON.Sphere(1)
  // const SphereBody = new CANNON.Body({
  //    mass:1,
  //    shape:SphereShape,
  //    material:defaultMaterial
  // })
  // SphereBody.position.set(0,10,0)
  // SphereBody.applyLocalForce(new CANNON.Vec3(0,0,1000),new CANNON.Vec3(0,0,0))
  // world.addBody(SphereBody)
  
  const planeGeo = new THREE.PlaneGeometry(20,20)
  const planeMater = new THREE.MeshStandardMaterial({map:t,roughness:0.2})
  const planeMesh = new THREE.Mesh(planeGeo,planeMater)
  planeMesh.rotation.set(-Math.PI*0.5,0,0)
  scene.add(planeMesh)

  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape:planeShape,
    material:defaultMaterial
  })
  planeBody.quaternion.setFromEuler(-Math.PI*0.5, 0, 0)
  world.addBody(planeBody)
  
  
  //light
  const abLight = new  THREE.AmbientLight('#FFFFFF',0.5)
  const dirLight = new THREE.DirectionalLight('#ffffff',0.5)
  dirLight.position.set(0,1,0)
  scene.add(abLight,dirLight)


  //gui
  const gui = new dat.GUI();
  const createThings = {
    createSphere:()=>{
      createSphere(Math.random(),{x:Math.random(),y:10,z:0})
    },
    createBox:()=>{
      createBox(
        Math.random(),Math.random(),Math.random(),
        {x:Math.random(),y:10,z:0}
      )
    }
  }
  gui.add(createThings,'createSphere')
  gui.add(createThings,'createBox')



  //camera
  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 20
  camera.position.y = 2
  scene.add(camera)
  
  
  //renderer
  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  renderer.setSize(size.width,size.height)
  //controls
  const controls = new OrbitControls(camera,canvas.value)
  controls.enableDamping = true
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.render(scene,camera)
  
  //tick函数
  let clock = new THREE.Clock()
  let p = 0
  const tick = ()=>{
    let c = clock.getElapsedTime()
    let d = c-p
    p=c
    world.step(1/60,d,1)

    for (const item of sphereArr) {
      item.sphereMesh.position.copy(item.sphereBody.position)
      item.sphereMesh.quaternion.copy(item.sphereBody.quaternion)
    }
    for (const item of boxArr){
      item.boxMesh.position.copy(item.boxBody.position)
      item.boxMesh.quaternion.copy(item.boxBody.quaternion)
    }
    // SphereBody.applyForce(new CANNON.Vec3(0,0,-1),SphereBody.position)
    window.requestAnimationFrame(tick)
    renderer.render(scene,camera)
  }
  tick()
})


</script>

<style  scoped>

</style>