import {Size} from './basic/size'
import {Time} from './basic/time'
import {Camera} from './basic/camera'
import {SScene} from './basic/scene'
import {Render} from './basic/render'
import { Control } from './basic/control'

export class total{
  constructor(canvas){
    this.size = new Size()
    this.time = new Time()
    this.camera = new Camera(this.size.width,this.size.height)
    this.scene = new SScene(this)
    this.render = new Render(canvas,this.size.width,this.size.height)
    this.control = new Control(this.camera.instance,canvas)

    this.canvas = canvas
    this.size.on('size',()=>{ 
      this.reSize()
    })
    this.time.on('time',()=>{
      this.reTime()
    })
  }
  reSize(){
     this.render.instance.setSize(this.size.width,this.size.height)
     this.render.instance.setPixelRatio(this.size.pixelRatio)
     this.camera.instance.aspect = this.size.width/this.size.height
     this.camera.instance.updateProjectionMatrix()
  }
  reTime(){
    this.render.instance.render(this.scene.instance,this.camera.instance)
    this.control.instance.update()
  }
}