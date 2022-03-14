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
import ACRemote from "../Components/acremote.js";
import Item from "../Components/item.js";
import GUI2D from "../gui.js";
import LightSwitch from "../Components/lightswtich.js";
import TWEEN from '@tweenjs/tween.js';

export const GameState={default:0,focus:1,active:2,radial:3,menu:4,levelstage:5,useitem:6};
export const usermode={patient:0,caregiver:1};
export const gamemode={training:0,practice:1,assessment:2};
export const ANIM_TIME=1000;

let SX=0,SY=0,SZ=0;
export default class MainScene {
  constructor(gameManager) {
    this.game = gameManager;
    this.sceneCommon = new Common(this);
    this.scene  = this.sceneCommon.createScene("basic");
    this.camera = this.sceneCommon.createCamera(this.scene);
    this.gui2D  = new GUI2D(this);
    this.gamestate        = {state:GameState.menu}; 
    this.trollyRoot       = new BABYLON.TransformNode("TROLLY"),
    this.tableRoot        = new BABYLON.TransformNode("TABLE");
    this.cabinetRoot      = new BABYLON.TransformNode("CABINET");
    this.doorRoot         = new BABYLON.TransformNode("DOOR");
    this.acRemoteRoot     = new BABYLON.TransformNode("ACREMOTe");
    this.apdmachineRoot   = new BABYLON.TransformNode("APDMACHINE");
    this.windowFrameRoot  = new BABYLON.TransformNode("WINDOW");
    
    this.windowbox=undefined,this.lightswtich=undefined;
    this.loaderManager  = new LoaderManager(this);
    this.game.engine.hideLoadingUI();
    this.pickMesh=null,this.focusMesh=null;
    this.trollyObject=undefined,this.tableObject=undefined,this.cabinetObject=undefined,this.doorObject=undefined,this.windowObject=undefined;
    this.acItem = undefined,this.bpMachineItem= undefined,this.connectionItem= undefined,this.alcohalItem= undefined,this.maskItem= undefined,this.drainBagItem= undefined;
    this.ccpdRecordBook=undefined,this.lightswtichObject=undefined;
   

    this.dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 256, this.scene);
    // this.testMesh = new BABYLON.Mesh("test");
    
    
    this.userMode = usermode.patient;
    this.gamemode = gamemode.training;
    // this.sceneOptimiser = new SceneOptimiser(50,500,this.scene);
    // this.sceneOptimiser.startOptimiser();
  }


  initScene() {

    // this.highlightLayer = new BABYLON.HighlightLayer("highlightLayer",this.scene, { camera: this.arcCam });
    // let mesh = this.door.getChildren()[1].getChildren()[0];
    // this.highlightLayer.addMesh(mesh, BABYLON.Color3.White());
    // this.highlightLayer.blurHorizontalSize=1;
    // this.highlightLayer.blurVerticalSize=1;
    // this.highlightLayer.innerGlow=true;
    // this.highlightLayer.outerGlow=false;


    this.trollyObject   = new Trolly(this,this.trollyRoot,{x:-2.85,y:1.78,z:2.5});
    this.tableObject    = new Table(this,this.tableRoot,{x:-.25,y:1.9,z:2.5});
    this.cabinetObject  = new Cabinet(this,this.cabinetRoot,{x:1.9,y:1,z:2.5});
    this.doorObject     = new DoorObject(this,this.doorRoot,{x:8.8,y:2.2,z:2.75});
    this.windowObject   = new WindowFrame(this,this.windowFrameRoot,{x:-7.9,y:3.45,z:2});
    this.acItem         = new ACRemote(this,this.acRemoteRoot,{x:-5.5,y:.9,z:.5});

    this.lightswtichObject = new LightSwitch(this,this.lightswtich);
    
    this.bpMachineItem     = new Item("Blood Pressure Monitor",this,this.scene.getTransformNodeByID("bpmachinenode"),{x:-69,y:30,z:33},{x:-93,y:17,z:-8},undefined);
    this.createBpText();
    

    this.connectionItem    = new Item("Connection Shield",this,this.scene.getTransformNodeByID("ConnectionShield"),{x:-70,y:5,z:38.5},{x:-65,y:-55,z:-4},undefined); 
    this.alcohalItem       = new Item("Alchohal Wipe",this,this.scene.getTransformNodeByID("Alcohol_Wipe"),{x:-45,y:8,z:38.5},{x:-36,y:-53,z:-4},{x:0,y:0,z:90});
    this.maskItem          = new Item("Face Mask",this,this.scene.getTransformNodeByID("SurgicalMask"),{x:36,y:32,z:20},{x:0,y:-66,z:-14},undefined);
    this.drainBagItem      = new Item("Drain Bag",this,this.scene.getTransformNodeByID("DrainBag"),{x:-9,y:4,z:34},{x:70,y:-52,z:-10},{x:0,y:0,z:-90});
    this.ccpdRecordBook    = new Item("CCPD Record Book",this,this.scene.getTransformNodeByID("ccpdrecordbook"),{x:35,y:1,z:38},{x:-64,y:-10,z:-3},undefined);
    let val=1;
    
    document.addEventListener('keydown', (event)=> {
      console.log(event.key);
      switch(event.key){
         case "ArrowDown":
            SY -=val;
          break;
        case "ArrowUp":
            SY +=val;
          break;
        case "ArrowLeft":
            SX-=val;
          break;
        case "ArrowRight":
            SX+=val;
          break;
        case "1":
            SZ+=val;
          break;
        case "2":
            SZ-=val;
          break;
      }
      // // -42!! sz !! -66
      // console.log("!! sx!! "+SX+" !!sy!!  "+SY+"!! sz !! "+SZ);  
  }, false);
    this.scene.onPointerObservable.add((pointerInfo) => {      	

      if(this.gamestate.state === GameState.menu)
        return ;
      if(this.gamestate.state !== GameState.radial){
          switch (pointerInfo.type) {
              case BABYLON.PointerEventTypes.POINTERDOWN:{
                      const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                        if(pickinfo.pickedMesh){
                          this.onpickMesh(pickinfo.pickedMesh);
                        }
                    }
                break;
              case BABYLON.PointerEventTypes.POINTERUP:{
                        // console.log(this.pickMesh);
                        if(this.pickMesh){
                          this.updateObjectOutLine(false);
                            this.pickMesh.renderOutline=false;
                            this.pickMesh = null;
                        }
                    }
                break;
              case BABYLON.PointerEventTypes.POINTERMOVE:{ 
                          const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                          if(pickinfo.pickedMesh) {
                            this.onpickMesh(pickinfo.pickedMesh);
                          }
                          else{
                            if(this.pickMesh)
                              this.pickMesh.renderOutline=false;
                              this.updateObjectOutLine(false);
                              this.pickMesh = null;
                          }
                  }
                break;
            }
          }
      });
      this.gui2D.resetCamBtn._onPointerUp=()=>{
        this.setCameraTarget(); 
      } 
  }
  createBpText(){

    const bpPlan = BABYLON.MeshBuilder.CreatePlane("bptextplan",{width:8,height:5,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
    bpPlan.parent = this.bpMachineItem.meshRoot;
    bpPlan.isPickable=false;
    bpPlan.renderOutline=false;
    bpPlan.outlineWidth=0;
    const planmat = new BABYLON.StandardMaterial("bptextmat", this.scene);
    const size = 256;
    planmat.diffuseColor  = new BABYLON.Color3.FromInts(128,135,148);
    planmat.emissiveColor = new BABYLON.Color3.FromInts(128,135,148);
    
    
    this.dynamicTexture.hasAlpha=true;
    planmat.diffuseTexture = this.dynamicTexture;
    bpPlan.material  = planmat;
    bpPlan.scaling   = new BABYLON.Vector3(1.4,3.2,1);
    bpPlan.position  = new BABYLON.Vector3(17.8,13,-9.9);
    bpPlan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(-30).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
    this.setbpRecord(0,0,0)
  }
  setbpRecord(v1,v2,v3){

    console.log(v1);
    let ctx = this.dynamicTexture.getContext();
    
    const font_size = 64;
    const font_type = "Orbitron";
    const font = font_size + "px " + font_type;
    ctx.clearRect(0, 0, 256, 256)
    this.dynamicTexture.drawText(v1+"",90, 70, font, "#808794", "transparent", true);
    this.dynamicTexture.drawText(v2+"",90, 150, font, "#808794", "transparent", true);
    this.dynamicTexture.drawText(v3+"",90, 230, font, "#808794", "transparent", true);
    // this.dynamicTexture.update();
  }
  onpickMesh(pickedMesh){

    
    // console.log(mesh.name);
    if(this.pickMesh && pickedMesh.name !== this.pickMesh.name){
      this.updateObjectOutLine(false);
      this.pickMesh.renderOutline=false;
    }
    if(pickedMesh.name ==="glassplane")
        this.pickMesh = this.windowbox;
    else if(pickedMesh.name ==="windowframeplan"){
        this.windowFrameRoot.getChildMeshes().forEach(childmesh => {
          if(childmesh.name==="windowframe")
            this.pickMesh = childmesh;
      });
    }
    else{
        if(this.focusMesh)
            this.checkObjectChange(this.focusMesh,pickedMesh);
        this.focusMesh = pickedMesh;
        this.pickMesh = pickedMesh;
    }

    this.updateObjectOutLine(true);
    this.pickMesh.renderOutline=true;
  }

  checkObjectChange(root1,root2){
    while(root1.parent !== null) {
        root1 = root1.parent;
    }
    while(root2.parent !== null) {
         root2 = root2.parent;
    }
    if(root1.name !== root2.name){
      if(this.gamestate.state != GameState.radial){
          console.log(root1.name+"      "+root2.name);
          this.gamestate.state = GameState.default;
      }
    }
  }
  updateObjectOutLine(value){
    if(!this.pickMesh)
      return;
    if(this.pickMesh.parent.parent && (this.pickMesh.parent.parent.name.includes("cabinet"))){
      let leftnode = this.scene.getTransformNodeByID("cabinetleftDoor").getChildMeshes()[0];
      leftnode.renderOutline=value;
      let rightnode = this.scene.getTransformNodeByID("cabinetrightDoor").getChildMeshes()[0];
      rightnode.renderOutline=value;
   }
   
   if(this.pickMesh.parent.name.includes("trollynode")){
        // alert(this.pickMesh.parent.name);
        this.pickMesh.parent.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.renderOutline=value;
        });
    }
    if(this.pickMesh.parent.name.includes("apdnode")){
      // alert(this.pickMesh.parent.name);
      this.pickMesh.parent.parent.getChildMeshes().forEach(childmesh=>{
          if(childmesh.id.includes("DeviceDialysisReference_primitive1"))
            childmesh.renderOutline=value;
      });
    }
    
    if(this.pickMesh.parent.name.includes("bpmachinenodeitems")){
      console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.renderOutline=value;
      });
    }
    if(this.pickMesh.parent.name.includes("ccpdrecordbook")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.outlineWidth=.1;
            childmesh.renderOutline=value;
      });
    }
    
    
    
  }
  setCameraTarget(){
    this.showResetViewButton(false);
    this.gamestate.state = GameState.default;
    this.sceneCommon.camVector  = new BABYLON.Vector3(0,3.2,0);
    this.camera.position.set(0,this.sceneCommon.camVector.y,0);
    this.camera.lowerAlphaLimit =  null;
    this.camera.upperAlphaLimit =  null;
    this.camera.lowerBetaLimit  =  null;
    this.camera.upperBetaLimit  =  null;
    new TWEEN.Tween(this.camera.target).to({x:this.sceneCommon.camVector.x,y:this.sceneCommon.camVector.y,z:this.sceneCommon.camVector.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
      }).start();
    new TWEEN.Tween(this.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
      }).start();
    // new TWEEN.Tween(this.camera).to({alpha: BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    // }).start();
    new TWEEN.Tween(this.camera).to({radius:3},ANIM_TIME*.5).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
    }).start();
    
  }
  setFocusOnObject(pos){
    new TWEEN.Tween(this.camera.target).to({x:pos.x,y:pos.y,z:pos.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
        // this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit=this.camera.alpha;
        // this.camera.lowerBetaLimit = this.camera.upperBetaLimit=this.camera.beta;
        if(this.gamestate.state === GameState.focus || this.gamestate.state === GameState.active)
            this.showResetViewButton(true);
        else
            this.showResetViewButton(false);

    }).start();
  }
  // setFocusOnDoor(pos){
  //   new TWEEN.Tween(this.camera.target).to({x:pos.x,y:pos.y,z:pos.z},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
  //       this.gamestate.state =  GameState.pick;
  //       this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit = this.camera.alpha;
  //   }).start();
  //   if(this.camera.alpha>2)
  //         new TWEEN.Tween(this.camera).to({alpha:3.25},500).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
  //   }).start();
  // }
  showResetViewButton(isVisible){
    this.gui2D.resetCamBtn.isVisible = isVisible;
  }
}
