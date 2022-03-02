
import { ObjectState } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class Trolly{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            this.meshRoot   = meshobject;
            this.apdMachine = undefined;
            this.position   = pos;
            this.action     = 0;
            this.setPos();
            // this.mesh = new BABYLON.Mesh();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.name.includes("apdmachine0"))
                    this.apdMachine = childmesh.parent;
                this.addAction(childmesh);
            });
            this.apdMachine.position = new BABYLON.Vector3(-50,0,-80);
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        console.log(this.root.gamestate.state+" "+mesh.name);
                        if(this.root.gamestate.state === ObjectState.default){
                             if(mesh.name.includes("trolly") && this.action === 0){
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(70).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y+1,this.meshRoot.position.z-2.2));
                             }
                             else if(mesh.name.includes("apdmachine") && this.action === 0){
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(70).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.apdMachine.absolutePosition.x,this.apdMachine.absolutePosition.y-.5,this.apdMachine.absolutePosition.z+1));
                                this.action=1;
                                // this.root.gamestate.state = ObjectState.pick;
                                console.log(" !!! focus apd!!!");
                             }
                             else{
                                if(this.action>0){
                                    this.reset();
                                    this.root.setCameraTarget();
                                }
                            }         
                        }
                      
                    }
                )
            )
        }
        reset(){
            this.root.gamestate.state =  ObjectState.default;
            this.action =0;
        }
}