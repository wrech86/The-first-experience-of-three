import { PerspectiveCamera } from "three"
export class Camera{
  constructor(width,height){
    this.instance = new PerspectiveCamera(75,width/height,0.1,1000)
    this.instance.position.z = 10
    this.instance.position.x = 3
    this.instance.position.y = 3
  }
}