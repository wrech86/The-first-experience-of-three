import { Mesh, MeshStandardMaterial, Scene,sRGBEncoding } from "three";
import {Box} from '../thing/box.js'
import { Floor } from "../thing/floor.js";
import {Light} from '../environment/light'
import { Env } from "../environment/envMap.js";

export class SScene{
  constructor(allThings){
    this.instance = new Scene()
    this.instance.add(allThings.camera.instance)
    this.instance.add(new Box().box,new Floor().floor)
    this.instance.add(new Light().dirLight,new Light().amLight)
    this.env = new Env()
    this.env.envMap.encoding = sRGBEncoding
    this.instance.background = this.env.envMap
    this.instance.traverse((child)=>{
      if(child instanceof Mesh && child.material instanceof MeshStandardMaterial){
        child.castShadow = true
        child.receiveShadow  = true
        child.material.envMap = this.env.envMap
        child.material.envMapIntensity = 3
        child.material.needsUpdate = true
      }
    })


    
   
  }
}