
import { ObjectState } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";
export default class WindowFrame{
        constructor(root,meshobject,pos){
            this.name       = meshobject.name;
            this.root       = root;
            this.meshRoot   = meshobject;
            this.position   = pos;
            this.action     = 0;
            this.setPos();
            // this.mesh = new BABYLON.Mesh();
            
            const plan = BABYLON.MeshBuilder.CreatePlane("glassplane",{width:4.2,height:2.5,sideOrientation: BABYLON.Mesh.DOUBLESIDE},this.root.scene);
            const glasssplanMat = new BABYLON.StandardMaterial("glassplaneMat", this.root.scene);
            glasssplanMat.diffuseColor = new BABYLON.Color3.FromInts(255,0,0);  
            plan.material = glasssplanMat;
            plan.position.set(-7.6,3.45,1);
            plan.rotation.y = BABYLON.Angle.FromDegrees(90).radians();
            plan.visibility=0;
            this.addAction(plan);

            const glasssplan = plan.clone("windowframeplan");
            glasssplan.parent   = this.meshRoot;
            glasssplan.scaling.set(55,100,1);
            glasssplan.visibility=1;
            glasssplan.position.set(50,0,-5);
            glasssplan.visibility=0;
            this.addAction(glasssplan);
            // const windowplan = BABYLON.MeshBuilder.CreatePlane("glassplane",{width:500,height:270,sideOrientation: BABYLON.Mesh.DOUBLESIDE},this.root.scene);

            // this.meshRoot.getChildMeshes().forEach(childmesh => {
            //     if(childmesh.name==="windowframe"){
                    
            //         }
            //     });
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                        console.log(this.root.gamestate.state+" "+mesh.name);
                        if(this.root.gamestate.state === ObjectState.default){
                             if(this.action === 0){
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(360).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x+3,this.meshRoot.position.y-.5,1));
                                this.action =1;
                             }else if(this.action ===1 && mesh.name =="windowframeplan"){
                                 console.log(this.meshRoot.position.z)
                                if(this.meshRoot.position.z>0)
                                    new TWEEN.Tween(this.meshRoot.position).to({z:0},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                                        if(this.action>0){
                                            this.reset();
                                            this.root.setCameraTarget();
                                        }

                                    }).start();
                                 else   
                                    new TWEEN.Tween(this.meshRoot.position).to({z:2},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                                        if(this.action>0){
                                            this.reset();
                                            this.root.setCameraTarget();
                                        }
                                    }).start();
                             }
                        }
                      
                    }
                )
            )
        }
        reset(){
            this.root.gamestate.state =  ObjectState.default;
            this.action =0;
        }
}