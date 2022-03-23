import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
let showMenu = false;
const diasolutionpos1 = new BABYLON.Vector3(.25,2,2.7);
const diasolutionpos2 = new BABYLON.Vector3(.7,2,2.7);
const diasolutionpos3 = new BABYLON.Vector3(-2,1.9,2.5);
const diasolutionpos4 = new BABYLON.Vector3(-3.30,2.15,2.50);
const sanitizerpos1   = new BABYLON.Vector3(-.8,1.90,2.7);
const sanitizerpos2   = new BABYLON.Vector3(-1.795,1.78,2);
let checktable_diapos=0,checktable_sanipos=0,checktrolly_diapos=0,checkapd_diapos=0,checktrolly_sanipos=0;

export default class CabinetItem{

      constructor(name,root,meshobject,pos){
        this.name            = name;
        this.root            = root;
        this.meshRoot        = meshobject;
        this.startPosition   = pos;
        this.placedPosition   = undefined;
        this.placedRotation   = undefined;
        this.setPos(); 
        this.initAction();
        
        this.pickObject = false;
        this.initDrag();
        this.meshRoot.addBehavior(this.pointerDragBehavior);
        this.meshRoot.name+="items";
        this.state =0;
        this.isPlaced=false;
        this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-50);
        this.label.isVisible=false;
        this.label.isPointerBlocker=true;
      }
      setPos(){
        this.meshRoot.position  = new BABYLON.Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
      }
      removeAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            childmesh.actionManager = null;
          });
      }
      initAction(){
          this.meshRoot.getChildMeshes().forEach(childmesh => {
              if(!childmesh.actionManager)
                  this.addAction(childmesh);
          });
      }
      addAction(mesh){
        mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
          this.label.isVisible=this.root.gamestate.state !== GameState.radial || this.root.gamestate.state !== GameState.menu || this.root.gamestate.state !== GameState.levelstage;
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
          this.label.isVisible=false
        }))
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                //   console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                    this.pickObject = true;
                    this.label.isVisible=this.root.gamestate.state !== GameState.radial || this.root.gamestate.state !== GameState.menu;
                }
            )
        )
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                    // console.log(this.root.gamestate.state+"!! OnPickTrigger!!! ")
                  if(this.root.gui2D.userExitBtn.isVisible)
                        return
                    this.label.isVisible=false;
                    showMenu =!showMenu;
                    this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                    this.root.gui2D.drawRadialMenu(showMenu);
                    this.root.gui2D.resetCamBtn.isVisible=!showMenu;
                    this.hideOutLine();
                    this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                        this.meshRoot.removeBehavior(this.pointerDragBehavior);
                        showMenu = false;
                        this.root.gui2D.drawRadialMenu(false);  
                    };
                    this.root.gui2D.useBtn._onPointerUp = ()=>{
                        this.meshRoot.removeBehavior(this.pointerDragBehavior);
                        showMenu = false;
                        this.root.gui2D.drawRadialMenu(false);  
                        this.showItem();
                    };
                    this.root.gui2D.crossBtn._onPointerUp = ()=>{
                        showMenu = false;
                        this.root.gui2D.drawRadialMenu(false);  
                        this.root.gamestate.state = GameState.active;
                    };
               }     
            )
        )
    }
    initDrag(){
      this.pointerDragBehavior = new BABYLON.PointerDragBehavior();
      this.pointerDragBehavior.useObjectOrientationForDragging = false;
      this.pointerDragBehavior.onDragStartObservable.add((event)=>{
          if( !this.pickObject || this.root.gamestate.state ===  GameState.radial){
              this.state =0;
              return;
          }
      });
      this.pointerDragBehavior.onDragObservable.add((event)=>{
          if(!this.pickObject || this.root.gamestate.state ===  GameState.radial){
              this.state =0;
              return;
          }
          this.meshRoot.position.z = this.startPosition.z;
          // console.log(this.meshRoot.position.x);
          if(this.meshRoot.position.x>-1.5 && this.meshRoot.position.x<1.1){
              this.root.scene.getMeshByName("tablecollider").visibility=1;
              this.root.scene.getMeshByName("trollycollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;

            new TWEEN.Tween(this.root.camera.target).to({x:0,y:1.5,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
          }
          else if(this.meshRoot.position.x>-2.5 && this.meshRoot.position.x<=-1.5){
              this.root.scene.getMeshByName("trollycollider").visibility=1;
              this.root.scene.getMeshByName("tablecollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
              new TWEEN.Tween(this.root.camera.target).to({x:-2,y:1.5,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
              }).start();
              new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
              new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
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
            new TWEEN.Tween(this.root.camera.target).to({x:1.5,y:1.5,z:this.root.camera.target.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            }).start();
          }
          else{
              this.root.scene.getMeshByName("tablecollider").visibility=0;
              this.root.scene.getMeshByName("trollycollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
          }
          this.state++;
          // console.log(event);
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
                      new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
                      new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                          checktable_sanipos++;
                          this.meshRoot.removeBehavior(this.pointerDragBehavior);
                          this.root.handsanitiserCnt++;
                          this.label.isVisible=false;
                          let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,itemcount:this.root.handsanitiserCnt}});
                          document.dispatchEvent(custom_event);
                      }).start();
                }
                else if(this.name.includes("Dialysis") && checktable_diapos<2){ 
                      placed = true;
                      const final_diasolutionpos = [diasolutionpos1,diasolutionpos2];
                      this.placedPosition = final_diasolutionpos[checktable_diapos];
                      this.placedRotation = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(180).radians(),0);
                      new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
                      new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                           checktable_diapos++;
                           this.meshRoot.removeBehavior(this.pointerDragBehavior);
                           this.removeAction();
                           this.root.dialysisItemCnt++;
                           this.label.isVisible=false;
                           let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,itemcount:this.root.dialysisItemCnt}});
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
                  console.log(placed +"   11111111  "+checktrolly_diapos);
                    if(placed){
                        const final_diasolutionpos = this.root.scene.getMeshByName("trollycollider").visibility>0?diasolutionpos3:diasolutionpos4;
                        this.placedPosition = final_diasolutionpos;
                        this.placedRotation = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(this.root.scene.getMeshByName("trollycollider").visibility>0?180:90).radians(),0);
                        if(this.root.scene.getMeshByName("trollycollider").visibility>0)
                              checktrolly_diapos++;
                        if(this.root.scene.getMeshByName("apdcollider").visibility>0)
                              checkapd_diapos++;  
                        new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
                        new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                            this.meshRoot.removeBehavior(this.pointerDragBehavior);
                        }).start();
                    }
              }
              if(this.name.includes("Hand") && checktrolly_sanipos<1){
                      placed = true;  
                      this.placedPosition = sanitizerpos2;
                      this.placedRotation = new BABYLON.Vector3(0,0,0);
                      new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
                      new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                          checktrolly_sanipos++
                          this.meshRoot.removeBehavior(this.pointerDragBehavior);
                      }).start();
                }
          }
          if(!placed){
                  const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
                  new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                  this.meshRoot.addBehavior(this.pointerDragBehavior);
                }).start();
           }
           this.root.scene.getMeshByName("tablecollider").visibility=0;
           this.root.scene.getMeshByName("trollycollider").visibility=0;
           this.root.scene.getMeshByName("apdcollider").visibility=0;
        });
    }
    placeItem(time){
        this.meshRoot.removeBehavior(this.pointerDragBehavior);
        if(this.name.includes("Hand")){
            this.placedPosition = sanitizerpos1;
            this.placedRotation = new BABYLON.Vector3(0,0,0);
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
            new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            }).start();
        }
        else if(this.name.includes("Dialysis")){ 
              const final_diasolutionpos = [diasolutionpos1,diasolutionpos2];
              this.placedPosition = final_diasolutionpos[checktable_diapos];
              checktable_diapos++;
              this.placedRotation = new BABYLON.Vector3(0,BABYLON.Angle.FromDegrees(180).radians(),0);
              new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
              new TWEEN.Tween(this.meshRoot.position).to({x:this.placedPosition.x,y:this.placedPosition.y,z:this.placedPosition.z},time).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
              }).start();
        }
    }
    showItem(){ 
      showMenu = false;
      this.meshRoot.removeBehavior(this.pointerDragBehavior);
      new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
      if(this.name.includes("Hand"))
         new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:0,z:BABYLON.Angle.FromDegrees(360).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
      else
         new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(110).radians(),y:0,z:BABYLON.Angle.FromDegrees(180).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
      // new TWEEN.Tween(this.meshRoot.position).to({x:1.9,y:2.32,z:.05},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x,y:this.root.camera.target.y+.8,z:this.root.camera.position.z+1.3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        this.root.gui2D.userExitBtn.isVisible = true;
        this.root.gui2D.userExitBtn._onPointerUp = ()=>{
              showMenu = false;
              this.root.gui2D.drawRadialMenu(false);  
              this.resetItem();
          };
      }).start();
    }
    resetItem(){
        new TWEEN.Tween(this.root.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        this.root.gui2D.userExitBtn.isVisible = false;
        let yAng = BABYLON.Angle.FromDegrees(90).radians();
        if(this.name.includes("Hand"))
            yAng = BABYLON.Angle.FromDegrees(0).radians();
        if(this.placedRotation)    
            new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placedRotation.x,y:this.placedRotation.y,z:this.placedRotation.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        else
            new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:yAng,z:0},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();    
        const finalpos = this.placedPosition!==undefined?this.placedPosition:this.startPosition;
        new TWEEN.Tween(this.meshRoot.position).to({x:finalpos.x,y:finalpos.y,z:finalpos.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            if(!this.placedPosition)
             this.meshRoot.addBehavior(this.pointerDragBehavior);
             this.root.gamestate.state = GameState.active;
        }).start();
    }
    hideOutLine(){
      this.meshRoot.getChildMeshes().forEach(childmesh=>{
          childmesh.renderOutline=false;
      });
    }
}