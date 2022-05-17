// https://www.babylonjs-playground.com/#NNT3VZ
// https://www.babylonjs-playground.com/#UES9PH#0
import { GameState,gamemode,ANIM_TIME,event_objectivecomplete,IS_DRAG,rotateState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
import {Vector3,Angle,ActionManager,ExecuteCodeAction,PointerDragBehavior } from 'babylonjs';
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
                this.placeRotation  =  new Vector3(Angle.FromDegrees(rotation.x).radians(),Angle.FromDegrees(rotation.y).radians(),Angle.FromDegrees(rotation.z).radians());
            this.parent             =  this.root.scene.getTransformNodeByID("tabledrawer");
            this.state              = 0;
            this.isPlaced           = false;
            this.pickObject         = false;
            this.setPos();
            this.initDrag();
            this.enableDrag(false);
            this.initAction();
            this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-100);
            this.label.isVisible=false;
            
            this.tout=undefined;
            this.tween=undefined;
            this.valdiationCheck=-1;
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
            this.meshRoot.position  = new Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
            this.startRotation      = new Vector3(0,0,0);
            if(this.meshRoot.name.includes("apd_package_node"))
                this.startRotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(180).radians());
            this.meshRoot.rotation  = new Vector3(this.startRotation.x,this.startRotation.y,this.startRotation.z);
            this.startScaling       = new Vector3(this.meshRoot.scaling.x,this.meshRoot.scaling.y,this.meshRoot.scaling.z);
            this.meshRoot.scaling   = new Vector3(1,1,1);
            this.meshRoot.setEnabled(true);
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isVisible  = true;
                childmesh.layerMask=1;
            });
        }
        setTrollyPosition(position){
            this.trollyPosition = position;
        }
        removeAction(){
            // let mesh = new Mesh();
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
                mesh.actionManager = new ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
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
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
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
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (object)=> {
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
                mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {
                            this.label.isVisible=false;
                            this.isDraging = false;
                            this.pickObject = true;
                            console.log("!!! OnPickTrigger!!! "+this.root.gamestate.state+"        "+rotateState.value+"      "+this.pointerDragBehavior.enabled);
                            this.updateoutLine(false);
                            if(this.root.camera.radius>2.51 && this.state<100){
                                this.root.gamestate.state = GameState.focus;
                                this.root.tableObject.setTableFocusAnim();
                                this.root.setFocusOnObject(new Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.meshRoot.position.z-.5));
                                this.root.tableObject.state=0;
                                return;
                            }
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
                                    this.showItem(true);
                                    rotateState.value=0;
                                }
                                else if(this.name.includes("Mask")){
                                    this.state=100;
                                    this.useMask(ANIM_TIME*.5);
                                    rotateState.value=0;
                                }
                                else if(this.name.includes("Alcohol Wipe")){
                                    this.state=100;
                                    this.root.setFocusOnObject(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z));
                                    this.root.setCameraAnim(270,270,45,2);
                                    const tout = setTimeout(() => {
                                        this.root.wipeAlcohal.usealcohalwipe=true;
                                        this.root.wipeAlcohal.alocohalwipe.isVisible = true;
                                        this.root.wipeAlcohal.reset();
                                        clearTimeout(tout); 
                                    },ANIM_TIME);
                                    this.meshRoot.setEnabled(false);
                                }
                                else if(this.name.includes("Drain Bag")){
                                    this.root.gamestate.state = GameState.active; 
                                    this.root.scene.getMeshByName("validation_drainbag_plan").visibility = 0; 
                                    this.meshRoot.getChildMeshes().forEach(childmesh => {
                                    if(childmesh.id.includes("DrainBagPlasticCover"))
                                            childmesh.isVisible = false;
                                        const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"drainbag_use",level:3}});
                                        document.dispatchEvent(custom_event);
                                    });
                                }
                                this.root.gamestate.state = GameState.active;
                                this.root.gui2D.resetCamBtn.isVisible =true;
                            };
                            this.root.gui2D.crossBtn._onPointerUp = ()=>{
                                showMenu = false;
                                this.root.gui2D.drawRadialMenu(showMenu);  
                                this.root.hideOutLine(this.meshRoot);
                                this.root.gamestate.state = GameState.active;
                            };
                       }     
                    )
                )
        }
        initDrag(){
            this.pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal:new Vector3(0,0,1)});
            this.meshRoot.addBehavior(this.pointerDragBehavior);
            this.pointerDragBehavior.useObjectOrientationForDragging = false;
            this.pointerDragBehavior.updateDragPlane=false;
            this.pointerDragBehavior.dragDeltaRatio =1;
            // this.pointerDragBehavior.moveAttached = false;
            this.enableDrag(false);    
            this.pointerDragBehavior.onDragStartObservable.add((event)=>{
                console.log("!!! cabinet item !!! "+this.root.gamestate.state+"      "+this.isDraging);
                if((!this.interaction && !this.pickObject)  && (this.root.gamestate.state ===  GameState.radial || this.root.gamestate.state ===  GameState.inspect)){
                    // console.log("!!! onDragStartObservable!!! "+this.root.gamestate.state);
                    this.state =0;
                    // this.enableDrag(false);
                    return;
                }
                if(!this.isDraging && !this.interaction){
                    return;
                }
                
            });
            this.pointerDragBehavior.onDragObservable.add((event)=>{
                if( (!this.interaction && !this.pickObject)  &&  this.root.gamestate.state ===  GameState.radial || this.root.gamestate.state ===  GameState.inspect){
                    this.state =0;
                    // this.enableDrag(false);
                    // console.log("onDragObservable");
                    return;
                }
                this.isDraging=this.pointerDragBehavior.dragging;
                if(!this.isDraging && !this.interaction)
                    return;
                this.label.isVisible=false;
                IS_DRAG.value = true;
                // this.pointerDragBehavior.attachedNode.position.x +=event.delta.x*100;
                // this.pointerDragBehavior.attachedNode.position.z -=event.delta.y*100;
                // this.meshRoot.position.z -=event.delta.z*100;
                // console.log(event.delta);
                // console.log(this.meshRoot.position);
                if(this.meshRoot.position.x>=-140 && this.root.camera.target.x !== this.root.tableObject.meshRoot.position.x){
                    const posZ =  this.root.tableObject.isdrawerOpen? this.root.tableObject.drawerNode.absolutePosition.z:this.root.tableObject.meshRoot.position.z;
                    this.root.setFocusOnObjectLinear(new Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,posZ));
                }
                if((this.meshRoot.position.x>-140 && this.meshRoot.position.x<90 && this.meshRoot.position.z<-10)){
                     this.root.scene.getMeshByName("tablecollider").visibility=1;
                }
                else    
                    this.root.scene.getMeshByName("tablecollider").visibility=0;

                if(this.trollyPosition && ((this.root.level >2 && this.root.gamemode === gamemode.training) || this.root.gamemode !== gamemode.training)){   
                    if(this.meshRoot.name.includes("DrainBag") && this.meshRoot.position.x<-150  && this.meshRoot.position.z>50){
                        if(this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility===0 && this.root.camera.target.x !== this.root.trollyObject.meshRoot.position.x)
                            this.root.setFocusOnObjectLinear(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z-1));
                        this.root.scene.getMeshByName("trollyreckcollider").visibility=1;
                    }
                    else  
                        this.root.scene.getMeshByName("trollyreckcollider").visibility=0;

                    if(this.meshRoot.name.includes("apd_package_node") && this.meshRoot.position.x<-150 && this.meshRoot.position.z>-20 && this.meshRoot.position.z<50){
                        
                        if(this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility===0 && this.root.camera.target.x !== this.root.trollyObject.meshRoot.position.x)
                            this.root.setFocusOnObjectLinear(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z-1));
                            this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=1;
                    }
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
                  if(this.trollyPosition && (this.meshRoot.name.includes("DrainBag") && this.root.scene.getMeshByName("trollyreckcollider").visibility>0)){
                        if(this.parent !== this.root.scene.getTransformNodeByID("tabledrawer")){
                            placed = true;
                            this.placedPosition = this.trollyPosition;
                            new TWEEN.Tween(this.meshRoot).to({position:this.placedPosition},ANIM_TIME*.3).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
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
                            new TWEEN.Tween(this.meshRoot).to({position:this.placedPosition},ANIM_TIME*.3).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                                this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=0;
                                // if(this.root.level ===3)
                                    this.root.itemCount++;
                                    const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"placed_2item_apdreck",level:3}});
                                    document.dispatchEvent(custom_event);
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
                        console.log(event);
                        this.placeItem(ANIM_TIME*.25,false);
                    }
                    if(!placed){
                        // console.log(this.placedPosition+"     "+this.startPosition);    
                        const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
                        new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                        }).start();
                    }
                    if(this.root.camera.target.x!= this.root.tableObject.meshRoot.position.x){
                        setTimeout(() => {
                            const posZ =  this.root.tableObject.isdrawerOpen?this.root.tableObject.meshRoot.position.z-1.5:this.root.tableObject.meshRoot.position.z-.5;
                            this.root.setFocusOnObjectLinear(new Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,posZ));
                        }, 1000);
                    }
                    
                }
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.root.scene.getMeshByName("trollyreckcollider").visibility=0;
                this.root.scene.getMeshByName("apdCassetteTrolly_collider").visibility=0;
                IS_DRAG.value = false;
                // console.log(event);
            });
        }
        placeItem(time,autoplace){
            // console.log(this.meshRoot.position);
            const tmppos =  new Vector3(-this.meshRoot.position.x,this.meshRoot.position.y*.8,-this.meshRoot.position.z); 
            if(!time)
               time=ANIM_TIME;
            this.state=0;
            this.isPlaced=true;
            this.label.isVisible=false;
            if(!autoplace && this.parent !== this.root.scene.getTransformNodeByID("tablenode")){
                this.meshRoot.position = this.meshRoot.position.normalize();
                this.meshRoot.position.addInPlace(tmppos.scale(-1));
                this.placedPosition    = {x:this.meshRoot.position.x,y:this.meshRoot.position.y-50,z:this.meshRoot.position.z+30};
            }else{
                this.placedPosition = this.tablePosition;
            }
            this.parent            = this.root.scene.getTransformNodeByID("tablenode");
            this.meshRoot.parent   = null;
            this.meshRoot.parent   = this.parent;
            new TWEEN.Tween(this.placedPosition).to({x:this.tablePosition.x,y:this.tablePosition.y,z:this.tablePosition.z},time).easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
                this.meshRoot.position = new Vector3(this.placedPosition.x,this.placedPosition.y,this.placedPosition.z);
            }) .onComplete(() => {
                this.root.scene.getMeshByName("tablecollider").visibility=0;
                this.placedPosition = this.tablePosition;
                
            }).start();
            if(this.placeRotation){
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},time*2).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
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
        //     new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
        //         this.root.scene.getMeshByName("tablecollider").visibility=0;
        //     }).start();
        //     if(this.placeRotation){
        //         new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
        //     }
        // }
       showItem(isbpuse){
            let getdrag = this.pointerDragBehavior.enabled;
            this.enableDrag(false);
            showMenu = false;
            this.root.gui2D.drawRadialMenu(false);  
            this.label.isVisible=false;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.renderOutline = false;
            });
           let scalAnim=1.5;
           let upAng  = -Angle.FromDegrees(60).radians();
           let zAng   =  Angle.FromDegrees(0).radians();
           let newPos  = new Vector3(0,0,0);
           if(this.parent ===  this.root.scene.getTransformNodeByID("tabledrawer"))
                newPos  = new Vector3(0,-80,-60);
           else{     
                if(this.root.tableObject.isdrawerOpen)
                    newPos = new Vector3(0,-200,-60);
                else
                    newPos = new Vector3(0,-80,-40);
             
           }
        if(this.name.includes("Blood Pressure")){
            if(this.root.ccpdRecordBook.meshRoot.position.z == 1.1)
                newPos.x-=40;                
            if(isbpuse){ 
                newPos.y -=10;
                newPos.z +=40;
                upAng  =  -Angle.FromDegrees(10).radians();
            }
        }
        if(this.meshRoot.name.includes("ccpdrecordbook") || this.meshRoot.name.includes("Connection") ||  this.meshRoot.name.includes("Alcohol")){
                scalAnim = 2.5;
        }
        if(this.meshRoot.name.includes("SurgicalMask")){
                upAng =0;
        }
        if(this.meshRoot.name.includes("apd_package_node")){
            upAng =  Angle.FromDegrees(60).radians();
            zAng  = -Angle.FromDegrees(180).radians();
        }
        if(this.name.includes("APD Cassette")){
            this.root.updateApdValidatetion(this.apdValidateType[0],0);
            this.root.updateApdValidatetion(this.apdValidateType[1],1);
        }
        if(this.name.includes("Connection Shield")){
            this.root.conectionValidatetion(this.valdiationCheck);
        }
        if(this.name.includes("Drain Bag")){
            this.root.updatedrainbagValidatetion(this.valdiationCheck);
        }
        rotateState.value=1;
        this.changeLayerMask(0x30000000);
        this.root.sceneCommon.addBlurEffect();
        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x+upAng,y:this.startRotation.y,z:this.startRotation.z+zAng},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x+newPos.x,y:this.root.camera.target.y+newPos.y,z:this.root.camera.target.z+newPos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.scaling).to({x:scalAnim,y:scalAnim,z:scalAnim},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
            this.root.rotateMesh(this.meshRoot);
            this.root.gui2D.resetCamBtn.isVisible = false;
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
            if(this.name.includes("APD Cassette")){
                this.root.updateApdValidatetion(-1,0);
                this.root.updateApdValidatetion(-1,1);
            }
            if(this.name.includes("Connection Shield")){
                this.root.conectionValidatetion(-1);
            }
            if(this.name.includes("Drain Bag")){
                this.root.updatedrainbagValidatetion(-1);
            }
            this.changeLayerMask(1);
            this.root.sceneCommon.removeBlurEffect();
            this.root.gui2D.userExitBtn.isVisible = false;
            this.root.gui2D.resetCamBtn.isVisible = true;
            if(this.placeRotation && (this.parent !== this.root.scene.getTransformNodeByID("tabledrawer")))
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
            else
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.startRotation.x,y:this.startRotation.y,z:this.startRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();    
            // new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:this.startScaling.x,y:this.startScaling.y,z:this.startScaling.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
            const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
            new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                this.enableDrag(setdrag);
                this.root.gamestate.state = GameState.active;
                
            }).start();
      }
      changeLayerMask(layermask){
         this.meshRoot.getChildMeshes().forEach(childmesh => {
            childmesh.layerMask = layermask; 
         });
         this.updateCCpd(layermask);
      }
      updateCCpd(layermask){
        if(this.root.ccpdRecordBook.meshRoot.position.z === 1.1 ){
            
            this.root.ccpdRecordBook.meshRoot.getChildMeshes().forEach(childmesh => {
                    childmesh.layerMask = layermask; 
             });
             this.root.scene.getMeshByName("ccpdplane").layerMask = layermask; 
         }
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
            new TWEEN.Tween(this.meshRoot.rotation).to({x:Angle.FromDegrees(0).radians(),y:0,z:0},anim_time).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                this.meshRoot.position = new Vector3(this.meshRoot.position.x,this.meshRoot.position.y+10,this.meshRoot.position.z-10);
                new TWEEN.Tween(this.meshRoot.position).to({x:this.meshRoot.position.x+100,y:this.meshRoot.position.y-100,z:this.meshRoot.position.z},anim_time).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                    this.meshRoot.parent = null;
                    this.parent = this.root.scene.getCameraByName("maincamera");
                    this.meshRoot.parent = this.parent;
                    this.meshRoot.scaling.set(.003,.003,.003);
                    // this.meshRoot.position = new Vector3(.55,-0.23,1.1);
                    let xpos =.75;
                    const ratio =  this.root.scene.getEngine().getRenderHeight()/this.root.scene.getEngine().getRenderWidth();
                    if(ratio>.5 && ratio<=.6)
                        xpos =ratio+.1;
                    else if(ratio>.6 && ratio<=.7)
                        xpos =ratio;
                    else if(ratio>.7 && ratio<1)
                        xpos =ratio*.7;
                    else if(ratio>1)
                        xpos =ratio*.5;
                    this.meshRoot.position = new Vector3(xpos,-0.3,1.1);
                    this.meshRoot.rotation = new Vector3(0,0,0);
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
            new TWEEN.Tween(frontpage.rotation).to({y:Angle.FromDegrees(120).radians()},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:.019,y:.019,z:.019},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                this.root.scene.getMeshByName("ccpdplane").isVisible=true;
                this.root.scene.getMeshByName("ccpdplane").isPickable=true;
                
            }).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:.35,y:.0,z:1.1},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
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
        new TWEEN.Tween(frontpage.rotation).to({y:0},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
        new TWEEN.Tween(this.meshRoot.scaling).to({x:.003,y:.003,z:.003},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
        }).start();
            let xpos =.75;
            const ratio =  this.root.scene.getEngine().getRenderHeight()/this.root.scene.getEngine().getRenderWidth();
            if(ratio>.5 && ratio<=.6)
                xpos =ratio+.1;
            else if(ratio>.6 && ratio<=.7)
                xpos =ratio;
            else if(ratio>.7 && ratio<1)
                xpos =ratio*.7;
            else if(ratio>1)
                xpos =.1;
            new TWEEN.Tween(this.meshRoot.position).to({x:xpos,y:-.3,z:1.1},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
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
            // this.meshRoot.rotation = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(0).radians(),Angle.FromDegrees(0).radians());  
            new TWEEN.Tween(this.meshRoot.rotation).to({x:Angle.FromDegrees(0).radians(),y:Angle.FromDegrees(0).radians(),z:Angle.FromDegrees(180).radians()},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.meshRoot.scaling).to({x:4,y:4,z:4},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                this.meshRoot.parent = null;
                this.parent = this.root.scene.getCameraByName("maincamera");
                this.meshRoot.parent = this.parent;
                this.meshRoot.rotation = new Vector3(Angle.FromDegrees(-60).radians(),0,0);
                this.meshRoot.scaling = new Vector3(.06,.06,.06); 
                this.meshRoot.position = new Vector3(.06,-1.15,1.05); 
                this.removeAction();
                const  custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"mask_used",level:2}});
                document.dispatchEvent(custom_event);        

            }).start();
            new TWEEN.Tween(this.meshRoot.position).to({x:this.meshRoot.position.x-10,y:this.meshRoot.position.y-100,z:this.meshRoot.position.z-50},anim_time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
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
        if(this.name.includes("Blood Pressure") || this.name.includes("Face Mask") || this.name.includes("CCPD Record Book") || this.name.includes("Alcohol Wipe")){
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

             if(childmesh.id === "ccpdback"){
                childmesh.outlineWidth=0;
                childmesh.renderOutline = false;   
                childmesh.customOutline.setEnabled(value);
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
                    childmesh.renderOutline = false;   
                    childmesh.outlineWidth  = 0;
                    if(childmesh.id === "APDCassetteRevisedWithPackaging2 (1)_primitive40"){
                        console.log(value+"       "+childmesh.customOutline.isVisible);
                        childmesh.customOutline.setEnabled(value);
                    }
             }
        });
    }
    reset(){
        // console.log(this.name);
        if(this.name.includes("CCPD")){
            this.root.scene.getMeshByName("ccpdplane").isVisible=false;
            this.root.scene.getMeshByName("ccpdplane").isPickable=false;
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                if(childmesh.id ==="ccpdfront"){
                    childmesh.rotation.y = Angle.FromDegrees(0).radians();
                }
            });
        }
        this.parent=null;
        this.meshRoot.parent = null;
        this.placedPosition = undefined;
        this.placeRotation=undefined;
        this.trollyPosition=undefined;
        this.tablePosition=undefined;
        this.startPosition=undefined;
        this.meshRoot.scaling   = new Vector3(1,1,1);
        this.removeAction();
        this.pointerDragBehavior.releaseDrag();
        this.pointerDragBehavior.detach();
        this.pointerDragBehavior = null;
        
    }
}
