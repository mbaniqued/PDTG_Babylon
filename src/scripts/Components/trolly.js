
import { GameState,ANIM_TIME,event_objectivecomplete,rotateState,gamemode } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
import {Vector3,Angle,ActionManager,ExecuteCodeAction} from 'babylonjs';
export default class Trolly{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            this.meshRoot   = meshobject;
            this.apdMachine = undefined;
            this.position   = pos;
            this.setPos();
            
            // this.mesh = new BABYLON.Mesh();
            // this.meshRoot.getChildMeshes().forEach(childmesh => {
            //     if(childmesh.name.includes("apdmachine0"))
            //         this.apdMachine = childmesh.parent;
            //     this.addAction(childmesh);
            // });
            this.initAction();
            this.apdMachine.position = new BABYLON.Vector3(-50,0,0);
        }
        addswitchAction(){
            const mesh = this.root.scene.getMeshByName("apdswitch_sphere");
            mesh.isPickable = true;
            if(!mesh.actionManager){
                mesh.actionManager = new ActionManager(this.root.scene);
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
                        if(this.root.gamestate.state === GameState.inspect)
                            this.updateoutLine(mesh,false);
                        else
                            this.updateoutLine(mesh,true);                        
                        
                    }))
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
                        this.updateoutLine(mesh,false);
                    }))
                    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {
                            if(rotateState.value===1)
                                return;
                            if(this.root.camera.radius>2){
                                this.focusApd(true);
                                this.root.setFocusOnObject(new Vector3(this.meshRoot.position.x-.5,this.meshRoot.position.y,this.meshRoot.position.z));    
                            }
                            else{
                                if((this.root.level==3 && this.root.gamemode === gamemode.training)  || this.root.gamemode !== gamemode.training){
                                    this.root.scene.getMeshByName("apd_machinetxt_plan").visibility =1;
                                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"apd_machine_on"}});
                                    document.dispatchEvent(custom_event);
                                }
                            }
                        }

                    )
                )
            }
        }
        addAction(mesh){
                mesh.actionManager = new ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
                    if(this.root.gamestate.state === GameState.inspect)
                        this.updateoutLine(mesh,false);
                    else
                        this.updateoutLine(mesh,true);                        
                    
                }))
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
                    this.updateoutLine(mesh,false);
                }))
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (object)=> {
                    this.updateoutLine(mesh,true);
                        this.root.scene.onPointerUp=()=>{
                            this.updateoutLine(mesh,false);
                        }
                }))
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {
                        if(rotateState.value ===1 || this.root.gamestate.state === GameState.radial || this.root.gamestate.state === GameState.inspect)
                            return;
                        this.root.gamestate.state = GameState.focus;
                        
                        if(mesh.name.includes("trolly")){
                            this.focusApd(false);
                            this.root.setFocusOnObject(new Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z));
                        }
                        if(mesh.name.includes("apdmachine")){
                            this.focusApd(true);
                            this.root.setFocusOnObject(new Vector3(this.meshRoot.position.x-.5,this.meshRoot.position.y,this.meshRoot.position.z));    
                        }
                    }
                )
            )
        }
        focusApd(ismachine){
            let isPositive =true;
            if(this.root.camera.alpha<Angle.FromDegrees(90).radians())
                isPositive = false;
            this.root.setCameraAnim(isPositive?270:-90,270,ismachine?75:70,ismachine?1.7:2.5);
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        removeAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.root.removeRegisterAction(childmesh);
                this.updateoutLine(childmesh,false);
            });
            const switchmesh = this.root.scene.getMeshByName("apdswitch_sphere");
            this.root.removeRegisterAction(switchmesh);
        }
        initAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isPickable = true;
                if(childmesh.name.includes("apdmachine0"))
                    this.apdMachine = childmesh.parent;
                if(!childmesh.actionManager)
                    this.addAction(childmesh);
            });
            this.addswitchAction();
        }
        updateoutLine(mesh,value){
            if( mesh.name !=="apdswitch_sphere" && mesh.parent.name ==="apdnode" &&  this.root.gamestate.state != GameState.focus){
                mesh.renderOutline = false;
            }
            else{
                if(mesh.name.includes("apdswitch_sphere")){
                    mesh.renderOutline = value;
                    mesh.outlineWidth=.005;
                }
                else{
                    if( mesh.parent && mesh.parent.name ==="apdnode"){
                        this.meshRoot.getChildMeshes().forEach(childmesh=>{
                            childmesh.outlineWidth  = .15;
                            if(childmesh.id.includes("DeviceDialysisReference_primitive1"))
                                childmesh.renderOutline = value;
                             else   
                                childmesh.renderOutline = false;
                             this.root.scene.getMeshByName("apdswitch_sphere").renderOutline = false;
                         });
                      }
                     else{   
                        this.root.scene.getMeshByName("apdswitch_sphere").renderOutline = false;
                        this.meshRoot.getChildMeshes().forEach(childmesh=>{
                            childmesh.outlineWidth  = 1;
                            if(childmesh.name.includes("apd"))
                                childmesh.renderOutline = false;
                            else{
                                if(childmesh.id === "Trolley_primitive1" || childmesh.id === "Trolley_primitive3") 
                                    childmesh.renderOutline = false;    
                                else 
                                    childmesh.renderOutline = value; 
                            }
                        });
                     }
                }
            }
        }

}