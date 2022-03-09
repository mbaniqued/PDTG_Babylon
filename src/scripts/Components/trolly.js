
import { ObjectState,ANIM_TIME } from "../scene/Basic";
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
            this.initMeshOutline();
            // this.mesh = new BABYLON.Mesh();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.name.includes("apdmachine0"))
                    this.apdMachine = childmesh.parent;
                this.addAction(childmesh);
            });
            this.apdMachine.position = new BABYLON.Vector3(-50,0,0);
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        console.log(this.root.gamestate.state+" "+mesh.name);
                        if(this.state>0 && this.root.gamestate.state === ObjectState.default)
                            this.state =0;
                        if(this.root.gamestate.state === ObjectState.default){
                             if(mesh.name.includes("trolly")){
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(270).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                                    this.root.gamestate.state = ObjectState.focus;
                                    this.state=1;
                                    this.setApdDeviceBorder(.1);
                                }).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(70).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                                    // console.log(" !!! innnnnnnnnnn complete!!! ");

                                }).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z-2.5));
                             }
                        }
                        else if(this.state ===1 && (this.root.gamestate.state === ObjectState.focus || this.root.gamestate.state === ObjectState.active)){
                                if(mesh.name.includes("apdmachine") && this.state===1){

                                    this.root.gamestate.state = ObjectState.focus;
                                    this.state=2;
                                    new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(270).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                                    new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(70).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                                    this.root.setFocusOnObject(new BABYLON.Vector3(this.apdMachine.absolutePosition.x,this.apdMachine.absolutePosition.y-.5,this.apdMachine.absolutePosition.z+1));    
                                    console.log(" !!! focus apd!!!");
                                }
                                
                        }
                        else if (this.state>1){
                            // console.log(this.state+" !!! in trolly reset!!! ");
                            this.reset();
                        }
                    }
                )
            )
        }
        reset(){
            this.root.gamestate.state =  ObjectState.default;
            this.state =0;
            // this.root.setCameraTarget();
        }
        initMeshOutline(){
            this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                if(childnode.name.includes("trollynode")){
                    childnode.getChildMeshes().forEach(childmesh=>{
                        this.root.loaderManager.setPickable(childmesh,.5); 
                    });
                }
                // if(childnode.name.includes("apdmachine")){
                //     childnode.getChildMeshes().forEach(childmesh=>{
                //         this.root.loaderManager.setPickable(childmesh,.1); 
                //     });
                // }
                
            });
        }
        setApdDeviceBorder(value){
            this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                if(childnode.name.includes("apdnode")){
                    childnode.getChildMeshes().forEach(childmesh=>{
                        if(childmesh.id.includes("DeviceDialysisReference_primitive1"))
                            this.root.loaderManager.setPickable(childmesh,value); 
                    });
                }
            });
        }

}