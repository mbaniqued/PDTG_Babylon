import { GameState,ANIM_TIME,event_objectivecomplete } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";
let showMenu=false;
export default class SinkItem{
        constructor(name,root,meshobj,position){
            this.name            = name;
            this.root            = root;
            this.meshRoot        = meshobj;
            this.position        = position;
            this.meshRoot.position = new BABYLON.Vector3(this.position.x,this.position.y,this.position.z);
            this.label = this.root.gui2D.createRectLabel(this.name,228,36,10,"#FFFFFF",this.meshRoot,0,-50);
            this.label.isVisible=false;
            this.label.isPointerBlocker=true;
            this.initAction();
            this.state=0;

        }
        removeAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                childmesh.actionManager = null;
            });
        }
        initAction(){
            this.meshRoot.getChildMeshes().forEach(childmesh => {
                this.addAction(childmesh);
            });
        }
        addAction(mesh){
            mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                this.label.isVisible =  this.state<100;

            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                this.label.isVisible=false
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                this.label.isVisible =  this.state<100;
            }))
            mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (object)=> {
                console.log(this.root.gamestate.state+"!! OnPickTrigger!!! "+this.state);
                if(this.state>0 && this.root.gamestate.state === GameState.default)
                    this.state=0;
                if(this.state>=100){
                    // if(this.name.includes("Mask")){
                    //     this.useMask(300);
                    // }
                    return;
                }
                if(this.root.gui2D.userExitBtn.isVisible)
                    return;
                switch(this.state){
                        case 0:
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(135).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
                                this.root.gamestate.state  =  GameState.focus;
                                this.state=1;
                            }).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(60).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root.camera).to({radius:2.3},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
                            // 1.98,y:2.02,z:-1.89
                            this.root.setFocusOnObject(new BABYLON.Vector3(1.98,2.02-.3,-1.89-1.2));
                        break;
                    case 1:
                        this.label.isVisible=false;
                        showMenu =!showMenu;
                        this.root.gamestate.state = showMenu?GameState.radial:GameState.active;
                        this.root.gui2D.drawRadialMenu(showMenu);
                        this.root.gui2D.resetCamBtn.isVisible=!showMenu;
                        this.root.gui2D.inspectBtn._onPointerUp = ()=>{
                            this.root.hideOutLine(this.meshRoot);
                            showMenu = false;
                            this.root.gui2D.drawRadialMenu(false);  
                            this.showItem();
                        };
                        this.root.gui2D.useBtn._onPointerUp = ()=>{
                            showMenu = false;
                            this.root.gui2D.drawRadialMenu(false);  
                            this.root.hideOutLine(this.meshRoot);
                            if( this.meshRoot.name  === "liquidhandsoap_node"){
                                this.state=100;
                                this.root.showResetViewButton(true);
                            }
                            else{
                                this.root.showResetViewButton(true);
                            }
                            
                        };
                        this.root.gui2D.crossBtn._onPointerUp = ()=>{
                            showMenu = false;
                            this.root.gui2D.drawRadialMenu(false);  
                            this.root.gamestate.state = GameState.active;
                            this.root.hideOutLine(this.meshRoot);
                        };
                        break;
                    }
                }     
            )
        )
    }
     showItem(){ 
        showMenu = false;
        // new TWEEN.Tween(this.root.camera).to({radius:2},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
         if( this.meshRoot.name  === "liquidhandsoap_node")
            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(90).radians(),y:BABYLON.Angle.FromDegrees(0).radians(),z:BABYLON.Angle.FromDegrees(360).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
         else
          new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(0).radians(),y:BABYLON.Angle.FromDegrees(135).radians(),z:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
          new TWEEN.Tween(this.meshRoot.scaling).to({x:1.3,y:1.3,z:1.3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
          new TWEEN.Tween(this.meshRoot.position).to({x:this.root.camera.target.x-.5,y:this.root.camera.target.y+.5,z:this.root.camera.target.z+.5},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
           this.root.showResetViewButton(false);
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
          if( this.meshRoot.name  === "liquidhandsoap_node")
            new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(90).radians(),y:BABYLON.Angle.FromDegrees(0).radians(),z:BABYLON.Angle.FromDegrees(0).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
          else
             new TWEEN.Tween(this.meshRoot.rotation).to({x:BABYLON.Angle.FromDegrees(90).radians(),y:BABYLON.Angle.FromDegrees(45).radians(),z:BABYLON.Angle.FromDegrees(0).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
          new TWEEN.Tween(this.meshRoot.scaling).to({x:1,y:1,z:1},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();        
          new TWEEN.Tween(this.meshRoot.position).to({x:this.position.x,y:this.position.y,z:this.position.z},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
            this.root.showResetViewButton(true);
          }).start();
      }
}