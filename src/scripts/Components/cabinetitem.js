import { GameState,gamemode,ANIM_TIME,event_objectivecomplete,IS_DRAG } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
let showMenu = false;
const diasolutionpos1 = new BABYLON.Vector3(.25,2,2.7);
const diasolutionpos2 = new BABYLON.Vector3(.7,2,2.7);
const diasolutionpos3 = new BABYLON.Vector3(-2,1.9,2.5);
const diasolutionpos4 = new BABYLON.Vector3(-3.30,2.15,2.50);
const sanitizerpos1   = new BABYLON.Vector3(-.8,1.90,2.7);
const sanitizerpos2   = new BABYLON.Vector3(-1.795,1.78,2);
let checktable_diapos=0,checktable_sanipos=0,checktrolly_diapos=0,checkapd_diapos=0,checktrolly_sanipos=0;
let checkdiaValidation=0;
export default class CabinetItem{

      constructor(name,root,meshobject,pos){
        this.name            = name;
        this.root            = root;
        this.meshRoot        = meshobject;
        
        this.startPosition   = pos;
        this.placedPosition   = undefined;
        this.placedRotation   = undefined;
        this.setPos(); 
        this.pickObject = false;
        this.initDrag();
        this.initAction();
        this.meshRoot.name+="items";
        this.state =0;
        this.isPlaced=false;
        this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-50);
        this.label.isVisible=false;
        this.label.isPointerBlocker=true;
        this.validationDone=false;
        this.interaction = false;
        if(this.meshRoot.name.includes("diasolutionnode")){
            this.validationNode = new BABYLON.TransformNode("validation_node");
            this.validationTxt=[];
            this.validationPos=[];
            this.checkValidation=[];
            this.createValidation();
         }
         checktable_diapos=0;checktable_sanipos=0;checktrolly_diapos=0;checkapd_diapos=0;checktrolly_sanipos=0;checkdiaValidation=0;
      }
      setPos(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isVisible=true;
            });
            this.meshRoot.position  = new BABYLON.Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
            if(this.meshRoot.name.includes("diasolutionnode"))
                this.meshRoot.rotation  = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(90).radians(),0);
            else
                this.meshRoot.rotation  = new BABYLON.Vector3(0,0,0);             
            this.meshRoot.setEnabled(true);
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.isVisible=true;
                
            });
      }
      removeAction(){
        this.interaction = false;
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            childmesh.actionManager = null;
            childmesh.isPickable=false;
            childmesh.renderOutline = false;   
          });
          this.updateoutLine(false);
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
        mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
            this.label.isVisible= (this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) || (this.state!==100 && this.state!==20);
            this.updateoutLine(true);
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

        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
          this.label.isVisible=false;
          this.updateoutLine(false);
          let name = mesh.name;
            if(name.includes(".")){
                name =this.checkName(mesh.name);
            }
            if(name.includes("highlight_plan"))
                this.onhighlightDValidation(name,0);
          
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                //   console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                    this.pickObject = true;
                    this.label.isVisible= (this.root.gamestate.state === GameState.focus || this.root.gamestate.state === GameState.active) || (this.state!==100 && this.state!==20);
                    this.updateoutLine(true);
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
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                    // console.log(this.root.gamestate.state+"!! OnPickTrigger!!! ")
                    console.log(mesh.name);
                    this.label.isVisible=false;
                    this.updateoutLine(false);
                    if(this.root.gamestate.state === GameState.inspect){
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
                        if(this.root.gamemode === gamemode.training && this.root.level ===3){
                            if(this.meshRoot.name.includes("diasolutionnode"))
                                this.root.gui2D.useBtn.isVisible = false;
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
                        if(this.name.includes("Hand") && this.root.level>2){
                            this.root.gamestate.state = GameState.active;
                            this.root.setFocusOnObject(new BABYLON.Vector3(1.98,2.02-.3,-1.89-1.2));
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(135).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                                this.root.handwashactivity.reset();
                                this.root.handwashactivity.drawhandWash(true);
                                this.root.gui2D.resetCamBtn.isVisible=true;
                                this.root.gui2D.resetCamBtn.zIndex =100;
                                this.state =100;
                            }).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({radius:2.9},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
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
      this.pointerDragBehavior = new BABYLON.PointerDragBehavior();
      this.pointerDragBehavior.useObjectOrientationForDragging = false;
      this.pointerDragBehavior.updateDragPlane =false;
      this.meshRoot.addBehavior(this.pointerDragBehavior);
      this.pointerDragBehavior.onDragStartObservable.add((event)=>{
            console.log(this.interaction+"  onDragStartObservable  "+this.pickObject);
          if((!this.interaction && !this.pickObject) || this.root.gamestate.state ===  GameState.radial){
              this.enableDrag(false);
              this.state =0;
              return;
          }
      });
      this.pointerDragBehavior.onDragObservable.add((event)=>{
          if((!this.interaction && !this.pickObject) || this.root.gamestate.state ===  GameState.radial){
              this.state =0;
              this.enableDrag(false);
              return;
          }
        // this.meshRoot.position.z = this.startPosition.z;
        //   console.log(this.meshRoot.position);
            IS_DRAG.value=true;
          if(this.meshRoot.position.x>-1.5 && this.meshRoot.position.x<1.1){
              this.root.scene.getMeshByName("tablecollider").visibility=1;
              this.root.scene.getMeshByName("trollycollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
            new TWEEN.Tween(this.root.camera.target).to({x:0,y:1.5,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
          }
          else if(this.meshRoot.position.x>-2.5 && this.meshRoot.position.x<=-1.5){
              this.root.scene.getMeshByName("trollycollider").visibility=1;
              this.root.scene.getMeshByName("tablecollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
              new TWEEN.Tween(this.root.camera.target).to({x:-2,y:1.5,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
              }).start();
              new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
          }
          else if(this.meshRoot.position.x<-2.5){
            this.root.scene.getMeshByName("apdcollider").visibility=1;  
            this.root.scene.getMeshByName("tablecollider").visibility=0;
            this.root.scene.getMeshByName("trollycollider").visibility=0;
          }
          else if(this.meshRoot.position.x>=1.1){
            this.root.scene.getMeshByName("tablecollider").visibility=0;
            this.root.scene.getMeshByName("trollycollider").visibility=0;
            this.root.scene.getMeshByName("apdcollider").visibility=0;
            new TWEEN.Tween(this.root.camera.target).to({x:1.5,y:1.5,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
            new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
            }).start();
          }
          else{
              this.root.scene.getMeshByName("tablecollider").visibility=0;
              this.root.scene.getMeshByName("trollycollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
          }
          this.state++;
      });
      this.pointerDragBehavior.onDragEndObservable.add((event)=>{
            this.label.isVisible = false;
            this.pickObject      = false;
            let placed=false;
            if(this.root.scene.getMeshByName("tablecollider").visibility>0){    
                if(this.name.includes("Hand") && checktable_sanipos<1){
                    placed = true;
                    this.placedPosition = sanitizerpos1;
                    this.placedRotation = new BABYLON.Vector3(0,0,0);
                      new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
                      new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                          checktable_sanipos++;
                          if(checktrolly_sanipos>0)
                            checktrolly_sanipos--;
                          this.enableDrag(false);
                          this.root.handsanitiserCnt++;
                          this.label.isVisible=false;
                          let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"item_placed",itemcount:this.root.handsanitiserCnt}});
                          document.dispatchEvent(custom_event);
                      }).start();
                }
                else if(this.name.includes("Dialysis") && checktable_diapos<2){ 
                      placed = true;
                      if(this.root.itemCount>0)
                        this.root.itemCount--;
                      const final_diasolutionpos = [diasolutionpos1,diasolutionpos2];
                      this.placedPosition = final_diasolutionpos[checktable_diapos];
                      this.placedRotation = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(180).radians(),0);
                      new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
                      new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                           checktable_diapos++;
                           if(checkapd_diapos>0)
                                checkapd_diapos--;
                            if(checktrolly_diapos>0)
                                checktrolly_diapos--;
                        //    this.enableDrag(false);
                        //    this.removeAction();
                           this.root.dialysisItemCnt++;
                           this.label.isVisible=false;
                           let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"item_placed",itemcount:this.root.dialysisItemCnt}});
                           document.dispatchEvent(custom_event);
                      }).start();
                }
          }
          else if(this.root.scene.getMeshByName("trollycollider").visibility>0  || this.root.scene.getMeshByName("apdcollider").visibility>0){
              if(this.name.includes("Dialysis")){
                    placed = true;  
                    if(checktrolly_diapos>0 && this.root.scene.getMeshByName("trollycollider").visibility>0)
                        placed = false;
                    if(checkapd_diapos>0 && this.root.scene.getMeshByName("apdcollider").visibility>0)
                        placed = false;
                //   console.log(placed +"   11111111  "+checktrolly_diapos);
                    if(placed){
                        const final_diasolutionpos = this.root.scene.getMeshByName("trollycollider").visibility>0?diasolutionpos3:diasolutionpos4;
                        this.placedPosition = final_diasolutionpos;
                        this.placedRotation = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(this.root.scene.getMeshByName("trollycollider").visibility>0?180:90).radians(),0);
                        if(this.root.scene.getMeshByName("trollycollider").visibility>0){
                              checktrolly_diapos++;
                              if(checkapd_diapos>0)
                                checkapd_diapos--;
                              if(checktable_diapos>0)
                                checktable_diapos--;
                            this.root.itemCount++;    
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:3,msg:"placed_2item_apdreck"}});
                            document.dispatchEvent(custom_event);
                        }
                        if(this.root.scene.getMeshByName("apdcollider").visibility>0){
                              checkapd_diapos++;  
                              if(checktrolly_diapos>0)
                                checktrolly_diapos--;
                              if(checktable_diapos>0)
                                checktable_diapos--;
                        }
                        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
                        new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                            // this.enableDrag(false);
                            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:3,msg:"placed_dialysis_apd_top"}});
                            document.dispatchEvent(custom_event);
                        }).start();
                    }
              }
              if(this.name.includes("Hand") && checktrolly_sanipos<1){
                      placed = true;  

                      this.placedPosition = sanitizerpos2;
                      this.placedRotation = new BABYLON.Vector3(0,0,0);
                      new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
                      new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                          checktrolly_sanipos++;
                          if(checktable_sanipos>0)
                            checktable_sanipos--;
                        //   this.enableDrag(false);
                         
                           let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:3,msg:"placed_sanitizer"}});
                           document.dispatchEvent(custom_event);
                         

                      }).start();
                }
          }
          if(!placed){
                  const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
                  new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                    this.enableDrag(true);
                }).start();
           }
           this.root.scene.getMeshByName("tablecollider").visibility=0;
           this.root.scene.getMeshByName("trollycollider").visibility=0;
           this.root.scene.getMeshByName("apdcollider").visibility=0;
           IS_DRAG.value=false;
        });
    }
    placeItem(time){
        if(!time)
          time =ANIM_TIME;
        if(this.name.includes("Hand")){
            this.placedPosition = sanitizerpos1;
            this.placedRotation = new BABYLON.Vector3(0,0,0);
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
            }).start();
        }
        else if(this.name.includes("Dialysis")){ 
              const final_diasolutionpos = [diasolutionpos1,diasolutionpos2];
              this.placedPosition = final_diasolutionpos[checktable_diapos];
              checktable_diapos++;
              if(this.placedPosition){
                this.placedRotation = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(180).radians(),0);
                new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
                new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                }).start();
            }
        }
    }
    showItem(){ 
      showMenu = false;
      this.enableDrag(false);
      if(this.name.includes("Hand"))
         new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:0,z:BABYLON.Angle.FromDegrees(360).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
      else
         new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(110).radians(),y:0,z:BABYLON.Angle.FromDegrees(180).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x,y:this.root.camera.target.y+.8,z:this.root.camera.position.z+1},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
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
        let yAng = BABYLON.Angle.FromDegrees(90).radians();
        if(this.name.includes("Hand"))
            yAng = BABYLON.Angle.FromDegrees(0).radians();
        if(this.placedRotation)    
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
        else
            new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:yAng,z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();    
        const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
        new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
            if(!this.placedPosition)
                this.enableDrag(true);
             this.root.gamestate.state = GameState.active;
        }).start();
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
         this.validationNode.position = new BABYLON.Vector3(0,3.9,0);
         const plan = BABYLON.MeshBuilder.CreatePlane("validation_plan",{width:90,height:150,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.root.scene);
         plan.parent = this.validationNode;
         plan.isPickable=false;
         plan.renderOutline=false;
         plan.outlineWidth=0;
         plan.position  = new BABYLON.Vector3(0,0,0);
         plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
         const size=512
         this.dynamicTexture   =  new BABYLON.DynamicTexture("validation_plan_texture",size,this.root.scene);
         this.dynamicTexture.hasAlpha=true;
         const planmat          = new BABYLON.StandardMaterial("drainbag_plan_mat",this.root.scene);
         planmat.diffuseColor   = new BABYLON.Color3.FromInts(255,255,255);
         planmat.emissiveColor  = new BABYLON.Color3.FromInts(255,255,255);
         planmat.diffuseTexture = this.dynamicTexture;
         plan.material          = planmat;
         this.validationTxt["cap_highlight_plan"] = "is the blue cap present?";
         this.validationPos["cap_highlight_plan"] = [435,5];
         this.checkValidation["cap_highlight_plan"] = -1;
         const cap_highlight_plan = plan.clone();
         cap_highlight_plan.name = "cap_highlight_plan";
         cap_highlight_plan.position  = new BABYLON.Vector3(-22,.5,-67);
         cap_highlight_plan.scaling   = new BABYLON.Vector3(.26,.05,1); 
         cap_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(15).radians());
         cap_highlight_plan.parent = this.validationNode;
         cap_highlight_plan.isPickable=true;
         const planmat2         = this.root.scene.getMaterialByName("highlight_mat").clone();
         cap_highlight_plan.material = planmat2; 
         cap_highlight_plan.visibility=0;

         this.validationTxt["greencap_highlight_plan"] = "is the Green Franginle seal present?";
         this.validationPos["greencap_highlight_plan"] = [264,8];
         this.checkValidation["greencap_highlight_plan"] = -1;
         const greencap_highlight_plan = cap_highlight_plan.clone();
         greencap_highlight_plan.name = "greencap_highlight_plan";
         greencap_highlight_plan.position  = new BABYLON.Vector3(-5,.5,-63);
         greencap_highlight_plan.scaling   = new BABYLON.Vector3(.1,.03,1); 
         greencap_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(15).radians());
         greencap_highlight_plan.parent = this.validationNode;
         greencap_highlight_plan.isPickable=true;
         greencap_highlight_plan.visibility=0;

         this.validationTxt["expiry_highlight_plan"] = "is the Dialysis Solution still valid?";
         this.validationPos["expiry_highlight_plan"] = [378,126];
         this.checkValidation["expiry_highlight_plan"] = -1;
         const expiry_highlight_plan = cap_highlight_plan.clone();
         expiry_highlight_plan.name = "expiry_highlight_plan";
         expiry_highlight_plan.position  = new BABYLON.Vector3(-9,.5,-34);
         expiry_highlight_plan.scaling   = new BABYLON.Vector3(.2,.05,1); 
         expiry_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
         expiry_highlight_plan.parent    = this.validationNode;
         expiry_highlight_plan.isPickable=true;
         expiry_highlight_plan.visibility=0;

         this.validationTxt["volume_highlight_plan"] = "is the correct volume?";
         this.validationPos["volume_highlight_plan"] = [378,147];
         this.checkValidation["volume_highlight_plan"] = -1;
        const volume_highlight_plan = cap_highlight_plan.clone();
        volume_highlight_plan.name = "volume_highlight_plan";
        volume_highlight_plan.position  = new BABYLON.Vector3(-16,.5,-29);
        volume_highlight_plan.scaling   = new BABYLON.Vector3(.12,.02,1); 
        volume_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
        volume_highlight_plan.parent    = this.validationNode;
        volume_highlight_plan.isPickable=true;
        volume_highlight_plan.visibility=0;

        this.validationTxt["serial_highlight_plan"] = "is the serial number correct?";
        this.validationPos["serial_highlight_plan"] = [208,148];
        this.checkValidation["serial_highlight_plan"] = -1;
        const serial_highlight_plan = cap_highlight_plan.clone();
        serial_highlight_plan.name = "serial_highlight_plan";
        serial_highlight_plan.position  = new BABYLON.Vector3(16,.5,-28);
        serial_highlight_plan.scaling   = new BABYLON.Vector3(.2,.05,1); 
        serial_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
        serial_highlight_plan.parent    = this.validationNode;
        serial_highlight_plan.isPickable=true;
        serial_highlight_plan.visibility=0;

        this.validationTxt["solution_highlight_plan"] = "is the correct solution type?";
        this.validationPos["solution_highlight_plan"] = [196,185];
        this.checkValidation["solution_highlight_plan"] = -1;
        
        const solution_highlight_plan = cap_highlight_plan.clone();
        solution_highlight_plan.name = "solution_highlight_plan";
        solution_highlight_plan.position  = new BABYLON.Vector3(17,.5,-17);
        solution_highlight_plan.scaling   = new BABYLON.Vector3(.15,.025,1); 
        solution_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
        solution_highlight_plan.parent    = this.validationNode;
        solution_highlight_plan.isPickable=true;
        solution_highlight_plan.visibility=0;

        this.validationTxt["concentration_highlight_plan"] = "is the correct concentration?";
        this.validationPos["concentration_highlight_plan"] = [274,226];
        this.checkValidation["concentration_highlight_plan"] = -1;
        const concentration_highlight_plan = cap_highlight_plan.clone();
        concentration_highlight_plan.name = "concentration_highlight_plan";
        concentration_highlight_plan.position  = new BABYLON.Vector3(6,.5,-7);
        concentration_highlight_plan.scaling   = new BABYLON.Vector3(.22,.025,1); 
        concentration_highlight_plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
        concentration_highlight_plan.parent    = this.validationNode;
        concentration_highlight_plan.isPickable=true;
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
           this.checkValidation.length=7;
          if(cnt>=this.checkValidation.length && !this.validationDone){
               checkdiaValidation++;
               this.validationDone = true;
               if(checkdiaValidation>=2){
                   console.log(" $$$$ validation complete $$$");
                  const custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,msg:"dialysis_validation",level:3}});
                  document.dispatchEvent(custom_event);
               }    
           }
        }
        this.updatedrainbagValidatetion = ()=>{
            let ctx = this.dynamicTexture.getContext();
            const font =  "bold 9px Arial";
            ctx.clearRect(0,0,size,size);
            this.dynamicTexture.drawText("2020-04-08",303,140,font,"#000000","transparent",true);
            this.dynamicTexture.drawText("2023-04-08",303,151,font,"#000000","transparent",true);
            const font2 =  "bold 12px Arial";
            this.dynamicTexture.drawText("5000",317,162,font2,"#000000","transparent",true);
            const font3 =  "bold 14px Arial";
            this.dynamicTexture.drawText("1.5%",171,237,font3,"#000000","transparent",true);
            this.validationNode.getChildMeshes().forEach(childmesh => {
                if(childmesh.name.includes("highlight_plan")){
                    if(this.checkValidation[childmesh.name]>-1){
                        const i =  this.checkValidation[childmesh.name];
                        const x =  this.validationPos[childmesh.name][0];
                        const y =  this.validationPos[childmesh.name][1];
                        if(i>-1)
                            this.root.drawImageOnTexture(this.dynamicTexture,this.root.validationImage[i],x,y,28,20);
                    }
                }
            });
            this.checkValidationComplete();
          }
          this.updatedrainbagValidatetion();
          this.setValidation = (name)=>{
            const msg  =  this.validationTxt[name];
            this.root.gui2D.drawValidationMenu(true);
            this.root.gui2D.validationText.text =  msg;
            this.checkValidation[name]=0;
            this.updatedrainbagValidatetion()
            this.root.gui2D.rightBtn._onPointerUp = ()=>{
                this.checkValidation[name]=1;
                this.updatedrainbagValidatetion();
                this.root.gui2D.drawValidationMenu(false);
            };
            this.root.gui2D.wrongBtn._onPointerUp = ()=>{
                this.checkValidation[name]=2;
                this.updatedrainbagValidatetion();
                this.root.gui2D.drawValidationMenu(false);
            };
            this.root.gui2D.doneBtn._onPointerUp = ()=>{
                if(this.checkValidation[name]<1){
                    this.checkValidation[name] =-1;
                    this.updatedrainbagValidatetion();
                }
                this.root.gui2D.drawValidationMenu(false);
             };
          }
          this.removeValidation =()=>{
            this.dynamicTexture.clear();
            this.dynamicTexture.dispose();
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
      
}