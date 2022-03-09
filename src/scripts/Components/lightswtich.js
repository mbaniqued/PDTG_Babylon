import { ObjectState,ANIM_TIME } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class LightSwitch{

        constructor(root,meshobject){
            this.name       = meshobject.name;
            this.root       = root;
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.action     = 0;
            this.addAction(this.meshRoot);
            
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === ObjectState.default)
                            this.state =0;
                        if(this.root.gamestate.state === ObjectState.default){
                            this.root.gamestate.state  =  ObjectState.active;
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(185).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({radius:2},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x+2,this.meshRoot.position.y+3.5,this.meshRoot.position.z-.5));
                        }
                        else{
                            this.action =1;
                        }    
                    }
                )
             )
        }

}