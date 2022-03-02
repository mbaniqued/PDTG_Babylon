import { ObjectState } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class Table{

    constructor(root,meshobject,pos){
        this.name       = meshobject.name;
        this.root       = root;
        this.meshRoot   = meshobject;
        this.position   = pos;
        this.action     = 0;
        this.setPos();
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
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,(object)=> {
                    if(this.root.gamestate.state === ObjectState.default){
                        if(mesh.name==="table3" && this.action===0){
                            // this.root.gamestate.state  =  ObjectState.pick;
                            this.action=1;
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(40).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y+1,this.meshRoot.position.z-.5));
                        }
                        else{
                            if(this.action>0){
                                console.log("!!! in drawer!!!");
                                this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                                    if(childnode.name==="tabledrawer"){
                                        let drawerNode = childnode;  
                                        let val = this.action==1?-100:100; 
                                        this.root.setFocusOnObject(new BABYLON.Vector3(drawerNode.absolutePosition.x,drawerNode.absolutePosition.y+1,drawerNode.absolutePosition.z+(this.action===1?-1.2:1)));
                                        new TWEEN.Tween(drawerNode.position).to({y:drawerNode.position.y+val},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                                            if(this.action==1){   
                                                this.action=2;
                                            }
                                            else{
                                                this.action=0;  
                                                this.root.gamestate.state = ObjectState.default;
                                                this.root.setCameraTarget();
                                            }
                                        }).start();
                                    }
                                });
                            }     
                        }
                    }
                   
                }
            )
          )
    }
    reset(){
        this.action=0;  
        this.root.gamestate.state = ObjectState.default;
    }
    
}