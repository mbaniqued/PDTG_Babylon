
import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
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
            
            this.plan = BABYLON.MeshBuilder.CreatePlane("glassplane",{width:4.2,height:2.5,sideOrientation: BABYLON.Mesh.DOUBLESIDE},this.root.scene);
            const glasssplanMat = new BABYLON.StandardMaterial("glassplaneMat", this.root.scene);
            glasssplanMat.diffuseColor = new BABYLON.Color3.FromInts(255,0,0);  
            this.plan.material = glasssplanMat;
            this.plan.position.set(-7.6,3.45,1);
            this.plan.rotation.y = BABYLON.Angle.FromDegrees(90).radians();
            this.plan.visibility=0;
            

            this.glasssplan = this.plan.clone("windowframeplan");
            this.glasssplan.parent   = this.meshRoot;
            this.glasssplan.scaling.set(55,100,1);
            this.glasssplan.position.set(50,0,-5);
            this.glasssplan.visibility=0;
            this.glasssplan.outlineWidth = 0;
            this.glasssplan.renderOutline=false;
            
            this.initMeshOutline();


            this.label = this.root.gui2D.createRectLabel(this.name,170,36,10,"#FFFFFF",this.meshRoot,0,0);
            this.label._children[0].text = "Window";
            this.label.isVisible=false;

            this.initAction();
            // const windowplan = BABYLON.MeshBuilder.CreatePlane("glassplane",{width:500,height:270,sideOrientation: BABYLON.Mesh.DOUBLESIDE},this.root.scene);

            // this.meshRoot.getChildMeshes().forEach(childmesh => {
            //     if(childmesh.name==="windowframe"){
                    
            //         }
            //     });
        }
        setPos(){
            this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
        }
        initAction(){
            if(!this.glasssplan.actionManager)
                this.addAction(this.glasssplan);
            if(!this.plan.actionManager)
                this.addAction(this.plan);
        }
        removeAction(){
            this.glasssplan.actionManager=null;
            this.plan.actionManager=null;
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=>{
                        console.log(this.root.gamestate.state+"   "+mesh.name+"   "+this.state);
                        if(this.state>0 && this.root.gamestate.state === GameState.default){
                            this.state =0;
                        }
                        this.setLabel();
                        switch(this.state){
                            case 0:
                                this.root.gamestate.state = GameState.default;
                                new TWEEN.Tween(this.root.camera).to({radius:1.5},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                                new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(359).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                                    this.state=1;
                                    this.root.gamestate.state = GameState.focus;
                                }).start();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x+3,this.meshRoot.position.y+.1,1));
                                break;
                            case 1:
                                    this.root.gamestate.state = GameState.active;
                                    this.windowClose =!this.windowClose;
                                    new TWEEN.Tween(this.meshRoot.position).to({z:this.meshRoot.position.z>0?0:2},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                                    if(this.windowClose){
                                        let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this}});
                                        document.dispatchEvent(custom_event);
                                    }
                                break;
                        }
                        
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
             if(this.root.gamestate.state === GameState.default){
                this.label._children[0].text = "Window";
             }
             else{
                this.label._children[0].text = this.windowClose?"Open Window":"Close Window"; 
             }   
            this.label.isVisible=true;
            this.label.isPointerBlocker=true;
            this.label._children[0].isPointerBlocker=true;
        }
}