
import { ObjectState } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class Item{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            this.meshRoot   = meshobject;
            this.position   = pos;
            this.action     = 0;
            this.setPos();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.addAction(childmesh);
            });
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.root.gamestate.state === ObjectState.default){
                            if(this.action===0){
                                this.action =1;
                                // this.root.gamestate.state  =  ObjectState.pick;
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(330).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();   
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({radius:1.5},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x-.25,this.meshRoot.position.y,this.meshRoot.position.z));
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