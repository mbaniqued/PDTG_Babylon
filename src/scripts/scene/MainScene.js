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
import TWEEN from '@tweenjs/tween.js';
import * as GUI from 'babylonjs-gui';

export const GameState={default:0,focus:1,active:2,radial:3,menu:4,levelstage:5,useitem:6,loading:7};
export const usermode={patient:0,caregiver:1};
export const gamemode={training:0,practice:1,assessment:2};
export const ANIM_TIME=1000;
export const event_objectivecomplete = "event_objectivecomplete";
let gameObjectives=[];

let SX=0,SY=0,SZ=0;
export default class MainScene {
  constructor(gameManager) {
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
    this.ccpdRecordBook=undefined,this.apdmachinePackage=undefined,this.lightswitchObject=undefined,this.dissolutionObject=[],this.sanitiserObject=[];
    this.fanAnim = null;
    
    // this.sceneOptimiser = new SceneOptimiser(50,500,this.scene);
    // this.sceneOptimiser.startOptimiser();
    this.level=0,this.isUp=false,this.objectiveCount=0,this.totalobjective=0,this.itemCount=0,this.dialysisItemCnt=0,this.handsanitiserCnt=0;
    this.initState();
    this.initacParticle();
    
  }
  initState(){
    this.gamestate  = {state:GameState.menu}; 
    this.userMode   = usermode.patient;
    this.gamemode   = gamemode.training;
  }
  initScene() {
    this.viewportFrame =  this.gui2D.createRect("viewportFrame",400,228,0,"#FFFFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
    this.viewportFrame.width  =.22;
    this.viewportFrame.height = .3;
    this.viewportFrame.isVisible=false;
    this.viewportFrame.leftInPixels=400;

    this.trollyObject   = new Trolly(this,this.trollyRoot,{x:-2.85,y:1.78,z:2.5});
    this.tableObject    = new Table(this,this.tableRoot,{x:-.25,y:1.9,z:2.5});
    this.cabinetObject  = new Cabinet(this,this.cabinetRoot,{x:1.9,y:1,z:2.5});
    this.doorObject     = new DoorObject(this,this.doorRoot,{x:8.8,y:2.2,z:2.75});
    this.windowObject   = new WindowFrame(this,this.windowFrameRoot,{x:-7.9,y:3.45,z:2});
    this.acItem         = new ACRemote(this,this.acRemoteRoot,{x:-5,y:.9,z:.5});
    this.lightswitchObject = new LightSwitch(this,this.lightswtich);
    this.fanswitchobject   = new FanSwitch(this,this.scene.getNodeByName("fanswitchnode"));

    this.bpnumberTexture = new BABYLON.DynamicTexture("bpnumberTexture",256,this.scene);
    this.bpMachineItem     = new Item("Blood Pressure Monitor",this,this.scene.getTransformNodeByID("bpmachinenode"),{x:-69,y:30,z:33},{x:-93,y:17,z:-8},undefined);
    this.createBpText();
    this.connectionItem    = new Item("Connection Shield",this,this.scene.getTransformNodeByID("ConnectionShield"),{x:-70,y:5,z:38.5},{x:-65,y:-55,z:-4},undefined); 
    this.alcohalItem       = new Item("Alchohal Wipe",this,this.scene.getTransformNodeByID("Alcohol_Wipe"),{x:-45,y:8,z:38.5},{x:-36,y:-53,z:-4},{x:0,y:0,z:90});
    this.maskItem          = new Item("Face Mask",this,this.scene.getTransformNodeByID("SurgicalMask"),{x:36,y:32,z:20},{x:0,y:-66,z:-14},undefined);
    this.drainBagItem      = new Item("Drain Bag",this,this.scene.getTransformNodeByID("DrainBag"),{x:-9,y:4,z:34},{x:70,y:-52,z:-10},{x:0,y:0,z:-90});
    this.ccpdRecordBook    = new Item("CCPD Record Book",this,this.scene.getTransformNodeByID("ccpdrecordbook"),{x:35,y:1,z:38},{x:-64,y:-10,z:-3},undefined);
    // this.ccpdRecordBook    = new Item("CCPD Record Book",this,this.scene.getTransformNodeByID("ccpdrecordbook"),{x:35,y:1,z:38},{x:-64,y:-10,z:-3},undefined);
    this.apdmachinePackage = new Item("APD Cassette Package",this,this.scene.getTransformNodeByID("apd_package_node"),{x:75,y:-10,z:38},{x:-9,y:6,z:-5},undefined);
    
    this.dissolutionObject[0] = new CabinetItem("Dialysis Solution",this,this.scene.getTransformNodeByID("diasolutionnode"),{x:2.16,y:1.57,z:2.34});
    const solutionclone1 = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode1");
    this.dissolutionObject[1] = new CabinetItem("Dialysis Solution",this,solutionclone1,{x:2.16,y:1.17,z:2.34});
    const solutionclone2 = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode2");
    this.dissolutionObject[2] = new CabinetItem("Dialysis Solution",this,solutionclone2,{x:2.16,y:.78,z:2.34});
    const solutionclone3 = this.scene.getTransformNodeByID("diasolutionnode").clone("diasolutionnode3");
    this.dissolutionObject[3] = new CabinetItem("Dialysis Solution",this,solutionclone3,{x:2.16,y:.31,z:2.34});

    this.sanitiserObject[0]   = new CabinetItem("Hand Sanitizer ",this,this.scene.getTransformNodeByID("handsanitizernode"),{x:1.47,y:1.07,z:2.6});
    const sanitizerclone2 = this.scene.getTransformNodeByID("handsanitizernode").clone("sanitizer2");
    this.sanitiserObject[1]   = new CabinetItem("Hand Sanitizer ",this,sanitizerclone2,{x:1.47,y:1.07,z:2.4});
    const sanitizerclone3 = this.scene.getTransformNodeByID("handsanitizernode").clone("sanitizer3");
    this.sanitiserObject[2]   = new CabinetItem("Hand Sanitizer ",this,sanitizerclone3,{x:1.47,y:1.07,z:2.2});

    this.startFan();

    this.gui2D.resetCamBtn.onPointerUpObservable.add(()=>{
      this.setCameraTarget(); 
      this.sceneCommon.removeMiniCam();
    }) 

    document.addEventListener('keydown', (event)=> {
      console.log(event.key);
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
      // this.apdmachinePackage.meshRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(SX).radians(),BABYLON.Angle.FromDegrees(SY).radians(),BABYLON.Angle.FromDegrees(SZ).radians());  
      // this.apdmachinePackage.meshRoot.position = new BABYLON.Vector3(SX,SY,SZ);  
      // console.log("!! sx!! "+SX+" !!sy!!  "+SY+"!! sz !! "+SZ);  
  }, false);
    this.scene.onPointerObservable.add((pointerInfo) => {      	
      if(this.gamestate.state === GameState.menu || this.gamestate.state === GameState.levelstage || this.gamestate.state === GameState.radial)
              return ;
      
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
      });
      this.objectiveListner = (e) => {
          this.checkObjectives(e.detail.object_type);
           
      }
      document.addEventListener(event_objectivecomplete,this.objectiveListner);
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
    
    this.bpnumberTexture.hasAlpha=true;
    planmat.diffuseTexture = this.bpnumberTexture;
    bpPlan.material  = planmat;
    bpPlan.scaling   = new BABYLON.Vector3(1.4,3.2,1);
    bpPlan.position  = new BABYLON.Vector3(17.8,13,-8);
    bpPlan.rotation  = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(-30).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
    this.setbpRecord(0,0,0);
  
  }
  setbpRecord(v1,v2,v3){
    let ctx = this.bpnumberTexture.getContext();
    const font_size = 64;
    const font_type = "Orbitron";
    const font = font_size + "px " + font_type;
    ctx.clearRect(0, 0, 256, 256)
    this.bpnumberTexture.drawText(parseInt(v1)+"",90, 70, font,  "#808794", "transparent", true);
    this.bpnumberTexture.drawText(parseInt(v2)+"",90, 150, font, "#808794", "transparent", true);
    this.bpnumberTexture.drawText(parseInt(v3)+"",90, 230, font, "#808794", "transparent", true);
    // this.bpnumberTexture.update();
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
       if(!root1.name.includes("items") && !root2.name.includes("items")){
          if(this.gamestate.state != GameState.radial){
            // console.log(root1.name+"      "+root2.name);
            this.gamestate.state = GameState.default;
          }
       }
    }
  }
  updateObjectOutLine(value){
    if(!this.pickMesh){
      return;
    }
    if(!this.pickMesh.isPickable || this.pickMesh.actionManager === null){
        value = false;
        this.pickMesh.outlineWidth=0;
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
    else if(this.pickMesh.parent.name.includes("ccpdrecordbook")){
      // console.log(this.pickMesh.parent.name);
      this.pickMesh.parent.getChildMeshes().forEach(childmesh=>{
            childmesh.outlineWidth=.1;
            childmesh.renderOutline=value;
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
          childmesh.outlineWidth=2;
          // console.log(this.pickMesh.isPickable+"  11111111   "+this.pickMesh.name) ;
        }
        else{
            childmesh.renderOutline=false;
            childmesh.outlineWidth=0;
            // console.log(this.pickMesh.isPickable+"  222222   "+this.pickMesh.name) ;
          }
      });
    } 
  }
  setCameraTarget(){
    this.showResetViewButton(false);
    this.gamestate.state = GameState.default;
    this.camera.fov=.6;
    this.sceneCommon.camVector  = new BABYLON.Vector3(0,3.2,0);
    this.camera.position.set(0,this.sceneCommon.camVector.y,0);
    this.camera.lowerAlphaLimit =  null;
    this.camera.upperAlphaLimit =  null;
    this.camera.lowerBetaLimit  =  null;
    this.camera.upperBetaLimit  =  null;
    new TWEEN.Tween(this.camera.target).to({x:this.sceneCommon.camVector.x,y:this.sceneCommon.camVector.y,z:this.sceneCommon.camVector.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
      }).start();
    new TWEEN.Tween(this.camera).to({beta:BABYLON.Angle.FromDegrees(90).radians()},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
    // new TWEEN.Tween(this.camera).to({alpha: BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
    // }).start();
    new TWEEN.Tween(this.camera).to({radius:3},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {}).start();
    
  }
  setFocusOnObject(pos){
    new TWEEN.Tween(this.camera.target).to({x:pos.x,y:pos.y,z:pos.z},ANIM_TIME).easing(TWEEN.Easing.Quadratic.In).onComplete(() => {
        // this.camera.lowerAlphaLimit = this.camera.upperAlphaLimit=this.camera.alpha;
        // this.camera.lowerBetaLimit = this.camera.upperBetaLimit=this.camera.beta;
        if(this.gamestate.state === GameState.focus || this.gamestate.state === GameState.active)
            this.showResetViewButton(true);
        else
            this.showResetViewButton(false);

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
      this.resetObjectiveBar();
      // this.level = 0;
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

                          this.tableObject.initAction();
                          this.bpMachineItem.initAction();
                          this.alcohalItem.initAction();
                          this.maskItem.initAction();
                          this.connectionItem.initAction();
                          this.apdmachinePackage.initAction();
                          this.drainBagItem .initAction();
                          this.ccpdRecordBook.initAction();
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
                      }
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
    this.objectiveCount =0;
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
     for(let i=0;i<this.dissolutionObject.length;i++)
       this.dissolutionObject[i].removeAction();

      for(let i=0;i<this.sanitiserObject.length;i++)
       this.sanitiserObject[i].removeAction();

       this.connectionItem.removeAction();  
       this.alcohalItem.removeAction();     
       this.maskItem.removeAction();        
       this.drainBagItem.removeAction();    
       this.ccpdRecordBook.removeAction();  
       this.ccpdRecordBook.removeAction();  
       this.apdmachinePackage.removeAction();
   }
   checkObjectives(object_type){

    
      if(object_type ===  this.doorObject){
        
          gameObjectives[0].status = true;
          this.doorObject.removeAction();
          this.objectiveCount++;
          console.log(this.dialysisItemCnt+"     11111111111111   "+this.handsanitiserCnt);
      }
      else if(object_type ===  this.lightswitchObject){
        gameObjectives[1].status = true;
        this.lightswitchObject.removeAction();
        this.objectiveCount++;
        console.log(this.dialysisItemCnt+"     2222222222222222   "+this.handsanitiserCnt);
      }
      else if(object_type ===  this.fanswitchobject){
        gameObjectives[2].status = true;
        this.fanswitchobject.removeAction();
        this.objectiveCount++;
        console.log(this.dialysisItemCnt+"     3333333333333333   "+this.handsanitiserCnt);
      }
      else if(object_type ===  this.windowObject){
        gameObjectives[3].status = true;
        this.windowObject.removeAction();
        this.objectiveCount++;
        console.log(this.dialysisItemCnt+"     4444444444444   "+this.handsanitiserCnt);
      }
      else if(object_type ===  this.acItem){
        gameObjectives[4].status = true;
        this.acItem.removeAction();
        this.objectiveCount++;
        console.log(this.dialysisItemCnt+"     55555555555555   "+this.handsanitiserCnt);
      }
      else if(object_type ===  this.connectionItem || object_type ===  this.alcohalItem|| object_type ===  this.maskItem || object_type ===  this.ccpdRecordBook 
              || object_type ===  this.apdmachinePackage||this.bpMachineItem){
            if(this.itemCount>=7){
              console.log(this.dialysisItemCnt+"     6666666666666666   "+this.handsanitiserCnt);
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
                for(let i=0;i<this.dissolutionObject.length;i++)
                  this.dissolutionObject[i].initAction();

                for(let i=0;i<this.sanitiserObject.length;i++)
                  this.sanitiserObject[i].initAction();
                  this.gamestate.state = GameState.default;
            }
      }
      if(this.dialysisItemCnt>1 && this.handsanitiserCnt>0){
        console.log(this.dialysisItemCnt+"     77777777777777777   "+this.handsanitiserCnt);
        this.cabinetObject.removeAction();
        this.objectiveCount++;
        gameObjectives[1].status = true;
        for(let i=0;i<this.dissolutionObject.length;i++)
            this.dissolutionObject[i].removeAction();
        for(let i=0;i<this.sanitiserObject.length;i++)
            this.sanitiserObject[i].removeAction();
          this.gamestate.state = GameState.default;
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
              break;
        }
        this.gui2D.nextBtn._onPointerUp=()=>{
           this.gui2D.drawLevelComplete(false);
           this.level++;
           this.setGame();
        }
        this.gui2D.endsessionBtn._onPointerUp=()=>{
          this.gui2D.drawLevelComplete(false);
          this.gamestate.state = GameState.menu;
          this.gui2D.drawMainMenu(true);
          this.sceneCommon.removeMiniCam();
        }
      }
   }
}