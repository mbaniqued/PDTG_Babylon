
import { GameState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";

let showMenu = false;

export default class Item{
        constructor(name,root,meshobject,pos,placedpos,rotation){
            this.name            = name;
            this.root            = root;
            this.meshRoot        = meshobject;
            this.position        = pos;
            this.startPosition   = pos;

            
            this.startRotation   = new BABYLON.Vector3(this.meshRoot.rotation.x,this.meshRoot.rotation.y,this.meshRoot.rotation.z);
            this.startScaling    = new BABYLON.Vector3(this.meshRoot.scaling.x,this.meshRoot.scaling.y,this.meshRoot.scaling.z);
            this.placedPostion   = placedpos;
            if(rotation){
                this.placeRotation   = rotation;
                this.placeRotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(this.placeRotation.x).radians(),BABYLON.Angle.FromDegrees(this.placeRotation.y).radians(),BABYLON.Angle.FromDegrees(this.placeRotation.z).radians());
            }
            this.parent          = this.root.scene.getTransformNodeByID("tabledrawer");
            this.state           = 0;
            this.isPlaced        = false;
            this.collide=false;
            this.pickObject=false;
            this.setPos();
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.addAction(childmesh);
            });
            this.initDrag();
            this.meshRoot.addBehavior(this.pointerDragBehavior);

            this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-50);
            this.label.isVisible=false;

            this.useItem=false;
            
        }
        setPos(){
            if(this.parent){
                this.meshRoot.parent    = this.parent;
                this.meshRoot.name+="items";
            }
            this.meshRoot.position  = new BABYLON.Vector3(this.position.x,this.position.y,this.position.z);
        }
        addAction(mesh){
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                // mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                //       parameter: this.root.scene.getMeshByName("tablecollider"),},
                //     () => {
                //         if(!this.isPlaced)
                //          this.root.scene.getMeshByName("tablecollider").visibility=1;
                //          this.collide = true;
                //     }
                //   )
                // );
                // mesh.actionManager.registerAction(
                //       new BABYLON.ExecuteCodeAction({trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                //         parameter: this.root.scene.getMeshByName("tablecollider")},
                //       () => {
                //            this.root.scene.getMeshByName("tablecollider").visibility=0;
                //            this.collide = false;
                //       }
                //     )
                // );
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                            console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                            this.pickObject = true;
                            this.label.isVisible=true;
                        }
                    )
                )
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                            console.log(this.root.gamestate.state+"!! OnPickTrigger!!! ")
                            this.label.isVisible=false;
                            showMenu =!showMenu;
                            this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                            this.root.gui2D.drawRadialMenu(showMenu);
                            if(showMenu)
                                this.root.gui2D.resetCamBtn.isVisible=false;
                            this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                                console.log("inspectBtn Button");
                                this.meshRoot.removeBehavior(this.pointerDragBehavior);
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.showItem();
                            };
                            this.root.gui2D.useBtn._onPointerUp = ()=>{
                                this.meshRoot.removeBehavior(this.pointerDragBehavior);
                                console.log("user Button");
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.showItem();
                                if(this.name.includes("Blood Pressure")){

                                    let startvalue = new BABYLON.Vector3(0,0,0);
                                    let endvalue = new BABYLON.Vector3(120,80,70);
                                    new TWEEN.Tween(startvalue).to({x:endvalue.x,y:endvalue.y,z:endvalue.z},2000).easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
                                        this.root.setbpRecord(endvalue.x,endvalue.y,endvalue.z);
                                    }) .onComplete(() => {}).start();
                                }
                            };
                            this.root.gui2D.crossBtn._onPointerUp = ()=>{
                                this.root.gui2D.drawRadialMenu(false);  
                                this.root.gamestate.state = GameState.active;
                                setShowMenu(false);
                                this.hideOutLine();

                                
                            };
                       }     
                    )
                )
        }
        initDrag(){
            this.pointerDragBehavior = new BABYLON.PointerDragBehavior();
            this.pointerDragBehavior.useObjectOrientationForDragging = false;
            this.pointerDragBehavior.onDragStartObservable.add((event)=>{
                console.log( this.pickObject+   "!!! onDragStartObservable 111"+this.root.gamestate.state);
                if( !this.pickObject && this.root.gamestate.state ===  GameState.radial){
                    this.state =0;
                    return;
                }
                console.log("dragStart");
            });
            this.pointerDragBehavior.onDragObservable.add((event)=>{
                console.log("!!! onDragObservable 111"+this.root.gamestate.state);
                if(!this.pickObject &&  this.root.gamestate.state ===  GameState.radial){
                    this.state =0;
                    return;
                }
                if((this.meshRoot.position.x>-140 && this.meshRoot.position.x<90  && this.meshRoot.position.y>30))
                    this.root.scene.getMeshByName("tablecollider").visibility=1;
                else    
                    this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.state++;
                // console.log(event);
            });
            this.pointerDragBehavior.onDragEndObservable.add((event)=>{
                this.label.isVisible=false;
                this.pickObject = false;
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                if((this.meshRoot.position.x>-140 && this.meshRoot.position.x<90  && this.meshRoot.position.y>20) && this.state>10 || this.isPlaced  ){ 
                    this.state=0;
                    this.parent           = this.root.scene.getTransformNodeByID("tablenode");
                    this.meshRoot.parent  = this.parent;
                    new TWEEN.Tween(this.meshRoot).to({position:this.placedPostion},300).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                        this.isPlaced=true;
                        this.root.scene.getMeshByName("tablecollider").visibility=0;
                        console.log("dragEnd");
                    }).start();
                    if(this.placeRotation){
                        
                        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},300).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                            this.meshRoot.removeBehavior(this.pointerDragBehavior);
                        }).start();
                    }
                }
                else{
                    new TWEEN.Tween(this.meshRoot).to({position:this.startPosition},300).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                        this.meshRoot.addBehavior(this.pointerDragBehavior);
                    }).start();
                }
                // console.log(event);
            });
        }
       showItem(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.renderOutline = false;
            });
           let scalAnim=5;
           let newPos = new BABYLON.Vector3(0,0,0);
           let upAng=-BABYLON.Angle.FromDegrees(60).radians();
           if(this.meshRoot.name.includes("bpmachinenode")){
                scalAnim = 1.7;
                newPos.z   -= 50;
           }
           if(this.meshRoot.name.includes("DrainBag")){
                scalAnim = 2;
                newPos.z-= 0;
                upAng=-BABYLON.Angle.FromDegrees(60).radians();
            }
            if(this.meshRoot.name.includes("ccpdrecordbook")){
                scalAnim = 4.5;
            }
            if(this.meshRoot.name.includes("SurgicalMask")){
                upAng =0;
                console.log("in mask")
            }
        if(this.isPlaced){
            newPos.z-=20;
            newPos.y-=140;
        }   
            
        showMenu = false;
        this.meshRoot.removeBehavior(this.pointerDragBehavior);
        new TWEEN.Tween(this.root.camera).to({radius:3},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x+upAng,y:this.startRotation.y,z:this.startRotation.z+BABYLON.Angle.FromDegrees(360).radians()},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.position).to({x:0,y:-42+newPos.y,z:-66+newPos.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.scaling).to({x:scalAnim,y:scalAnim,z:scalAnim},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            this.root.gui2D.userExitBtn.isVisible = true;
            this.root.gui2D.userExitBtn._onPointerUp = ()=>{
                showMenu = false;
                this.root.gui2D.drawRadialMenu(false);  
                this.resetItem();
            };
        }).start();
      }
      resetItem(){
        this.root.gui2D.userExitBtn.isVisible = false;
        if(this.isPlaced){
            if(this.placeRotation)
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            else
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();    
            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPostion.x,y:this.placedPostion.y,z:this.placedPostion.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.meshRoot.addBehavior(this.pointerDragBehavior);
                this.root.gamestate.state = GameState.active;
            }).start();
        }
        else{
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:this.position.x,y:this.position.y,z:this.position.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.meshRoot.addBehavior(this.pointerDragBehavior);
                this.root.gamestate.state = GameState.active;
            }).start();
        }
      }
      hideOutLine(){
        this.meshRoot.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.renderOutline=false;
        });
      }
}
export function setShowMenu(value){
    showMenu = value;
}


