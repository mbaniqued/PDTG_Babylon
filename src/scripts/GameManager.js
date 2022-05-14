
import * as BABYLON from 'babylonjs';
import MainScene from './scene/MainScene';
import SceneManager   from './SceneManager';
import TWEEN from '@tweenjs/tween.js';
import {GameState}  from './scene/MainScene';
let divFps;
let cnt=0;
export class GameManger {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas,true);
        this.engine.enableOfflineSupport=true;
        this.sceneManager = new SceneManager();
        this.sceneManager.setSceneState(this.sceneManager.sceneState.basic);
        this.worldManager = null;
        switch(this.sceneManager.currentSceneState){
            case this.sceneManager.sceneState.basic:
                this.mainScene = new MainScene(this);
                this.setCamFov();
                this.engine.onResizeObservable.add(() => {
                    this.setCamFov();
                    this.engine.resize();
                });
            break;
        }
        divFps = document.getElementById("fps");
        window.addEventListener("resize",  ()=> {
            this.resizeBabylonEngine();
        },false);
        this.startRenderLoop();
    }
    setCamFov(){
        if(this.engine.getRenderHeight()>this.engine.getRenderWidth()){
            this.mainScene.camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;
        }
        else{
            this.mainScene.camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
        }
    }
    resizeBabylonEngine(){
        this.setCamFov();
        this.engine.resize();
    }
    restartScene(){
        if(this.mainScene.scene){
            this.mainScene.scene.onDisposeObservable.add(()=>{
                this.mainScene.scene = undefined;
                this.mainScene.scene = null;
                this.mainScene = null;
                this.mainScene = new MainScene(this);
                this.startRenderLoop();    
            });
            this.engine.stopRenderLoop();
            // this.mainScene.releaseScene();
        }
    }
    startRenderLoop(){
        this.engine.scenes[0].registerBeforeRender(()=>{
            if(this.mainScene.gamestate.state ===  GameState.default)
                this.mainScene.sceneCommon.updateCam();
            TWEEN.update();
        })
        this.engine.runRenderLoop( ()=> {
            switch(this.sceneManager.currentSceneState){
                case this.sceneManager.sceneState.basic:
                        if(this.mainScene && this.mainScene.scene && this.mainScene.loaderManager.isLoad){
                                this.mainScene.scene.render();
                            
                        }
                    break;
            }
            divFps.innerHTML = this.engine.getFps().toFixed() + " fps";
        });
    }
    stopRenderLoop(){
        this.engine.stopRenderLoop();
    }
    showFPS(){
        return this.engine.getFps().toFixed();
    }
}
