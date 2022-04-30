import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
import { LIGHTON,LIGHTOFF } from "../Enviroment";
export default class LightSwitch{

        constructor(root,meshobject){
            this.name       = meshobject.name;
            this.root       = root;
            this.camera     = root.camera;
            this.meshRoot   = meshobject;
            this.state      = 0;
            this.label = this.root.gui2D.createRectLabel(this.name,170,36,10,"#FFFFFF",this.meshRoot,-20,-120);
            this.label._children[0].text = "Switches";
            this.label.isVisible=false;
            this.isLightOff=false;
            this.initAction();
        }
        initAction(){
            if(!this.meshRoot.actionManager)
                this.addAction(this.meshRoot);
                this.meshRoot.isPickable = true;
        }
        removeAction(){
            this.root.removeRegisterAction(this.meshRoot);
            this.updateoutLine(this.meshRoot,false);
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                    if(this.root.camera.radius<3){
                        this.state =1;
                        this.root.gamestate.state  =  GameState.active;
                    }
                    else{
                        this.state =0;
                        this.root.gamestate.state  =  GameState.default;
                    }
                    this.setLabel();
                    this.updateoutLine(mesh,true);
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
                    this.updateoutLine(mesh,false);
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                    if(this.root.camera.radius<3){
                        this.state =1;
                        this.root.gamestate.state  =  GameState.active;
                    }
                    else{
                        this.state =0;
                        this.root.gamestate.state  =  GameState.default;
                    }
                    this.setLabel();
                    this.updateoutLine(mesh,true);
                    this.root.scene.onPointerUp=()=>{
                        this.label.isVisible=false;
                        this.updateoutLine(mesh,false);
                    }
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        if(this.root.camera.radius<3){
                            this.state =1;
                            this.root.gamestate.state  =  GameState.active;
                        }
                        else{
                            this.state =0;
                            this.root.gamestate.state  =  GameState.default;
                        }
                        this.setLabel();
                        this.root.sceneCommon.setminiCamTarget(0);
                        if(this.root.gamestate.state === GameState.default){
                            this.root.gamestate.state  =  GameState.active;
                            this.state=1;
                            this.root.setCameraAnim(185,185,90,1.5);
                            let node = this.root.scene.getNodeByName("fanswitchnode");
                            this.root.setFocusOnObject(new BABYLON.Vector3(node.position.x,node.position.y,node.position.z+.25));
                        }
                        else if(this.state>0){
                            
                            this.setLight();
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"light_off",level:0}});
                            document.dispatchEvent(custom_event);
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
                this.label._children[0].text = this.isLightOff?"Turn Off Lights":"Turn On Lights"; 
            }
            this.label.isVisible=true;
        }
        setLight(){
            console.log(" !!! light state!! " +this.state+"      "+this.isLightOff)
            this.isLightOff =!this.isLightOff;
            this.root.sceneCommon.hemiLight.intensity        = this.isLightOff?LIGHTON-.1:0;
            this.root.sceneCommon.directionalLight.intensity = this.isLightOff?LIGHTON:LIGHTOFF;
            // this.root.scene.environmentTexture.level         = this.isLightOff?1:0;
        }
        updateoutLine(mesh,value){
            if(mesh.outlineWidth>0)
                mesh.renderOutline = value;
            else    
                mesh.renderOutline = false;
            
        }

}