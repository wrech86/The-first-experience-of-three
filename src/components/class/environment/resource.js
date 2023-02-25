import { CubeTextureLoader, TextureLoader } from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import source from '/public/source/source.js'
import { EventEmitter } from 'eventemitter3'
export class Resource extends EventEmitter{
  constructor(){
    super()
    this.totalSource = {}
    this.source = source
    this.sourceLength = this.source.length
    this.nowLength = 0
    this.readyLoad()
    
  }
  readyLoad(){
    for (const item of this.source) {
      if(item.type === 'Cube'){
        let cube = new CubeTextureLoader().setPath(item.root).load(item.path)
        this.isLoad(item,cube)
                
      }else if(item.type === 'Gltf'){
        let gltf = new GLTFLoader().setPath(item.root).load(item.path)
        this.isLoad(item,gltf)
      }else if(item.type === 'texture'){
        let texture = new TextureLoader().setPath(item.root).load(item.path)
        this.isLoad(item,texture)
      }
    }
  }
  isLoad(item,texture){
    this.totalSource[item.name] = texture
    this.nowLength++
    if(this.sourceLength === this.nowLength){
      this.emit('load')
    }
  }
}