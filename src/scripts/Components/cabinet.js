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
        this.initMeshOutline();
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
            
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                this.label.isVisible=false;
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                this.setLabel();
                this.root.scene.onPointerUp=()=>{
                    this.label.isVisible=false;
                }
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                // document.getElementById("debugtext").textContent= "cabinetstate==before== "+this.state+"  !!! GameState!!  "+this.root.gamestate.state;
                if(this.state>0 && this.root.gamestate.state === GameState.default){
                        if(this.state>0 && this.isdoorOpen)
                            this.state =10;
                         else   
                            this.state =0;
                }
                // document.getElementById("debugtext").textContent= "cabinetstate==after== "+this.state+"  !!! GameState!!  "+this.root.gamestate.state;
                    switch(this.state){
                        case 0:
                                this.root.gamestate.state = GameState.default;
                                this.cabinetFocusAnim();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));
                            break;
                         case 1:
                                if(mesh.parent.parent.name.includes("Door")){
                                    this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));            
                                    this.meshRoot.getChildTransformNodes().forEach(childnode => {
                                        this.root.gamestate.state = GameState.active;
                                        if(!this.doorAnim){
                                            if(childnode.name==="cabinetleftDoor"){
                                                this.isdoorOpen = !this.isdoorOpen;
                                                this.openCloseDoor(childnode,90,true);
                                            }
                                            if(childnode.name==="cabinetrightDoor")
                                                this.openCloseDoor(childnode,90,false);
                                        }
                                    });
                                }
                             break;   
                           case 10:
                                this.cabinetFocusAnim();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));            
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
            this.setCabinetDoorBorder(1);
        }).start();
        new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
    }
    openCloseDoor(mesh,angle,isleft){
        let val=0;
        if(mesh.rotation.z === BABYLON.Angle.FromDegrees(0).radians())
            val = BABYLON.Angle.FromDegrees(angle).radians();
        new TWEEN.Tween(mesh.rotation).to({z:isleft?-val:val},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onUpdate(()=>{
            this.doorAnim = true;
        }).onComplete(() => {
            this.doorAnim = false;
            if(isleft){
                if(!this.isdoorOpen){
                    this.isdoorOpen=false;
                    this.doorAnim = false;
                }
            }
        }).start();
    }
    
    setLabel(){
        console.log(this.root.gamestate.state)
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
                this.setCabinetDoorBorder(-1);
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
   
}