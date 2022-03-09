import { ObjectState,ANIM_TIME } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class DoorObject{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.position   = pos;
            this.action     = 0;
            this.setPos();
            // let mesh = new BABYLON.TransformNode();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.name ==="mydoor")
                    this.addAction(childmesh);
            });
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === ObjectState.default)
                            this.state =0;
                        if(this.root.gamestate.state === ObjectState.default){
                            this.root.gamestate.state  =  ObjectState.active;
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(190).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({radius:6},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z));
                        }
                        else{
                            this.action =1;
                            this.openCloseDoor();
                        }    
                    }
                )
             )
        }
        openCloseDoor(){
            let val=325;
            if(this.meshRoot.rotation.y<= BABYLON.Angle.FromDegrees(325).radians())
            val=360;
            new TWEEN.Tween(this.meshRoot.rotation).to({y:BABYLON.Angle.FromDegrees(val).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                console.log(" innnnnn     openCloseDoor");
                // this.root.gamestate.state =  ObjectState.default;
                // this.action =0;
                // this.root.setCameraTarget();
            }).start();
        }
}