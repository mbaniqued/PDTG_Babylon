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
import CabinetItem from "../Components/cabinetitem.js"; 
import FanSwitch from "../Components/fanswitch.js";
import SinkItem from "../Components/sinkitem.js";
import TWEEN from '@tweenjs/tween.js';
import * as GUI from 'babylonjs-gui';
import { FOV } from "../Common.js";
import HandWash from "../Components/handwash.js";
import AlcohalWipe from "../Components/alcohalwipe.js";

export const GameState={default:0,focus:1,active:2,radial:3,menu:4,levelstage:5,useitem:6,loading:7,inspect:8};
export const usermode={patient:0,caregiver:1};
export const gamemode={training:0,practice:1,assessment:2};
export const ANIM_TIME=1000;
export const event_objectivecomplete = "event_objectivecomplete";



let gameObjectives=[];

let SX=0,SY=0,SZ=0;
export default class MainScene {
  constructor(gameManager) {
    this.isSceneCreated=false;
    this.game = gameManager;
    this.sceneCommon = new Common(this);
    this.scene  = this.sceneCommon.createScene("basic");
    this.camera = this.sceneCommon.createCamera(this.scene);
    this.gui2D  = new GUI2D(this);
    
    this.trollyRoot       = new BABYLON.TransformNode("TROLLY"),
    this.tableRoot        = new BABYLON.TransformNode("TABLE");
    this.cabinetRoot      = new BABYLON.TransformNode("CABINET");
    this.doorRoot         = new BABYLON.TransformNode("DOOR");
    this.acRemoteRoot     = new BABYLON.TransformNode("ACREMOTe");
    this.apdmachineRoot   = new BABYLON.TransformNode("APDMACHINE");
    this.windowFrameRoot  = new BABYLON.TransformNode("WINDOW");
    this.loaderManager    = new LoaderManager(this);
    this.game.engine.hideLoadingUI();
    
    this.windowbox=undefined,this.lightswtich=undefined;
    this.pickMesh=null,this.focusMesh=null;
    this.trollyObject=undefined,this.tableObject=undefined,this.cabinetObject=undefined,this.doorObject=undefined,this.windowObject=undefined;
    this.acItem = undefined,this.bpMachineItem= undefined,this.connectionItem= undefined,this.alcohalItem= undefined,this.maskItem= undefined,this.drainBagItem= undefined;
    this.ccpdRecordBook=undefined,this.apdmachinePackage=undefined,this.lightswitchObject=undefined,this.dialysisSolutionObject=[],this.sanitiserObject=[];
    this.fanAnim = null,this.paperTowelObject=undefined,this.handSoapObject=undefined;
    this.handwashactivity,this.wipeAlcohal,this.validationImage=[];

    const size= 512;
    this.dynamicTexture   = new BABYLON.DynamicTexture("dynamictexture",size,this.scene);
    
    // this.sceneOptimiser = new SceneOptimiser(50,500,this.scene);
    // this.sceneOptimiser.startOptimiser();
    this.level=0,this.isUp=false,this.objectiveCount=0,this.totalobjective=0,this.itemCount=0,this.dialysisItemCnt=0,this.handsanitiserCnt=0;
    
    this.bpBalue="";
    this.initState();
    this.initacParticle();
    this.handwashactivity = new HandWash(this);
    this.handwashactivity.drawhandWash(false);

    this.wipeAlcohal = new AlcohalWipe(this);
    this.addevents();

    this.validationImage[0]     = new Image();
    this.validationImage[0].src =  '/ui/questionmark.png';
    this.validationImage[1]     = new Image();
    this.validationImage[1].src = '/ui/green.png';
    this.validationImage[2]     = new Image();
    this.validationImage[2].src = '/ui/cross2_png.png';
    
  }
  initState(){
    this.gamestate  = {state:GameState.menu}; 
    this.userMode   = usermode.patient;
    this.gamemode   = gamemode.training;
  }
  
