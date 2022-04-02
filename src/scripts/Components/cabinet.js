import { GameState,ANIM_TIME } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
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
        // this.initMeshOutline();
        // this.mesh = new BABYLON.TransformNode();
        this.initAction();
        this.label = this.root.gui2D.createRectLabel(this.name,160,36,10,"#FFFFFF",this.meshRoot,0,-150);
        this.label._children[0].text = "Cabinet";
        this.label.isVisible=false;
        this.label.isPointerBlocker=true;
    }
    setPos(){
        this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
    }
    removeAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            childmesh.actionManager = null;
            childmesh.renderOutline = false;   
        });
    }
    initAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(!childmesh.actionManager)
                this.addAction(childmesh);
        });
    }
    addAction(mesh){
        mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
            this.setLabel();
            this.updateoutLine(mesh,true);
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                this.label.isVisible=false;
                this.updateoutLine(mesh,false);
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                this.setLabel();
                this.updateoutLine(mesh,true);
                this.root.scene.onPointerUp=()=>{
                    this.label.isVisible=false;
                    this.updateoutLine(mesh,false);
                }
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                    this.updateoutLine(mesh,false);
                    if(this.state>0 && this.root.gamestate.state === GameState.default){
                        if(this.state>0 && this.isdoorOpen)
                            this.state =10;
                        else   
                            this.state =0;
                    }
                    this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y,this.position.z-.5));
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
        new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(270).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
            this.root.gamestate.state = GameState.focus;
            this.state =1;
            // this.setCabinetDoorBorder(1);
        }).start();
        new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
    }
    openCloseDoor(){
        this.meshRoot.getChildTransformNodes().forEach(childnode => {
            if(!this.doorAnim){
                if(childnode.name==="cabinetleftDoor"){
                    this.isdoorOpen = !this.isdoorOpen;
                    this.doorAnimation(childnode,90,true);
                }
                if(childnode.name==="cabinetrightDoor")
                    this.doorAnimation(childnode,90,false);
            }
        });
    }
    doorAnimation(mesh,angle,isleft){
        let val=0;
        if(mesh.rotation.z === BABYLON.Angle.FromDegrees(0).radians())
            val = BABYLON.Angle.FromDegrees(angle).radians();
        new TWEEN.Tween(mesh.rotation).to({z:isleft?-val:val},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{
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
            this.label.isVisible=this.root.gamestate.state !== GameState.radial && this.root.gamestate.state !== GameState.menu && this.root.gamestate.state !== GameState.levelstage;
    }
    initMeshOutline(){
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                if(childnode.name.includes("cabinetnode")){
                    childnode.getChildMeshes().forEach(childmesh=>{
                        this.root.loaderManager.setPickable(childmesh,1); 
                    });
                }
                // this.setCabinetDoorBorder(-1);
        });
    }
    setCabinetDoorBorder(value){
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
            if(childnode.name.includes("cabinetleftDoor")){
                childnode.getChildMeshes().forEach(childmesh=>{
                    this.root.loaderManager.setPickable(childmesh,value); 
                });
            }
            if(childnode.name.includes("cabinetrightDoor")){
                childnode.getChildMeshes().forEach(childmesh=>{
                    this.root.loaderManager.setPickable(childmesh,value); 
                });
            }
        });
        
    }
    updateoutLine(mesh,value){
        if((mesh.parent.name ==="cabinetleftDoor"|| mesh.parent.name ==="cabinetrightDoor") && this.root.camera.radius>=3){
            mesh.renderOutline = false;
        }
        else
            mesh.renderOutline = value;
        }
   
}