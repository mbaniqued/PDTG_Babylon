import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import {Color3,Vector3,ActionManager,ExecuteCodeAction} from 'babylonjs';
export default class FanSwitch{

        constructor(root,meshobject){
            this.name       = meshobject.name;
            this.root       = root;
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.state      = 0;
            this.initAction();
            this.label = this.root.gui2D.createRectLabel(this.name,170,36,10,"#FFFFFF",this.meshRoot,0,-150);
            this.label._children[0].text = "Switches";
            this.label.isVisible=false;
            this.isFanOff=false;
        }
        initAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(!childmesh.actionManager)
                    this.addAction(childmesh);
                childmesh.isPickable = true;
            });
            this.updateoutLine(false);
        }
        removeAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.root.removeRegisterAction(childmesh);
            });
        }
        addAction(mesh){
            mesh.actionManager = new ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
                if(this.root.camera.radius<3){
                    this.state =1;
                    this.root.gamestate.state  =  GameState.active;
                }
                else{
                    this.state =0;
                    this.root.gamestate.state  =  GameState.default;
                }
                this.setLabel();
                this.updateoutLine(true);
            }))
            mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
                    this.updateoutLine(false);
            }))
            mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (object)=> {
                    if(this.root.camera.radius<3){
                        this.state =1;
                        this.root.gamestate.state  =  GameState.active;
                    }
                    else{
                        this.state =0;
                        this.root.gamestate.state  =  GameState.default;
                    }
                    this.setLabel();
                    this.updateoutLine(true);
                    this.root.scene.onPointerUp=()=>{
                        this.label.isVisible=false;
                        this.updateoutLine(false);
                    }
            }))
            mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {
                        if(this.root.camera.radius<3){
                            this.state =1;
                            this.root.gamestate.state  =  GameState.active;
                        }
                        else{
                            this.state =0;
                            this.root.gamestate.state  =  GameState.default;
                        }
                        this.root.sceneCommon.setminiCamTarget(0);
                        this.setLabel();
                        if(this.root.gamestate.state === GameState.default){
                            this.root.gamestate.state  =  GameState.active;
                            this.state=1;
                            this.root.setCameraAnim(185,185,90,1.5);
                            this.root.setFocusOnObject(new Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z+.25));
                        }
                        else if(this.state>0){
                            this.isFanOff =!this.isFanOff;
                            if(this.isFanOff){
                                this.root.stopFan();
                                let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"fan_off",level:0}});
                                document.dispatchEvent(custom_event);
                            }
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
        updateoutLine(value){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.outlineWidth=2;
                if(childmesh.name === "fanswitch1"){
                    childmesh.renderOutline = false;
                    childmesh.customOutline.isVisible = value;
                }
                else                    
                    childmesh.renderOutline = false;
                childmesh.outlineColor  = Color3.Yellow();

            });
        }

}