
import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import { randomNumber } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
let showMenu = false;
export default class Item{
        constructor(name,root,meshobject,pos,placedpos,rotation){
            this.name            = name;
            this.root            = root;
            this.meshRoot        = meshobject;
            this.startPosition   = pos;
            this.startRotation   = new BABYLON.Vector3(this.meshRoot.rotation.x,this.meshRoot.rotation.y,this.meshRoot.rotation.z);
            this.startScaling    = new BABYLON.Vector3(this.meshRoot.scaling.x,this.meshRoot.scaling.y,this.meshRoot.scaling.z);
            this.placedPostion   = placedpos;
            if(rotation)
                this.placeRotation =  new BABYLON.Vector3(BABYLON.Angle.FromDegrees(rotation.x).radians(),BABYLON.Angle.FromDegrees(rotation.y).radians(),BABYLON.Angle.FromDegrees(rotation.z).radians());
            this.parent          = this.root.scene.getTransformNodeByID("tabledrawer");
            this.state           = 0;
            this.isPlaced        = false;
            this.pickObject      =false;
            this.setPos();
            this.initAction();
            this.initDrag();
            this.meshRoot.addBehavior(this.pointerDragBehavior);
            this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-50);
            this.label.isVisible=false;
            this.label.isPointerBlocker=true;
            this.useItem=false;
            this.tout=undefined;
            this.tween=undefined;
        }
        setPos(){
            if(this.parent){
                this.meshRoot.parent    = this.parent;
                this.meshRoot.name+="items";
            }
            this.meshRoot.position  = new BABYLON.Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
        }
        removeAction(){
                this.meshRoot.getChildMeshes().forEach(childmesh => {
                    if(childmesh.parent.name.includes("items"))
                        childmesh.actionManager = null;
            });
        }
        initAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.parent.name.includes("items"))
                    this.addAction(childmesh);
            });
        }
        addAction(mesh){
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                    this.label.isVisible=this.root.gamestate.state !== GameState.radial || this.root.gamestate.state !== GameState.menu || this.root.gamestate.state !== GameState.levelstage;
                    this.label.isVisible=this.meshRoot.scaling.x<=1.1;
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                        // console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                            this.pickObject = true;
                            this.label.isVisible=this.root.gamestate.state !== GameState.radial || this.root.gamestate.state !== GameState.menu || this.root.gamestate.state !== GameState.levelstage;
                            this.label.isVisible=this.meshRoot.scaling.x<=1.1;
                        }
                    )
                )
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                                console.log(this.root.gamestate.state+"!! OnPickTrigger!!! ")
                                if(this.name.includes("Blood Pressure")){
                                   this.usebpMachine();
                                }
                                if(this.name.includes("CCPD")){
                                    this.openccpdRecordBook(300);
                                 }
                            
                            if(this.root.gui2D.userExitBtn.isVisible)
                                return;
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
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.hideOutLine();
                                if(this.name.includes("CCPD")){
                                    this.useccpdRecordBook(500);
                                }
                                else if(this.name.includes("Blood Pressure")){
                                    this.showItem();
                                }
                                else{
                                    
                                }
                                this.state=100;
                            };
                            this.root.gui2D.crossBtn._onPointerUp = ()=>{
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.root.gamestate.state = GameState.active;
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
                if( !this.pickObject && this.root.gamestate.state ===  GameState.radial){
                    this.state =0;
                    return;
                }
            });
            this.pointerDragBehavior.onDragObservable.add((event)=>{
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
                
                // if((this.meshRoot.position.x>-140 && this.meshRoot.position.x<90  && this.meshRoot.position.y>30) && this.state>10 || this.isPlaced ){ 
                if((this.root.scene.getMeshByName("tablecollider").visibility>0) && this.state>10 || this.isPlaced ){ 
                    this.placeItem(ANIM_TIME*.3);
                    this.root.itemCount++;
                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,itemcount:this.root.itemCount,level:1}});
                    document.dispatchEvent(custom_event);
                }
                else{
                    new TWEEN.Tween(this.meshRoot).to({position:this.startPosition},ANIM_TIME*.3).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                        this.meshRoot.addBehavior(this.pointerDragBehavior);
                    }).start();
                }
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                
                // console.log(event);
            });
        }
        placeItem(time){
            if(!time)
                time=1000;
            this.state=0;
            this.parent           = this.root.scene.getTransformNodeByID("tablenode");
            this.meshRoot.parent  = this.parent;
            new TWEEN.Tween(this.meshRoot).to({position:this.placedPostion},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.isPlaced=true;
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.meshRoot.removeBehavior(this.pointerDragBehavior);
                // this.removeAction();
                this.label.isVisible=false;
            }).start();
            if(this.placeRotation){
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            }
        }
       showItem(){
            this.label.isVisible=false;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.renderOutline = false;
            });
           let scalAnim=5;
           let newPos = new BABYLON.Vector3(0,0,0);
           let upAng  = -BABYLON.Angle.FromDegrees(90).radians();
           let radius=3;
           if(this.meshRoot.name.includes("bpmachinenode")){
                scalAnim  = 2;
                newPos.z -= 20;
           }
           else if(this.meshRoot.name.includes("DrainBag")){
                scalAnim = 2;
                newPos.z-= 20;
                // upAng=-BABYLON.Angle.FromDegrees(60).radians();
            }
            else if(this.meshRoot.name.includes("ccpdrecordbook")){
                scalAnim = 4.5;
            }
            else if(this.meshRoot.name.includes("SurgicalMask")){
                upAng =0;
            }
            else if(this.meshRoot.name.includes("apd_package_node")){
                upAng = BABYLON.Angle.FromDegrees(90).radians();
                scalAnim  = 2;
            }
            
        if(this.isPlaced){
            // newPos.z-=50;
            // newPos.y-=140;
            radius=2.5;
        }   
        showMenu = false;
        this.meshRoot.removeBehavior(this.pointerDragBehavior);
        new TWEEN.Tween(this.root.camera).to({radius:radius},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x+upAng,y:this.startRotation.y,z:this.startRotation.z+BABYLON.Angle.FromDegrees(360).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        // new TWEEN.Tween(this.meshRoot.position).to({x:0,y:-42+newPos.y,z:-66+newPos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x,y:this.root.camera.target.y-50,z:this.root.camera.target.z-110},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        
        new TWEEN.Tween(this.meshRoot.scaling).to({x:scalAnim,y:scalAnim,z:scalAnim},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
            this.root.gui2D.userExitBtn.isVisible = true;
            this.root.gui2D.userExitBtn._onPointerUp = ()=>{
                showMenu = false;
                this.root.gui2D.drawRadialMenu(false);  
                this.resetItem();
                this.state =0;
            };
        }).start();
      }
      resetItem(){
        this.root.gui2D.userExitBtn.isVisible = false;
        new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(50).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        if(this.isPlaced){
            if(this.placeRotation)
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            else
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();    
            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPostion.x,y:this.placedPostion.y,z:this.placedPostion.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.meshRoot.addBehavior(this.pointerDragBehavior);
                this.root.gamestate.state = GameState.active;
            }).start();
        }
        else{
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:this.startPosition.x,y:this.startPosition.y,z:this.startPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
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
      usebpMachine(){
        console.log(this.state);
        if(this.state===100){
                this.state =101;
                this.tout = setTimeout(() => {
                    clearTimeout(this.tout)
                    let bpvalue =   randomNumber(85,110);
                    let startvalue = {value:0};
                    this.tween = new TWEEN.Tween(startvalue).to({value:bpvalue},2000).easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
                        this.root.setbpRecord(startvalue.value,false);
                    }).onComplete(() => {
                        this.root.setbpRecord(startvalue.value,true);
                        let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"reading_done",level:2}});
                        document.dispatchEvent(custom_event);                                                
                    }).start();
            },100);
        }
        else if(this.state===101){
            this.state =100;
            if(this.tout)
                clearTimeout(this.tout);
            if(this.tween){    
                this.tween.stop();
            }
            this.root.setbpRecord(0,false);
            
        } 
      }
      useccpdRecordBook(anim_time){
          if(this.name.includes("CCPD")){

            // -0.7300000000000004 !!sy!!  0.18999999999999995!! sz !! 3.389999999999972
            this.meshRoot.rotation.x = BABYLON.Angle.FromDegrees(180).radians();
            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(0).radians(),y:0,z:0},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:250,y:-237,z:0},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.meshRoot.parent = null;
                this.parent = this.root.scene.getCameraByName("maincamera");
                this.meshRoot.parent = this.parent;
                this.meshRoot.scaling.set(.003,.003,.003);

                
                this.meshRoot.position = new BABYLON.Vector3(.55,-0.23,1.05);
                this.label.isVisible = false;
                this.meshRoot.removeBehavior(this.pointerDragBehavior);
            }).start();
          }
      }
      openccpdRecordBook(anim_time){
        if(this.state===100){  
            new TWEEN.Tween(this.meshRoot.scaling).to({x:.06,y:.06,z:.06},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:1.57,y:-.07,z:4.639},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.removeAction();
            }).start();
        }
     }

}



