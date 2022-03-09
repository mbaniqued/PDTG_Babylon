import { ObjectState,ANIM_TIME } from "../scene/Basic";
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
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(childmesh)
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
                        if(mesh.parent.name.includes("cabinetnode")){
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(270).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                                this.root.gamestate.state = ObjectState.focus;
                                this.state =1;
                                this.setCabinetDoorBorder(1);
                            }).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));
                        }
                    }
                    else if(this.state ===1 && mesh.parent.parent.name.includes("Door") && (this.root.gamestate.state === ObjectState.focus || this.root.gamestate.state === ObjectState.active)){
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));
                            this.meshRoot.getChildTransformNodes().forEach(childnode => {
                                this.root.gamestate.state = ObjectState.active;
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
                    }     
                )
           )
    }
    openCloseDoor(mesh,angle,isleft){
        let val=0;
        if(mesh.rotation.z === BABYLON.Angle.FromDegrees(0).radians())
            val=angle;
        new TWEEN.Tween(mesh.rotation).to({z:isleft?-BABYLON.Angle.FromDegrees(val).radians():BABYLON.Angle.FromDegrees(val).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
            this.doorAnim = true;
        }).onComplete(() => {
            this.doorAnim = false;
            if(isleft){
                // console.log(this.isdoorOpen);
                if(!this.isdoorOpen)
                    this.reset();
            }
        }).start();
    }
    reset(){
        // this.state=0;
        this.isdoorOpen=false;
        this.doorAnim = false;
        // this.root.gamestate.state = ObjectState.default;
        // this.root.setCameraTarget();
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