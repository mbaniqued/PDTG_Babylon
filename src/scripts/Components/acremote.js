
import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import {Vector3,Angle,Color3,ActionManager,ExecuteCodeAction} from 'babylonjs';
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
            this.meshRoot.position  = new Vector3(this.position.x,this.position.y,this.position.z);
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
                this.root.removeRegisterAction(childmesh);
            });
        }
        addAction(mesh){
                    mesh.actionManager = new ActionManager(this.root.scene);
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        if(this.root.camera.radius<2){
                            this.root.gamestate.state = GameState.focus;
                            this.state =1;
                        }
                        this.updateoutLine(true);
                        this.setLabel();
                    }))
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
                            this.label.isVisible=false;
                            this.updateoutLine(false);
                    }))
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (object)=> {
                            if(this.state>0 && this.root.gamestate.state === GameState.default)
                                this.state =0;
                            if(this.root.camera.radius<2){
                                this.root.gamestate.state = GameState.focus;
                                this.state =1;
                                this.root.setFocusOnObject(new Vector3(this.meshRoot.position.x-.1,this.meshRoot.position.y,this.meshRoot.position.z));
                            }
                            this.updateoutLine(true);
                            this.setLabel();
                            this.root.scene.onPointerUp=()=>{
                                this.label.isVisible=false;
                                this.updateoutLine(false);
                            }
                    }))
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {

                        this.root.sceneCommon.setminiCamTarget(1);
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        this.setLabel();
                        if(this.state == 0 && this.root.gamestate.state === GameState.default){
                                this.root.gamestate.state = GameState.focus;
                                this.state= 1;
                                this.label._children[0].text = "Power Off AC";
                                let isPositive=true;
                                if(this.root.camera.alpha>Angle.FromDegrees(180).radians())
                                    isPositive = false;
                                this.root.setCameraAnim(isPositive?.1:359,.1,40,1.5);
                                this.root.setFocusOnObject(new Vector3(this.meshRoot.position.x-.1,this.meshRoot.position.y,this.meshRoot.position.z));
                                this.root.gamestate.state = GameState.focus;
                        }    
                        else if(this.state>0) {
                                this.isAcOff = !this.isAcOff;
                                this.root.scene.getMeshByName("acindicator").material.diffuseColor  = this.isAcOff?new Color3.FromInts(255,0,0):new Color3.FromInts(0,255,0);
                                this.root.setAc(!this.isAcOff);
                                this.root.audioManager.playSound(this.root.audioManager.acSound);
                                if(this.isAcOff){
                                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"acoff",level:0}});
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