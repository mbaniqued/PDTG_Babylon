import { ObjectState } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class Cabinet{

    constructor(root,meshobject,pos){
        this.name       = meshobject.name;
        this.root       = root;
        this.meshRoot   = meshobject;
        this.position   = pos;
        this.action     = 0;
        this.setPos();
        // this.mesh = new BABYLON.TransformNode();
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            console.log(childmesh.name);
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
                    console.log("!!!Cabinet state!!! "+this.root.gamestate.state);
                    if(this.root.gamestate.state === ObjectState.default){
                        if(mesh.name.includes("cabinet") && this.action===0){
                            // this.root.gamestate.state  =  ObjectState.pick;
                            this.action=1;
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));
                        }
                        else if(this.action>0){
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.position.x,this.position.y+.5,this.position.z-1));
                            this.meshRoot.getChildTransformNodes().forEach(childnode => {
                                if(childnode.name==="cabinetleftDoor"){
                                    this.openCloseDoor(childnode,90,true);
                                }
                                if(childnode.name==="cabinetrightDoor")
                                    this.openCloseDoor(childnode,90,false);
                            });
                        }     
                    }
                }
            )
        )
    }
    openCloseDoor(mesh,angle,isleft){
        let val=0;
        if(mesh.rotation.z === BABYLON.Angle.FromDegrees(0).radians())
            val=angle;
        new TWEEN.Tween(mesh.rotation).to({z:isleft?-BABYLON.Angle.FromDegrees(val).radians():BABYLON.Angle.FromDegrees(val).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            if(isleft){
                if(this.action===1){   
                    this.action=2;
                }
                else{
                    this.action=0;  
                    this.root.gamestate.state = ObjectState.default;
                    console.log("$$$$$$$$$$$"+this.action+"   "+this.root.gamestate.state);
                    this.root.setCameraTarget();
                }
            }
            
        }).start();
    }
}