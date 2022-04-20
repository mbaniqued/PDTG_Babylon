
import { GameState,ANIM_TIME,event_objectivecomplete,rotateState,gamemode } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
export default class Trolly{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            this.meshRoot   = meshobject;
            this.apdMachine = undefined;
            this.position   = pos;
            this.state      = 0;
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
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                        if(this.root.gamestate.state === GameState.inspect)
                            this.updateoutLine(mesh,false);
                        else
                            this.updateoutLine(mesh,true);                        
                        
                    }))
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                        this.updateoutLine(mesh,false);
                    }))
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                            if(rotateState.value===1)
                                return;
                            // console.log(" !!! switch!! "+mesh.name);
                            if(this.root.camera.target.z!=this.meshRoot.position.z+1){
                                
                                    this.focusApd();
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
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                if(this.root.gamestate.state === GameState.inspect)
                    this.updateoutLine(mesh,false);
                else
                    this.updateoutLine(mesh,true);                        
                
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                   this.updateoutLine(mesh,false);
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                this.updateoutLine(mesh,true);
                    this.root.scene.onPointerUp=()=>{
                        this.updateoutLine(mesh,false);
                    }
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                    console.log(this.root.gamestate.state+" "+mesh.name);
                    switch(this.state){
                            case 0:
                                this.root.gamestate.state = GameState.default;
                                new TWEEN.Tween(this.root.camera).to({radius:2.5},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
                                let isPositive =true;
                                if(this.root.camera.alpha<BABYLON.Angle.FromDegrees(90).radians())
                                    isPositive = false;
                                new TWEEN.Tween(this.root.camera).to({alpha:isPositive?BABYLON.Angle.FromDegrees(270).radians():-BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                                    this.root.gamestate.state = GameState.focus;
                                    this.root.camera.alpha = BABYLON.Angle.FromDegrees(270).radians();
                                }).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(70).radians()},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
                                if(mesh.name.includes("trolly")){
                                    this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z));
                                }
                                if(mesh.name.includes("apdmachine")){
                                    this.focusApd();
                                    // console.log(" !!! focus apd!!!");
                                }
                                break;
                        }
                    }
                )
            )
        }
        focusApd(){
            new TWEEN.Tween(this.root.camera).to({radius:2.5},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            let isPositive =true;
            if(this.root.camera.alpha<BABYLON.Angle.FromDegrees(90).radians())
                isPositive = false;
            new TWEEN.Tween(this.root.camera).to({alpha:isPositive?BABYLON.Angle.FromDegrees(270).radians():-BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                this.root.camera.alpha = BABYLON.Angle.FromDegrees(270).radians();
            }).start();
            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(70).radians()},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x-.5,this.meshRoot.position.y-.1,this.meshRoot.position.z+1));    
            
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
                    console.log(mesh.name+"      "+value);
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