
import { ObjectState } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class ACRemote{
        constructor(root,meshobject,pos,_parent){
            this.name            = meshobject.name;
            this.root            = root;
            this.meshRoot        = meshobject;
            this.position        = pos;
            this.state        = 0;
            this.setPos();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.addAction(childmesh);

            });
        }
        setPos(){
            this.meshRoot.position  = new BABYLON.Vector3(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
                    mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === ObjectState.default)
                            this.state =0;
                        if( this.state == 0 && this.root.gamestate.state === ObjectState.default){
                                this.root.gamestate.state = ObjectState.focus;
                                this.state= 1;
                                            // this.root.gamestate.state  =  ObjectState.pick;
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(330).radians()},900).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();   
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},900).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({radius:1.5},1000).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x-.25,this.meshRoot.position.y,this.meshRoot.position.z));
                            }    
                            else{
                                if(this.state>0){
                                this.reset();
                                }
                            }
                        
                        }
                    )
                )
            
        }
        reset(){
            this.state =0;
            // this.root.gamestate.state =  ObjectState.default;
            // this.root.setCameraTarget();
        }
}