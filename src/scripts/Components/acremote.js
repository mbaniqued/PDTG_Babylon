
import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
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
            this.initAction();
            this.label = this.root.gui2D.createRectLabel(this.name,160,36,10,"#FFFFFF",this.meshRoot,0,-50);
            this.label._children[0].text = "AC Remote";
            
        }
        setPos(){
            this.meshRoot.position  = new BABYLON.Vector3(this.position.x,this.position.y,this.position.z);
        }
        initAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(!childmesh.actionManager)
                    this.addAction(childmesh);
                childmesh.isPickable = true;
            });
        }
        removeAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.actionManager=null;
                childmesh.isPickable = false;
            });
        }
        addAction(mesh){
                    mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        if(this.root.camera.radius<2){
                            this.root.gamestate.state = GameState.focus;
                            this.state =1;
                        }
                        this.updateoutLine(true);
                        this.setLabel();
                    }))
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                            this.label.isVisible=false;
                            this.updateoutLine(false);
                    }))
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                            if(this.state>0 && this.root.gamestate.state === GameState.default)
                                this.state =0;
                            if(this.root.camera.radius<2){
                                this.root.gamestate.state = GameState.focus;
                                this.state =1;
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x-.1,this.meshRoot.position.y,this.meshRoot.position.z));
                            }
                            this.updateoutLine(true);
                            this.setLabel();
                            this.root.scene.onPointerUp=()=>{
                                this.label.isVisible=false;
                                this.updateoutLine(false);
                            }
                    }))
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {

                        this.root.sceneCommon.setminiCamTarget(1);
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        this.setLabel();
                        if(this.state == 0 && this.root.gamestate.state === GameState.default){
                                this.root.gamestate.state = GameState.focus;
                                this.state= 1;
                                this.label._children[0].text = "Power Off AC";
                                let val = BABYLON.Angle.FromRadians(this.root.camera.alpha).degrees()>300?359:0; 
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(val).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();   
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(40).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({radius:1.5},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x-.1,this.meshRoot.position.y,this.meshRoot.position.z));
                        }    
                        else if(this.state>0) {
                                this.isAcOff = !this.isAcOff;
                                this.root.setAc(!this.isAcOff);
                                if(this.isAcOff){
                                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this}});
                                    document.dispatchEvent(custom_event);
                                }
                            }
                        }
                    )
                )
        }
        setLabel(){
            // console.log(this.state+"    "+this.root.gamestate.state)
            if(this.root.gamestate.state ===  GameState.default)
                this.label._children[0].text = "AC Remote";
            else
                this.label._children[0].text = this.isAcOff?"Power On AC":"Power Off AC";
            this.label.isVisible=true;
            this.label.isPointerBlocker=true;
        }
        updateoutLine(value){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.renderOutline = value;
                childmesh.outlineWidth  = 1;
            });
        }
}