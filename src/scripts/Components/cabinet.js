import { GameState,ANIM_TIME,rotateState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
import {Vector3,Angle,ActionManager,ExecuteCodeAction} from 'babylonjs';
export default class Cabinet{

    constructor(root,meshobject,pos){
        this.name       = meshobject.name;
        this.root       = root;
        this.meshRoot   = meshobject;
        this.position   = pos;
        this.isdoorOpen = false;
        this.doorAnim   = false;
        this.state      = 0;
        this.setPos();
        this.setDoor();
        this.initAction();
        this.label = this.root.gui2D.createRectLabel(this.name,160,36,10,"#FFFFFF",this.meshRoot,0,-150);
        this.label._children[0].text = "Cabinet";
        this.label.isVisible=false;
    }
    setPos(){
        this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
    }
    removeAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            this.root.removeRegisterAction(childmesh);
            this.updateoutLine(childmesh,false);
        });
    }
    initAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            childmesh.isPickable = true;
            if(!childmesh.actionManager)
                this.addAction(childmesh);
        });
    }
    addAction(mesh){
        mesh.actionManager = new ActionManager(this.root.scene);
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
            if(rotateState.value===1)
                return;
            this.setLabel();
            this.updateoutLine(mesh,true);
        }))
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
                this.label.isVisible=false;
                this.updateoutLine(mesh,false);
        }))
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (object)=> {
            if(rotateState.value===1)
                return;
                this.setLabel();
                this.updateoutLine(mesh,true);
                this.root.scene.onPointerUp=()=>{
                    this.label.isVisible=false;
                    this.updateoutLine(mesh,false);
                }
        }))
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {
                if(rotateState.value ===1 || this.root.gamestate.state === GameState.radial || this.root.gamestate.state === GameState.inspect)
                    return;
                    this.updateoutLine(mesh,false);
                    if((this.root.camera.target.x != this.meshRoot.position.x && this.root.camera.target.y != this.meshRoot.position.y)){
                        if(this.state>0 && this.isdoorOpen)
                            this.state =10;
                        else   
                            this.state =0;
                        let isPositive =true;
                        if(this.root.camera.alpha<Angle.FromDegrees(45).radians())
                            isPositive = false;
                        this.root.setCameraAnim(isPositive?270:-90,270,60,3);
                    }
                    // if(this.state>0 && this.root.gamestate.state === GameState.default){
                    //     if(this.state>0 && this.isdoorOpen)
                    //         this.state =10;
                    //     else   
                    //         this.state =0;
                    // }
                    this.root.setFocusOnObject(new Vector3(this.position.x,this.position.y,this.position.z-.5));
                    switch(this.state){
                        case 0:
                                this.root.gamestate.state = GameState.default;
                                this.cabinetFocusAnim();
                            break;
                         case 1:
                                if(mesh.parent.parent.name.includes("Door")){
                                    this.root.gamestate.state = GameState.active;
                                    this.openCloseDoor();
                                }
                             break;   
                           case 10:
                                this.cabinetFocusAnim();
                               break;  
                        } 
                        this.setLabel();      
                    }     
                )
            )
    }
    cabinetFocusAnim(){
        let isPositive =true;
        if(this.root.camera.alpha<Angle.FromDegrees(45).radians())
            isPositive = false;
        // console.log("!! ispositive!! "+isPositive);
        this.root.setCameraAnim(isPositive?270:-90,270,60,3);
        this.state =1;
        this.root.gamestate.state = GameState.focus;
    }
    openCloseDoor(){
        this.meshRoot.getChildTransformNodes().forEach(childnode => {
            if(!this.doorAnim){
                if(childnode.name==="cabinetleftDoor"){
                    this.isdoorOpen = !this.isdoorOpen;
                    this.root.audioManager.playSound(this.isdoorOpen?this.root.audioManager.cabinetOpen:this.root.audioManager.cabinetClose);
                    this.doorAnimation(childnode,90,true);
                }
                if(childnode.name==="cabinetrightDoor")
                    this.doorAnimation(childnode,90,false);
            }
        });
    }
    doorAnimation(mesh,angle,isleft){
        let val=0;
        if(mesh.rotation.z === Angle.FromDegrees(0).radians())
            val = Angle.FromDegrees(angle).radians();
        new TWEEN.Tween(mesh.rotation).to({z:isleft?-val:val},ANIM_TIME*.7).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(()=>{
            this.doorAnim = true;
        }).onComplete(() => {
            if(isleft){
                this.doorAnim = false;
            }
        }).start();
    }
    setDoor(){
        this.meshRoot.getChildTransformNodes().forEach(childnode => {
            if(childnode.name==="cabinetleftDoor"){
                childnode.rotation.z=0;
            }
            if(childnode.name==="cabinetrightDoor")
                childnode.rotation.z=0;
        });
    }
    setLabel(){
        // console.log(this.root.gamestate.state)
        if(this.root.gamestate.state === GameState.default)
            this.label._children[0].text = "Cabinet";
        else
            this.label._children[0].text = this.isdoorOpen?"Close Cabinet":"Open Cabinet";
        this.label.isVisible=this.root.gamestate.state == GameState.active || this.root.gamestate.state === GameState.default;
        this.label.isPointerBlocker = false;
    }
    updateoutLine(mesh,value){
        if((mesh.parent.name ==="cabinetleftDoor"|| mesh.parent.name ==="cabinetrightDoor") && this.root.camera.radius>=3){
            mesh.renderOutline = false;
        }
        else
            mesh.renderOutline = value;
        }
}