  async initScene() {
    return  new Promise(resolve => {
    this.viewportFrame =  this.gui2D.createRect("viewportFrame",400,228,0,"#FFFFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
    this.viewportFrame.width  =.22;
    this.viewportFrame.height = .3;
    this.viewportFrame.isVisible=false;
    this.viewportFrame.leftInPixels=400;

    this.trollyObject      = new Trolly(this,this.trollyRoot,{x:-2.85,y:1.78,z:2.5});
    this.createapdmachineText();
    this.tableObject       = new Table(this,this.tableRoot,{x:-.25,y:1.9,z:2.5});
    this.cabinetObject     = new Cabinet(this,this.cabinetRoot,{x:1.9,y:1,z:2.5});
    this.doorObject        = new DoorObject(this,this.doorRoot,{x:8.8,y:2.2,z:2.75});
    this.windowObject      = new WindowFrame(this,this.windowFrameRoot,{x:-7.9,y:3.45,z:2});
    this.acItem            = new ACRemote(this,this.acRemoteRoot,{x:-5,y:.9,z:.5});
    this.lightswitchObject = new LightSwitch(this,this.lightswtich);
    this.fanswitchobject   = new FanSwitch(this,this.scene.getNodeByName("fanswitchnode"));
    
    
    this.bpMachineItem     = new Item("Blood Pressure Monitor",this,this.scene.getTransformNodeByID("bpmachinenode"),{x:-69,y:30,z:33},{x:-93,y:17,z:-8},undefined);
    this.createBpText();
    this.connectionItem    = new Item("Connection Shield",this,this.scene.getTransformNodeByID("ConnectionShield"),{x:-70,y:5,z:38.5},{x:-65,y:-55,z:-4},undefined); 
    this.createconnectionItemValidation();
    this.alcohalItem       = new Item("Alchohal Wipe",this,this.scene.getTransformNodeByID("Alcohol_Wipe"),{x:-45,y:8,z:38.5},{x:-36,y:-53,z:-4},{x:0,y:0,z:90});
    this.maskItem          = new Item("Face Mask",this,this.scene.getTransformNodeByID("SurgicalMask"),{x:36,y:32,z:20},{x:0,y:-66,z:-14},undefined);
    this.drainBagItem      = new Item("Drain Bag",this,this.scene.getTransformNodeByID("DrainBag"),{x:-9,y:4,z:34},{x:70,y:-52,z:-10},{x:0,y:0,z:-90});
    this.drainBagItem.setTrollyPosition({x:-265,y:1,z:138});
    this.createdrainBagValidation();
    this.ccpdRecordBook    = new Item("CCPD Record Book",this,this.scene.getTransformNodeByID("ccpdrecordbook"),{x:35,y:1,z:38},{x:-64,y:-10,z:-3},undefined);
    this.apdmachinePackage = new Item("APD Cassette Package",this,this.scene.getTransformNodeByID("apd_package_node"),{x:75,y:-10,z:38},{x:-9,y:6,z:-5},undefined);
    this.apdmachinePackage.setTrollyPosition({x:-231,y:-16,z:8});
    this.createApdPackageValidatiion();
    
    // const solutionclone = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode");
    this.dialysisSolutionObject[0] = new CabinetItem("Dialysis Solution",this,this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode0"),{x:2.16,y:1.57,z:2.34});

    // const solutionclone1 = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode1");
    // this.scene.getTransformNodeByID("diasolutionnode").setEnabled(true);
    this.dialysisSolutionObject[1] = new CabinetItem("Dialysis Solution",this,this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode1"),{x:2.16,y:1.17,z:2.34});
    // const solutionclone2 = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode2");
    this.dialysisSolutionObject[2] = new CabinetItem("Dialysis Solution",this,this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode3"),{x:2.16,y:.78,z:2.34});
    // const solutionclone3 = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode3");
    this.dialysisSolutionObject[3] = new CabinetItem("Dialysis Solution",this,this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode3"),{x:2.16,y:.31,z:2.34});

    this.scene.getTransformNodeByID("diasolutionnode").getChildMeshes().forEach(childmesh => {
      childmesh.isVisible = false;
    });
    
    
    
    this.sanitiserObject[0]   = new CabinetItem("Hand Sanitizer ",this,this.scene.getTransformNodeByID("handsanitizernode"),{x:1.47,y:1.07,z:2.6});
    const sanitizerclone2 = this.scene.getTransformNodeByID("handsanitizernode").clone("sanitizer2");
    this.sanitiserObject[1]   = new CabinetItem("Hand Sanitizer ",this,sanitizerclone2,{x:1.47,y:1.07,z:2.4});
    const sanitizerclone3 = this.scene.getTransformNodeByID("handsanitizernode").clone("sanitizer3");
    this.sanitiserObject[2]   = new CabinetItem("Hand Sanitizer ",this,sanitizerclone3,{x:1.47,y:1.07,z:2.2});

    this.paperTowelObject  = new SinkItem("PaperTowel",this,this.scene.getNodeByName("papertowel_node"),{x:1.9,y:2.02,z:-1.89});
    this.handSoapObject    = new SinkItem("Hand Soap",this,this.scene.getNodeByName("liquidhandsoap_node"),{x:2.25,y:2.17,z:-2.19});

    this.createccpdCanvas();
    this.startFan();

    
    this.gui2D.resetCamBtn.onPointerUpObservable.add(()=>{
        this.setCameraTarget(); 
        this.sceneCommon.removeMiniCam();
        this.handwashactivity.drawhandWash(false);
        this.gui2D.advancedTexture.renderAtIdealSize=false;
      }) 
      resolve('resolved');
    });
  }
  addevents(){
    document.addEventListener('keydown', (event)=> {
      // console.log(event.key);
      const val=1;
      switch(event.key){
         case "ArrowDown":
            SY -=val;
            // this.apdmachinePackage.removeAction();
          break;
        case "ArrowUp":
            SY +=val;
            // this.apdmachinePackage.initAction();
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
      // let ctx = this.apdmachineTexture.getContext();
      //   const font =  "bold 52px Orbitron";
      //   ctx.clearRect(0,0,512,512);
      //   this.apdmachineTexture.drawText("LOAD THE SET",SX,SY,font,"#0000ff","transparent",true);

      
      // this.apdmachinePackage.meshRoot.position  = new BABYLON.Vector3(SX,SY,SZ); 
      // this.scene.getMeshByName("backsidePlan").position   = new BABYLON.Vector3(SX,SY,SZ); 
      
      // this.scene.getMeshByName("cap_highlight_plan").rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(SX).radians(),BABYLON.Angle.FromDegrees(SY).radians(),BABYLON.Angle.FromDegrees(SZ).radians());  
      // this.scene.getMeshByName("validation_plan").rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(SX).radians(),BABYLON.Angle.FromDegrees(SY).radians(),BABYLON.Angle.FromDegrees(SZ).radians());  
      // let ctx = this.connectionTexture.getContext();
      // const font =  "bold 28px Arial";
      // ctx.clearRect(0,0,128,128);
      // this.connectionTexture.drawText("2024",SX,SY,font,"#0000ff","transparent",true);

      
      console.log("!! sx!! "+SX+" !!sy!!  "+SY+"!! sz !! "+SZ);  
  }, false);
   this.scene.onPointerObservable.add((pointerInfo) => {    
    
    // if(this.gamestate.state === GameState.menu || this.gamestate.state === GameState.levelstage || this.gamestate.state === GameState.radial)
    //     return ;
      switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:{
                    const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
                    console.log(pickinfo);
                      if(pickinfo.pickedMesh){
                        console.log(pickinfo.pickedMesh.name);  	
                        this.onpickMesh(pickinfo.pickedMesh);
                      }
                  }
              break;
            case BABYLON.PointerEventTypes.POINTERUP:{
                    if(this.pickMesh){
                      // this.updateObjectOutLine(false);
                        // this.pickMesh.renderOutline=false;
                        this.pickMesh = null;
                    }
                }
              break;
            case BABYLON.PointerEventTypes.POINTERMOVE:{ 
                    const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);

                    if(pickinfo.pickedMesh) {
                      console.log(pickinfo.pickedMesh.name);
                      this.onpickMesh(pickinfo.pickedMesh);
                    }
                    else{
                      if(this.pickMesh)
                        // this.pickMesh.renderOutline=false;
                        // this.updateObjectOutLine(false);
                        this.pickMesh = null;
                    }
                }
              break;
          }
      });
      this.objectiveListner = (e) => {
          this.checkObjectives(e.detail);
      }
      document.addEventListener(event_objectivecomplete,this.objectiveListner);
  }
  resetScene(){
    this.objectiveCount=0;
    this.trollyObject      = null;
    this.tableObject       = null;
    this.cabinetObject     = null;
    this.doorObject        = null;
    this.windowObject      = null;
    this.acItem            = null;
    this.lightswitchObject = null;
    this.fanswitchobject   = null;
    
    
    this.bpMachineItem     = null;
    this.connectionItem    = null; 
    this.alcohalItem       = null;
    this.maskItem          = null;
    this.drainBagItem      = null;
    this.ccpdRecordBook    = null;
    this.apdmachinePackage = null;
    
    for(let i=0;i<this.dialysisSolutionObject.length;i++){
      this.dialysisSolutionObject[i].removeValidation();
      this.removeNode(this.dialysisSolutionObject[i].meshRoot);
      this.dialysisSolutionObject[i] = null;
    }
   for(let i=0;i<this.sanitiserObject.length;i++){
      if(i!==0)
        this.removeNode(this.sanitiserObject[i].meshRoot);
        this.sanitiserObject[i]   = null;
    }
    
    // this.sanitiserObject[1]   = null;
    // this.removeNode(this.scene.getTransformNodeByID("sanitizer3"));
    // this.sanitiserObject[2]   = null;

    this.paperTowelObject  = null;
    this.handSoapObject    = null;
    this.removeMesh(this.scene.getMeshByName("glassplane"));
    this.removeMesh(this.scene.getMeshByName("windowframeplan"));
    console.log("reset suceesss");
  }
  removeMesh(mesh){
    if(mesh){
      this.scene.removeMesh(mesh);
      mesh.dispose();
    }
  }
  removeNode(node){
    if(node){
        node.getChildMeshes().forEach(childmesh => {
          this.scene.removeMesh(childmesh);
          childmesh.dispose();
      });
      this.scene.removeTransformNode(node);
      node.dispose();
    }
  }
  createapdmachineText(){
    if(this.apdmachineTexture)
        return
    const plan = BABYLON.MeshBuilder.CreatePlane("apd_machinetxt_plan",{width:.3,height:.3,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);  
    plan.position.set(-3.589,2.02,2.13);
    plan.isPickable=false;
    plan.renderOutline=false;
    plan.visibility=0;
    const planmat         = new BABYLON.StandardMaterial("validation_connection_plan_mat", this.scene);
    planmat.diffuseColor  = new BABYLON.Color3.FromInts(255,255,255);
    planmat.emissiveColor = new BABYLON.Color3.FromInts(255,255,255);
    plan.material = planmat;
    this.apdmachineTexture   = this.dynamicTexture.clone();
    this.apdmachineTexture.hasAlpha=true;
    planmat.diffuseTexture = this.apdmachineTexture;
    const size=this.apdmachineTexture.getSize();
    
    let ctx = this.apdmachineTexture.getContext();
    const font =  "bold 48px Orbitron";
    ctx.clearRect(0,0,size.width,size.height);
    this.apdmachineTexture.drawText("LOAD THE SET",30,270,font,"#FFCD46","transparent",true);
    
  }
  createconnectionItemValidation(){
    if(this.connectionTexture)
      return; 
    const plan = BABYLON.MeshBuilder.CreatePlane("validation_connection_plan",{width:1,height:1,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
    plan.parent = this.connectionItem.meshRoot;
    plan.isPickable=false;
    plan.renderOutline=false;
    plan.outlineWidth=0;
    
    this.connectionTexture   = this.dynamicTexture.clone(); //new BABYLON.DynamicTexture("connection_plan_texture",size,this.scene);
    this.connectionTexture.scale(.5);
    const size=this.connectionTexture.getSize();
    this.connectionTexture.hasAlpha=true;
    const planmat         = new BABYLON.StandardMaterial("validation_connection_plan_mat", this.scene);
    planmat.diffuseColor  = new BABYLON.Color3.FromInts(255,255,255);
    planmat.emissiveColor = new BABYLON.Color3.FromInts(255,255,255);
    planmat.diffuseTexture = this.connectionTexture;
    plan.material      = planmat;
    plan.scaling   = new BABYLON.Vector3(8,4,1); 
    plan.position  = new BABYLON.Vector3(-5.2,-9.8,-.5); 
    plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());

    const plan2 = plan.clone();
    plan2.name = "highlight_plan";
    plan2.scaling   = new BABYLON.Vector3(4.5,4,1); 
    plan2.parent   = this.connectionItem.meshRoot;
    plan2.isPickable=true;
    plan2.position  = new BABYLON.Vector3(-6.8,-9.8,-.5); 
    
    const planmat2         = new BABYLON.StandardMaterial("highlight_mat", this.scene);
    planmat2.diffuseColor  = new BABYLON.Color3.FromInts(152,193,201);
    planmat2.emissiveColor = new BABYLON.Color3.FromInts(152,193,201);
    planmat2.alpha=.5;
    plan2.material = planmat2; 
    plan2.visibility=0;

    this.onhighlightConnectionPlan = (value)=>{
      plan2.visibility=value;
    }
    this.conectionValidatetion = (imgno)=>{
     let ctx = this.connectionTexture.getContext();
      const font =  "bold 64px Arial";
      ctx.clearRect(0,0,size.width,size.height);
      this.connectionTexture.drawText("2024",14,208,font,"#0000ff","transparent",true);
      if(imgno>-1)
        this.drawImageOnTexture(this.connectionTexture,this.validationImage[imgno],160,40,72,128);
    }
    this.conectionValidatetion(-1);
  }
  createdrainBagValidation(){
    if(this.drainBagTexture)
      return; 
      const plan = BABYLON.MeshBuilder.CreatePlane("validation_drainbag_plan",{width:15,height:8,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
     plan.parent = this.drainBagItem.meshRoot;
     plan.isPickable=false;
     plan.renderOutline=false;
     plan.outlineWidth=0;
     
     plan.position  = new BABYLON.Vector3(-12, 9.59,-10);
     plan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(90).radians());
     
     this.drainBagTexture   = this.dynamicTexture.clone();// new BABYLON.DynamicTexture("drain_bag_texture",size,this.scene);
     this.drainBagTexture.scale(.5);
     this.drainBagTexture.hasAlpha=true;
     const size=this.dynamicTexture.getSize();
     const planmat         = new BABYLON.StandardMaterial("validation_drainbag_plan_mat", this.scene);
     planmat.diffuseColor  = new BABYLON.Color3.FromInts(255,255,255);
     planmat.emissiveColor = new BABYLON.Color3.FromInts(255,255,255);
     planmat.diffuseTexture = this.drainBagTexture;
     plan.material      = planmat;
      

     const plan2 = plan.clone();
      plan2.name = "highlight_plan";
      plan2.scaling   = new BABYLON.Vector3(.75,.6,1); 
      plan2.parent   = this.drainBagItem.meshRoot;
      plan2.isPickable=true;
      plan2.position  = new BABYLON.Vector3(-12.6, 7.2,-10);
      const planmat2         = this.scene.getMaterialByName("highlight_mat").clone();
      planmat2.name = "highlight_plan";
      plan2.material = planmat2; 
      plan2.visibility=0;

      this.onhighlightDrainBagPlan = (value)=>{
        plan2.visibility=value;
      }
      this.updatedrainbagValidatetion = (imgno)=>{
        let ctx = this.drainBagTexture.getContext();
        const font =  "bold 32px Arial";
        ctx.clearRect(0,0,size.width,size.height);
        this.drainBagTexture.drawText("2020-04-08",4,70,font,"#000000","transparent",true);
        this.drainBagTexture.drawText("2023-04-08",4,160,font,"#000000","transparent",true);
        if(imgno>-1)
          this.drawImageOnTexture(this.drainBagTexture,this.validationImage[imgno],190,60,56,112);
      }
      this.updatedrainbagValidatetion(-1);
     
  }
  createApdPackageValidatiion(){
    if(this.apdDateTexture)
     return;
     const datePlan = BABYLON.MeshBuilder.CreatePlane("validation_apddate_plan",{width:22,height:20,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
     datePlan.parent = this.apdmachinePackage.meshRoot;
     datePlan.isPickable=false;
     datePlan.renderOutline=false;
     datePlan.outlineWidth=0;
     datePlan.position  = new BABYLON.Vector3(-9.7,-.5,-30.7);
     datePlan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
     
     this.apdDateTexture   = this.dynamicTexture.clone(); //new BABYLON.DynamicTexture("apddate_texture",size,this.scene);
     this.apdDateTexture.scale(.5);
     const size=this.apdDateTexture.getSize();
     this.apdDateTexture.hasAlpha=true;
     const planmat         = new BABYLON.StandardMaterial("validation_apddate_mat", this.scene);
     planmat.diffuseColor  = new BABYLON.Color3.FromInts(255,255,255);
     planmat.emissiveColor = new BABYLON.Color3.FromInts(255,255,255);
     planmat.diffuseTexture = this.apdDateTexture;
     datePlan.material      = planmat;
     const dateHighlightPlan    = datePlan.clone();
      dateHighlightPlan.name     = "highlight_plan";
      dateHighlightPlan.parent   = this.apdmachinePackage.meshRoot;
      dateHighlightPlan.isPickable=true;
      dateHighlightPlan.position  = new BABYLON.Vector3(-2.10,-.4,-29.8);
      dateHighlightPlan.scaling  = new BABYLON.Vector3(1.3,.3,1);
      dateHighlightPlan.visibility=0;
      const planmat2         = this.scene.getMaterialByName("highlight_mat").clone();
      dateHighlightPlan.material  = planmat2;
      
      this.onHighlightApdPlan = (value)=>{
        dateHighlightPlan.visibility=value;
      }
      this.updateApdValidatetion = (imgno)=>{
        let ctx = this.apdDateTexture.getContext();
        const font =  "bold 28px Arial";
        ctx.clearRect(0,0,size.width,size.height);
        this.apdDateTexture.drawText("2021-2022",73,153,font,"#808794","transparent",true);
        if(imgno>-1)
          this.drawImageOnTexture(this.apdDateTexture,this.validationImage[imgno],210,116,48,48);
      }
      this.updateApdValidatetion(-1);
  }
  
  drawImageOnTexture(texture,img,x,y,w,h){
      const ctx = texture.getContext();
      ctx.drawImage(img,x,y,w,h);
      texture.update();
  }
  createBpText(){
    if(this.bpnumberTexture)  
     return;

    const bpPlan = BABYLON.MeshBuilder.CreatePlane("bptextplan",{width:8,height:5,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
    bpPlan.parent = this.bpMachineItem.meshRoot;
    bpPlan.isPickable=false;
    bpPlan.renderOutline=false;
    bpPlan.outlineWidth=0;
    this.bpnumberTexture   = this.dynamicTexture.clone(); //new BABYLON.DynamicTexture("bpnumberTexture",256,this.scene);
    this.bpnumberTexture.scale(.5);
    this.bpnumberTexture.hasAlpha=true;
    const planmat         = new BABYLON.StandardMaterial("bptextmat", this.scene);
    planmat.diffuseColor  = new BABYLON.Color3.FromInts(128,135,148);
    planmat.emissiveColor = new BABYLON.Color3.FromInts(128,135,148);
    planmat.diffuseTexture = this.bpnumberTexture;
    bpPlan.material  = planmat;
    bpPlan.scaling   = new BABYLON.Vector3(1.4,3.2,1);
    bpPlan.position  = new BABYLON.Vector3(17.8,13,-8);
    bpPlan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(-30).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
    this.setbpRecord(0,false);
  
  }
  setbpRecord(v1,isupdate){
    let ctx = this.bpnumberTexture.getContext();
    const font_size = 64;
    const font_type = "Orbitron";
    const font = font_size + "px " + font_type;
    ctx.clearRect(0,0,this.bpnumberTexture.getSize().width,this.bpnumberTexture.getSize().height);
    let v2=0,v3=0;
    if(v1>0)
      this.bpnumberTexture.drawText(parseInt(v1)+"",90, 70, font,  "#808794", "transparent", true);
    else
      this.bpnumberTexture.drawText("",90, 70, font,  "#808794", "transparent", true);

      if(isupdate){
        v2 = randomNumber(70,90);
        v3 = randomNumber(60,80);
        this.bpnumberTexture.drawText(parseInt(v2)+"",90, 150, font, "#808794", "transparent", true);
        this.bpnumberTexture.drawText(parseInt(v3)+"",90, 230, font, "#808794", "transparent", true);
        this.bpBalue = parseInt(v1)+"/"+parseInt(v2)+"("+parseInt(v3)+")";
        console.log(this.bpBalue);
      }
      else{
        this.bpnumberTexture.drawText("",90, 150, font, "#808794", "transparent", true);
        this.bpnumberTexture.drawText("",90, 230, font, "#808794", "transparent", true);
      }
  }
  onpickMesh(pickedMesh){
    if(this.pickMesh && pickedMesh.name !== this.pickMesh.name){
      // this.updateObjectOutLine(false);
      // this.pickMesh.renderOutline=false;
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
    // this.updateObjectOutLine(true);
  }

  checkObjectChange(root1,root2){
    while(root1.parent !== null) {
        root1 = root1.parent;
    }
    while(root2.parent !== null) {
         root2 = root2.parent;
    }
    if(root1.name !== root2.name){
       if(!root1.name.includes("items") && !root2.name.includes("items")){
          if(this.gamestate.state != GameState.radial){
            // console.log(root1.name+"      "+root2.name);
            this.gamestate.state = GameState.default;
          }
       }
    }
  }
  hideOutLine(meshroot){
    // console.log(meshroot.parent);
    if(meshroot.parent){
        meshroot.parent.getChildMeshes().forEach(childmesh=>{
          childmesh.renderOutline=false;
      });
    }
    else{
        meshroot.getChildMeshes().forEach(childmesh=>{
          childmesh.renderOutline=false;
      });
    }
  }
  updateObjectOutLine(value){
    if(!this.pickMesh){
      return;
    }
    console.log(this.pickMesh.name + "    "+this.pickMesh.outlineWidth);
    if(this.pickMesh.outlineWidth<.01)
      return;

     
    if(!this.pickMesh.isPickable || this.pickMesh.actionManager === null){
        value = false;
        this.pickMesh.outlineWidth=0;
        this.pickMesh.renderOutline=value;
        return;
    }
    if(this.pickMesh.parent.parent && (this.pickMesh.parent.parent.name.includes("cabinet"))){
      let leftnode = this.scene.getTransformNodeByID("cabinetleftDoor").getChildMeshes()[0];
      leftnode.renderOutline=value;
      let rightnode = this.scene.getTransformNodeByID("cabinetrightDoor").getChildMeshes()[0];
      rightnode.renderOutline=value;
   } 
   else if(this.pickMesh.parent.name.includes("trollynode")){
        // alert(this.pickMesh.parent.name);
        this.pickMesh.parent.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.renderOutline=value;
        });
    }
    else if(this.pickMesh.parent.name.includes("apdnode")){
      // alert(this.pickMesh.parent.name);
      this.pickMesh.parent.parent.getChildMeshes().forEach(childmesh=>{
          if(childmesh.id.includes("DeviceDialysisReference_primitive1"))
            childmesh.renderOutline=value;
      });
    }
    else if(this.pickMesh.parent.name.includes("bpmachinenodeitems")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.renderOutline=value;
      });
    }
    else if(this.pickMesh.parent.name.includes("Connection")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.renderOutline=value;
            childmesh.outlineWidth=1;
      });
    }
    else if(this.pickMesh.parent.name.includes("ccpdrecordbook")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            if(this.pickMesh.parent.parent === this.scene.getCameraByName("maincamera")){
                childmesh.outlineWidth=0;
                childmesh.renderOutline=value;
            }
            else{
                childmesh.outlineWidth=.1;
                childmesh.renderOutline=value;
            }
      });
    }
    else if(this.pickMesh.parent.name.includes("diasolutionnode")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.outlineWidth=2;
            childmesh.renderOutline=value;
      });
    }
    else if(this.pickMesh.parent.name.includes("fanswitchnode")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.outlineWidth=0;
            if(childmesh.id ==="OnSwitch2"){
              childmesh.renderOutline=value;
              childmesh.outlineWidth=.5;
            }
            else  
              childmesh.renderOutline=false;
            
      });
    }
    else if(this.pickMesh.parent.name.includes("apd_package_node")){
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
        if(childmesh.id ==="APDCassetteRevisedWithPackaging2.001_primitive42"){
          childmesh.renderOutline=value;
          childmesh.outlineWidth=5;
          // console.log(this.pickMesh.isPickable+"  11111111   "+this.pickMesh.name) ;
        }
        else{
            childmesh.renderOutline=false;
            childmesh.outlineWidth=0;
            // console.log(this.pickMesh.isPickable+"  222222   "+this.pickMesh.name) ;
          }
      });
    } 
    else if(this.pickMesh.parent.name.includes("papertowel_node")){
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
         if(childmesh.name === "PaperTowel_primitive1")
            childmesh.renderOutline=value;
          else
            childmesh.renderOutline=false;            
          // childmesh.outlineWidth=.01;
      });
    } 
    
  }
  setCameraTarget(){
    this.showResetViewButton(false);
    this.gamestate.state = GameState.default;
    this.camera.fov=FOV;
    this.sceneCommon.camVector  = new BABYLON.Vector3(0,3.2,0);
    this.camera.position.set(0,this.sceneCommon.camVector.y,0);
    this.camera.lowerAlphaLimit =  null;
    this.camera.upperAlphaLimit =  null;
    this.camera.lowerBetaLimit  =  null;
    this.camera.upperBetaLimit  =  null;
    new TWEEN.Tween(this.camera.target).to({x:this.sceneCommon.camVector.x,y:this.sceneCommon.camVector.y,z:this.sceneCommon.camVector.z},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(()=>{}).start();
    new TWEEN.Tween(this.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
    // new TWEEN.Tween(this.camera).to({alpha: BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
    // }).start();
    new TWEEN.Tween(this.camera).to({radius:3},ANIM_TIME).easing(TWEEN.Easing.Quartic.In).onComplete(() => {}).start();
    
  }
  setFocusOnObject(pos){
    new TWEEN.Tween(this.camera.target).to({x:pos.x,y:pos.y,z:pos.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
        // this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit=this.camera.alpha;
        // this.camera.lowerBetaLimit = this.camera.upperBetaLimit=this.camera.beta;
        // if(this.gamestate.state === GameState.focus || this.gamestate.state === GameState.active)
        this.showResetViewButton(true);
    }).start();
  }
  showResetViewButton(isVisible){
    this.gui2D.resetCamBtn.isVisible = isVisible;
  }
  startFan(){
      const fanNode =  this.scene.getNodeByName("fannode");
      if(this.fanAnim == null){
        this.fanAnim = new TWEEN.Tween(fanNode.rotation).to({y:BABYLON.Angle.FromDegrees(359).radians()},500).repeat(Infinity).easing(TWEEN.Easing.Linear.None).onComplete(() => {
        }).start();
      }
      else{
        this.fanAnim.resume();        
      }
  }
  stopFan(){
    this.fanAnim.pause();    
  }
  initacParticle(){
    const box = BABYLON.MeshBuilder.CreateBox("acbox", {width:2, height:.5,depth:1},this.scene);
    box.material = new BABYLON.StandardMaterial("mat",this.scene);
    box.position.set(-6,4.65,3.25);
    box.material.wireframe = true;
    box.isPickable=false;
    box.renderOutline = false;
    box.visibility=0;
    this.acparticle                 = new BABYLON.ParticleSystem("acparticles",300,this.scene);
    this.acparticle.particleTexture = new BABYLON.Texture("models/texture/particles1.png",this.scene);
    
    this.acparticle.emitter         = BABYLON.Vector3.Zero(); 
    this.acparticle.minSize         = .03;
    this.acparticle.maxSize         = .03;
    

    this.acparticle.minLifeTime = .5;
    this.acparticle.maxLifeTime = .5;

    
    this.acparticle.emitRate = 300;
    this.acparticle.isBillboardBased=true;
    // this.acparticle.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Z;
    // this.acparticle.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_Y;
    this.acparticle.createBoxEmitter(new BABYLON.Vector3(0,-5,-5), new BABYLON.Vector3(0,-5,-5), new BABYLON.Vector3(box.position.x-.9,box.position.y,box.position.z), new BABYLON.Vector3(box.position.x+.9,box.position.y,box.position.z));
    this.acparticle.minEmitPower = .3;
    this.acparticle.maxEmitPower = .3;
    this.acparticle.updateSpeed = 0.005;
    this.setAc(true);
   }
   setAc(isOn){
      if(isOn)
        this.acparticle.start();
      else
        this.acparticle.stop();  
   }
   setGame(){
     this.level=1;
    if(!this.isSceneCreated){
        this.resetScene();
        this.initScene().then(()=>{
          this.startGame();
          // console.log("inn setGame ifffffffff");
        }); 
    }
    else{
        // console.log("inn setGame elseeeeeeee");
        this.isSceneCreated = false;
        this.startGame(); 
      }
   }
   focusTrolly(){
    this.setFocusOnObject(new BABYLON.Vector3(this.trollyObject.meshRoot.position.x,this.trollyObject.meshRoot.position.y,this.trollyObject.meshRoot.position.z));
    new TWEEN.Tween(this.camera).to({alpha:BABYLON.Angle.FromDegrees(270).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
    new TWEEN.Tween(this.camera).to({beta:BABYLON.Angle.FromDegrees(45).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
      this.wipeAlcohal.usealcohalwipe=true;
      this.wipeAlcohal.alocohalwipe.isVisible = true;
      this.wipeAlcohal.reset();
    }).start();
    new TWEEN.Tween(this.camera).to({radius:2},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
   }
   startGame(){
    this.gamemode =  gamemode.training;
    this.resetObjectiveBar();
    this.bpBalue="";
    this.removeAllActions();
    switch(this.gamemode){
        case gamemode.training:
              switch(this.level){
                case 0:
                    {
                      this.gui2D.objectiveTitle.text = "Room Prepration";
                      this.totalobjective=5; 
                      const values = ["Close The Door","Switch On The Light","Turn-off the Fan","Close the window","Turn-off the AC using remote"];   
                      this.doorObject.initAction(); 
                      this.lightswitchObject.initAction();
                      this.fanswitchobject.initAction();
                      this.acItem.initAction();
                      this.windowObject.initAction();
                      
                      for(let i=0;i<values.length;i++){ 
                          gameObjectives.push({status:false,msg:values[i]});
                          this.objectivebar[i] = this.gui2D.createBar(values[i],380,42);
                          this.gui2D.objectiveBg.addControl(this.objectivebar[i]); 
                          this.objectivebar[i].isVisible = i===0;
                          this.objectivebar[i].getChildByName("rightarrow").alpha=.5;
                      }
                      this.gui2D.objectiveBg.getChildByName("objectivetitle2").text = "Current Objective :";
                      this.gui2D.objectiveBg.addControl(this.gui2D.downArrow);
                      this.gui2D.drawObjectiveMenu(true);
                    }
                  break;
                case 1:{
                        this.gui2D.objectiveTitle.text = "Item Prepration";
                        this.totalobjective=2; 
                        const values = ["Place the required eqipment from the drawer on the top of the table: \n \u2022 BP Monitor \n \u2022 CCPD Record Book \n \u2022 Alcohal Wipe \n \u2022 Connection Shield \n \u2022 APD Cassette Package \n \u2022 Face Mask \n \u2022 Drain Bag",
                                        "Place the required eqipment from the brown cabinet on top of the table: \n \u2022 Dialysis Solution x2 \n \u2022 Hand Sanitizer"];   

                        this.handSoapObject.initAction();
                        this.paperTowelObject.initAction();                                        
                        this.tableObject.initAction();
                        this.bpMachineItem.initAction();
                        this.alcohalItem.initAction();
                        this.maskItem.initAction();
                        this.connectionItem.initAction();
                        this.apdmachinePackage.initAction();
                        this.drainBagItem .initAction();
                        this.ccpdRecordBook.initAction();

                        this.bpMachineItem.enableDrag(true);
                        this.alcohalItem.enableDrag(true);
                        this.maskItem.enableDrag(true);
                        this.connectionItem.enableDrag(true);
                        this.apdmachinePackage.enableDrag(true);
                        this.drainBagItem.enableDrag(true);
                        this.ccpdRecordBook.enableDrag(true);

                        for(let i=0;i<values.length;i++){ 
                          gameObjectives.push({status:false,msg:values[i]});
                          this.objectivebar[i] = this.gui2D.createBar(values[i],380,i===0?250:160);
                          this.gui2D.objectiveBg.addControl(this.objectivebar[i]); 
                          this.objectivebar[i].isVisible = i===0;
                          this.objectivebar[i].getChildByName("rightarrow").alpha=.5;
                      }
                      this.gui2D.objectiveBg.getChildByName("objectivetitle2").text = "Current Objective :";
                      this.gui2D.objectiveBg.addControl(this.gui2D.downArrow);
                      this.gui2D.drawObjectiveMenu(true);
                      this.gui2D.useBtn.isVisible=false;
                    }
                   break;
                case 2:{
                      this.tableObject.initAction();
                      this.bpMachineItem.placeItem(ANIM_TIME);
                      this.ccpdRecordBook.placeItem(ANIM_TIME);
                      this.alcohalItem.placeItem(ANIM_TIME);
                      this.connectionItem.placeItem(ANIM_TIME);
                      this.maskItem.placeItem(ANIM_TIME);
                      this.apdmachinePackage.placeItem(ANIM_TIME);
                      this.drainBagItem.placeItem(ANIM_TIME);
                      this.sanitiserObject[0].placeItem(ANIM_TIME);
                      this.dialysisSolutionObject[0].placeItem(ANIM_TIME);
                      this.dialysisSolutionObject[1].placeItem(ANIM_TIME);
                      let tout = setTimeout(() => {
                        this.bpMachineItem.initAction();
                        this.tableObject.initAction();
                        clearTimeout(tout);
                      }, ANIM_TIME*1.2);
                      this.gui2D.objectiveTitle.text = "Self Prepration";
                      this.totalobjective=6; 
                      const values = ["Measure your blood pressure  using the BP Monitor","Access the CCPD Record Book","Record your BP in the CCPD Record Book"
                                       ,"Use a face mask","Navigate to the sink,and wash your hands","Dry your hands with the paper towel"];   
                       for(let i=0;i<values.length;i++){ 
                            gameObjectives.push({status:false,msg:values[i]});
                            this.objectivebar[i] = this.gui2D.createBar(values[i],380,60);
                            this.gui2D.objectiveBg.addControl(this.objectivebar[i]); 
                            this.objectivebar[i].isVisible = i===0;
                            this.objectivebar[i].getChildByName("rightarrow").alpha=.5;
                        }
                        this.gui2D.objectiveBg.getChildByName("objectivetitle2").text = "Current Objective :";
                        this.gui2D.objectiveBg.addControl(this.gui2D.downArrow);
                        this.gui2D.drawObjectiveMenu(true);
                      }
                     break;
                  case 3:
                      this.bpMachineItem.placeItem(ANIM_TIME);
                      this.ccpdRecordBook.placeItem(ANIM_TIME);
                      this.alcohalItem.placeItem(ANIM_TIME);
                      this.connectionItem.placeItem(ANIM_TIME);
                      this.maskItem.placeItem(ANIM_TIME);
                      this.apdmachinePackage.placeItem(ANIM_TIME);
                      this.drainBagItem.placeItem(ANIM_TIME);
                      this.sanitiserObject[0].placeItem(ANIM_TIME);
                      this.dialysisSolutionObject[0].placeItem(ANIM_TIME);
                      this.dialysisSolutionObject[1].placeItem(ANIM_TIME);
                      this.alcohalItem.placeItem(ANIM_TIME);
                      
                      this.gui2D.objectiveTitle.text = "Machine Prepration";
                      this.totalobjective=11; 
                      const values = ["Use the alcohal wipes to clean the APD Machin& Rack","Place the hand disinfectant on the APD Rack","Inspect & Validate the APD Cassette Package",
                                      "Inspect & validate the selected Dialysis Solutions","Inspect & Validate the connection shield","Inspect & validate the drain bag",
                                      "Open the drain bag packaging","Place the Drain bag on the bottom tray od APD Rack","Place the dislysis solution on the top of the APD Machine",
                                      "Place the following items on the top of the APD Rack:\n\u2022 Dialysis Solution \n\u2022 APD Cassette Package",
                                      "Navigate to the APD Machine,and click on the green button to turn-on the device"];   
                       for(let i=0;i<values.length;i++){ 
                            gameObjectives.push({status:false,msg:values[i]});
                            if(i===5 || i===6)
                              this.objectivebar[i] = this.gui2D.createBar(values[i],380,34);
                            else if(i===9)
                              this.objectivebar[i] = this.gui2D.createBar(values[i],380,105);
                            else if(i===10)
                               this.objectivebar[i] = this.gui2D.createBar(values[i],380,80);
                            else
                              this.objectivebar[i] = this.gui2D.createBar(values[i],380,60);
                            this.gui2D.objectiveBg.addControl(this.objectivebar[i]); 
                            this.objectivebar[i].isVisible = i===0;
                            this.objectivebar[i].getChildByName("rightarrow").alpha=.5;
                        }
                        this.gui2D.objectiveBg.getChildByName("objectivetitle2").text = "Current Objective :";
                        this.gui2D.objectiveBg.addControl(this.gui2D.downArrow);
                        this.gui2D.drawObjectiveMenu(true);
                        this.tableObject.initAction();
                        this.alcohalItem.initAction();
                        this.trollyObject.initAction();
                        this.apdmachinePackage.initAction();                        
                        this.apdmachinePackage.enableDrag(true);
                     break;  
              }
          break;
        case gamemode.practice:
          break;            
        case gamemode.assessment:
          break;            
    }
    this.gui2D.downArrow._onPointerUp =()=>{
      this.isUp =!this.isUp;
      this.gui2D.objectiveBg.isVisible=false;
      this.gui2D.downArrow.rotation = BABYLON.Angle.FromDegrees(this.isUp?90:270).radians(); 
      this.updateObjective();
    }
   }
   resetObjectiveBar(){
    this.gamestate.state = GameState.default;
    this.itemCount=0;
    this.dialysisItemCnt=0;
    this.handsanitiserCnt=0;
    this.objectiveCount = 0;
    this.totalobjective = 0; 
    this.isUp=false;
    if(this.objectivebar){
       for(let i=0;i<this.objectivebar.length;i++)
            this.gui2D.objectiveBg.removeControl(this.objectivebar[i]); 
      this.gui2D.objectiveBg.removeControl(this.gui2D.downArrow);
    }
      this.objectivebar=[];
      gameObjectives=[];
   }
   updateObjective(){
    this.gui2D.objectiveBg.isVisible = false;
    if(this.isUp){
      this.gui2D.objectiveBg.getChildByName("objectivetitle2").text = "Objective :";
          for(let i=0;i<this.gui2D.objectiveBg.children.length;i++){
              this.gui2D.objectiveBg.children[i].isVisible=true;
              if(i>1 && i<this.gui2D.objectiveBg.children.length-1)
                 this.gui2D.objectiveBg.children[i].getChildByName("rightarrow").alpha = gameObjectives[i-2].status?1:.5;
          }
      }
    else{
        let isonce=false;
        for(let i=0;i<this.gui2D.objectiveBg.children.length;i++){
          if(i>1 && i<this.gui2D.objectiveBg.children.length-1){
              this.gui2D.objectiveBg.children[i].getChildByName("rightarrow").alpha = gameObjectives[i-2].status?1:.5;
              // console.log(this.gui2D.objectiveBg.children[i].getChildByName("rightarrow").alpha);
              this.gui2D.objectiveBg.children[i].isVisible=false;    
              if(!gameObjectives[i-2].status && !isonce){
                  isonce =true;
                  this.gui2D.objectiveBg.children[i].isVisible=true;
              }
          }
        }
        this.gui2D.objectiveBg.getChildByName("objectivetitle2").text = "Current Objective :";
      }
      this.gui2D.objectiveBg.isVisible=true;
      this.gui2D.advancedTexture.update();
      
   }
   removeAllActions(){

     this.doorObject.removeAction(); 
     this.lightswitchObject.removeAction();
     this.fanswitchobject.removeAction();
     this.acItem.removeAction();
     this.windowObject.removeAction();
     this.tableObject.removeAction();
     this.cabinetObject.removeAction();
     this.trollyObject.removeAction();
     for(let i=0;i<this.dialysisSolutionObject.length;i++)
       this.dialysisSolutionObject[i].removeAction();

      for(let i=0;i<this.sanitiserObject.length;i++)
       this.sanitiserObject[i].removeAction();

       this.bpMachineItem.removeAction();  
       this.connectionItem.removeAction();  
       this.alcohalItem.removeAction();     
       this.maskItem.removeAction();        
       this.drainBagItem.removeAction();    
       this.ccpdRecordBook.removeAction();  
       this.apdmachinePackage.removeAction();
       this.handSoapObject.removeAction();
       this.paperTowelObject.removeAction();
   }
   checkObjectives(detail){
        switch(this.level){
            case 0:
                  if(detail.object_type ===  this.doorObject){
                      gameObjectives[0].status = true;
                      this.doorObject.removeAction();
                      this.objectiveCount++;
                  }
                  else if(detail.object_type ===  this.lightswitchObject){
                    gameObjectives[1].status = true;
                    this.lightswitchObject.removeAction();
                    this.objectiveCount++;
                  }
                  else if(detail.object_type ===  this.fanswitchobject){
                    gameObjectives[2].status = true;
                    this.fanswitchobject.removeAction();
                    this.objectiveCount++;
                  }
                  else if(detail.object_type ===  this.windowObject){
                    gameObjectives[3].status = true;
                    this.windowObject.removeAction();
                    this.objectiveCount++;
                  }
                  else if(detail.object_type ===  this.acItem){
                    gameObjectives[4].status = true;
                    this.acItem.removeAction();
                    this.objectiveCount++;
                  }
            break;
           case 1:
                if((detail.object_type ===  this.connectionItem || detail.object_type ===  this.alcohalItem|| detail.object_type ===  this.maskItem || detail.object_type ===  this.ccpdRecordBook 
                  || detail.object_type ===  this.apdmachinePackage||this.bpMachineItem)){
                        if(this.itemCount>=7){
                            this.itemCount =0;
                            this.objectiveCount++;
                            gameObjectives[0].status = true;
                            this.tableObject.setDrawerAnim();
                            this.tableObject.removeAction();
                            this.bpMachineItem.removeAction();
                            this.alcohalItem.removeAction();
                            this.maskItem.removeAction();
                            this.connectionItem.removeAction();
                            this.apdmachinePackage.removeAction();
                            this.drainBagItem .removeAction();
                            this.ccpdRecordBook.removeAction();
                            this.cabinetObject.initAction();
                            for(let i=0;i<this.dialysisSolutionObject.length;i++){
                              this.dialysisSolutionObject[i].initAction();
                              this.dialysisSolutionObject[i].enableDrag(true);
                            }
                            for(let i=0;i<this.sanitiserObject.length;i++){
                               this.sanitiserObject[i].initAction();
                               this.sanitiserObject[i].enableDrag(true);
                            }
                          this.gamestate.state = GameState.default;
                        }
                  }
                  if(this.dialysisItemCnt>1 && this.handsanitiserCnt>0){
                    this.cabinetObject.removeAction();
                    this.objectiveCount++;
                    gameObjectives[1].status = true;
                    for(let i=0;i<this.dialysisSolutionObject.length;i++)
                        this.dialysisSolutionObject[i].removeAction();
                    for(let i=0;i<this.sanitiserObject.length;i++)
                        this.sanitiserObject[i].removeAction();
                      this.gamestate.state = GameState.default;
                  }
             break; 
          case 2:
                  if(detail.object_type === this.bpMachineItem){
                    if(!gameObjectives[0].status)
                        this.objectiveCount++;
                        gameObjectives[0].status = true;
                      this.ccpdRecordBook.initAction();
                      this.gui2D.resetCamBtn.isVisible=false;
                  }
                  if(detail.object_type === this.ccpdRecordBook){
                      if(detail.msg.includes("useccpd")){
                        if(!gameObjectives[1].status)
                            this.objectiveCount++;
                          gameObjectives[1].status = true;
                      }
                      if(detail.msg.includes("ccprd_record_fill")){
                         if(!gameObjectives[2].status){
                            this.objectiveCount++;
                            this.maskItem.initAction();
                         }
                         gameObjectives[2].status = true;
                      }
                  }
                  if(detail.object_type === this.maskItem){
                    if(!gameObjectives[3].status)
                        this.objectiveCount++;
                       gameObjectives[3].status = true;
                       this.handSoapObject.initAction();
                       this.paperTowelObject.initAction();
                       this.gamestate.state = GameState.default;
                  }
                  if(detail.object_type === this.handSoapObject ||  detail.object_type === this.paperTowelObject){
                      if(detail.msg === "wash_hands"){
                        if(!gameObjectives[4].status)
                          this.objectiveCount++;
                        gameObjectives[4].status = true;
                      }
                      if(detail.msg === "use_papertowel"){
                        if(!gameObjectives[5].status)
                          this.objectiveCount++;
                        gameObjectives[5].status = true;
                      }
                  }
                  this.showResetViewButton(true);
              break; 
           case 3:
                  console.log("$$$$$$$$$$  level 3333333 complete!!");
                  if(detail.object_type === this.alcohalItem){
                     if(!gameObjectives[0].status)
                        this.objectiveCount++;
                      gameObjectives[0].status = true;
                      this.tableObject.setTableFocusAnim();
                      this.setFocusOnObject(new BABYLON.Vector3(this.tableObject.meshRoot.position.x,this.tableObject.meshRoot.position.y,this.tableObject.meshRoot.position.z-.5));
                      this.sanitiserObject[0].initAction();
                      this.sanitiserObject[0].enableDrag(true);
                  }

                  if(this.sanitiserObject.indexOf(detail.object_type)>-1 && detail.msg.includes("placed_sanitizer")){
                        if(!gameObjectives[1].status)
                            this.objectiveCount++;
                        gameObjectives[1].status = true
                        this.gamestate.state = GameState.focus;
                        this.tableObject.setTableFocusAnim();
                        this.setFocusOnObject(new BABYLON.Vector3(this.tableObject.meshRoot.position.x,this.tableObject.meshRoot.position.y,this.tableObject.meshRoot.position.z-.5));
                        this.apdmachinePackage.initAction();
                        this.apdmachinePackage.enableDrag(false);
                        this.sanitiserObject[0].enableDrag(false);

                  }
                  if(detail.object_type === this.apdmachinePackage){
                     if(detail.msg && detail.msg.includes("apd_validation")){
                        if(!gameObjectives[2].status)
                            this.objectiveCount++;
                        gameObjectives[2].status = true;
                        this.dialysisSolutionObject[0].initAction();
                        this.dialysisSolutionObject[0].enableDrag(false);
                        this.dialysisSolutionObject[1].initAction();
                        this.dialysisSolutionObject[1].enableDrag(false);
                     }
                  }
                  if(detail.object_type instanceof CabinetItem){
                       if(this.dialysisSolutionObject.indexOf(detail.object_type)>-1){
                          if(detail.msg.includes("dialysis_validation")){
                              if(!gameObjectives[3].status)
                                this.objectiveCount++;
                              gameObjectives[3].status = true;
                              this.connectionItem.initAction();
                              this.connectionItem.enableDrag(false);
                          }
                          if(detail.msg.includes("placed_dialysis_apd_top")){
                            if(!gameObjectives[8].status)
                                this.objectiveCount++;
                              gameObjectives[8].status = true;
                                
                          }
                          
                      }
                  }
                  if(detail.object_type === this.connectionItem && detail.msg.includes("connection_validation")){
                        if(!gameObjectives[4].status)
                        this.objectiveCount++;
                        gameObjectives[4].status = true;
                        this.drainBagItem.initAction();
                        this.drainBagItem.enableDrag(false);
                  }
                  
                  if(detail.object_type === this.drainBagItem){
                       if(detail.msg.includes("drain_bag_trolly")){
                          console.log("#############");
                            if(!gameObjectives[7].status)
                              this.objectiveCount++;
                           gameObjectives[7].status = true;
                           this.drainBagItem.enableDrag(false);
                           this.dialysisSolutionObject[0].enableDrag(true);
                           this.dialysisSolutionObject[1].enableDrag(true);
                           this.gamestate.state = GameState.active;

                       }
                      else if(detail.msg.includes("drainbag_use")){
                          if(!gameObjectives[6].status)
                              this.objectiveCount++;
                            gameObjectives[6].status = true;
                            this.drainBagItem.enableDrag(true);
                       } 
                      else{
                          if(!gameObjectives[5].status)
                            this.objectiveCount++;
                          gameObjectives[5].status = true;
                      }
                  }
                  if(detail.msg.includes("placed_2item_apdreck")){
                    if(!gameObjectives[9].status && this.itemCount>1){
                          this.objectiveCount++;
                        gameObjectives[9].status = true;

                        this.trollyObject.initAction();
                     }
                  }
                  if(detail.msg.includes("apd_machine_on")){
                    if(!gameObjectives[10].status)
                        this.objectiveCount++;
                      gameObjectives[10].status = true;
                  }
                  
                //   if(detail.object_type === this.drainBagItem){
                //     if( detail.msg && detail.msg.includes("drainbag_use")){
                //          gameObjectives[3].status = true;
                //          this.objectiveCount=4;
                //          this.drainBagItem.initAction();
                //         this.drainBagItem.enableDrag(false);
                //     }
                //  }
                  this.gamestate.state = GameState.active;
             break;   
        }
      
      this.updateObjective();
      if(this.objectiveCount>=this.totalobjective){
        this.gui2D.drawObjectiveMenu(false);
        this.gui2D.drawLevelComplete(true);
        switch(this.level){
            case 0:
                this.gui2D.winPopUp.getChildByName("popup_tittle").text = "Room PrepRation\n Complete!";
              break;
            case 1:
                this.gui2D.winPopUp.getChildByName("popup_tittle").text   = "Item PrepRation\n Complete!";
                this.cabinetObject.openCloseDoor();
              break;
        }
        this.gui2D.nextBtn._onPointerUp=()=>{
           this.gui2D.drawLevelComplete(false);
           this.level++;
           this.isSceneCreated = true;
           this.setGame();
        }
        this.gui2D.endsessionBtn._onPointerUp=()=>{
          this.isSceneCreated = false;
          this.gui2D.drawLevelComplete(false);
          this.gamestate.state = GameState.menu;
          this.gui2D.drawMainMenu(true);
          this.sceneCommon.removeMiniCam();
        }
      }
   }
    createccpdCanvas(){
       if(this.recordbookCanvas)
           return;

      let ccpdPlan      =  BABYLON.MeshBuilder.CreatePlane("ccpdplane",{width:1,height:1,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
      ccpdPlan.parent   = this.scene.getCameraByName("maincamera");
      const mat           = new BABYLON.StandardMaterial("ccpdplanemat",this.scene);
      mat.diffuseColor    = new BABYLON.Color3(1,0,0);
      ccpdPlan.material = mat;
      ccpdPlan.scaling.set(.35,.53,1);
      ccpdPlan.position = new BABYLON.Vector3(0.49,0,1.05); 
      ccpdPlan.isPickable=true;
      ccpdPlan.outlineWidth=0;
      ccpdPlan.isVisible=false;

      this.recordbookCanvas = GUI.AdvancedDynamicTexture.CreateForMesh(ccpdPlan,512,512);
      const titlepanel  = this.gui2D.createStackPanel("titlepanel",170,500,"#ffffff00",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP);    
      titlepanel.leftInPixels =22;
      titlepanel.topInPixels =26;
      this.recordbookCanvas.addControl(titlepanel);
      this. inputpanel  = this.gui2D.createStackPanel("titlepanel",95,500,"#ffffff00",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP);    
      this.inputpanel.leftInPixels =186;
      this.inputpanel.topInPixels =25.5;
      this.recordbookCanvas.addControl(this.inputpanel);

      
      const title=["Date","B/P","Time On","Time Off","Heater Bag","1.5 Dext. (Amount)","Supply Bag","1.5 Dext. (Amount)","Last Bag","1.5 Dext. (Amount)","Type of Therapy",
                  "Therapy Volume","Therapy Time","Fill Volume","Last Fill Volume","Concentration","Number of Cycle","Intial Drain","Average Dwell Time","Total UF","Lost Dwell Time",
                  "Added Dwell Time","Colour of Drainage"]; 

      for(let i=0;i<title.length;i++){
          const titletxt =  this.gui2D.createText("ccpdtitle"+i,title[i],12,"#000000",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
          titletxt.widthInPixels  = titlepanel.widthInPixels
          titletxt.fontFamily="Arial"
          titletxt.heightInPixels = 20
          titletxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          titletxt.textVerticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          titlepanel.addControl(titletxt);
          titletxt.isPointerBlocker=true;


          const inputfield = this.gui2D.createInputField("ccpdinput"+i,"","DD/MM/Year",this.inputpanel.widthInPixels,20,"#FFFF0000","#000000",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP) ;
          inputfield.fontSizeInPixels=12;
          inputfield.thickness=0;
          if(i===0)
            inputfield.placeholderText = "DD/MM/Year";
          else if(i===1){
              inputfield.placeholderText = "SYS/DIA(PH)";
              inputfield.onTextChangedObservable.add(()=>{
                //  if(this.bpBalue ===inputfield.text)
                 {
                    let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this.ccpdRecordBook,msg:"ccprd_record_fill",level:2}});
                    document.dispatchEvent(custom_event);                                                
                  }
                    
               })
          }
          else{
              inputfield.placeholderText = "";
              inputfield.isVisible=false;
          }
          this.inputpanel.addControl(inputfield);
      }  
        const pageCloseBtn  =   this.gui2D.createCircle("pageclose",56,36,"#FF000073",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        this.recordbookCanvas.addControl(pageCloseBtn);
        const crossimg      =  this.gui2D.createImage("crossimg","ui/pngaaa.com-28984.png",24,20,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        crossimg.isPointerBlocker=false;
        crossimg.isVisible  = true;
        pageCloseBtn.addControl(crossimg);
        pageCloseBtn.leftInPixels=190;
        pageCloseBtn.isVisible  = true;

        pageCloseBtn._onPointerUp=()=>{
            ccpdPlan.isVisible=false;
            ccpdPlan.isPickable=false;
            this.ccpdRecordBook.closeccpdRecordBook(300);
        }
   }
   getSceneCordinate(){
    let vector= BABYLON.Vector3.Unproject(
      new BABYLON.Vector2(this.scene.pointerX,this.scene.pointerY),
      this.scene.getEngine().getRenderWidth(),
      this.scene.getEngine().getRenderHeight(),
      BABYLON.Matrix.Identity(),this.scene.getViewMatrix(),
      this.scene.getProjectionMatrix());
   }

}


export function randomNumber(min, max) { 
  return Math.random() * (max - min) + min;
} 