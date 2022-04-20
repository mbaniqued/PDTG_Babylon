
import { GameState,gamemode,ANIM_TIME,event_objectivecomplete,IS_DRAG,rotateState } from "../scene/MainScene";
import { randomNumber } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
import { Control } from "babylonjs-gui";
let showMenu = false;
export default class Item{
        constructor(name,root,meshobject,pos,placedpos,rotation){
            this.name            = name;
            this.root            = root;
            this.meshRoot        = meshobject;
            this.startPosition   = pos;
            this.tablePosition   = placedpos;
            this.placedPosition   = undefined;
            if(rotation)
                this.placeRotation  =  new BABYLON.Vector3(BABYLON.Angle.FromDegrees(rotation.x).radians(),BABYLON.Angle.FromDegrees(rotation.y).radians(),BABYLON.Angle.FromDegrees(rotation.z).radians());
            this.parent             = this.root.scene.getTransformNodeByID("tabledrawer");
            this.state              = 0;
            this.isPlaced           = false;
            this.pickObject         = false;
            this.setPos();
            this.initDrag();
            this.enableDrag(false);
            this.initAction();
            this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-100);
            this.label.isVisible=false;
            
            this.useItem=false;
            this.tout=undefined;
            this.tween=undefined;
            this.valdiationCheck=0;
            this.valdiationCount=0,this.isValidationDone=[],this.apdValidateType=[],this.isapdTubeValidate=false;
            this.inspectDone=false;
            this.trollyPosition=undefined;
            this.interaction=false;
            this.isDraging=false;
        }
        setPos(){
            
            this.meshRoot.parent = null;
            this.parent          = this.root.scene.getTransformNodeByID("tabledrawer");
            this.meshRoot.parent = this.parent;
            this.meshRoot.name   +="items";
            this.meshRoot.position  = new BABYLON.Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
            this.startRotation      = new BABYLON.Vector3(0,0,0);
            if(this.meshRoot.name.includes("apd_package_node"))
                this.startRotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(180).radians());
            this.meshRoot.rotation  = new BABYLON.Vector3(this.startRotation.x,this.startRotation.y,this.startRotation.z);
            this.startScaling       = new BABYLON.Vector3(this.meshRoot.scaling.x,this.meshRoot.scaling.y,this.meshRoot.scaling.z);
            this.meshRoot.scaling   = new BABYLON.Vector3(1,1,1);
            this.meshRoot.setEnabled(true);
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isVisible  = true;
            });
        }
        setTrollyPosition(position){
            this.trollyPosition = position;
        }
        removeAction(){
            // let mesh = new BABYLON.Mesh();
            this.interaction = false;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.parent.name.includes("items")){
                    this.root.removeRegisterAction(childmesh);
                }
            });
            this.updateoutLine(false);
            this.enableDrag(false);
        }
        initAction(){
            this.interaction = true;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.parent.name.includes("items"))
                        childmesh.isPickable=true;
                // //     if(childmesh.name.includes("validation") || childmesh.name.includes("bptextplan"))    
                // //         childmesh.isPickable=false;
                // //     else  
                if(childmesh.isPickable)
                     this.addAction(childmesh);
            });
        }
        addAction(mesh){
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {

                    
                    this.label.isVisible = (this.root.gamestate.state === GameState.default ||this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) && this.state<100;
                    // console.log(this.pointerDragBehavior.enabled+"        "+this.meshRoot.name+"           "+mesh.isPickable+"     "+this.state+"      "+this.root.gamestate.state);
                    this.updateoutLine(this.label.isVisible);
                    
                    if(this.root.gamestate.state === GameState.inspect){
                        if(mesh.name.includes("highlight_plan") || mesh.name.includes("validation")){
                            this.updateoutLine(false);
                            this.label.isVisible=false;
                            if(this.name.includes("APD Cassette")){
                                if(mesh.name === "apd_highlight_plan")
                                    this.root.onHighlightApdPlan(1,0);
                                else
                                    this.root.onHighlightApdPlan(1,1);    
                            }
                            if(this.name.includes("Connection")){
                                this.root.onhighlightConnectionPlan(1);
                            }
                            if(this.name.includes("Drain Bag"))
                                this.root.onhighlightDrainBagPlan(1);
                        }
                    }
                   
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                    this.label.isVisible=false;
                    this.updateoutLine(false);
                        if(this.root.gamestate.state === GameState.inspect){
                            if(this.name.includes("APD Cassette")){
                                this.root.onHighlightApdPlan(0,0);
                                this.root.onHighlightApdPlan(0,1);
                            }
                            if(this.name.includes("Connection")){
                                this.root.onhighlightConnectionPlan(0);
                            }
                            if(this.name.includes("Drain Bag"))
                                this.root.onhighlightDrainBagPlan(0);
                        }
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                        // console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                            
                            this.label.isVisible= (this.root.gamestate.state === GameState.default ||this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) && this.state<100;
                            this.updateoutLine(this.label.isVisible);
                            
                            if(this.root.gamestate.state === GameState.inspect){
                                this.updateoutLine(false);
                                this.label.isVisible=false;
                                if(mesh.name.includes("highlight_plan") || mesh.name.includes("validation")){
                                    if(this.name.includes("APD Cassette")){
                                        if(mesh.name  === "apd_highlight_plan")
                                            this.root.onHighlightApdPlan(1,0);
                                        else
                                            this.root.onHighlightApdPlan(1,1);    
                                    }
                                    if(this.name.includes("Connection")){
                                       this.root.onhighlightConnectionPlan(1);
                                    }
                                    if(this.name.includes("Drain Bag"))
                                       this.root.onhighlightDrainBagPlan(1);
                                }
                            }
                        }
                    )
                )
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                            this.label.isVisible=false;
                            this.isDraging = false;
                            this.pickObject = true;
                            // console.log("!! OnPickTrigger!! "+this.root.gamestate.state);
                            this.updateoutLine(false);
                            if(this.root.camera.radius>2.5 && this.state<100){
                                this.root.gamestate.state = GameState.focus;
                                this.root.tableObject.setTableFocusAnim();
                                this.root.tableObject.meshRoot.getChildTransformNodes().forEach(childnode=>{
                                    if(childnode.name==="tabledrawer"){
                                        let drawerNode = childnode;  
                                        this.root.setFocusOnObject(new BABYLON.Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.isdrawerOpen?drawerNode.absolutePosition.z-1.5:this.root.tableObject.meshRoot.position.z-.5));
                                    }
                                });
                                this.root.tableObject.state=0;
                                return;
                            }
                            // console.log("!! onpick!! "+this.root.gamestate.state);
                            if(this.root.gamestate.state === GameState.inspect){
                                // console.log(mesh.name);
                                if(mesh.name.includes("highlight_plan") || mesh.name.includes("validation")){
                                    // console.log("!!! validation!!! ");
                                    this.onValidationPick(mesh.name);
                                    return
                                }
                            }
                            if(this.state>=100){ // use item
                                if(this.name.includes("Blood Pressure")){
                                    this.root.gui2D.resetCamBtn.isVisible=false;
                                    this.usebpMachine();
                                }
                                if(this.name.includes("CCPD")){
                                    this.openccpdRecordBook(ANIM_TIME*.5);
                                }
                                return;
                            }
                            if(this.root.gui2D.userExitBtn.isVisible)
                                return;
                            showMenu =!showMenu;
                            this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                            this.root.gui2D.drawRadialMenu(showMenu);
                            this.root.gui2D.resetCamBtn.isVisible=!showMenu;
                            if(showMenu){
                                this.updateUseBtn();       
                            }
                            this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                                if(this.root.gamemode === gamemode.training){
                                    if(this.root.level>2)
                                      this.root.gamestate.state = GameState.inspect; 
                                }
                                else
                                     this.root.gamestate.state = GameState.inspect; 
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.showItem();
                                this.root.hideOutLine(this.meshRoot);
                            };
                            this.root.gui2D.useBtn._onPointerUp = ()=>{
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(false);  
                                this.root.hideOutLine(this.meshRoot);
                                if(this.name.includes("CCPD")){
                                    this.state=100;
                                    this.useccpdRecordBook(ANIM_TIME*.5,true);
                                }
                                else if(this.name.includes("Blood Pressure")){
                                    this.state=100;
                                    this.showItem();
                                }
                                else if(this.name.includes("Mask")){
                                    this.state=100;
                                    this.useMask(ANIM_TIME*.5);
                                    this.root.gui2D.resetCamBtn.isVisible =true;
                                }
                                else if(this.name.includes("Alchohal Wipe")){
                                    this.state=100;
                                    this.root.focusTrolly();
                                    this.meshRoot.setEnabled(false);
                                }
                                else if(this.name.includes("Drain Bag")){
                                    this.root.gamestate.state = GameState.active; 
                                    this.meshRoot.getChildMeshes().forEach(childmesh => {
                                       if(childmesh.id.includes("DrainBagPlasticCover"))
                                            childmesh.isVisible = false;
                                        const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"drainbag_use",level:3}});
                                        document.dispatchEvent(custom_event);
                                    });
                                }
                                this.root.gamestate.state = GameState.active;
                            };
                            this.root.gui2D.crossBtn._onPointerUp = ()=>{
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(showMenu);  
                                this.root.gamestate.state = GameState.active;
                                this.root.hideOutLine(this.meshRoot);
                            };
                       }     
                    )
                )
        }
        initDrag(){
            this.pointerDragBehavior = new BABYLON.PointerDragBehavior();
            this.meshRoot.addBehavior(this.pointerDragBehavior);
            this.pointerDragBehavior.useObjectOrientationForDragging = false;
            this.pointerDragBehavior.updateDragPlane = false;
            this.enableDrag(false);    
            this.pointerDragBehavior.onDragStartObservable.add((event)=>{
                if( (!this.interaction && !this.pickObject)  ||  this.root.gamestate.state ===  GameState.radial || this.root.gamestate.state ===  GameState.inspect){
                    console.log("!!! onDragStartObservable!!! "+this.root.gamestate.state);
                    this.state =0;
                    this.enableDrag(false);
                    console.log("onDragStartObservable");   
                    return;
                }
                if(!this.isDraging && !this.interaction){
                    console.log("!!! 22222222onDragStartObservable!!! "+this.root.gamestate.state);
                    return;
                }
                
                
            });
            this.pointerDragBehavior.onDragObservable.add((event)=>{
                if( (!this.interaction && !this.pickObject)  ||  this.root.gamestate.state ===  GameState.radial || this.root.gamestate.state ===  GameState.inspect){
                    this.state =0;
                    this.enableDrag(false);
                    console.log("onDragObservable");
                    return;
                }
                this.isDraging=this.pointerDragBehavior.dragging;
                if(!this.isDraging && !this.interaction)
                    return;
                this.label.isVisible=false;
                IS_DRAG.value = true;
                
                if(this.meshRoot.position.z<-45)
                   this.meshRoot.position.z=-45;
                if(this.meshRoot.position.y>80)
                   this.meshRoot.position.y=80;
                if((this.meshRoot.position.x>-140 && this.meshRoot.position.x<90  && this.meshRoot.position.y>0 && this.meshRoot.position.z<20))
                    this.root.scene.getMeshByName("tablecollider").visibility=1;
                else    
                    this.root.scene.getMeshByName("tablecollider").visibility=0;

                 if(this.trollyPosition && ((this.root.level >2 && this.root.gamemode === gamemode.training) || this.root.gamemode !== gamemode.training)){   
                    if(this.meshRoot.position.x<-100)
                        new TWEEN.Tween(this.root.camera.target).to({x:-2,y:2,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(()=>{}).start();
                    // else{
                    //         this.root.tableObject.meshRoot.getChildTransformNodes().forEach(childnode=>{
                    //             if(childnode.name==="tabledrawer"){
                    //                 let drawerNode = childnode;  
                    //                 this.root.setFocusOnObject(new BABYLON.Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.isdrawerOpen?drawerNode.absolutePosition.z-1.5:this.root.tableObject.meshRoot.position.z-.5));
                    //             }
                    //         });
                    // }
                        // new TWEEN.Tween(this.root.camera.target).to({x:-.5,y:2,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(()=>{}).start();
                    if(this.meshRoot.name.includes("DrainBag") && this.meshRoot.position.x<-160 && (this.meshRoot.position.y<-10 || this.meshRoot.position.z<130))
                        this.root.scene.getMeshByName("trollyreckcollider").visibility=1;
                    else  
                        this.root.scene.getMeshByName("trollyreckcollider").visibility=0;

                    if(this.meshRoot.name.includes("apd_package_node") && this.meshRoot.position.x<-160 && (this.meshRoot.position.y<-10 || this.meshRoot.position.z<15))
                            this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=1;
                    else
                            this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=0;     
                 }
                // this.state++;
                // console.log(event);
            });
            this.pointerDragBehavior.onDragEndObservable.add((event)=>{
                this.label.isVisible=false;
                this.pickObject = false;
                this.updateoutLine(false);
                let placed=false;
                if(this.isDraging){
                    console.log(this.meshRoot.position +"     "+this.isPlaced);
                    if(this.trollyPosition && (this.meshRoot.name.includes("DrainBag") && this.root.scene.getMeshByName("trollyreckcollider").visibility>0)){
                        if(this.parent !== this.root.scene.getTransformNodeByID("tabledrawer")){
                            placed = true;
                            this.placedPosition = this.trollyPosition;
                            new TWEEN.Tween(this.meshRoot).to({position:this.placedPosition},ANIM_TIME*.3).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                                this.focusTable();
                                this.root.scene.getMeshByName("trollyreckcollider").visibility=0;
                                if(this.root.level ===3){
                                    const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"drain_bag_trolly",level:3}});
                                    document.dispatchEvent(custom_event);
                                }
                                
                            }).start();
                        }
                    }
                    if(this.trollyPosition && (this.meshRoot.name.includes("apd_package_node") && this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility>0)){
                        if(this.parent !== this.root.scene.getTransformNodeByID("tabledrawer")){
                            this.placedPosition = this.trollyPosition;
                            placed = true;
                            new TWEEN.Tween(this.meshRoot).to({position:this.placedPosition},ANIM_TIME*.3).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                                this.focusTable();
                                this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=0;
                                // if(this.root.level ===3)
                                {
                                    this.root.itemCount++;
                                    const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"placed_2item_apdreck",level:3}});
                                    document.dispatchEvent(custom_event);
                                }
                            }).start();
                        }
                    }
                    if((this.root.scene.getMeshByName("tablecollider").visibility>0)){ 
                        placed = true;
                        this.placedPosition = this.tablePosition;
                        // if(this.root.level ===1)
                        {
                            if(!this.isPlaced){
                                this.root.itemCount++;
                                const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"item_placed",itemcount:this.root.itemCount,level:1}});
                                document.dispatchEvent(custom_event);
                            }
                        }
                        this.placeItem(ANIM_TIME*.3,false);
                    }

                    if(!placed){
                        console.log(this.placedPosition+"     "+this.startPosition);    
                        const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
                        new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                            
                        }).start();
                    }
                }
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.root.scene.getMeshByName("trollyreckcollider").visibility=0;
                this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=0;
                IS_DRAG.value = false;
                // console.log(event);
            });
        }
        focusTable(){
            let tout = setTimeout(() => {
                this.root.tableObject.setTableFocusAnim();
                this.root.setFocusOnObject(new BABYLON.Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.meshRoot.position.z-.5));
                clearTimeout(tout)
            }, 500);
        }
        placeItem(time,autoplace){
            if(!time)
               time=ANIM_TIME;
            this.state=0;
            this.isPlaced=true;
            this.label.isVisible=false;
            if(this.parent !== this.root.scene.getTransformNodeByID("tablenode"))
                this.placedPosition = {x:this.meshRoot.position.x,y:this.meshRoot.position.y-(autoplace?0:130),z:this.meshRoot.position.z};
            else    
                this.placedPosition = this.tablePosition;

            this.parent           = this.root.scene.getTransformNodeByID("tablenode");
            this.meshRoot.parent  = null;
            this.meshRoot.parent  = this.parent;
            new TWEEN.Tween(this.placedPosition).to({x:this.tablePosition.x,y:this.tablePosition.y,z:this.tablePosition.z},time).easing(TWEEN.Easing.Quartic.In).onUpdate(()=>{
                this.meshRoot.position = new BABYLON.Vector3(this.placedPosition.x,this.placedPosition.y,this.placedPosition.z);
            }).onComplete(() => {
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.placedPosition = this.tablePosition;
                this.meshRoot.position = new BABYLON.Vector3(this.placedPosition.x,this.placedPosition.y,this.placedPosition.z);
            }).start();
            if(this.placeRotation){
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},time*2).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            }
        }
        // placeItem(time){
        //     if(!time)
        //        time=ANIM_TIME;
        //     this.state=0;
        //     this.isPlaced=true;
        //     this.parent           = this.root.scene.getTransformNodeByID("tablenode");
        //     this.meshRoot.parent  = null;
        //     this.meshRoot.parent  = this.parent;
        //     // console.log("!!!! placeItem!! ");
        //     this.label.isVisible=false;
        //     this.placedPosition = this.tablePosition;
        //     new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
        //         this.root.scene.getMeshByName("tablecollider").visibility=0;
        //     }).start();
        //     if(this.placeRotation){
        //         new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        //     }
        // }
       showItem(){
            let getdrag = this.pointerDragBehavior.enabled;
            // console.log("!!! showItem!! "+getdrag);
            this.enableDrag(false);
            showMenu = false;
            this.root.gui2D.drawRadialMenu(false);  
            this.label.isVisible=false;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.renderOutline = false;
            });
           let scalAnim=1.2;
           let newPos  = new BABYLON.Vector3(0,0,0);
           if(this.parent ===  this.root.scene.getTransformNodeByID("tabledrawer"))
                newPos  = new BABYLON.Vector3(0,-80,-60);
           else{     
                if(this.root.tableObject.isdrawerOpen)
                    newPos = new BABYLON.Vector3(0,-200,-60);
                else    
                    newPos = new BABYLON.Vector3(0,-80,-40);
           }
           let upAng  = -BABYLON.Angle.FromDegrees(60).radians();
           let zAng   =  BABYLON.Angle.FromDegrees(0).radians();
        
        if(this.meshRoot.name.includes("ccpdrecordbook") || this.meshRoot.name.includes("Connection") ||  this.meshRoot.name.includes("Alchohal")){
                scalAnim = 2;
        }
        if(this.meshRoot.name.includes("SurgicalMask")){
                upAng =0;
        }
        if(this.meshRoot.name.includes("apd_package_node")){
            upAng = BABYLON.Angle.FromDegrees(60).radians();
            zAng = -BABYLON.Angle.FromDegrees(180).radians();
        }
        rotateState.value=1;
        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x+upAng,y:this.startRotation.y,z:this.startRotation.z+BABYLON.Angle.FromDegrees(360).radians()+zAng},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x,y:this.root.camera.target.y+newPos.y,z:this.root.camera.target.z+newPos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.scaling).to({x:scalAnim,y:scalAnim,z:scalAnim},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
            this.root.rotateMesh(this.meshRoot);
            this.root.gui2D.userExitBtn.isVisible = true;
            this.root.gui2D.userExitBtn._onPointerUp = ()=>{
                showMenu = false;
                rotateState.value=0;
                this.resetItem(getdrag);
                this.state =0;
            };
        }).start();
      }
      resetItem(setdrag){

        this.root.gui2D.userExitBtn.isVisible = false;
        this.root.gui2D.resetCamBtn.isVisible = true;
        // new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(50).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        // new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        // this.root.gamestate.state = GameState.active;
        // if(this.isPlaced){
            if(this.placeRotation && (this.parent !== this.root.scene.getTransformNodeByID("tabledrawer")))
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            else
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();    
            // new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
            new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                 this.enableDrag(setdrag);
                 this.root.gamestate.state = GameState.active;
            }).start();
        // }
        // else{
        //     new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        //     new TWEEN.Tween(this.meshRoot.position).to({x:this.startPosition.x,y:this.startPosition.y,z:this.startPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        //     new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
        //     }).start();
        // }
        
      }
      usebpMachine(){
        // console.log(this.state);
        if(this.state===100){
                this.root.gui2D.resetCamBtn.isVisible=false;
                this.root.gui2D.userExitBtn.isVisible=true;
                this.state =101;
                this.tout = setTimeout(() => {
                    clearTimeout(this.tout)
                    let bpvalue    =   this.root.bpMonitor.getBpRecord(2)[0]; //randomNumber(85,110);
                    let startvalue = {value:0};
                    let durarion   =  bpvalue*50;
                    this.tween     = new TWEEN.Tween(startvalue).to({value:bpvalue},durarion).easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
                        this.root.setbpRecord(startvalue.value,false);
                    }).onComplete(() => {
                        this.root.setbpRecord(startvalue.value,true);
                        const custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"reading_done",level:2}});
                        document.dispatchEvent(custom_event);                                                
                    }).start();
            },100);
        }
        else if(this.state===101){
            this.state = 100;
            if(this.tout)
                clearTimeout(this.tout);
            if(this.tween){    
                this.tween.stop();
            }
            this.root.setbpRecord(0,false);
            
        } 
      }
      useccpdRecordBook(anim_time,callevent){
          if(this.name.includes("CCPD")){
            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(0).radians(),y:0,z:0},anim_time).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                new TWEEN.Tween(this.meshRoot.position).to({x:this.meshRoot.position.x+150,y:this.meshRoot.position.y-100,z:this.meshRoot.position.z},anim_time).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                    this.meshRoot.parent = null;
                    this.parent = this.root.scene.getCameraByName("maincamera");
                    this.meshRoot.parent = this.parent;
                    this.meshRoot.scaling.set(.003,.003,.003);
                    // this.meshRoot.position = new BABYLON.Vector3(.55,-0.23,1.1);
                    this.meshRoot.position = new BABYLON.Vector3(.75,-0.3,1.1);
                    this.meshRoot.rotation = new BABYLON.Vector3(0,0,0);
                    this.label.isVisible = false;
                    this.enableDrag(false);
                    if(callevent){
                        const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"useccpd",level:2}});
                        document.dispatchEvent(custom_event);
                    }
                }).start();
            }).start();
          }
      }
      openccpdRecordBook(anim_time){
        this.label.isVisible = false;
        let frontpage;
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            // console.log(childmesh.id);
            if(childmesh.id ==="ccpdfront")
                frontpage =childmesh;
        });
        this.root.audioManager.playSound(this.root.audioManager.pageFlipSound);
        if(this.state===100){  
            new TWEEN.Tween(frontpage.rotation).to({y:BABYLON.Angle.FromDegrees(185).radians()},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:.019,y:.019,z:.019},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                this.root.scene.getMeshByName("ccpdplane").isVisible=true;
                this.root.scene.getMeshByName("ccpdplane").isPickable=true;
            }).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:.35,y:.0,z:1.1},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
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
        new TWEEN.Tween(frontpage.rotation).to({y:0},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.scaling).to({x:.003,y:.003,z:.003},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
        }).start();
        new TWEEN.Tween(this.meshRoot.position).to({x:.75,y:-.3,z:1.1},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
        }).start();
     }
     useMask(anim_time){
            // -0.24 !!sy!!  -1.1400000000000008!! sz !! 4.7799999999999425
            anim_time =500;
            // this.meshRoot.parent = null;
            // this.parent = this.root.scene.getCameraByName("maincamera");
            // this.meshRoot.parent = this.parent;
            // this.meshRoot.scaling.set(.01,.01,.01);
            // this.meshRoot.position.set(-.24,-1.14,4.78);
            // this.meshRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());  

            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(-60).radians()},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:4,y:4,z:4},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:this.meshRoot.position.x,y:this.meshRoot.position.y-80,z:this.meshRoot.position.z},anim_time).easing(TWEEN.Easing.Quartic.In).onComplete(() => {
                this.meshRoot.parent = null;
                this.parent = this.root.scene.getCameraByName("maincamera");
                this.meshRoot.parent = this.parent;
                this.meshRoot.scaling = new BABYLON.Vector3(.06,.06,.06); 
                this.meshRoot.position = new BABYLON.Vector3(.06,-1.15,1.05); 
                this.removeAction();
                const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"mask_used",level:2}});
                document.dispatchEvent(custom_event);        
            }).start();
     }
     enableDrag(value){
         if(this.pointerDragBehavior){
            this.pointerDragBehavior.enabled = value;
         }
     }
     updateUseBtn(){
        if(this.name.includes("APD Cassette") || this.name.includes("Connection Shield") || this.name.includes("Drain Bag")){
            this.root.gui2D.useBtn.isVisible = false;
           if(this.name.includes("Drain Bag") && this.valdiationCheck>0)
                this.root.gui2D.useBtn.isVisible = true;
        }
        if(this.name.includes("Blood Pressure") || this.name.includes("Face Mask") || this.name.includes("CCPD Record Book") || this.name.includes("Alchohal Wipe")){
            if(this.root.gamemode === gamemode.training){
                if((this.name.includes("Blood Pressure") || this.name.includes("Face Mask") || this.name.includes("CCPD Record Book")) && this.root.level>1) 
                    this.root.gui2D.useBtn.isVisible = true;
                else if(this.root.level>2)    
                    this.root.gui2D.useBtn.isVisible = true;
                 else
                    this.root.gui2D.useBtn.isVisible = false;   
            }else{
                this.root.gui2D.useBtn.isVisible = true;
            }
        }
     }
     onValidationPick(mesh_name){
        this.root.gui2D.drawValidationMenu(true);
        this.valdiationCheck=0;
        if(this.name.includes("APD Cassette")){
            if(mesh_name ===  "apd_highlight_plan"){
                this.root.gui2D.validationText.text =  "is the APD Cassette Package still valid?";
                this.root.updateApdValidatetion(this.valdiationCheck,0);
            }
            else{
                this.root.gui2D.validationText.text =  "Are all the connection lines intact?";
                this.root.updateApdValidatetion(this.valdiationCheck,1);
            }
        }
        if(this.name.includes("Connection Shield")){
            this.root.gui2D.validationText.text =  "is the Connection Shield still valid?";
            this.root.conectionValidatetion(this.valdiationCheck);
        }
        if(this.name.includes("Drain Bag")){
            this.root.gui2D.validationText.text =  "is the Drain Bag still valid?";
            this.root.updatedrainbagValidatetion(this.valdiationCheck);
        }
        this.root.gui2D.rightBtn._onPointerUp = ()=>{
            this.valdiationCheck=1;
            if(this.name.includes("APD Cassette")){
                if(mesh_name === "apd_highlight_plan")
                    this.root.updateApdValidatetion(this.valdiationCheck,0);
                else
                    this.root.updateApdValidatetion(this.valdiationCheck,1);
            }
            if(this.name.includes("Connection Shield"))
                this.root.conectionValidatetion(this.valdiationCheck);
            if(this.name.includes("Drain Bag"))
                this.root.updatedrainbagValidatetion(this.valdiationCheck);
            this.checkValidation(mesh_name);
            this.root.gui2D.drawValidationMenu(false);
        };
        this.root.gui2D.wrongBtn._onPointerUp = ()=>{
            this.valdiationCheck=2;
            if(this.name.includes("APD Cassette")){
                if(mesh_name === "apd_highlight_plan")
                    this.root.updateApdValidatetion(this.valdiationCheck,0);
                else
                    this.root.updateApdValidatetion(this.valdiationCheck,1);
            }
            if(this.name.includes("Connection Shield"))
                this.root.conectionValidatetion(this.valdiationCheck);
            if(this.name.includes("Drain Bag"))
                this.root.updatedrainbagValidatetion(this.valdiationCheck);
            this.checkValidation(mesh_name);
            this.root.gui2D.drawValidationMenu(false);
        };
        this.root.gui2D.doneBtn._onPointerUp = ()=>{
            if(this.valdiationCheck<1)
                this.valdiationCheck=-1;
            this.checkValidation(mesh_name);
            this.root.gui2D.drawValidationMenu(false);
        };
     }
     checkValidation(mesh_name){
        let custom_event = undefined;
        if(this.name.includes("APD Cassette")){
             if(!this.isValidationDone[this.valdiationCount] && this.valdiationCheck>0){
                this.isValidationDone[this.valdiationCount]=true;
                this.valdiationCount++;
             }
            if(mesh_name === "apd_highlight_plan"){
                this.apdValidateType[0]=this.valdiationCheck;
                this.root.updateApdValidatetion(this.valdiationCheck,0);
            }
            else{
                 this.apdValidateType[1]=this.valdiationCheck;
                this.root.updateApdValidatetion(this.valdiationCheck,1);
            }
            if(this.valdiationCount>=2)
                custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"apd_validation",level:3}});
        }
        if(this.name.includes("Connection Shield")){
            this.root.conectionValidatetion(this.valdiationCheck);
            if(this.valdiationCheck>0)
               custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"connection_validation",level:3}});
        }
        if(this.name.includes("Drain Bag")){
            this.root.updatedrainbagValidatetion(this.valdiationCheck);
            if(this.valdiationCheck>0)
               custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"drainbag_validation",level:3}});
        }
        if(custom_event)
           document.dispatchEvent(custom_event);
     }
     updateoutLine(value){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(childmesh.name.includes("highlight_plan"))
                childmesh.renderOutline = false;
            else
                childmesh.renderOutline = value;
             if(childmesh.name.includes("ccpd")){
                childmesh.outlineWidth=.1;
             }
             if(childmesh.parent.name.includes("DrainBag")){
                if(childmesh.id === "DrainBagPlasticCover" || childmesh.id === "DrainBagA_2"){
                    childmesh.outlineWidth  = 2;
                }
                else{
                    childmesh.renderOutline = false;   
                }
             }
             if(childmesh.parent.name.includes("apd_package_node")){
                    if(childmesh.name.includes("APDCassetteRevisedWithPackaging2.001_primitive42") || childmesh.name.includes("APDCassetteRevisedWithPackaging2.001_primitive12")){
                        childmesh.outlineWidth  = 5;
                    }
                    else{
                        childmesh.renderOutline = false;   
                    }
             }
        });
    }
    reset(){
        // console.log(this.name);
        this.parent=null;
        this.meshRoot.parent = null;
        this.placedPosition = undefined;
        this.placeRotation=undefined;
        this.trollyPosition=undefined;
        this.tablePosition=undefined;
        this.startPosition=undefined;
        this.meshRoot.scaling   = new BABYLON.Vector3(1,1,1);
        this.removeAction();
        this.pointerDragBehavior.releaseDrag();
        this.pointerDragBehavior.detach();
        this.pointerDragBehavior = null;
    }
}
