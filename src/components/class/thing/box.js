import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from "three";
export class Box{
  constructor(){
    this.box = new Mesh(
      new BoxGeometry(1,1,1),
      new MeshStandardMaterial({color:'#ff0000'})
    )
    this.box.position.set(0,1,0)
    this.box.castShadow = true



  
  }
}