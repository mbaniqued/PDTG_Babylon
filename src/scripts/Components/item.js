
import { GameState,gamemode,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import { randomNumber } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
let showMenu = false;
export default class Item{
        constructor(name,root,meshobject,pos,placedpos,rotation){
            this.name            = name;
            this.root            = root;
            this.meshRoot        = meshobject;
            this.startPosition   = pos;
            this.startRotation   = new BABYLON.Vector3(0,0,0);
            if(this.meshRoot.name.includes("apd_package_node"))
                this.startRotation   = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(180).radians());
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
            this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-100);
            this.label.isVisible=false;
            this.label.isPointerBlocker=false;
            this.useItem=false;
            this.tout=undefined;
            this.tween=undefined;
            this.valdiationCheck=0;
        }
        setPos(){
            if(this.parent){
                this.meshRoot.parent    = this.parent;
                this.meshRoot.name+="items";
            }
            this.meshRoot.position  = new BABYLON.Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
            if(this.meshRoot.name.includes("apd_package_node")){
                this.meshRoot.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(180).radians());
            }
            else   
                this.meshRoot.rotation  = new BABYLON.Vector3(this.startRotation.x,this.startRotation.y,this.startRotation.z);
                this.meshRoot.scaling   = new BABYLON.Vector3(1,1,1);
        }
        removeAction(){
                this.meshRoot.getChildMeshes().forEach(childmesh => {
                    if(childmesh.parent.name.includes("items"))
                        childmesh.actionManager = null;
            });
            this.enableDrag(false);
        }
        initAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.parent.name.includes("items")){
                    childmesh.setEnabled(true);
                    this.addAction(childmesh);
                }
            });
        }
        addAction(mesh){
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {

                    console.log(mesh.name);
                    this.label.isVisible= (this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) && this.state<100;
                    if(mesh.name ==="apddate_plan_hightlight"){
                        this.root.onPickdateHighlightPlan(1);
                    }
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
                    this.root.onPickdateHighlightPlan(0);
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                        // console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                            this.pickObject = true;
                            this.label.isVisible= (this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) && this.state<100;
                        }
                    )
                )
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                            console.log(this.root.gamestate.state+"!! OnPickTrigger!!! "+showMenu)
                            if(mesh.name ==="apddate_plan_hightlight"){
                                this.root.gui2D.drawValidationMenu(true);
                                this.valdiationCheck=0;
                                this.root.updateApdValidatetion(this.valdiationCheck);
                                this.root.gui2D.rightBtn._onPointerUp = ()=>{
                                    this.root.gui2D.validationText.text =  "Are all the connection lines intact?";
                                    this.valdiationCheck=1;
                                    this.root.updateApdValidatetion(this.valdiationCheck);
                                };
                                this.root.gui2D.wrongBtn._onPointerUp = ()=>{
                                    this.valdiationCheck=2;
                                    this.root.updateApdValidatetion(this.valdiationCheck);
                                    
                                };
                                this.root.gui2D.doneBtn._onPointerUp = ()=>{
                                    
                                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"apd_validation",level:3}});
                                    document.dispatchEvent(custom_event);
                                    this.root.gui2D.drawValidationMenu(false);
                                    
                                };


                            }
                            if(this.root.camera.radius>2.5){
                                this.root.gamestate.state = GameState.focus;
                                this.root.tableObject.setTableFocusAnim();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.position.y,this.root.tableObject.meshRoot.position.z-.5));
                                this.root.tableObject.state=0;
                                return;
                            }
                            if(this.state>=100){
                                if(this.name.includes("Blood Pressure")){
                                    this.usebpMachine();
                                    }
                                if(this.name.includes("CCPD")){
                                    this.openccpdRecordBook(300);
                                }
                                return;
                            }
                            if(this.root.gui2D.userExitBtn.isVisible)
                                return;
                            this.label.isVisible=false;
                            showMenu =!showMenu;
                            this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                            this.root.gui2D.drawRadialMenu(showMenu);
                            this.root.gui2D.resetCamBtn.isVisible=this.root.gamestate.state!==GameState.radial;
                            if(showMenu){
                                if(this.root.gamemode === gamemode.training && this.root.level ===3){
                                    if(this.name.includes("APD Cassette"))
                                        this.root.gui2D.useBtn.isVisible = false;
                                }
                            }
                            this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                                console.log("inspectBtn Button");
                                this.enableDrag(false);
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.showItem();
                            };
                            this.root.gui2D.useBtn._onPointerUp = ()=>{
                                showMenu = false;
                                this.enableDrag(false);
                                this.root.gui2D.drawRadialMenu(false);  
                                this.root.hideOutLine(this.meshRoot);
                                if(this.name.includes("CCPD")){
                                    this.useccpdRecordBook(500);
                                }
                                else if(this.name.includes("Blood Pressure")){
                                    this.showItem();
                                }
                                else if(this.name.includes("Mask")){
                                    this.useMask(500);
                                }
                                else if(this.name.includes("Alchohal Wipe")){
                                    console.log("use  Alcohol_Wipe ");
                                    this.root.focusTrolly();
                                    this.meshRoot.setEnabled(false);
                                }
                                else{
                                    
                                }
                                this.state=100;
                            };
                            this.root.gui2D.crossBtn._onPointerUp = ()=>{
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.root.gamestate.state = GameState.active;
                                this.root.hideOutLine(this.meshRoot);
                            };
                       }     
                    )
                )
        }
        initDrag(){
            this.pointerDragBehavior = new BABYLON.PointerDragBehavior();
            this.pointerDragBehavior.useObjectOrientationForDragging = false;
            this.pointerDragBehavior.updateDragPlane = false;
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
                        this.enableDrag(true);
                    }).start();
                }
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                
                // console.log(event);
            });
        }
        placeItem(time){
            if(!time)
               time=ANIM_TIME;
            this.state=0;
            this.parent           = this.root.scene.getTransformNodeByID("tablenode");
            this.meshRoot.parent  = this.parent;
            new TWEEN.Tween(this.meshRoot).to({position:this.placedPostion},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.isPlaced=true;
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.enableDrag(false);
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
           let scalAnim=4.3;
           let newPos = new BABYLON.Vector3(0,-25,-60);
           let upAng  = -BABYLON.Angle.FromDegrees(60).radians();
           let zAng   = BABYLON.Angle.FromDegrees(0).radians();
           if(this.meshRoot.name.includes("bpmachinenode")){
                scalAnim  = 1.8;
                upAng  = -BABYLON.Angle.FromDegrees(45).radians();
           }
           else if(this.meshRoot.name.includes("DrainBag")){
                scalAnim = 1.8;
                // upAng=-BABYLON.Angle.FromDegrees(60).radians();
            }
            else if(this.meshRoot.name.includes("ccpdrecordbook")){
                scalAnim = 3.3;
            }
            else if(this.meshRoot.name.includes("SurgicalMask")){
                upAng =0;
            }
            else if(this.meshRoot.name.includes("apd_package_node")){
                upAng = BABYLON.Angle.FromDegrees(60).radians();
                scalAnim  = 1.8;
                if(this.root.gamemode === gamemode.training && this.root.level ===3)
                    zAng   = -BABYLON.Angle.FromDegrees(180).radians();
            }
            
        if(this.isPlaced){
            // console.log(this.root.camera.radius)
            newPos = new BABYLON.Vector3(0,-80,-40)
            if(this.root.camera.radius<3)
                scalAnim  *= .75;
        }   
        showMenu = false;
        this.enableDrag(false);
        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x+upAng,y:this.startRotation.y,z:this.startRotation.z+BABYLON.Angle.FromDegrees(360).radians()+zAng},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x,y:this.root.camera.target.y+newPos.y,z:this.root.camera.target.z+newPos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
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
        // new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(50).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        // new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        if(this.isPlaced){
            if(this.placeRotation)
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            else
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();    
            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPostion.x,y:this.placedPostion.y,z:this.placedPostion.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.enableDrag(true);
                this.root.gamestate.state = GameState.active;
            }).start();
        }
        else{
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:this.startPosition.x,y:this.startPosition.y,z:this.startPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.enableDrag(true);
                this.root.gamestate.state = GameState.active;
            }).start();
        }
      }
      usebpMachine(){
        console.log(this.state);
        if(this.state===100){
                this.root.gui2D.resetCamBtn.isVisible=false;
                this.root.gui2D.userExitBtn.isVisible=true;
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
            // 210 !!sy!!  -225!! sz !! -42
            // 199 !!sy!!  -239!! sz !! -50
            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(-75).radians(),y:0,z:0},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                new TWEEN.Tween(this.meshRoot.position).to({x:220,y:-239,z:-50},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                    this.meshRoot.parent = null;
                    this.parent = this.root.scene.getCameraByName("maincamera");
                    this.meshRoot.parent = this.parent;
                    this.meshRoot.scaling.set(.003,.003,.003);
                    this.meshRoot.position = new BABYLON.Vector3(.55,-0.23,1.1);
                    this.meshRoot.rotation = new BABYLON.Vector3(0,0,0);
                    this.label.isVisible = false;
                    this.enableDrag(false);
                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"useccpd",level:2}});
                    document.dispatchEvent(custom_event);
                }).start();
            }).start();
            
          }
      }
      openccpdRecordBook(anim_time){
        this.label.isVisible = false;
        let frontpage;
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            console.log(childmesh.id);
            if(childmesh.id ==="ccpdfront")
                frontpage =childmesh;
        });
        if(this.state===100){  
            new TWEEN.Tween(frontpage.rotation).to({y:BABYLON.Angle.FromDegrees(185).radians()},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:.013,y:.013,z:.013},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.root.scene.getMeshByName("ccpdplane").isVisible=true;
                this.root.scene.getMeshByName("ccpdplane").isPickable=true;
            }).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:.5,y:.0,z:1.1},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                this.removeAction();
            }).start();
        }
     }
     closeccpdRecordBook(anim_time){
        this.initAction();
        this.label.isVisible = false;
        let frontpage;
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(childmesh.id ==="ccpdfront")
                frontpage =childmesh;
        });
        new TWEEN.Tween(frontpage.rotation).to({y:0},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.scaling).to({x:.003,y:.003,z:.003},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
        }).start();
        new TWEEN.Tween(this.meshRoot.position).to({x:.55,y:-.23,z:1.1},anim_time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
        }).start();
     }
     useMask(anim_time){
            // -0.24 !!sy!!  -1.1400000000000008!! sz !! 4.7799999999999425
            this.meshRoot.parent = null;
            this.parent = this.root.scene.getCameraByName("maincamera");
            this.meshRoot.parent = this.parent;
            this.meshRoot.scaling.set(.01,.01,.01);
            this.meshRoot.position.set(-.24,-1.14,4.78);
            this.meshRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());  
            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(-60).radians()},anim_time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:.06,y:.06,z:.06},anim_time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            }).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:.06,y:-1.14,z:1.05},anim_time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                this.removeAction();
                let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"mask_used",level:2}});
                document.dispatchEvent(custom_event);        
            }).start();
     }
     enableDrag(value){
         if(this.pointerDragBehavior)
            this.pointerDragBehavior.enabled = value;

            
     }

}



