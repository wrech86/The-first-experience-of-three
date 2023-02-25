
import { Resource } from "./resource";
export class Env{
  constructor(){
    // this.env = new CubeTextureLoader()
    // this.env.setPath('/envMap/2/')
    // this.map=this.env.load([
    //   'px.png','nx.png',
    //   'py.png','ny.png',
    //   'pz.png','nz.png'
    // ])
    this.source = new Resource()
    this.envMap = this.source.totalSource.night
    
    this.floor = {
      color:this.source.totalSource.floorColor,
      ao:this.source.totalSource.floorAo,
      nor:this.source.totalSource.floorNor
    }
    
  
  }
}