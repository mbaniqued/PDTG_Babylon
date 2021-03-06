import { GameState,gamemode,ANIM_TIME,event_objectivecomplete,IS_DRAG,rotateState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
import {Mesh,DynamicTexture,StandardMaterial,MeshBuilder,Color3,TransformNode,Vector3,Angle,ActionManager,ExecuteCodeAction,PointerDragBehavior } from 'babylonjs';
let showMenu = false;
export const diasolutionpos1 = new Vector3(.25,2,2.7);
export const diasolutionpos2 = new Vector3(.7,2,2.7);
export const diasolutionpos3 = new Vector3(-2,1.9,2.5);
export const diasolutionpos4 = new Vector3(-3.30,2.15,2.50);
export const sanitizerpos1   = new Vector3(-.8,1.90,2.7);
export const sanitizerpos2   = new Vector3(-1.795,1.78,2);
let dialysis_tablepos=0,checkdialysisValidation=0;



export default class CabinetItem{

      constructor(name,root,meshobject,pos){
        this.name             = name;
        this.root             = root;
        this.meshRoot         = meshobject;
        
        this.startPosition    = pos;
        this.placedPosition   = undefined;
        this.placedRotation   = undefined;
        this.lastPosition     = undefined;
        this.setPos(); 
        this.pickObject = false;
        this.initDrag();
        this.initAction();
        this.meshRoot.name+="items";
        this.state =0;
        this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-50);
        this.label.isVisible=false;
        this.validationDone    = false;
        this.pickforValidation = false;
        this.interaction       = false;
        this.isDraging         = false;
        this.placeOnTable      = false;
        if(this.meshRoot.name.includes("diasolutionnode")){
            this.validationNode = new TransformNode("validation_node");
            this.validationTxt=[];
            this.validationPos=[];
            this.checkValidation=[];
            this.createValidation();
         }
         dialysis_tablepos=0;checkdialysisValidation=0;
      }
      setPos(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isVisible=true;
                childmesh.layerMask=1;
            });
            this.meshRoot.position   = new Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
            this.initialScal         = {x:this.meshRoot.scaling.x,y:this.meshRoot.scaling.y,z:this.meshRoot.scaling.z};
            this.lastPosition        = {x:this.meshRoot.position.x,y:this.meshRoot.position.y,z:this.meshRoot.position.z};
            if(this.meshRoot.name.includes("diasolutionnode"))
                this.meshRoot.rotation  = new Vector3(0,Angle.FromDegrees(90).radians(),0);
            else
                this.meshRoot.rotation  = new Vector3(0,0,0);             
            this.meshRoot.setEnabled(true);
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isVisible=true;
                
            });
      }
      removeAction(){
        this.interaction = false;
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            this.root.removeRegisterAction(childmesh);
          });
          this.updateoutLine(false);
          this.enableDrag(false);
      }
      initAction(){
        this.interaction = true;
        this.enableDrag(false);
          this.meshRoot.getChildMeshes().forEach(childmesh => {
              if(!childmesh.actionManager)
                  this.addAction(childmesh);
            if(childmesh.name.includes("validation"))    
                childmesh.isPickable=false;
            else  
                childmesh.isPickable=true;
             childmesh.isVisible=true;
          });
      }
      addAction(mesh){
        mesh.actionManager = new ActionManager(this.root.scene);
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (object)=> {
            this.label.isVisible = ( this.root.gamestate.state === GameState.default || this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) && (this.state!==100 || this.state!==20);
            this.updateoutLine(this.label.isVisible);
            if(this.root.gamestate.state === GameState.inspect){
                this.updateoutLine(false);
                this.label.isVisible = false;
                let name = mesh.name;
                if(mesh.name.includes(".")){
                    name =this.checkName(mesh.name);
                }
                if(name.includes("highlight_plan")){
                    this.onhighlightDValidation(name,1);
                }
            }

        }))
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (object)=> {
          this.label.isVisible=false;
          this.updateoutLine(false);
          let name = mesh.name;
            if(name.includes(".")){
                name =this.checkName(mesh.name);
            }
            if(name.includes("highlight_plan"))
                this.onhighlightDValidation(name,0);
          
        }))
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (object)=> {
                //   console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                    this.pickObject = true;
                    this.label.isVisible = ( this.root.gamestate.state === GameState.default || this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) && (this.state!==100 || this.state!==20);
                    this.updateoutLine(this.label.isVisible);
                    if(this.root.gamestate.state === GameState.inspect){
                        this.updateoutLine(false);
                        this.label.isVisible = false;
                        let name = mesh.name;
                        if(mesh.name.includes(".")){
                            name =this.checkName(mesh.name);
                        }
                        if(name.includes("highlight_plan")){
                            // console.log(name);
                            this.onhighlightDValidation(name,1);
                        }
                    }
                }
            )
        )
        mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, (object)=> {
                    // console.log(this.root.gamestate.state+"!! OnPickTrigger!!! ")
                    this.isDraging = false; 
                    this.label.isVisible=false;
                    this.updateoutLine(false);
                    if(this.root.gamestate.state === GameState.inspect || this.root.gui2D.radialCircle.isVisible){
                        let name = mesh.name;
                        if(name.includes("."))
                            name =this.checkName(mesh.name);
                        if(name.includes("highlight_plan")){
                            this.setValidation(name);
                            return
                        }
                    }
                  if(this.root.gui2D.userExitBtn.isVisible)
                        return
                    showMenu =!showMenu;
                    this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                    this.root.gui2D.drawRadialMenu(showMenu);
                    this.root.gui2D.resetCamBtn.isVisible=!showMenu;
                    this.hideOutLine();
                    if(showMenu){
                        if(this.root.gamemode === gamemode.training){
                            this.root.gui2D.useBtn.isVisible = false;
                            console.log(this.root.level+"         "+this.name);
                            if(this.meshRoot.name.includes("diasolutionnode"))
                                this.root.gui2D.useBtn.isVisible = false;
                             if(this.root.level >1 && this.name.includes("Hand"))
                                this.root.gui2D.useBtn.isVisible = true;
                        }
                        else{
                            if(this.name.includes("Hand"))
                                this.root.gui2D.useBtn.isVisible = true;
                        }
                    }
                    this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                        this.root.gamestate.state = GameState.inspect;
                        showMenu = false;
                        this.showItem();
                        this.state =20;
                        this.root.gui2D.drawRadialMenu(false);  
                    };
                    this.root.gui2D.useBtn._onPointerUp = ()=>{
                        showMenu = false;
                        this.root.gui2D.drawRadialMenu(showMenu);  
                        if(this.name.includes("Hand") && ((this.root.level===3 && this.root.gamemode === gamemode.training) || this.root.gamemode !== gamemode.training)){
                            this.root.gamestate.state = GameState.active;
                            this.root.setFocusOnObject(new Vector3(1.98,2.02-.3,-1.89-1.2));
                            this.root.setCameraAnim(135,135,60,2.9);
                            const tout = setTimeout(() => {
                                clearTimeout(tout);
                                this.root.handwashactivity.reset();
                                this.root.handwashactivity.drawhandWash(true);
                                this.state =100;
                            }, ANIM_TIME);
                        }
                    };
                    this.root.gui2D.crossBtn._onPointerUp = ()=>{
                        showMenu = false;
                        this.root.gui2D.drawRadialMenu(false);  
                        this.root.gamestate.state = GameState.active;
                        this.state =0;
                    };
               }     
            )
        )
    }
    initDrag(){
      this.pointerDragBehavior = new PointerDragBehavior({dragPlaneNormal:new Vector3(0,0,1)});
      this.pointerDragBehavior.useObjectOrientationForDragging = false;
      this.pointerDragBehavior.updateDragPlane =false;
      this.meshRoot.addBehavior(this.pointerDragBehavior);
      this.pointerDragBehavior.onDragStartObservable.add((event)=>{
            // console.log(this.interaction+"  onDragStartObservable  "+this.pickObject);
          if((!this.interaction && !this.pickObject) || this.root.gamestate.state ===  GameState.radial){
            //   this.enableDrag(false);
              this.state =0;
              return;
          }
          this.lastPosition = {x:this.meshRoot.position.x,y:this.meshRoot.position.y,z:this.meshRoot.position.z};
      });
      this.pointerDragBehavior.onDragObservable.add((event)=>{
          if((!this.interaction && !this.pickObject) || this.root.gamestate.state ===  GameState.radial){
              this.state =0;
            //   this.enableDrag(false);
              return;
          }
          if(!this.isDraging && !this.interaction)
            return;
        // this.meshRoot.position.z = this.startPosition.z;
        // console.log(this.meshRoot.position);
        this.isDraging=this.pointerDragBehavior.dragging;
        IS_DRAG.value=true;
        this.root.scene.getMeshByName("tablecollider").visibility=0;
        this.root.scene.getMeshByName("trollycollider").visibility=0;
        this.root.scene.getMeshByName("apdcollider").visibility=0;
        this.root.scene.getMeshByName("cabinetpartcollider1").visibility=0;
        this.root.scene.getMeshByName("cabinetpartcollider2").visibility=0;
        this.root.scene.getMeshByName("cabinetpartcollider3").visibility=0;              
        this.root.scene.getMeshByName("cabinetpartcollider4").visibility=0;
         if(this.meshRoot.position.x>-1.5 && this.meshRoot.position.x<1.1){
              this.root.scene.getMeshByName("tablecollider").visibility=1;
              if(this.root.camera.target.x != this.root.tableObject.meshRoot.position.x){
                this.root.setCameraAnimLinear(270,270,45,2.5);
                this.root.setFocusOnObjectLinear(new Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.meshRoot.position.z-.5));
              }
          }
          else if(this.meshRoot.position.x>-2.5 && this.meshRoot.position.x<=-1.5){
            this.root.scene.getMeshByName("trollycollider").visibility=1;
            if(this.root.camera.target.x != this.root.trollyObject.meshRoot.position.x){
                this.root.setCameraAnimLinear(270,270,70,2.5);
                this.root.setFocusOnObjectLinear(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z));
            }
          }
          else if(this.name.includes("Dialysis") && this.meshRoot.position.x<-2.5){
            this.root.scene.getMeshByName("apdcollider").visibility=1;  
            if(this.root.camera.target.x != this.root.trollyObject.meshRoot.position.x){
                this.root.setCameraAnimLinear(270,270,70,2.5);     
                this.root.setFocusOnObjectLinear(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z));
            }
          }
          else if(this.meshRoot.position.x>=1.1){
            if(this.root.camera.target.x != this.root.cabinetObject.meshRoot.position.x){
                this.root.setCameraAnimLinear(270,270,60,3);     
                this.root.setFocusOnObjectLinear(new Vector3(this.root.cabinetObject.meshRoot.position.x,this.root.cabinetObject.meshRoot.position.y,this.root.cabinetObject.meshRoot.position.z-.5));
            }
            if(this.meshRoot.position.x>=1.5 &&  this.meshRoot.position.x<=2.5){
                if(this.meshRoot.position.y>1.4 && this.meshRoot.position.y<2){
                    this.root.scene.getMeshByName("cabinetpartcollider1").visibility=1;
                }
                if(this.meshRoot.position.x>=1.5 && (this.meshRoot.position.y>1.1 && this.meshRoot.position.y<1.4)){
                    this.root.scene.getMeshByName("cabinetpartcollider2").visibility=1;
                }
                if(this.meshRoot.position.x>=1.5 && (this.meshRoot.position.y>.7 && this.meshRoot.position.y<1.1)){
                    this.root.scene.getMeshByName("cabinetpartcollider3").visibility=1;              
                }
                if(this.meshRoot.position.x>=1.5 && (this.meshRoot.position.y<.7)){
                    this.root.scene.getMeshByName("cabinetpartcollider4").visibility=1;
                }
            }
          }
          else{
              this.root.scene.getMeshByName("tablecollider").visibility=0;
              this.root.scene.getMeshByName("trollycollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
              this.root.scene.getMeshByName("cabinetpartcollider1").visibility=0;
              this.root.scene.getMeshByName("cabinetpartcollider2").visibility=0;
              this.root.scene.getMeshByName("cabinetpartcollider3").visibility=0;              
              this.root.scene.getMeshByName("cabinetpartcollider4").visibility=0;
          }
          this.state++;
      });
      this.pointerDragBehavior.onDragEndObservable.add((event)=>{
            this.label.isVisible = false;
            this.pickObject      = false;
            let placed=false;
            if(this.isDraging){
              if(this.root.scene.getMeshByName("tablecollider").visibility>0){    
                    if(this.name.includes("Hand") && getsanitiserTablePosition(this.root)>-1){
                        placed = true;
                        this.placeOnTable      = true;
                        this.placedPosition = sanitizerpos1;
                        this.placedRotation = new Vector3(0,0,0);
                        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                        new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                            this.root.handsanitiserCnt++;
                            this.label.isVisible=false;
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"item_placed",itemcount:this.root.handsanitiserCnt,level:1}});
                            document.dispatchEvent(custom_event);
                        }).start();
                    }
                    else if(this.name.includes("Dialysis") && getdialysisTablePos(this.root)>-1){ 
                        placed = true;
                        this.placeOnTable  = true;
                        if(this.root.itemCount>0)
                            this.root.itemCount--;
                        const index = getdialysisTablePos(this.root);   
                        const final_diasolutionpos = [diasolutionpos1,diasolutionpos2];
                        this.placedPosition = final_diasolutionpos[index];
                        this.placedRotation = new Vector3(0,Angle.FromDegrees(180).radians(),0);
                        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                        new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                            this.root.dialysisItemCnt++;
                            this.label.isVisible=false;
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"item_placed",itemcount:this.root.dialysisItemCnt,level:1}});
                            document.dispatchEvent(custom_event);
                        }).start();
                    }
                }
                else if(this.root.scene.getMeshByName("trollycollider").visibility>0  || this.root.scene.getMeshByName("apdcollider").visibility>0){
                    if(this.name.includes("Dialysis")){
                        placed = true;  
                        if(getdialysisTrollyPosition(this.root)<0 && this.root.scene.getMeshByName("trollycollider").visibility>0)
                            placed = false;
                        if(getdialysisApdPosition(this.root)<0 && this.root.scene.getMeshByName("apdcollider").visibility>0)
                            placed = false;
                        if(placed){
                            const final_diasolutionpos = this.root.scene.getMeshByName("trollycollider").visibility>0?diasolutionpos3:diasolutionpos4;
                            this.placedPosition = final_diasolutionpos;
                            this.placedRotation = new Vector3(0,Angle.FromDegrees(this.root.scene.getMeshByName("trollycollider").visibility>0?180:90).radians(),0);
                            if(this.root.scene.getMeshByName("trollycollider").visibility>0){
                                this.root.itemCount++;    
                                let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:3,msg:"placed_2item_apdreck"}});
                                document.dispatchEvent(custom_event);
                            }
                            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                                let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:3,msg:"placed_dialysis_apd_top"}});
                                document.dispatchEvent(custom_event);
                            }).start();
                        }
                    }
                    if(this.name.includes("Hand") && getsanitiserTrollyPosition(this.root)>-1){
                        placed = true;  
                        this.placedPosition = sanitizerpos2;
                        this.placedRotation = new Vector3(0,0,0);
                        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                        new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:3,msg:"placed_sanitizer"}});
                            document.dispatchEvent(custom_event);
                        }).start();
                    }
                }
                if(!placed){
                    if(this.name.includes("Dialysis") && this.root.scene.getMeshByName("cabinetpartcollider1").visibility>0){
                        const isavailble =  !checkPosition(this.root,{x:2.16,y:1.57,z:2.34})
                        placed = false;
                        if(isavailble){
                           placed = true;
                           this.placedPosition = {x:2.16,y:1.57,z:2.34};
                           new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:Angle.FromDegrees(90).radians(),z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                           new TWEEN.Tween(this.meshRoot.position).to({x:2.16,y:1.57,z:2.34},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
                        }
                     }
                     else if(this.name.includes("Dialysis") && this.root.scene.getMeshByName("cabinetpartcollider2").visibility>0){
                         const isavailble =  !checkPosition(this.root,{x:2.16,y:1.17,z:2.34})
                         placed = false;
                         if(isavailble){
                           placed = true;
                           this.placedPosition = {x:2.16,y:1.17,z:2.34};
                            new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:Angle.FromDegrees(90).radians(),z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                            new TWEEN.Tween(this.meshRoot.position).to({x:2.16,y:1.17,z:2.34},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
                         }
                      }
                    else if(this.name.includes("Dialysis") && this.root.scene.getMeshByName("cabinetpartcollider3").visibility>0){
                         const isavailble =  !checkPosition(this.root,{x:2.16,y:.78,z:2.34})
                         placed = false;
                         if(isavailble){
                           placed = true;
                           this.placedPosition = {x:2.16,y:.78,z:2.34};
                            new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:Angle.FromDegrees(90).radians(),z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                            new TWEEN.Tween(this.meshRoot.position).to({x:2.16,y:.78,z:2.34},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
                         }
                      }
                    else if(this.name.includes("Dialysis") && this.root.scene.getMeshByName("cabinetpartcollider4").visibility>0){
                         const isavailble =  !checkPosition(this.root,{x:2.16,y:.31,z:2.34})
                         placed = false;
                         if(isavailble){
                           placed = true;
                           this.placedPosition = {x:2.16,y:.31,z:2.34};
                            new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:Angle.FromDegrees(90).radians(),z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                            new TWEEN.Tween(this.meshRoot.position).to({x:2.16,y:.31,z:2.34},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
                         }
                     }
                     if(!placed){
                        const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
                        new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                        }).start();
                      }
                    
                }
                if(this.lastPosition.x>-1.5 && this.lastPosition.x<1.1){
                    setTimeout(() => {
                        this.root.setCameraAnimLinear(270,270,45,2.5);
                        this.root.setFocusOnObjectLinear(new Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.meshRoot.position.z-.5));    
                    }, 1000);
                    
                }
                else if(this.lastPosition.x>-2.5 && this.lastPosition.x<=-1.5){
                    setTimeout(() => {
                        this.root.setCameraAnimLinear(270,270,70,2.5);
                        this.root.setFocusOnObjectLinear(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z));
                    }, 1000);
                }
                else if(this.lastPosition.x<-2.5){
                    setTimeout(() => {
                        this.root.setCameraAnimLinear(270,270,70,2.5);
                        this.root.setFocusOnObjectLinear(new Vector3(this.root.trollyObject.meshRoot.position.x,this.root.trollyObject.meshRoot.position.y,this.root.trollyObject.meshRoot.position.z));
                    }, 1000);
                }
                else if(this.lastPosition.x>=1.1){
                    setTimeout(() => {
                        this.root.setCameraAnimLinear(270,270,60,3);     
                        this.root.setFocusOnObjectLinear(new Vector3(this.root.cabinetObject.meshRoot.position.x,this.root.cabinetObject.meshRoot.position.y,this.root.cabinetObject.meshRoot.position.z-.5));
                    }, 1000);
                }
             }
             this.root.scene.getMeshByName("tablecollider").visibility=0;
             this.root.scene.getMeshByName("trollycollider").visibility=0;
             this.root.scene.getMeshByName("apdcollider").visibility=0;
             this.root.scene.getMeshByName("cabinetpartcollider1").visibility=0;
             this.root.scene.getMeshByName("cabinetpartcollider2").visibility=0;
             this.root.scene.getMeshByName("cabinetpartcollider3").visibility=0;              
             this.root.scene.getMeshByName("cabinetpartcollider4").visibility=0;
            IS_DRAG.value=false;
        });
    }
    placeItem(time){
        if(!time)
          time =ANIM_TIME;
        if(this.name.includes("Hand")){
            this.placedPosition = sanitizerpos1;
            this.placedRotation = new Vector3(0,0,0);
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
            }).start();
        }
        else if(this.name.includes("Dialysis")){ 
              const final_diasolutionpos = [diasolutionpos1,diasolutionpos2];
              this.placedPosition = final_diasolutionpos[dialysis_tablepos];
              dialysis_tablepos++;
              if(this.placedPosition){
                this.placedRotation = new Vector3(0,Angle.FromDegrees(180).radians(),0);
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
                new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
                }).start();
            }
        }
        this.label.isVisible = false;
    }
    showItem(){ 
    if(this.name.includes("Dialysis")) 
        this.validationNode.setEnabled(true); 
      showMenu = false;
      rotateState.value=1;
      let getdrag = this.pointerDragBehavior.enabled;
      this.enableDrag(false);
      this.root.sceneCommon.addBlurEffect();
      this.changeLayerMask(0x30000000);
      if(this.name.includes("Hand"))
         new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:0,z:Angle.FromDegrees(360).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
      else
         new TWEEN.Tween(this.meshRoot.rotation).to({x:Angle.FromDegrees(110).radians(),y:0,z:Angle.FromDegrees(180).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
         
        const mul = 1.5; 
        new TWEEN.Tween(this.meshRoot.scaling).to({x:this.initialScal.x*mul,y:this.initialScal.y*mul,z:this.initialScal.z*mul},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
         
        // const yy = this.root.camera.target.y<3?this.root.camera.target.y:2;
        const yy = this.root.camera.target.y+.7;
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x,y:yy,z:this.root.camera.position.z+.95},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {
        this.root.gui2D.userExitBtn.isVisible = true;
        this.root.gui2D.resetCamBtn.isVisible = false;
        this.root.rotateMesh(this.meshRoot);
        this.root.gui2D.userExitBtn._onPointerUp = ()=>{
              rotateState.value=0;
              showMenu = false;
              this.root.gui2D.drawRadialMenu(false);  
              this.resetItem(getdrag);
          };
      }).start();
    }
    resetItem(setdrag){
        if(this.name.includes("Dialysis")) 
            this.validationNode.setEnabled(false); 
        this.root.gui2D.userExitBtn.isVisible = false;
        this.root.gui2D.resetCamBtn.isVisible = true;
        this.changeLayerMask(1);
        this.root.sceneCommon.removeBlurEffect();
        let yAng = Angle.FromDegrees(90).radians();
        if(this.name.includes("Hand"))
            yAng = Angle.FromDegrees(0).radians();
        if(this.placedRotation)    
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();
        else
            new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:yAng,z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();    
        new TWEEN.Tween(this.meshRoot.scaling).to({x:this.initialScal.x,y:this.initialScal.y,z:this.initialScal.z},ANIM_TIME*.5).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(() => {}).start();        
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
      }
    hideOutLine(){
      this.meshRoot.getChildMeshes().forEach(childmesh=>{
          childmesh.renderOutline=false;
      });
    }
    enableDrag(val){
        if(this.pointerDragBehavior)
            this.pointerDragBehavior.enabled = val;

    }
    createValidation(){
         this.validationNode.parent = this.meshRoot;   
         this.validationNode.scaling.set(-1,1,1)
         this.validationNode.position = new Vector3(0,5,0);
         const plan = MeshBuilder.CreatePlane("validation_plan",{width:90,height:150,sideOrientation: Mesh.FRONTSIDE},this.root.scene);
         plan.parent = this.validationNode;
         plan.isPickable=false;
         plan.renderOutline=false;
         plan.outlineWidth=0;
         plan.position  = new Vector3(0,0,0);
         plan.rotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(0).radians());
         const size=1024;
         this.dynamicTexture   =  new DynamicTexture("validation_plan_texture",size,this.root.scene);
         this.dynamicTexture.hasAlpha=true;
         const planmat          = new StandardMaterial("validation_plan_mat",this.root.scene);
         planmat.diffuseColor   = new Color3.FromInts(255,255,255);
         planmat.emissiveColor  = new Color3.FromInts(255,255,255);
         planmat.diffuseTexture = this.dynamicTexture;
         plan.material          = planmat;

         this.validationTxt["cap_highlight_plan"] = "is the blue cap present?";
         this.validationPos["cap_highlight_plan"] = [445,10];
         this.checkValidation["cap_highlight_plan"] = -1;
         const cap_highlight_plan = plan.clone();
         cap_highlight_plan.name = "cap_highlight_plan";
         cap_highlight_plan.position  = new Vector3(-22,.5,-67);
         cap_highlight_plan.scaling   = new Vector3(.26,.05,1); 
         cap_highlight_plan.rotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(15).radians());
         cap_highlight_plan.parent = this.validationNode;
         cap_highlight_plan.isPickable=true;
         const planmat2         = this.root.scene.getMaterialByName("highlight_mat").clone();
         cap_highlight_plan.material = planmat2; 
         cap_highlight_plan.visibility=0;

         this.validationTxt["greencap_highlight_plan"] = "is the Green FRANGIBLE seal present?";
         this.validationPos["greencap_highlight_plan"] = [300,15];
         this.checkValidation["greencap_highlight_plan"] = -1;
         const greencap_highlight_plan = cap_highlight_plan.clone();
         greencap_highlight_plan.name = "greencap_highlight_plan";
         greencap_highlight_plan.position  = new Vector3(-5,.5,-63);
         greencap_highlight_plan.scaling   = new Vector3(.1,.03,1); 
         greencap_highlight_plan.rotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(15).radians());
         greencap_highlight_plan.parent = this.validationNode;
         greencap_highlight_plan.isPickable=true;
         greencap_highlight_plan.visibility=0;

         this.validationTxt["expiry_highlight_plan"] = "is the Dialysis Solution still valid?";
         this.validationPos["expiry_highlight_plan"] = [378,126];
         this.checkValidation["expiry_highlight_plan"] = -1;
         const expiry_highlight_plan = cap_highlight_plan.clone();
         expiry_highlight_plan.name = "expiry_highlight_plan";
         expiry_highlight_plan.position  = new Vector3(-9,.5,-34);
         expiry_highlight_plan.scaling   = new Vector3(.2,.05,1); 
         expiry_highlight_plan.rotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(0).radians());
         expiry_highlight_plan.parent    = this.validationNode;
         expiry_highlight_plan.isPickable=true;
         expiry_highlight_plan.visibility=0;

         this.validationTxt["volume_highlight_plan"] = "is the volume correct?";
         this.validationPos["volume_highlight_plan"] = [378,147];
         this.checkValidation["volume_highlight_plan"] = -1;
        const volume_highlight_plan = cap_highlight_plan.clone();
        volume_highlight_plan.name = "volume_highlight_plan";
        volume_highlight_plan.position  = new Vector3(-16,.5,-29);
        volume_highlight_plan.scaling   = new Vector3(.12,.02,1); 
        volume_highlight_plan.rotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(0).radians());
        volume_highlight_plan.parent    = this.validationNode;
        volume_highlight_plan.isPickable=true;
        volume_highlight_plan.visibility=0;

        this.validationTxt["serial_highlight_plan"] = "is the serial number correct?";
        this.validationPos["serial_highlight_plan"] = [208,148];
        this.checkValidation["serial_highlight_plan"] = -1;
        const serial_highlight_plan = cap_highlight_plan.clone();
        serial_highlight_plan.name = "serial_highlight_plan";
        serial_highlight_plan.position  = new Vector3(16,.5,-28);
        serial_highlight_plan.scaling   = new Vector3(.2,.05,1); 
        serial_highlight_plan.rotation  = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(0).radians());
        serial_highlight_plan.parent    = this.validationNode;
        serial_highlight_plan.isPickable=true;
        serial_highlight_plan.setEnabled(this.root.gamemode !== gamemode.training);
        serial_highlight_plan.visibility=0;

        

        this.validationTxt["solution_highlight_plan"] = "is the correct solution type?";
        this.validationPos["solution_highlight_plan"] = [196,185];
        this.checkValidation["solution_highlight_plan"] = -1;
        
        const solution_highlight_plan = cap_highlight_plan.clone();
        solution_highlight_plan.name = "solution_highlight_plan";
        solution_highlight_plan.position   = new Vector3(17,.5,-17);
        solution_highlight_plan.scaling    = new Vector3(.15,.025,1); 
        solution_highlight_plan.rotation   = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(0).radians());
        solution_highlight_plan.parent     = this.validationNode;
        solution_highlight_plan.isPickable = true;
        solution_highlight_plan.setEnabled (this.root.gamemode !== gamemode.training);
        solution_highlight_plan.visibility=0;

        this.validationTxt["concentration_highlight_plan"] = "is the correct concentration?";
        this.validationPos["concentration_highlight_plan"] = [274,226];
        this.checkValidation["concentration_highlight_plan"] = -1;
        const concentration_highlight_plan = cap_highlight_plan.clone();
        concentration_highlight_plan.name = "concentration_highlight_plan";
        concentration_highlight_plan.position   = new Vector3(6,.5,-7);
        concentration_highlight_plan.scaling    = new Vector3(.22,.025,1); 
        concentration_highlight_plan.rotation   = new Vector3(Angle.FromDegrees(90).radians(),Angle.FromDegrees(180).radians(),Angle.FromDegrees(0).radians());
        concentration_highlight_plan.parent     = this.validationNode;
        concentration_highlight_plan.isPickable = true;
        concentration_highlight_plan.visibility=0;
        this.onhighlightDValidation = (name,value)=>{
           this.validationNode.getChildMeshes().forEach(childmesh => {
               if(childmesh.name.includes("highlight_plan")){
                  if(childmesh.name  === name)
                    childmesh.visibility=value;
                }
            });
         }
         this.checkValidationComplete=()=>{
            let cnt=0;
            this.validationNode.getChildMeshes().forEach(childmesh => {
               if(childmesh.name.includes("highlight_plan")){
                  if(this.checkValidation[childmesh.name]>0)
                      cnt++;
               }
           });
           this.checkValidation.length=5;
          if(cnt>=this.checkValidation.length && !this.validationDone){
               checkdialysisValidation++;
               this.validationDone = true;
               if(checkdialysisValidation>=2){
                //    console.log(" $$$$ validation complete $$$");
                  const custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"dialysis_validation",level:3}});
                  document.dispatchEvent(custom_event);
               }    
           }
        }
        this.updateValidation = ()=>{
            let ctx = this.dynamicTexture.getContext();
            const font =  "bold 18px Arial";
            ctx.clearRect(0,0,size,size);
            this.dynamicTexture.drawText("2020-04-08",303*2,140*2,font,"#000000","transparent",true);
            this.dynamicTexture.drawText("2023-04-08",303*2,151*2,font,"#000000","transparent",true);
            const font2 =  "bold 24px Arial";
            this.dynamicTexture.drawText("5000",317*2,162*2,font2,"#000000","transparent",true);
            const font3 =  "bold 28px Arial";
            this.dynamicTexture.drawText("1.5%",171*2,237*2,font3,"#000000","transparent",true);
            this.validationNode.getChildMeshes().forEach(childmesh => {
                if(childmesh.name.includes("highlight_plan")){
                    if(this.checkValidation[childmesh.name]>-1){
                        const i =  this.checkValidation[childmesh.name];
                        const x =  this.validationPos[childmesh.name][0];
                        const y =  this.validationPos[childmesh.name][1];
                        if(i>-1){
                                const font2 = "bold 36px Arial";
                                const symbol=["\u003F","\u2714","\u274C"]
                                const symbolcolor=["#808080","#00FF00","#FF0000"];
                                this.dynamicTexture.drawText(symbol[i],x*2-18,y*2+20,font2,symbolcolor[i],"transparent",true);
                            // this.root.drawImageOnTexture(this.dynamicTexture,this.root.validationImage[i],x,y,28,20);
                        }
                    }
                }
            });
            this.checkValidationComplete();
          }
          this.updateValidation();
          this.setValidation = (name)=>{
            const msg  =  this.validationTxt[name];
            this.root.gui2D.drawValidationMenu(true);
            this.root.gui2D.validationText.text =  msg;
            this.checkValidation[name]=0;
            this.updateValidation()
            this.root.gui2D.rightBtn._onPointerUp = ()=>{
                this.checkValidation[name]=1;
                this.pickforValidation =true
                this.updateValidation();
                this.root.gui2D.drawValidationMenu(false);
            };
            this.root.gui2D.wrongBtn._onPointerUp = ()=>{
                this.checkValidation[name]=2;
                this.pickforValidation =true;
                this.updateValidation();
                this.root.gui2D.drawValidationMenu(false);
                
            };
            this.root.gui2D.doneBtn._onPointerUp = ()=>{
                if(this.checkValidation[name]<1){
                    this.checkValidation[name] =-1;
                    this.updateValidation();
                }
                this.root.gui2D.drawValidationMenu(false);
             };
          }
          this.removeValidation =()=>{
            this.dynamicTexture.clear();
            this.dynamicTexture.dispose();
            this.dynamicTexture = null;
            this.root.removeNode(this.validationNode);
         }
        
      }
      checkName(str){
        str = str.replaceAll(".", " "); 
        const myArray = str.split(" ");
        const name = myArray[myArray.length-1];
        return name;

      }
      updateoutLine(value){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if( childmesh.name.includes("highlight_plan"))
                childmesh.renderOutline = false;
             else   
                childmesh.renderOutline = value;
             childmesh.outlineWidth =1;
            //  console.log(childmesh.name);
        });
    }
    checkAllValidationDone(){
        let isCheck=false;
        if(this.checkValidation["cap_highlight_plan"]>0   && this.checkValidation["greencap_highlight_plan"]>0 && this.checkValidation["expiry_highlight_plan"]>0 &&
           this.checkValidation["volume_highlight_plan"]>0 && this.checkValidation["concentration_highlight_plan"]>0){
            isCheck = true;
        }   
        return isCheck;
    }
    reset(){
        // this.meshRoot.scaling   = new Vector3(1,1,1);
        this.removeAction();
        this.pointerDragBehavior.releaseDrag();
        this.pointerDragBehavior.detach();
        this.pointerDragBehavior = null;
    }
      
}
function getdialysisTablePos(root){
    let index=-1;
    let arr=[0,0]
    const pos = [diasolutionpos1,diasolutionpos2];
    for(let i=0;i<root.dialysisSolutionObject.length;i++){
        for(let j=0;j<pos.length;j++){
            if(root.dialysisSolutionObject[i].placedPosition === pos[j]){
                arr[j]=1;
            }
        }
    }
    // console.table(arr);
    for(let i=0;i<arr.length;i++){
        if(arr[i] ===0){
            index = i;
            return index;
        }
    }
    return index;
}

