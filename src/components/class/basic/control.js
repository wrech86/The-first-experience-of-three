import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export class Control{
  constructor(camera,canvas){
    this.instance = new OrbitControls(camera,canvas)
    this.instance.enableDamping = true
  }
}