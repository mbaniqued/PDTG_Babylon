import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
export default class LightSwitch{

        constructor(root,meshobject){
            this.name       = meshobject.name;
            this.root       = root;
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.state      = 0;
            this.label = this.root.gui2D.createRectLabel(this.name,170,36,10,"#FFFFFF",this.meshRoot,0,-50);
            this.label._children[0].text = "Switches";
            this.label.isVisible=false;
            this.isLightOff=false;
            this.initAction();
        }
        initAction(){
            if(!this.meshRoot.actionManager)
                this.addAction(this.meshRoot);
        }
        removeAction(){
            this.meshRoot.actionManager=null;
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                if(this.state>0 && this.root.gamestate.state === GameState.default)
                    this.state =0;
                    this.setLabel();
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                    if(this.state>0 && this.root.gamestate.state === GameState.default)
                        this.state=0;
                    this.setLabel();
                    this.root.scene.onPointerUp=()=>{
                        this.label.isVisible=false;
                    }
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                           this.state =0;
                        if(this.root.camera.radius<3)
                            this.state =1;
                        this.setLabel();
                        this.root.sceneCommon.setminiCamTarget(0);
                        if(this.root.gamestate.state === GameState.default){
                            this.root.gamestate.state  =  GameState.active;
                            this.state=1;
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(185).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({radius:2},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                            // this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x+2,this.meshRoot.position.y+3.5,this.meshRoot.position.z-.5));
                            let node = this.root.scene.getNodeByName("fanswitchnode");
                            this.root.setFocusOnObject(new BABYLON.Vector3(node.position.x,node.position.y,node.position.z+.5));
                        }
                        else if(this.state>0){
                            this.isLightOff =!this.isLightOff;
                            this.setLight();
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this}});
                            document.dispatchEvent(custom_event);
                        }
                        this.setLabel();
                        console.log("innnnnnnnnnnnn OnPickTrigger")
                    }
                )
             )
        }
        setLabel(){
            if(this.state ===0)
            this.label._children[0].text = "Switches";
            else if(this.state===1){
                this.label._children[0].text = this.isLightOff?"Turn Off Lights":"Turn On Lights"; 
            }
            this.label.isVisible=true;
            this.label.isPointerBlocker=true;
        }
        setLight(){
            this.root.sceneCommon.hemiLight.intensity        =  this.isLightOff?.5:.1;
            this.root.sceneCommon.directionalLight.intensity = this.isLightOff?.5:.1;
        }

}