function getdialysisTrollyPosition(root){
    let index=-1;
    let arr=[0];
    for(let i=0;i<root.dialysisSolutionObject.length;i++){
        if(root.dialysisSolutionObject[i].placedPosition === diasolutionpos3){
                arr[0]=1;
        }
    }
    // console.table(arr);
    if(arr[0]===0){
        index = 0;
        return index;
    }
    return index;
}
function getdialysisApdPosition(root){
    let index=-1;
    let arr=[0];
    for(let i=0;i<root.dialysisSolutionObject.length;i++){
        if(root.dialysisSolutionObject[i].placedPosition === diasolutionpos4){
            arr[0]=1;
        }
    }
    // console.table(arr);
    if(arr[0]===0){
        index = 0;
        return index;
    }
    return index;
}
function getsanitiserTablePosition(root){
    let index=-1;
    let arr=[0]
    for(let i=0;i<root.sanitiserObject.length;i++){
        if(root.sanitiserObject[i].placedPosition === sanitizerpos1){
            arr[0]=1;
        }
    }
    // console.table(arr);
    if(arr[0]===0){
        index = 0;
        return index;
    }
    return index;
}
function getsanitiserTrollyPosition(root){
    let index=-1;
    let arr=[0]
    for(let i=0;i<root.sanitiserObject.length;i++){
        if(root.sanitiserObject[i].placedPosition === sanitizerpos2){
            arr[0]=1;
        }
    }
    // console.table(arr);
    if(arr[0]===0){
        index = 0;
        return index;
    }
    return index;
}
function checkPosition(root,position){
    let isplaced=false;
    for(let i=0;i<root.dialysisSolutionObject.length;i++){
        if(root.dialysisSolutionObject[i].meshRoot.position.x == position.x && root.dialysisSolutionObject[i].meshRoot.position.y == position.y && root.dialysisSolutionObject[i].meshRoot.position.z == position.z){
            isplaced = true;
        }
    }
    return isplaced;
}
