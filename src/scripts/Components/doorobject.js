import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
export default class DoorObject{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.position   = pos;
            this.state     = 0;
            this.closedoor = false;
            this.setPos();
            this.label = this.root.gui2D.createRectLabel(this.name,160,36,10,"#FFFFFF",this.meshRoot,0,0);
            this.label._children[0].text = "Door";
            this.label.isVisible=false;
            this.initAction();
            this.setDoor();
            this.interaction=false;
            // let mesh = new BABYLON.TransformNode();
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        initAction(){
            this.interaction=true;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
               if(childmesh.name ==="mydoor" && !childmesh.actionManager)
                  this.addAction(childmesh);
            });
        }
        removeAction(){
            this.interaction=false;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.actionManager = null;
            });
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                this.setLabel();
                this.updateoutLine(true);
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
                    this.updateoutLine(false);
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                    this.setLabel();
                    this.updateoutLine(true);
                    this.root.scene.onPointerUp=()=>{
                        this.updateoutLine(false);
                        this.label.isVisible=false;
                    }
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        switch(this.state){
                            case 0:
                                this.root.gamestate.state  =  GameState.default;
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(190).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({radius:6},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                                    this.root.gamestate.state  =  GameState.focus;
                                    this.state =1;
                                }).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z));
                                break;
                            case 1:
                                this.openCloseDoor();
                                break;    
                        }
                        this.setLabel();
                    }
                )
            )
        }
        openCloseDoor(){
            let val=325;
            if(this.meshRoot.rotation.y<= BABYLON.Angle.FromDegrees(325).radians())
                val=360;
            new TWEEN.Tween(this.meshRoot.rotation).to({y:BABYLON.Angle.FromDegrees(val).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.closedoor = !this.closedoor;
                if(this.closedoor){
                    this.label.isVisible=false;
                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this}});
                    document.dispatchEvent(custom_event);
                }
            }).start();
        }
        setDoor(){
            this.meshRoot.rotation.y = BABYLON.Angle.FromDegrees(325).radians();
        }
        setLabel(){
            if(this.root.gamestate.state === GameState.default)
                this.label._children[0].text = "Door";
            else
                this.label._children[0].text = this.closedoor?"Open Door":"Close Door"; 

            this.label.isVisible= this.interaction && (this.root.gamestate.state === GameState.default || this.root.gamestate.state === GameState.active);
            this.label.isPointerBlocker=false;
        }
        updateoutLine(value){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.outlineWidth>0)
                    childmesh.renderOutline = value;
                else                    
                    childmesh.renderOutline = false;
                childmesh.outlineColor  = BABYLON.Color3.Yellow();

            });
        }
}