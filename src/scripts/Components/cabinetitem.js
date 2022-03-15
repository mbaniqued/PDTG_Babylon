import { GameState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
let showMenu = false;

const table1pos = new BABYLON.Vector3(.25,2,2.7);
const table2pos = new BABYLON.Vector3(.7,2,2.7);
export default class CabinetItem{

      constructor(name,root,meshobject,pos){
        this.name            = name;
        this.root            = root;
        this.meshRoot        = meshobject;
        this.startPosition   = pos;
        this.setPos(); 
        this.meshRoot.getChildMeshes().forEach(childmesh => {
          this.addAction(childmesh);
          });
        this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,150,-50);
        this.label.isVisible=false;
        this.pickObject = false;
        this.initDrag();
        this.meshRoot.addBehavior(this.pointerDragBehavior);
        this.meshRoot.name+="items";
        this.state =0;
        this.isPlaced=false;
      }
      setPos(){
        this.meshRoot.position  = new BABYLON.Vector3(this.startPosition.x,this.startPosition.y,this.startPosition.z);
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
                  console.log(this.root.gamestate.state+"!! OnPickDownTrigger!!! ")
                    this.pickObject = true;
                    this.label.isVisible=this.root.gamestate.state !== GameState.radial || this.root.gamestate.state !== GameState.menu;
                }
            )
        )
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                    console.log(this.root.gamestate.state+"!! OnPickTrigger!!! ")
                    if(this.root.gui2D.userExitBtn.isVisible)
                        return
                    this.label.isVisible=false;
                    showMenu =!showMenu;
                    this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                    this.root.gui2D.drawRadialMenu(showMenu);
                    this.root.gui2D.resetCamBtn.isVisible=!showMenu;
                    this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                        this.meshRoot.removeBehavior(this.pointerDragBehavior);
                        showMenu = false;
                        this.root.gui2D.drawRadialMenu(false);  
                        this.showItem();
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
          this.meshRoot.position.z = this.startPosition.z;
          console.log(this.meshRoot.position);
          if(this.meshRoot.position.x>-1.5 && this.meshRoot.position.x<.8){
            this.root.scene.getMeshByName("tablecollider").visibility=1;
            this.root.scene.getMeshByName("trollycollider").visibility=0;
            this.root.scene.getMeshByName("apdcollider").visibility=0;
            new TWEEN.Tween(this.root.camera.target).to({x:0,y:this.root.camera.target.y,z:this.root.camera.target.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            }).start();
            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
          }
          else if(this.meshRoot.position.x>-2.5 && this.meshRoot.position.x<=-1.5){
              this.root.scene.getMeshByName("trollycollider").visibility=1;
              this.root.scene.getMeshByName("tablecollider").visibility=0;
              this.root.scene.getMeshByName("apdcollider").visibility=0;
              new TWEEN.Tween(this.root.camera.target).to({x:-1.2,y:this.root.camera.target.y,z:this.root.camera.target.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
              }).start();
              new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
          }
          else if(this.meshRoot.position.x<-2.5){
            this.root.scene.getMeshByName("apdcollider").visibility=1;
            this.root.scene.getMeshByName("tablecollider").visibility=0;
            this.root.scene.getMeshByName("trollycollider").visibility=0;
          }
          else if(this.meshRoot.position.x>.8){
            this.root.scene.getMeshByName("tablecollider").visibility=0;
            this.root.scene.getMeshByName("trollycollider").visibility=0;
            this.root.scene.getMeshByName("apdcollider").visibility=0;
            new TWEEN.Tween(this.root.camera.target).to({x:1.5,y:this.root.camera.target.y,z:this.root.camera.target.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
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


            this.root.scene.getMeshByName("tablecollider").visibility=0;
            this.root.scene.getMeshByName("trollycollider").visibility=0;
            this.root.scene.getMeshByName("apdcollider").visibility=0;
            // if((this.meshRoot.position.x>-140 && this.meshRoot.position.x<90  && this.meshRoot.position.y>20) && this.state>10 || this.isPlaced ){ 
            //     this.state=0;
            //     // new TWEEN.Tween(this.meshRoot).to({position:this.placedPostion},300).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            //     //     this.isPlaced=true;
            //     //     this.root.scene.getMeshByName("tablecollider").visibility=0;
            //     // }).start();
            //     // if(this.placeRotation){
            //     //     new TWEEN.Tween(this.meshRoot.rotation).to({x:this.placeRotation.x,y:this.placeRotation.y,z:this.placeRotation.z},300).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            //     //         this.meshRoot.removeBehavior(this.pointerDragBehavior);
            //     //     }).start();
            //     // }
            // }
            // else
            {
                new TWEEN.Tween(this.meshRoot).to({position:this.startPosition},300).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                    this.meshRoot.addBehavior(this.pointerDragBehavior);
                }).start();
            }
            // console.log(event);
        });
    }
    showItem(){ 
      showMenu = false;
      this.meshRoot.removeBehavior(this.pointerDragBehavior);
      new TWEEN.Tween(this.root.camera).to({radius:3},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
      if(this.name.includes("Hand"))
        new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:0,z:BABYLON.Angle.FromDegrees(360).radians()},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
      else
        new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(110).radians(),y:0,z:BABYLON.Angle.FromDegrees(180).radians()},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();        
      
      new TWEEN.Tween(this.meshRoot.position).to({x:1.9,y:2.32,z:.05},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
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
        if(this.name.includes("Hand"))
          new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:0,z:0},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        else
          new TWEEN.Tween(this.meshRoot.rotation).to({x:0,y:BABYLON.Angle.FromDegrees(90).radians(),z:0},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();            
        new TWEEN.Tween(this.meshRoot.position).to({x:this.startPosition.x,y:this.startPosition.y,z:this.startPosition.z},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
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