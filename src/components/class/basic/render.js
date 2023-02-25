import * as THREE from 'three'
export class Render{
  constructor(canvas,width,height){
    this.instance = new THREE.WebGLRenderer({
      canvas:canvas,
      antialias:true
    })
    this.instance.setSize(width,height)
    this.instance.outputEncoding = THREE.sRGBEncoding
    this.instance.physicallyCorrectLights = true
    this.instance.toneMapping = THREE.ACESFilmicToneMapping
    this.instance.toneMappingExposure  = 1.2
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
  }
}