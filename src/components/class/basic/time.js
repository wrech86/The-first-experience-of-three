import EventEmitter from "eventemitter3";
import { Clock } from "three";
export class Time extends EventEmitter{
  constructor(){
    super()
    this.time = new Clock()
    this.basicTime = 0
    this.currentTime = 16
    this.intervalTime = 0
    window.requestAnimationFrame(()=>{
      this.tick()
    })
  }
  tick(){
   this.currentTime = this.time.getElapsedTime()
   this.intervalTime = this.currentTime - this.basicTime
   this.basicTime = this.currentTime
   this.emit('time')
   window.requestAnimationFrame(()=>{
    this.tick()
   })
  }
}