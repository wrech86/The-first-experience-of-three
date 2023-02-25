<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref} from 'vue';
import { onMounted } from 'vue';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = ref()
onMounted(()=>{
  const size = {
    width:window.innerWidth,
    height:window.innerHeight
  }
  window.addEventListener('resize',()=>{
    size.width = window.innerWidth
    size.height = window.innerHeight
    camera.aspect=size.width/size.height
    camera.updateProjectionMatrix()
    renderer.setSize(size.width,size.height)
  })
  //纹理
  const texture = new THREE.TextureLoader()
  //房子纹理
  const houseT = texture.load('house/wood_cabinet_worn_long_diff_4k.jpg')
  const houseAo = texture.load('house/wood_cabinet_worn_long_ao_4k.jpg')
  const houseN= texture.load('house/wood_cabinet_worn_long_nor_4k.jpg')
  const houseR = texture.load('house/wood_cabinet_worn_long_rou_4k.jpg')
  //门纹理
  const doorT = texture.load('door/door_diff_4k.jpg')
  const doorAo = texture.load('door/door_ao_4k.jpg')
  const doorN = texture.load('door/door_nor_gl_4k.jpg')
  const doorR = texture.load('door/door_rough_4k.jpg')
  const doorD = texture.load('door/door_disp_4k.jpg')
  const doorArm = texture.load('door/door_arm_4k.jpg')
  //地面纹理
  const grassT = texture.load('grass/coast_sand_rocks_02_diff_4k.jpg')
  const grassAo = texture.load('grass/coast_sand_rocks_02_ao_4k.jpg')
  const grassR = texture.load('grass/coast_sand_rocks_02_rough_4k.jpg')
  const grassN = texture.load('grass/coast_sand_rocks_02_nor_gl_4k.jpg')
  
  grassT.repeat.set(8,8)
  grassAo.repeat.set(8,8)
  grassR.repeat.set(8,8)
  grassN.repeat.set(8,8)
  
  grassT.wrapS = THREE.RepeatWrapping
  grassAo.wrapS = THREE.RepeatWrapping
  grassR.wrapS = THREE.RepeatWrapping
  grassN.wrapS = THREE.RepeatWrapping

  grassT.wrapT = THREE.RepeatWrapping
  grassAo.wrapT = THREE.RepeatWrapping
  grassR.wrapT = THREE.RepeatWrapping
  grassN.wrapT = THREE.RepeatWrapping
  const scene = new THREE.Scene()

  //地面
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30,30),
    new THREE.MeshStandardMaterial({
      map:grassT,
      aoMap:grassAo,
      normalMap:grassN,
      roughnessMap:grassR
    })
  )
  ground.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(ground.geometry.attributes.uv.array,2)
  )
  ground.rotation.x = -Math.PI * 0.5
  scene.add(ground)
  //房子
  const house = new THREE.Group()
  const content = new THREE.Mesh(
    new THREE.BoxGeometry(4,4,4),
    new THREE.MeshStandardMaterial({
      map:houseT,
      aoMap:houseAo,
      normalMap:houseN,
      roughness:houseR
    })
  )
  content.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(content.geometry.attributes.uv.array,2)
  )
  content.position.y = 2
  house.add(content)
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(4,1,4),
    new THREE.MeshStandardMaterial({color:"#993333"})
  )
  roof.position.set(0,4.5,0)
  roof.rotation.y = Math.PI * 0.5 * 0.5
  house.add(roof)
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1,2),
    new THREE.MeshStandardMaterial({
      map:doorT,
      transparent:true,
      aoMap:doorAo,
      displacementMap:doorD,
      displacementScale:0.1,
      normalMap:doorN,
      roughnessMap:doorR,
      metalnessMap:doorArm
    })
  )
  door.geometry.setAttribute('uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array,2)
  )
  door.position.set(0,1,2.001)
  house.add(door)
  const eye = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    new THREE.MeshStandardMaterial({color:'#99CCFF'})
  )
  //坐标轴
  // const axesHelper = new THREE.AxesHelper( 5 );
  // scene.add( axesHelper )
  //绕轴旋转
  eye.rotation.y = Math.PI * 0.5
  eye.position.set(2.001,2,0)
  house.add(eye)
  //划线
  const lineMater1 = new THREE.LineBasicMaterial({color:'#000000'})
  const points1 = [
  new THREE.Vector3( 2.02, 1.5, 0 ),
  new THREE.Vector3( 2.02, 2.5, 0 ),
  ];
  const lineGeo1 = new THREE.BufferGeometry().setFromPoints( points1 );
  const line1 = new THREE.Line(lineGeo1,lineMater1)
  house.add(line1)
  const points2 = [
  new THREE.Vector3( 2.02, 2, 0.5 ),
  new THREE.Vector3( 2.02, 2, -0.5 ),
  ];
  const lineGeo2 = new THREE.BufferGeometry().setFromPoints( points2 );
  const line2 = new THREE.Line(lineGeo2,lineMater1)
  house.add(line2)
  //光线
  const light1 = new THREE.AmbientLight('#CCCCCC',0.12)
  scene.add(light1)
  const light2 = new THREE.DirectionalLight('#FFFF99',0.12)
  light2.position.set(4,5,-2)
  scene.add(light2)
  const light = new THREE.PointLight('#CC0033',1,7)
  light.position.set(0,4,3.001)
  house.add(light)
  scene.add(house)
  
  //灌木丛
  const grassGeo = new THREE.SphereGeometry(0.5,32,16,0,Math.PI*2,0,Math.PI*0.5)
  const grassMater = new THREE.MeshStandardMaterial({color:'#CCCC00'})
  const grass1 = new THREE.Mesh(grassGeo,grassMater)
  grass1.position.set(1.5,0,2.5)
  grass1.scale.set(0.5,0.5,0.5)
  scene.add(grass1)
  const grass2 = new THREE.Mesh(grassGeo,grassMater)
  grass2.position.set(-1.5,0,2)
  scene.add(grass2)
  const grass3 = new THREE.Mesh(grassGeo,grassMater)
  grass3.position.set(1.2,0,2.5)
  grass3.scale.set(0.25,0.25,0.25)
  scene.add(grass3)
  const grass4 = new THREE.Mesh(grassGeo,grassMater)
  grass4.position.set(1,0,2)
  scene.add(grass4)
  //墓碑
  const tombstoneGeo = new THREE.BoxGeometry(0.7,1.5,0.3)
  const tombstoneMater = new THREE.MeshStandardMaterial({color:'#cccccc'})
  for(let i = 0;i<40;i++){
    const tombstone = new THREE.Mesh(tombstoneGeo,tombstoneMater)
    const radius = 6 + Math.random() * 7
    const angle = Math.random()*Math.PI*2
    let x = Math.sin(angle)*radius
    let z = Math.cos(angle)*radius
    tombstone.position.set(x,1,z)
    tombstone.rotation.y=(Math.random()-0.5)*Math.PI*0.2
    tombstone.rotation.x=(Math.random()-0.5)*Math.PI*0.1
    scene.add(tombstone)
  }
  //雾
  const fog = new THREE.Fog('#99CCCC',2,30)
  scene.fog = fog




  const camera = new THREE.PerspectiveCamera(75,size.width/size.height,1,1000)
  camera.position.z = 20
  camera.position.y = 3
  camera.lookAt( 0, 0, 0 );

  const controls = new OrbitControls(camera,canvas.value)
  controls.enableDamping = true
  
  const renderer = new THREE.WebGLRenderer({canvas:canvas.value})
  renderer.setSize(size.width,size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 2))
  renderer.setClearColor('#99cccc')
  renderer.render(scene,camera)

  const clock = new THREE.Clock()
  const init=()=>{
    const time = clock.getElapsedTime()
    requestAnimationFrame(init)
    renderer.render(scene,camera)
  } 
  init()
})
</script>

<style  scoped>
*{
  margin: 0;
  padding: 0;
}
canvas{
  position: fixed;
  top: 0;
  left: 0;
}
</style>