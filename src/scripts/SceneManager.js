

// firefighting // linefollowing
export default class SceneManager{
    constructor(){
          this.sceneState        = {basic:1};                          
          this.currentSceneState = 0;
    }
    setSceneState(scenestate){
         this.currentSceneState = scenestate;
    }
}