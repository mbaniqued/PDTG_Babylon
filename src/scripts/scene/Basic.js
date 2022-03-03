// https://github.com/mbaniqued/PDTG_Babylon
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import LoaderManager from "../LoaderManager.js";
import Common from '../Common.js' 
import DoorObject from "../Components/doorobject.js";
import Table from "../Components/table.js";
import Trolly from "../Components/trolly.js";
import Cabinet from "../Components/cabinet.js";
import WindowFrame from "../Components/windowframe.js"; 
import Item from "../Components/item.js";

export const ObjectState={default:0,pick:1,picked:2};
import TWEEN from '@tweenjs/tween.js';
export default class BasicScene {
  constructor(gameManager) {
    this.game = gameManager;
    this.sceneCommon = new Common(this.game);
    this.scene  = this.sceneCommon.createScene("basic");
    this.camera = this.sceneCommon.createCamera(this.scene);
    this.gamestate        = {state:ObjectState.default}; 
    this.trollyRoot       = new BABYLON.TransformNode("TROLLY"),
    this.tableRoot        = new BABYLON.TransformNode("TABLE");
    this.cabinetRoot      = new BABYLON.TransformNode("CABINET");
    this.doorRoot         = new BABYLON.TransformNode("DOOR");
    this.acRemoteRoot     = new BABYLON.TransformNode("ACREMOTe");
    this.apdmachineRoot   = new BABYLON.TransformNode("APDMACHINE");
    this.windowFrameRoot  = new BABYLON.TransformNode("WINDOW");
    this.windowbox=undefined;

    
    this.loaderManager  = new LoaderManager(this);
    this.game.engine.hideLoadingUI();
    this.pickMesh=null;
    this.trollyObject=undefined,this.tableObject=undefined,this.cabinetObject=undefined,this.doorObject=undefined,this.windowObject=undefined;
    this.acItem= undefined;
    

    // this.sceneOptimiser = new SceneOptimiser(50,500,this.scene);
     //this.sceneOptimiser.startOptimiser();
  }


  initScene() {

    // this.highlightLayer = new BABYLON.HighlightLayer("highlightLayer",this.scene, { camera: this.arcCam });
    // let mesh = this.door.getChildren()[1].getChildren()[0];
    // this.highlightLayer.addMesh(mesh, BABYLON.Color3.White());
    // this.highlightLayer.blurHorizontalSize=1;
    // this.highlightLayer.blurVerticalSize=1;
    // this.highlightLayer.innerGlow=true;
    // this.highlightLayer.outerGlow=false;


    this.trollyObject   = new Trolly(this,this.trollyRoot,{x:-2.85,y:1.1,z:2.5});
    this.tableObject    = new Table(this,this.tableRoot,{x:-.25,y:1,z:2.5});
    this.cabinetObject  = new Cabinet(this,this.cabinetRoot,{x:1.9,y:1,z:2.5});
    this.doorObject     = new DoorObject(this,this.doorRoot,{x:8.8,y:2.2,z:2.75});
    this.windowObject   = new WindowFrame(this,this.windowFrameRoot,{x:-7.9,y:3.45,z:2});
    this.acItem         = new Item(this,this.acRemoteRoot,{x:-5.5,y:.9,z:.5});
    
    this.scene.onPointerObservable.add((pointerInfo) => {      	
      switch (pointerInfo.type) {
          case BABYLON.PointerEventTypes.POINTERDOWN:{
                  const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                  if (pickinfo.pickedMesh) {
                    if(this.pickMesh && pickinfo.pickedMesh.name !== this.pickMesh.name)
                        this.pickMesh.renderOutline=false;
                        if(pickinfo.pickedMesh.name ==="glassplane")
                            this.pickMesh = this.windowbox;
                        else if(pickinfo.pickedMesh.name ==="windowframeplan"){
                            this.windowFrameRoot.getChildMeshes().forEach(childmesh => {
                              if(childmesh.name==="windowframe")
                                this.pickMesh = childmesh;
                          });
                        }
                        else    
                          this.pickMesh= pickinfo.pickedMesh;
                        this.onpickMesh(this.pickMesh);
                      
                      console.log(pickinfo.pickedMesh.name);
                  }
                }
            break;
          case BABYLON.PointerEventTypes.POINTERUP:{
                    // console.log(this.pickMesh);
                     if(this.pickMesh){
                        this.pickMesh.renderOutline=false;
                        this.pickMesh = null;
                     }
                }
            break;
          case BABYLON.PointerEventTypes.POINTERMOVE:{ 
                      const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                      if(pickinfo.pickedMesh) {
                          if(this.pickMesh && pickinfo.pickedMesh.name !== this.pickMesh.name)
                            this.pickMesh.renderOutline=false;
                            this.pickMesh = pickinfo.pickedMesh;
                          if(pickinfo.pickedMesh.name ==="glassplane")
                              this.pickMesh = this.windowbox;
                          else if(pickinfo.pickedMesh.name ==="windowframeplan"){
                                this.windowFrameRoot.getChildMeshes().forEach(childmesh => {
                                  if(childmesh.name==="windowframe")
                                    this.pickMesh = childmesh;
                              });
                          }
                          else
                              this.pickMesh =pickinfo.pickedMesh;
                            this.onpickMesh(pickinfo.pickedMesh);
                      }
                      else{
                        if(this.pickMesh)
                          this.pickMesh.renderOutline=false;
                          this.pickMesh = null;
                      }
              }
            break;
        }
  });
  

  // function mousemovef(){
	//     var pickResult = scene.pick(scene.pointerX, scene.pointerY);
	//     if (pickResult.hit) {
	// 	    var diffX = pickResult.pickedPoint.x - box.position.x;
	// 	    var diffY = pickResult.pickedPoint.z - box.position.z;
  //       console.log(pickResult.hit);
  //   	}	
  //   }
  }
  setCameraTarget(){
    
    this.sceneCommon.camVector  = new BABYLON.Vector3(0,3.2,0);
    this.camera.position.set(0,this.sceneCommon.camVector.y,0);
    
    this.camera.lowerAlphaLimit =  null;
    this.camera.upperAlphaLimit =  null;
    new TWEEN.Tween(this.camera.target).to({x:this.sceneCommon.camVector.x,y:this.sceneCommon.camVector.y,z:this.sceneCommon.camVector.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    }).start();
    new TWEEN.Tween(this.camera).to({beta: BABYLON.Angle.FromDegrees(90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    }).start();
    // new TWEEN.Tween(this.camera).to({alpha: BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    // }).start();
    new TWEEN.Tween(this.camera).to({radius:3},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    }).start();
    
  }
  setFocusOnObject(pos){
    new TWEEN.Tween(this.camera.target).to({x:pos.x,y:pos.y,z:pos.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit=this.camera.alpha;
    }).start();
  }
  setFocusOnDoor(pos){
    new TWEEN.Tween(this.camera.target).to({x:pos.x,y:pos.y,z:pos.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        this.gamestate.state =  ObjectState.pick;
        this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit = this.camera.alpha;
    }).start();
    if(this.camera.alpha>2)
          new TWEEN.Tween(this.camera).to({alpha:3.25},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    }).start();
  }
  onpickMesh(mesh){
        mesh.renderOutline=true;
  }

}
