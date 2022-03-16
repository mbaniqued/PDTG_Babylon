import { GameState,ANIM_TIME } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
export default class FanSwitch{

        constructor(root,meshobject){
            this.name       = meshobject.name;
            this.root       = root;
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.state      = 0;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.addAction(childmesh);
            });
            this.label = this.root.gui2D.createRectLabel(this.name,170,36,10,"#FFFFFF",this.meshRoot,0,-50);
            this.label._children[0].text = "Switches";
            this.label.isVisible=false;
            this.isFanOff=false;
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                if(this.state>0 && this.root.gamestate.state === GameState.default)
                    this.state =0;
                    this.setLabel();
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                    if(this.state>0 && this.root.gamestate.state === GameState.default)
                        this.state =0;
                    this.setLabel();
                    this.root.scene.onPointerUp=()=>{
                        this.label.isVisible=false;
                    }
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        this.setLabel();
                        if(this.root.gamestate.state === GameState.default){
                            this.root.gamestate.state  =  GameState.active;
                            this.state=1;
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(185).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({radius:2},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z));
                        }
                        else if(this.state>0){
                            this.isFanOff =!this.isFanOff;
                            if(this.isFanOff)
                                this.root.stopFan();
                            else    
                                this.root.startFan();

                        }
                        this.setLabel();
                    }
                )
             )
        }
        setLabel(){
            if(this.state ===0)
            this.label._children[0].text = "Switches";
            else if(this.state===1){
                this.label._children[0].text = this.isFanOff?"Turn On Fan":"Turn Off Fan"; 
            }
            this.label.isVisible=true;
        }
        

}