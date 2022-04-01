import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

export default class LoaderManager {
  constructor(root) {
    this.root = root;
    this.game = root.game;
    this.scene = root.scene;
    this.assetsManager = new BABYLON.AssetsManager(this.scene);
    this.assetsManager.useDefaultLoadingScreen = true;
    this.Counter=0;
    this.isLoad=false;
    this.loadSceneAssets();
  }
   
  loadSceneAssets() {
      
      const physicMat   = new BABYLON.PBRMaterial("kitchenpCube3",this.scene);
      const standerdMat = new BABYLON.StandardMaterial("standerd",this.scene);
      this.root.door    = new BABYLON.TransformNode("doornode");
      this.root.door.scaling = new BABYLON.Vector3(.01,.01,.01);
      // const sinkMat          = kitchenpCube3Mat.clone();
      this.assetsManager.addMeshTask("room_reference","","models/","roomscene.glb");
      this.assetsManager.addMeshTask("trolley","","models/","Trolley_v2.glb");
      this.assetsManager.addMeshTask("table","","models/","Table_v2.glb");
      this.assetsManager.addMeshTask("cabinet","","models/","Cabinet_Main_v2.glb");
      this.assetsManager.addMeshTask("gasStove2","","models/","gasStove2.glb");
      this.assetsManager.addMeshTask("cabinethanging","","models/","Cabinet_Hanging.glb");
      this.assetsManager.addMeshTask("airconditioner_remote","","models/","Airconditioner_Remote.glb");
      this.assetsManager.addMeshTask("APD_Machine_v2","","models/","APD_Machine_v2.glb");
      this.assetsManager.addMeshTask("bp_monitor","","models/Items/","bpmachine.glb");
      this.assetsManager.addMeshTask("Alcohol_Wipe","","models/Items/","Alcohol_Wipe.glb");
      this.assetsManager.addMeshTask("ConnectionShield","","models/Items/","ConnectionShield.glb");
      this.assetsManager.addMeshTask("DrainBag","","models/Items/","DrainBag_final.glb");
      this.assetsManager.addMeshTask("SurgicalMask","","models/Items/","SurgicalMask.glb");
      this.assetsManager.addMeshTask("ccpdrecordbook","","models/Items/","ccpdrecordbook.glb");
      this.assetsManager.addMeshTask("diaSol_complete","","models/Items/","diaSol_complete.glb");
      this.assetsManager.addMeshTask("HandSanitizer","","models/Items/","HandSanitizer.glb");
      this.assetsManager.addMeshTask("ceiling_fan","","models/","ceiling_fan.glb");
      
      this.assetsManager.addMeshTask("fanswitch","","models/","fanswitch.glb");
      this.assetsManager.addMeshTask("APD_Package_v2","","models/Items/","APD_Package_v2.glb");
      this.assetsManager.addMeshTask("PaperTowel","","models/Items/","PaperTowel.glb");
      this.assetsManager.addMeshTask("LiquidHandsoap","","models/Items/","LiquidHandsoap.glb");
      
      
      this.assetsManager.onTaskSuccessObservable.add((task)=> {
        
        
        if(task.name === "LiquidHandsoap"){
          const node   = new BABYLON.TransformNode("liquidhandsoap_node");
          for(let i=0;i<task.loadedMeshes.length;i++){ //liquidhandsoap_node
            task.loadedMeshes[i].parent = node;
            task.loadedMeshes[i].scaling.set(-.4,.4,.4);
            this.setPickable(task.loadedMeshes[i],.01);
          } 
          node.rotation.set(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
          node.position.set(0,0,0);
          
        }
        if(task.name === "PaperTowel"){
          const node   = new BABYLON.TransformNode("papertowel_node");
          for(let i=0;i<task.loadedMeshes.length;i++){ //paper_towel
            task.loadedMeshes[i].parent = node;
            // console.log(task.loadedMeshes[i].name);
            task.loadedMeshes[i].scaling.set(.012,.012,.012);
            this.setPickable(task.loadedMeshes[i],1);
          } 
          node.rotation.set(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(45).radians(),BABYLON.Angle.FromDegrees(0).radians());
          node.position.set(0,0,0);
          
          
        }
        if(task.name === "APD_Package_v2"){
          const node   = new BABYLON.TransformNode("apd_package_node");
          for(let i=0;i<task.loadedMeshes.length;i++){ //fanswitch
            task.loadedMeshes[i].parent = node;
            task.loadedMeshes[i].scaling.set(-.5,.5,.5);
            if(task.loadedMeshes[i].name === "APDCassetteRevisedWithPackaging2.001_primitive11"){
              task.loadedMeshes[i].setEnabled(false);
            }
            this.setPickable(task.loadedMeshes[i],2);
            
          } 
          node.rotation.set(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(180).radians());
          node.position.set(0,0,0);
          node.isPickable=false;
        }
        if(task.name === "fanswitch"){
          const node   = new BABYLON.TransformNode("fanswitchnode");
            for(let i=0;i<task.loadedMeshes.length;i++){ //fanswitch
              task.loadedMeshes[i].parent = node;
              if(task.loadedMeshes[i].id === "OnSwitch2"){
                  const mat           = standerdMat.clone("fanswitch");
                  mat.diffuseColor    = new BABYLON.Color3.FromInts(192,192,192);
                  mat.emissiveColor   = new BABYLON.Color3.FromInts(50,50,50);
                  mat.metallic  = 0;  
                  mat.roughness = .2;  
                  task.loadedMeshes[i].material = mat;
                  this.setPickable(task.loadedMeshes[i],1);
              }else{
                  const mat           = physicMat.clone("fanswitch_2");
                  mat.albedoColor     = new BABYLON.Color3.FromInts(10,10,10);
                  mat.metallic  = 1;  
                  mat.roughness = .2;  
                  task.loadedMeshes[i].material = mat;
                  task.loadedMeshes[i].isPickable=false;
                  task.loadedMeshes[i].renderOutline=false;
              }
              task.loadedMeshes[i].name="fanswitch"+i;
            }
          // node.scaling.set(.01,.01,.01);
          node.rotation.set(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
          node.position.set(3.039,3.209,-0.6);
        }

        if(task.name === "ceiling_fan"){
            const node   = new BABYLON.TransformNode("fannode");
            for(let i=0;i<task.loadedMeshes.length;i++){ //fannode
              task.loadedMeshes[i].parent = node;
              task.loadedMeshes[i].name="ceilingfan"+i;
              task.loadedMeshes[i].isPickable=false;
            }
          node.scaling.set(.01,.01,.01);
          node.rotation.set(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
          node.position.set(-5.9,5.90,0);
        }
        if(task.name === "HandSanitizer"){
          const node   = new BABYLON.TransformNode("handsanitizernode");
            for(let i=0;i<task.loadedMeshes.length;i++){ //handsanitizernode
                task.loadedMeshes[i].parent = node;
                task.loadedMeshes[i].name="sanitizer"+i;
                this.setPickable(task.loadedMeshes[i],.5);
            }
            node.scaling.set(.015,.015,.015);
            // this.root.tmp = node;
        }
        if(task.name === "diaSol_complete"){
            const node   = new BABYLON.TransformNode("diasolutionnode");
            for(let i=0;i<task.loadedMeshes.length;i++){ //diasolutionnode
                task.loadedMeshes[i].parent = node;
                task.loadedMeshes[i].name="diasolution"+i;
                if(task.loadedMeshes[i].id.includes("DialysisSolution_primitive")){
                    task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(180).radians());
                }
                else{
                  task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(180).radians());
                }
                task.loadedMeshes[i].isVisible = false;
                this.setPickable(task.loadedMeshes[i],1);
            }
            node.scaling.set(-.005,.005,.005);
            node.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians());
        }
        if(task.name === "bp_monitor"){
          const node       = new BABYLON.TransformNode("bpmachinenode");
          for(let i=0;i<task.loadedMeshes.length;i++){ //bpmachinenode
              
              task.loadedMeshes[i].parent = node;
              task.loadedMeshes[i].name="bp_monitor"+i;
              this.setPickable(task.loadedMeshes[i],1);
              task.loadedMeshes[i].scaling.set(-.8,.8,.8);
            }
            // bpnode.scaling.set(-.8,.8,.8);
        }
        if(task.name === "Alcohol_Wipe"){
          const node       = new BABYLON.TransformNode("Alcohol_Wipe");
          for(let i=0;i<task.loadedMeshes.length;i++){ //Alcohol_Wipe
              task.loadedMeshes[i].parent = node;
              task.loadedMeshes[i].name="Alcohol_Wipe"+i;
              this.setPickable(task.loadedMeshes[i],1);
              task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
              task.loadedMeshes[i].scaling.set(-1,1,1);
            }
        }
        if(task.name === "ConnectionShield"){
          const node       = new BABYLON.TransformNode("ConnectionShield");
          for(let i=0;i<task.loadedMeshes.length;i++){ //ConnectionShield
              
              task.loadedMeshes[i].parent = node;
              task.loadedMeshes[i].name="ConnectionShield"+i;
              this.setPickable(task.loadedMeshes[i],1);
              task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(-180).radians(),BABYLON.Angle.FromDegrees(0).radians());
              task.loadedMeshes[i].scaling.set(-1,1,1);
            }
        }
        if(task.name === "DrainBag"){
          const node       = new BABYLON.TransformNode("DrainBag");
          for(let i=0;i<task.loadedMeshes.length;i++){ //DrainBag
              // console.log(task.loadedMeshes[i].name);
              task.loadedMeshes[i].parent = node;
              this.setPickable(task.loadedMeshes[i],1);
              // if(task.loadedMeshes[i].name === "DrainBagPlasticCover")
              // task.loadedMeshes[i].position = new BABYLON.Vector3(0,0,-5);
              task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(180).radians());
              task.loadedMeshes[i].name="DrainBag"+i;
              task.loadedMeshes[i].scaling.set(.6,.6,.6);
              
            }
            
            // node.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
            
        }
        if(task.name === "ccpdrecordbook"){
          const node       = new BABYLON.TransformNode("ccpdrecordbook");
          for(let i=0;i<task.loadedMeshes.length;i++){ //ccpdrecordbook
              
              
              task.loadedMeshes[i].parent = node;
              task.loadedMeshes[i].name="ccpdrecordbook"+i;
              if(task.loadedMeshes[i].id === "ccpdfront"){
                task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(180).radians());
                task.loadedMeshes[i].scaling.set(-10,10,10);
                task.loadedMeshes[i].position.x-=12;
                this.setPickable(task.loadedMeshes[i],0);
              }
              if(task.loadedMeshes[i].id === "ccpdback"){
                task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(180).radians(),BABYLON.Angle.FromDegrees(0).radians());
                task.loadedMeshes[i].isPickable=false;
                this.setPickable(task.loadedMeshes[i],0);
                task.loadedMeshes[i].scaling.set(-10,10,10);
              }
              
            }
            node.scaling.set(1,1,1);
            // node.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
        }
        if(task.name === "SurgicalMask"){
          const node       = new BABYLON.TransformNode("SurgicalMask");
          for(let i=0;i<task.loadedMeshes.length;i++){ //SurgicalMask
              
              task.loadedMeshes[i].parent = node;
              task.loadedMeshes[i].name="SurgicalMask"+i;
              this.setPickable(task.loadedMeshes[i],1);
              task.loadedMeshes[i].rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(270).radians());
            
            }
            // node.scaling.set(1,1,1);
            // node.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(270).radians());
            
            
        }
        if(task.name === "APD_Machine_v2"){
          const apdnode       = new BABYLON.TransformNode("apdnode");
          for(let i=0;i<task.loadedMeshes.length;i++){ //APD_Machine
            task.loadedMeshes[i].parent  = apdnode;
            // console.log(task.loadedMeshes[i].id);
            task.loadedMeshes[i].name="apdmachine"+i;
            this.setPickable(task.loadedMeshes[i],-.1);
            // task.loadedMeshes[i]..setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0), false);
          }
          apdnode.scaling.set(-5,5,5);
          apdnode.parent = this.root.trollyRoot;
        }
        if(task.name === "airconditioner_remote"){
          for(let i=0;i<task.loadedMeshes.length;i++){ // airconditioner_remote
            task.loadedMeshes[i].parent  = this.root.acRemoteRoot;
            task.loadedMeshes[i].name="acremot"+i;
            this.setPickable(task.loadedMeshes[i],.35);
            const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
            const boundingInfo = new BABYLON.BoundingInfo(min, max);
            const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
            task.loadedMeshes[i].position = new BABYLON.Vector3(centerPoint.x,centerPoint.y,centerPoint.z);
          }
          this.root.acRemoteRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(105).radians(),BABYLON.Angle.FromDegrees(0).radians());
          this.root.acRemoteRoot.position.set(0,0,0);
          this.root.acRemoteRoot.scaling.set(.01,.01,.01);
        }
        if(task.name === "cabinethanging"){
          const wallcabinet         = new BABYLON.TransformNode("cabinethangingnode");
          for(let i=0;i<task.loadedMeshes.length;i++){ // cabinethanging
            task.loadedMeshes[i].parent  = wallcabinet;
            task.loadedMeshes[i].isPickable=false;
            task.loadedMeshes[i].name="cabinethanging"+i;
          }
          wallcabinet.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
          wallcabinet.position.set(0,4.5,2.9);
          wallcabinet.scaling.set(.01,.01,.01);
        }
        if(task.name === "trolley"){
          const trolly         = new BABYLON.TransformNode("trollynode");
          for(let i=0;i<task.loadedMeshes.length;i++){ // trolly
            task.loadedMeshes[i].parent  = trolly;
            task.loadedMeshes[i].name="trolly"+i;
            this.setPickable(task.loadedMeshes[i],-1);
            // const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
            // const boundingInfo = new BABYLON.BoundingInfo(min, max);
            // const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
            // task.loadedMeshes[i].position = new BABYLON.Vector3(centerPoint.x,centerPoint.y,centerPoint.z);
            // task.loadedMeshes[i].setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0), false);
            // if(task.loadedMeshes[i].id ==="Trolley_primitive1")
            //     task.loadedMeshes[i].position.z+=88;
            // if(task.loadedMeshes[i].id ==="Trolley_primitive3")   
            //     task.loadedMeshes[i].position.z+=78;
          }
          trolly.parent = this.root.trollyRoot;
          this.root.trollyRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
          this.root.trollyRoot.scaling.set(.01,.01,.01);
        }
        if(task.name === "table"){
          const table         = new BABYLON.TransformNode("tablenode");
          const tabledrawer   = new BABYLON.TransformNode("tabledrawer");
          const tableknob     = new BABYLON.TransformNode("tableknob");
          for(let i=0;i<task.loadedMeshes.length;i++){ // table
              
              if(task.loadedMeshes[i].id === "Table_primitive0")
                  task.loadedMeshes[i].parent  = tableknob;  
              else if(task.loadedMeshes[i].id=== "Table_primitive1")
                  task.loadedMeshes[i].parent  = tabledrawer;  
              else{
                  task.loadedMeshes[i].parent  = table;
                  // task.loadedMeshes[i].setEnabled(false);
              }
              task.loadedMeshes[i].name="table"+i;
              this.setPickable(task.loadedMeshes[i],0);
              // this.setPickable(task.loadedMeshes[i],1);
              // const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
              // const boundingInfo = new BABYLON.BoundingInfo(min, max);
              // const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
              // task.loadedMeshes[i].position = new BABYLON.Vector3(centerPoint.x,centerPoint.y,centerPoint.z);
              // if(task.loadedMeshes[i].id === "Table_primitive0"){
              //   tableknob.position.set(0,-70,0);
              // }
              // if(task.loadedMeshes[i].id === "Table_primitive1"){
              //   tabledrawer.position.set(0,-5,-60);
              // }
          }
          tableknob.parent   = tabledrawer;
          tabledrawer.parent = this.root.tableRoot;
          table.parent       = this.root.tableRoot; 
          this.root.tableRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
          this.root.tableRoot.scaling.set(.01,.01,.01);
        }
        if(task.name === "cabinet"){
          const cabinet       = new BABYLON.TransformNode("cabinetnode");
          const cebinetLeft   = new BABYLON.TransformNode("cabinetleftDoor");
          const cabinetRight  = new BABYLON.TransformNode("cabinetrightDoor");
          for(let i=0;i<task.loadedMeshes.length;i++){ // cabinet
            // console.log(task.loadedMeshes[i].id);
            if(task.loadedMeshes[i].id  ===  "Cabinet_Main_primitive1")
                task.loadedMeshes[i].parent  = cabinetRight;
            else if(task.loadedMeshes[i].id=== "Cabinet_Main_primitive2"){
                task.loadedMeshes[i].parent = cebinetLeft;
                const part1  =  task.loadedMeshes[i].clone("cabinetpart1");
                part1.parent  = cabinet;
                part1.position.set(80,-38,2.5);
                part1.scaling.set(1,1,.65);
                part1.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(90).radians());
                
                const part2  =  part1.clone("cabinetpart2");
                part2.position.set(83,-38,42.5);
                part2.scaling.set(1,1,1);
                
                const part3  =  part1.clone("cabinetpart3");
                part3.position.set(83,-38,82.5);
                part3.scaling.set(1,1,1);
            }
            else
                task.loadedMeshes[i].parent   = cabinet;

            this.setPickable(task.loadedMeshes[i],0);
            task.loadedMeshes[i].name="cabinet"+i;
            const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
            const boundingInfo = new BABYLON.BoundingInfo(min, max);
            const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
            task.loadedMeshes[i].position = new BABYLON.Vector3(centerPoint.x,centerPoint.y,centerPoint.z);
            if(task.loadedMeshes[i].id  === "Cabinet_Main_primitive1"){
              const tmp = new BABYLON.TransformNode("tmpcabinetRight");
              task.loadedMeshes[i].parent =tmp;
              tmp.parent=cabinetRight; 
              tmp.position = new BABYLON.Vector3(-35,0,0);
            }
            else if(task.loadedMeshes[i].id=== "Cabinet_Main_primitive2"){
              const tmp = new BABYLON.TransformNode("tmpcabinetLeft");
              task.loadedMeshes[i].parent =tmp;
              tmp.parent=cebinetLeft; 
              tmp.position = new BABYLON.Vector3(35,0,0);
            }
          }
          cabinet.parent = this.root.cabinetRoot;
          cabinetRight.parent   = this.root.cabinetRoot;
          cebinetLeft.parent    = this.root.cabinetRoot;
          cabinetRight.position = new BABYLON.Vector3(68.5,-50,0);
          cebinetLeft.position  = new BABYLON.Vector3(-68.5,-50,0);
          this.root.cabinetRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(90).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
          this.root.cabinetRoot.scaling.set(.01,.01,.01);
        }
        if(task.name === "gasStove2"){
            const tmproot  = new BABYLON.TransformNode("gasStove2"); 
            tmproot.scaling.set(.01,.01,.01);
            for(let i=0;i<task.loadedMeshes.length;i++){ // gasstove
              const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
              const boundingInfo = new BABYLON.BoundingInfo(min, max);
              const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
              task.loadedMeshes[i].position =  centerPoint;
              task.loadedMeshes[i].parent = tmproot;
              task.loadedMeshes[i].name="gasstove";
              task.isPickable=false;
              task.loadedMeshes[i].renderOutline=false;
              task.loadedMeshes[i].outlineWidth=0;
            }
            tmproot.rotation.x+=BABYLON.Angle.FromDegrees(90).radians();
            tmproot.position.set(-.17,0,-3.2);
            tmproot.isPickable=false;
        }
        if(task.name === "room_reference"){

              for(let i=0;i<task.loadedMeshes.length;i++){
                  task.loadedMeshes[i].isPickable=false;
                  if(task.loadedMeshes[i].name === "OutWall pCube31"){
                        const mat = new BABYLON.StandardMaterial("outwallmat",this.scene);
                        mat.diffuseColor = new BABYLON.Color3.FromInts(147,147,147);
                        mat.specularColor = new BABYLON.Color3.FromInts(0,0,0);
                        task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "pCube31 InteriorWall" || task.loadedMeshes[i].name === "Divider" || task.loadedMeshes[i].name ==="pPlane5"){
                      task.loadedMeshes[i].isPickable=false;
                      task.loadedMeshes[i].renderOutline=false;
                      task.loadedMeshes[i].outlineWidth=0;
                      const mat           = standerdMat.clone("innerWall");
                      mat.diffuseColor    = new BABYLON.Color3.FromInts(126,135,143);
                      mat.emissiveColor   = new BABYLON.Color3.FromInts(126,135,143);
                      if(task.loadedMeshes[i].name ==="pPlane5"){
                          mat.diffuseColor   = new BABYLON.Color3.FromInts(101,105,110);
                          mat.emissiveColor   = new BABYLON.Color3.FromInts(101,105,110);
                      }
                      mat.roughness       = .524;
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "pPlane6"){
                    // const mat = kitchenpCube3Mat.clone();
                      const mat           = standerdMat.clone("pPlane6");
                      mat.diffuseTexture  = new BABYLON.Texture("models/texture/FloorShape.jpg",this.scene);
                      mat.bumpTexture     = new BABYLON.Texture("models/texture/FloorShape normal.jpg",this.scene);
                      mat.diffuseColor    = new BABYLON.Color3.FromInts(120,120,120); 
                      mat.metallic=0;
                      mat.roughness=1;
                      task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name === "Sink"){
                      const sinkMat = physicMat.clone("SinkMat");
                      sinkMat.albedoColor = new BABYLON.Color3.FromInts(255,255,255);
                      sinkMat.metallic   = .7;
                      sinkMat.roughness  = .22;
                      task.loadedMeshes[i].material = sinkMat;
                }
                else if(task.loadedMeshes[i].name === "Kitchen pCube3"){
                      const mat =  standerdMat.clone("Kitchen pCube3Mat");
                      mat.diffuseColor = new BABYLON.Color3.FromInts(108,82,58);
                      mat.metallic   = .8;
                      mat.roughness  = 1;
                      task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name === "StoveExhaust"){
                      const mat         = standerdMat.clone("StoveExhaustMat");
                      mat.diffuseColor  = new BABYLON.Color3.FromInts(51,51,51);
                      mat.emissiveColor = new BABYLON.Color3.FromInts(0,0,0);
                      mat.metallic   = .67;
                      mat.roughness  = .33;
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "Exhaust"){
                      const mat         = physicMat.clone("ExhaustMat");
                      mat.baseColor  = new BABYLON.Color3.FromInts(202,202,202);
                      mat.metallic   = .833;
                      mat.roughness  = .15;
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "Fridge1"){
                      const mat         = physicMat.clone("Fridge1Mat");
                      mat.albedoColor   = new BABYLON.Color3.FromInts(257,255,253);
                      // mat.emissiveColor  = new BABYLON.Color3.FromInts(157,155,153);
                      mat.metallic   = .81;
                      mat.roughness  = .19;
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "Cabinet" || task.loadedMeshes[i].name === "Cabinet4" || task.loadedMeshes[i].name === "Cabinet6"){
                      const mat            = standerdMat.clone("Fridge1Mat");
                      mat.diffuseColor     = new BABYLON.Color3.FromInts(255,255,255);
                      mat.emissiveColor    = new BABYLON.Color3.FromInts(128,128,128);
                      mat.diffuseTexture   = new BABYLON.Texture("models/texture/picturemessage_rajvwxq1.qr2.png",this.scene);
                      mat.diffuseTexture.uScale = 8.55;
                      mat.metallic      = .878;
                      mat.roughness     = 1;
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "BedFoam"){
                      const mat           = standerdMat.clone("BedFoamMat");
                      mat.diffuseColor    = new BABYLON.Color3.FromInts(154,154,154);
                      mat.diffuseTexture  = new BABYLON.Texture("models/texture/Fabric040_2K_Color.jpg",this.scene);
                      mat.metallic        = 0;
                      mat.roughness       = 1;
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "Bed1"){
                        const mat       = physicMat.clone("Bed1");
                        mat.albedoColor = new BABYLON.Color3.FromInts(132,158,200);
                        mat.ambientColor = new BABYLON.Color3.FromInts(120,120,120);
                        mat.metallic  = 1;
                        mat.roughness = 1;  
                        task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "Pillow" || task.loadedMeshes[i].name ===  "pCube38"){
                      const mat       = standerdMat.clone("Bed1");
                      mat.diffuseColor = new BABYLON.Color3.FromInts(213,228,255);
                      mat.metallic  = .748;
                      mat.roughness = 0;  
                      task.loadedMeshes[i].material = mat;
                  }
                  else if(task.loadedMeshes[i].name === "WindiCasingFrame DoorFront1" || task.loadedMeshes[i].name === "WindowFrame pCube22"  
                    || task.loadedMeshes[i].name ===  "pCube22 WindowFrame2"|| task.loadedMeshes[i].name ==="WindowFrame pCube22" ){
                      const mat       = standerdMat.clone("windowrame");
                      mat.diffuseColor = new BABYLON.Color3.FromInts(91,91,91);
                      mat.metallic  = 1;
                      mat.roughness = .18;  
                      task.loadedMeshes[i].material = mat;
                      if(task.loadedMeshes[i].name=== "WindiCasingFrame DoorFront1"){
                        this.root.windowbox = task.loadedMeshes[i];
                        this.setPickable(this.root.windowbox,.5);
                      }
                      else if(task.loadedMeshes[i].name === "pCube22 WindowFrame2"){
                        const windownode   = new BABYLON.TransformNode("windownode");
                        task.loadedMeshes[i].parent   =  windownode;
                        task.loadedMeshes[i].name     = "windowframe";
                        const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
                        const boundingInfo = new BABYLON.BoundingInfo(min, max);
                        const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
                        task.loadedMeshes[i].position =  centerPoint;
                        this.setPickable(task.loadedMeshes[i],-1);
                        // windownode.position.set(-790,345,0);
                        windownode.parent   = this.root.windowFrameRoot;
                        windownode.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());
                        this.root.windowFrameRoot.scaling.set(.01,.01,.01);
                      }
                      
                  }
                  else if(task.loadedMeshes[i].name === "Glass WindowFrame pCube22" || task.loadedMeshes[i].name === "pCube22 WindowFrame2 Glass"){
                    const mat       = standerdMat.clone("glasswindowFrameMat");
                    mat.diffuseColor = new BABYLON.Color3.FromInts(255,255,255);
                    mat.metallic  = 1;
                    mat.roughness = .5;  
                    mat.alpha=.1;
                    task.loadedMeshes[i].material = mat;
                    if(task.loadedMeshes[i].name === "pCube22 WindowFrame2 Glass"){
                        const windownode   = new BABYLON.TransformNode("windowframenode");
                        task.loadedMeshes[i].parent   =  windownode;
                        task.loadedMeshes[i].name     = "windowglass";
                        const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
                        const boundingInfo = new BABYLON.BoundingInfo(min, max);
                        const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
                        task.loadedMeshes[i].position =  centerPoint;
                        task.loadedMeshes[i].isPickable=false;
                        // windownode.position.set(-790,345,0);
                        windownode.parent   = this.root.windowFrameRoot;
                        windownode.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(0).radians());

                    }
                    
                }
                else if(task.loadedMeshes[i].name ===  "AirconClose1"){
                  const mat       = physicMat.clone("acMat");
                  mat.albedoColor  = new BABYLON.Color3.FromInts(73,73,73);
                  mat.emissiveColor = new BABYLON.Color3.FromInts(0,0,0);
                  mat.metallic  = 0;
                  mat.roughness = .1;  
                  task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name ===  "DoorBath2 DoorBath1"){
                  const mat       = standerdMat.clone("DoorBath2Mat");
                  mat.diffuseColor  = new BABYLON.Color3.FromInts(255,145,46);
                  mat.roughness = 1;  
                  task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name ===  "CasingFrameBath DoorBath2"){
                  const mat       = standerdMat.clone("FrameBathMat");
                  mat.diffuseColor  = new BABYLON.Color3.FromInts(78,78,78);
                  mat.roughness = 1;  
                  task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name ===  "DoorBath2 DorrKnobBath DoorBath1"){
                  const mat       = standerdMat.clone("DoorBath2Mat");
                  mat.diffuseColor  = new BABYLON.Color3.FromInts(147,147,147);
                  mat.roughness = 1;  
                  task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name ===  "DoorFront1 CasingFrameFront"){
                  const mat       = standerdMat.clone("DoorFront1Mat");
                  mat.diffuseColor  = new BABYLON.Color3.FromInts(55,55,55);
                  mat.roughness = 1;  
                  task.loadedMeshes[i].material = mat;
                }
                else if(task.loadedMeshes[i].name ===  "DoorFront1 DoorKnob"){
                  
                    const tmproot  = new BABYLON.TransformNode("door_root"); 
                    task.loadedMeshes[i].parent = tmproot;
                    task.loadedMeshes[i].scaling.y=.98;
                    task.loadedMeshes[i].name="mydoor";
                    this.setPickable(task.loadedMeshes[i],2);
                    const mat            = standerdMat.clone("bathdoorMat");
                    mat.diffuseColor     = new BABYLON.Color3.FromInts(255,170,93);
                    mat.diffuseTexture   = new BABYLON.Texture("models/texture/Wood027_2K_Roughness.jpg",this.scene);
                    mat.roughness = 1;  
                    task.loadedMeshes[i].material = mat;
                    const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
                    const boundingInfo = new BABYLON.BoundingInfo(min, max);
                    const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
                    task.loadedMeshes[i].position =  centerPoint;
                    tmproot.position.z-=100;
                    tmproot.parent =this.root.doorRoot;
                    this.root.doorRoot.rotation = new BABYLON.Vector3(BABYLON.Angle.FromDegrees(0).radians(),BABYLON.Angle.FromDegrees(325).radians(),BABYLON.Angle.FromDegrees(0).radians());
                    this.root.doorRoot.scaling.set(.01,.01,.01);
                }
                else if(task.loadedMeshes[i].name ===  "DoorFront1 DoorKnobFront DoorKnob"){
                    if(this.Counter ===0){
                        const tmproot  = new BABYLON.TransformNode("door_knob");
                        task.loadedMeshes[i].parent = tmproot;
                        task.loadedMeshes[i].name="mydoorknob";
                        const mat           = physicMat.clone("bathdoorMat");
                        mat.albedoColor     = new BABYLON.Color3.FromInts(0,0,0);  
                        mat.emissiveColor   = new BABYLON.Color3.FromInts(1,1,1);
                        mat.albedoTexture   = new BABYLON.Texture("models/texture/Wood027_2K_Roughness.jpg",this.scene);
                        mat.roughness       = .15;  
                        mat.metallic        = .53;  
                        task.loadedMeshes[i].material = mat;
                        const { min, max } = task.loadedMeshes[i].getHierarchyBoundingVectors();
                        const boundingInfo = new BABYLON.BoundingInfo(min, max);
                        const centerPoint = boundingInfo.boundingBox.center.scale(-1);  
                        task.loadedMeshes[i].position =  centerPoint;
                        tmproot.rotation.y = BABYLON.Angle.FromDegrees(180).radians();
                        tmproot.position.set(-20,0,-195);
                        tmproot.parent =this.root.doorRoot;
                        tmproot.name ="doorknob";
                        this.Counter++;
                    }
                    else{
                        task.loadedMeshes[i].setEnabled(false);
                    }
                }
                else if(task.loadedMeshes[i].name ===  "OnSwitch2"){
                  const mat           = standerdMat.clone("bathdoorMat");
                  mat.diffuseColor    = new BABYLON.Color3.FromInts(192,192,192);
                  mat.emissiveColor   = new BABYLON.Color3.FromInts(50,50,50);
                  mat.metallic  = 0;  
                  mat.roughness = .2;  
                  task.loadedMeshes[i].material = mat;
                  this.root.lightswtich = task.loadedMeshes[i];
                  this.root.lightswtich.name = "lightswtich";
                  this.setPickable(task.loadedMeshes[i],1);
                }
                else if(task.loadedMeshes[i].name === "pCube6" || task.loadedMeshes[i].name === "pCube24" || task.loadedMeshes[i].name ===  "pCube29" ||
                        task.loadedMeshes[i].name === "pCube25"){
                        task.loadedMeshes[i].setEnabled(false);
                        task.loadedMeshes[i].isPickable=false;
                 }
                // console.log(task.loadedMeshes[i].name);
              }
          }
    });
    const frontplan = BABYLON.MeshBuilder.CreatePlane("frontplane",{width:8,height:5,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
    let frontplanMaterial = new BABYLON.StandardMaterial("frontplaneMat", this.scene);

    frontplanMaterial.emissiveTexture= new BABYLON.Texture("models/texture/view.jpg",this.scene);
    frontplanMaterial.diffuseTexture = new BABYLON.Texture("models/texture/view.jpg",this.scene);
    frontplan.rotation.y = BABYLON.Angle.FromDegrees(270).radians();
    frontplan.position = new BABYLON.Vector3(-8.4,4,-.9);
    frontplan.material = frontplanMaterial;
    frontplan.isPickable=false;
    frontplan.renderOutline=false;


    const backPlan = frontplan.clone();
    let backplanMaterial = new BABYLON.StandardMaterial("frontplaneMat", this.scene);
    backplanMaterial.emissiveTexture= new BABYLON.Texture("models/texture/hallway.jpg",this.scene);
    backplanMaterial.diffuseTexture = new BABYLON.Texture("models/texture/hallway.jpg",this.scene);
    backPlan.rotation.y = BABYLON.Angle.FromDegrees(90).radians();
    backPlan.position = new BABYLON.Vector3(10,2,.5);
    backPlan.scaling.y*=1.2;
    backPlan.material = backplanMaterial;
    backPlan.isPickable=false;
    backPlan.renderOutline=false;


    const tableupperColllider = BABYLON.MeshBuilder.CreatePlane("tablecollider",{width:2.6,height:1.6,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
    let tableMat = new BABYLON.StandardMaterial("frontplaneMat", this.scene);
    tableMat.diffuseColor = new BABYLON.Color3.FromInts(107,166,163);
    tableMat.emissiveColor = new BABYLON.Color3.FromInts(107,166,163);
    tableupperColllider.renderOutline=false;
    tableupperColllider.isPickable=false;
    tableupperColllider.material = tableMat;
    tableupperColllider.rotation.set(BABYLON.Angle.FromDegrees(90).radians(),0,0);
    tableupperColllider.position.set(-.3,1.92,2.5);
    tableupperColllider.visibility=0;

    const trollyCollider = tableupperColllider.clone("trollycollider"); 
    trollyCollider.renderOutline=false;
    trollyCollider.isPickable=false;
    trollyCollider.position = new BABYLON.Vector3(-2.2,1.80,2.50);
    trollyCollider.scaling.set(.3,.8,1)
    trollyCollider.visibility=0;
    trollyCollider.isPickable=false;
    trollyCollider.renderOutline=false;

    const apdCassetteTrolly = trollyCollider.clone("apdCassetteTrolly_collider")
    apdCassetteTrolly.isPickable=false;
    apdCassetteTrolly.renderOutline=false;
    apdCassetteTrolly.visibility=0;
    apdCassetteTrolly.position = new BABYLON.Vector3(-2.7,1.80,2.50);

    const trollyreckCollider =   trollyCollider.clone("trollyreckcollider")  
    trollyreckCollider.visibility=0;
    trollyreckCollider.position  = new BABYLON.Vector3(-2.9,.5,2.5); 
    trollyreckCollider.scaling.set(.83,.83,1);

    const apdCollider = tableupperColllider.clone("apdcollider"); 
    apdCollider.renderOutline=false;
    apdCollider.isPickable=false;
    
    this.scene.getMeshByName("apdcollider").position = new BABYLON.Vector3(-3.4,2.1,2.5);
    apdCollider.position = new BABYLON.Vector3(-3.4,2.1,2.5);
    apdCollider.scaling.set(.3,.4,1)
    apdCollider.visibility=0;


    const apdSwitch = BABYLON.MeshBuilder.CreateSphere("apdswitch_sphere", {diameter:.05});
    apdSwitch.position.set(-3.689,1.89,2.139);
    apdSwitch.visibility=0;
    const apdSwitchmat = new BABYLON.StandardMaterial("apdswitch_sphere_mat")
    apdSwitchmat.diffuseColor = new BABYLON.Color3.FromInts(0,255,0);
    apdSwitch.material =  apdSwitchmat;
    apdSwitch.isPickable = true;
    apdSwitch.renderOutline = false;
  
  // console.log("meshes", meshes)
   this.assetsManager.onProgress = (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) => {
      this.game.engine.loadingUIText = "We are loading the scene. " +remainingCount +" out of " +totalCount +" items still need to be loaded.";};

    this.assetsManager.onFinish = (tasks) => {
      //On ALL Done
      this.loaded = true;
      console.log("!!! assetsManager finish!!!");
      switch(this.game.sceneManager.currentSceneState)
      {
           case this.game.sceneManager.sceneState.basic:
                this.root.isSceneCreated=true;
                this.root.initScene().then(()=>{
                    this.isLoad=true;
                });
               break;
      }
      if(document.getElementById("loader_spiner"))
         document.getElementById("loader_spiner").style.display = "none";
    };
    this.assetsManager.load();
  }
  setPickable(mesh,width){
    mesh.isPickable=true;
    mesh.renderOutline = false;
    mesh.outlineWidth = width;
    mesh.outlineColor = BABYLON.Color3.Yellow();
  }
  
}
