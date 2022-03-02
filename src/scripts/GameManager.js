
import * as BABYLON from 'babylonjs';
import Basic from './scene/Basic';
import SceneManager   from './SceneManager';
import TWEEN from '@tweenjs/tween.js';
import {ObjectState}  from './scene/Basic';
let divFps;
let cnt=0;
export class GameManger {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.enableOfflineSupport=true;
        this.sceneManager = new SceneManager();
        this.sceneManager.setSceneState(this.sceneManager.sceneState.basic);
        this.worldManager = null;
        switch(this.sceneManager.currentSceneState){
            case this.sceneManager.sceneState.basic:
                this.basic = new Basic(this);
                break;
        }
        // divFps = document.getElementById("fps");
        window.addEventListener("resize",  ()=> {
            this.resizeBabylonEngine();
        },false);
        this.startRenderLoop();
    }
    resizeBabylonEngine(){
        this.engine.resize();
    }
    restartScene(){
        if(this.basic.scene){
            this.basic.scene.onDisposeObservable.add(()=>{
                this.basic.scene = undefined;
                this.basic.scene = null;
                this.basic = null;
                this.basic = new Basic(this);
                this.startRenderLoop();    
            });
            this.engine.stopRenderLoop();
            this.basic.releaseScene();
        }
    }
    startRenderLoop(){
        this.engine.runRenderLoop( ()=> {
            switch(this.sceneManager.currentSceneState){
                case this.sceneManager.sceneState.basic:
                        if(this.basic && this.basic.scene && this.basic.loaderManager.isLoad){
                            this.basic.scene.render();
                            if(this.basic.gamestate.state ===  ObjectState.default)
                                this.basic.sceneCommon.updateCam();
                                
                            TWEEN.update();
                            // if(cnt>200){
                            //     let mesh = this.basic.tableRoot.getChildren()[3];
                            //         if(mesh){
                            //             // mesh  = mesh.getChildren()[2];
                            //             mesh.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(-cnt).radians());
                            //         }
                                   
                            //     }
                            // cnt++;
                            // if(this.basic.trollyRoot.rotation){
                            //     this.basic.trollyRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(cnt).radians(),BABYLON.Angle.FromDegrees(0).radians());
                            // }
                        }
                    break;
            }
            // divFps.innerHTML = this.engine.getFps().toFixed() + " fps";
        });
    }
    stopRenderLoop(){
        this.engine.stopRenderLoop();
    }
    showFPS(){
        return this.engine.getFps().toFixed();
    }
}
