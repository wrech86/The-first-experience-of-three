import EventEmitter from 'eventemitter3'

export class Size extends EventEmitter{
  constructor(){
    super()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio || 2)
    this.reSize()
  }
  reSize(){
    window.addEventListener('resize',()=>{
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio || 2)
      this.emit('size')
    })
  }
}