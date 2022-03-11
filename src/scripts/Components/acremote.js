
import { GameState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
export default class ACRemote{
        constructor(root,meshobject,pos,_parent){
            this.name            = meshobject.name;
            this.root            = root;
            this.meshRoot        = meshobject;
            this.position        = pos;
            this.state          = 0;
            this.isAcOff        = false;
            this.setPos();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.addAction(childmesh);

            });
            this.label = this.root.gui2D.createRectLabel(this.name,160,36,10,"#FFFFFF",this.meshRoot,0,-50);
            this.label._children[0].text = "AC Remote";
            this.label.isVisible=false;
        }
        setPos(){
            this.meshRoot.position  = new BABYLON.Vector3(this.position.x,this.position.y,this.position.z);
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
                        
                        if(this.state == 0 && this.root.gamestate.state === GameState.default){
                                this.root.gamestate.state = GameState.focus;
                                this.state= 1;
                                this.label._children[0].text = "Power Off AC";
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(330).radians()},900).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();   
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},900).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({radius:1.5},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x-.25,this.meshRoot.position.y,this.meshRoot.position.z));
                        }    
                        else if(this.state>0) {
                                this.setLabel();
                                this.isAcOff = !this.isAcOff;
                            }
                        }
                    )
                )
                // this.root.gui2D.resetCamBtn._onPointerUp = ()=>{
                //     this.reset(1);
                // }
            
        }
        reset(type){
            this.state =0;
            this.root.gamestate.state =  GameState.default;
            if(type>0)
            this.root.setCameraTarget();
        }
        setLabel(){
            if(this.state===0)
                this.label._children[0].text = "AC Remote";
            else
                this.label._children[0].text = this.isAcOff?"Power On AC":"Power Off AC";
            this.label.isVisible=true;
        }
}