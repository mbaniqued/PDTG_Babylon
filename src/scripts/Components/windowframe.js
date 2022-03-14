
import { GameState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
export default class WindowFrame{
        constructor(root,meshobject,pos){
            this.name           = meshobject.name;
            this.root           = root;
            this.meshRoot       = meshobject;
            this.position       = pos;
            this.state          = 0;
            this.windowClose    = false;
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
            glasssplan.position.set(50,0,-5);
            glasssplan.visibility=0;
            glasssplan.outlineWidth = 0;
            glasssplan.renderOutline=false;
            this.addAction(glasssplan);
            this.initMeshOutline();


            this.label = this.root.gui2D.createRectLabel(this.name,170,36,10,"#FFFFFF",this.meshRoot,-150,0);
            this.label._children[0].text = "Window";
            this.label.isVisible=false;


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
                        console.log(this.root.gamestate.state+" "+mesh.name+"   "+this.state);
                        if(this.state>0 && this.root.gamestate.state === GameState.default)
                            this.state =0;
                        switch(this.state){
                            case 0:
                                this.root.gamestate.state = GameState.default;
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(359.9).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                                    this.state=1;
                                    this.root.gamestate.state = GameState.focus;
                                }).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x+3,this.meshRoot.position.y-.5,1));
                                break;
                            case 1:
                                    this.root.gamestate.state = GameState.active;
                                    this.windowClose =!this.windowClose;
                                    new TWEEN.Tween(this.meshRoot.position).to({z:this.meshRoot.position.z>0?0:2},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                                break;
                        }
                        this.setLabel();
                    }
                )
            )
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
        }
        initMeshOutline(){
            this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                    if(childnode.name.includes("windownode")){
                        childnode.getChildMeshes().forEach(childmesh=>{
                            this.root.loaderManager.setPickable(childmesh,.0001); 
                        });
                    }
            });
        }
        setLabel(){
            if(this.state ===0)
            this.label._children[0].text = "Window";
            else if(this.state===1){
                this.label._children[0].text = this.windowClose?"Open Window":"Close Window"; 
            }
            this.label.isVisible=true;
        }
}