
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
            this.plan.outlineWidth=1;
            

            this.glasssplan = this.plan.clone("windowframeplan");
            this.glasssplan.parent   = this.meshRoot;
            this.glasssplan.scaling.set(55,100,1);
            this.glasssplan.position.set(50,0,-5);
            this.glasssplan.visibility=0;
            this.glasssplan.outlineWidth=1;
            this.glasssplan.outlineWidth =1;
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

            this.glasssplan.isPickable=true;
            this.plan.isPickable=true;
        }
        removeAction(){
            this.root.removeRegisterAction(this.glasssplan);
            this.root.removeRegisterAction(this.plan);
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=>{
                        console.log(this.root.gamestate.state+"   "+mesh.name+"   "+this.state);
                        if(this.root.camera.radius>2.5){
                            this.state =0;
                            this.root.gamestate.state =GameState.default;
                        }
                        this.setLabel();
                        switch(this.state){
                            case 0:
                                    this.root.gamestate.state = GameState.default;
                                    let isPositive=true;
                                    if(this.root.camera.alpha>BABYLON.Angle.FromDegrees(180).radians())
                                        isPositive = false;
                                    console.log("!! setTableFocusAnim!!! "+isPositive+"         "+BABYLON.Angle.FromRadians(this.root.camera.alpha).degrees());
                                    this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x+3,this.meshRoot.position.y+.1,1));
                                    this.root.setCameraAnim(isPositive?.1:359,.1,90,1.5);
                                    this.state=1;
                                    this.root.gamestate.state = GameState.focus;
                                break;
                            case 1:
                                    if(mesh.name.includes("windowframeplan")){
                                        this.root.gamestate.state = GameState.active;
                                        this.closeWindow();
                                        if(this.windowClose){
                                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"window_close",level:0}});
                                            document.dispatchEvent(custom_event);
                                        }
                                    }
                                break;
                        }
                    }
                )
            )
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
        }
        closeWindow(){
            this.windowClose =!this.windowClose;
            this.root.audioManager.playSound(this.root.audioManager.windowSlideSound);
            new TWEEN.Tween(this.meshRoot.position).to({z:this.meshRoot.position.z>0?0:2},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        }
        initMeshOutline(){
            this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                if(childnode.name.includes("windownode")){
                    childnode.getChildMeshes().forEach(childmesh=>{
                        this.root.loaderManager.setPickable(childmesh,1); 
                    });
                }
            });
        }
        setLabel(){
            if(this.root.camera.radius>2.5){
                this.label._children[0].text = "Window";
             }
             else{
                this.label._children[0].text = this.windowClose?"Open Window":"Close Window"; 
             }   
            this.label.isVisible= this.root.gamestate.state ===  GameState.active || this.root.gamestate.state ===  GameState.default ||  this.root.gamestate.state ===  GameState.focus;
            this.label.isPointerBlocker=false;
            this.label._children[0].isPointerBlocker=false;
        }
        updateoutLine(mesh,value){
            if(mesh.outlineWidth>0){
                 if(mesh.name === "glassplane"){
                    this.root.windowbox.renderOutline = value;
                    this.root.windowbox.outlineWidth =1;
                    this.root.windowbox.outlineColor  = BABYLON.Color3.Yellow();
                    console.log("innnnnnn glassplan");
                 }
                 if(mesh.name === "windowframeplan"){
                    this.meshRoot.getChildMeshes().forEach(childmesh => {
                          if(childmesh.name==="windowframe"){
                             childmesh.renderOutline = value;
                             childmesh.outlineWidth  = 1;
                             childmesh.outlineColor  = BABYLON.Color3.Yellow();
                          }
                          else{
                            childmesh.renderOutline = false;
                          }
                      });
                 }
            }
            else{
                mesh.renderOutline = false;
             }   
        }
}