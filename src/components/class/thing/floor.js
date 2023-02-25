import {  Mesh, MeshStandardMaterial, PlaneGeometry } from "three";
import { Env } from "../environment/envMap";
export class Floor{
  constructor(){
    this.env = new Env()
    this.floor = new Mesh(
      new PlaneGeometry(10,10),
      new MeshStandardMaterial({
        map:this.env.floor.color,
        aoMap:this.env.floor.ao,
        normalMap:this.env.floor.nor,
        
        
      })
    )
    this.floor.rotation.x = -Math.PI*.5
    this.floor.receiveShadow = true
  }
}