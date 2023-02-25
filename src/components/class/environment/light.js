import { AmbientLight, DirectionalLight } from "three";
export class Light{
  constructor(){
    this.dirLight = new DirectionalLight('#ffffff',3)
    this.amLight = new AmbientLight('#ffffff',0.3)
    this.dirLight.position.set(2,2,2)
    this.dirLight.castShadow = true
    this.dirLight.shadow.mapSize.set(1024,1024)
    this.dirLight.shadow.camera.far = 100
    this.dirLight.shadow.camera.near = 0.5
  }
}