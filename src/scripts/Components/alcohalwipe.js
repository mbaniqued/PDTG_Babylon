const position =[{x: -2.35,y: 1.80,z:2.19},{x: -2.35,y: 1.80,z:2.86},{x:-3.34,y:2.089,z:2.68},{x:-3.34,y:2.089,z:2.32},{x:-3.349,y:2,z:2.1},{x:-3.37 ,y:1.800,z:2.00}]
import * as GUI from 'babylonjs-gui';
export default class AlcohalWipe{

        constructor(root){
            this.root = root;    
            this.wipespotplanenode=[];
            this.cleanCnt=[];
            this.cleanCnt[0]= false;
            this.wipespotplanenode[0]  = new BABYLON.TransformNode("wipeplan_node");
            const wipespotplane        = BABYLON.MeshBuilder.CreatePlane("wipeplan",{width:2,height:1,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.root.scene);
            wipespotplane.name = "wipeplan"
            const mat              = new BABYLON.StandardMaterial("wipeplanmat",this.root.scene);
            mat.diffuseColor       = new BABYLON.Color3.FromInts(0,255,230);
            mat.emissiveColor      = new BABYLON.Color3.FromInts(0,255,230);
            wipespotplane.rotation.x   = BABYLON.Angle.FromDegrees(90).radians();
            wipespotplane.position     = new BABYLON.Vector3(0,0,0)
            wipespotplane.scaling      = new BABYLON.Vector3(.6,.69,1)
            wipespotplane.outlineWidth  = 0;
            wipespotplane.renderOutline = false;
            mat.alpha=.2;
            mat.roughness=.7
            wipespotplane.material = mat;
            wipespotplane.parent = this.wipespotplanenode[0];

            const checkplan              = wipespotplane.clone("wipeplan2");
            checkplan.name = "wipeplan2";
            const checkplanMat           = new BABYLON.StandardMaterial("checkplanMat");
            checkplanMat.diffuseColor    = new BABYLON.Color3.FromInts(128,128,128);
            checkplanMat.emissiveColor    = new BABYLON.Color3.FromInts(128,128,128);
            checkplanMat.diffuseTexture =  new BABYLON.Texture("ui/white.png",this.root.scene);
            checkplanMat.diffuseTexture.hasAlpha=true;
            checkplan.position     = new BABYLON.Vector3(0,.001,0);
            checkplan.scaling      = new BABYLON.Vector3(.1,.2,1);
            checkplan.outlineWidth  = 0;
            checkplan.renderOutline = false;
            checkplan.material = checkplanMat;
            checkplan.parent = this.wipespotplanenode[0];
            this.wipespotplanenode[0].position = new BABYLON.Vector3(position[0].x,position[0].y,position[0].z);
            this.createWipeCleanSopt();
            this.loadwipeAlcohal();
            for(let i=0;i<this.wipespotplanenode.length;i++){
                this.cleanCnt[i] = false;
                this.wipespotplanenode[i].name = "wipespot"+i;
            }
        }
        createWipeCleanSopt(){
            for(let i=1;i<6;i++){
                this.wipespotplanenode[i] = this.wipespotplanenode[0].clone("wipeplan_node"+i);
                const wipespotplane              = new BABYLON.StandardMaterial("wipeplanmat"+i,this.root.scene);
                wipespotplane.diffuseColor       = new BABYLON.Color3.FromInts(0,255,230);
                wipespotplane.emissiveColor      = new BABYLON.Color3.FromInts(0,255,230);
                wipespotplane.outlineWidth  = 0;
                wipespotplane.renderOutline = false;
                wipespotplane.alpha=.2;
                wipespotplane.roughness=.7
                this.wipespotplanenode[i].getChildMeshes()[0].material = wipespotplane;
                const checkplanMat           = new BABYLON.StandardMaterial("checkplanMat"+i);
                checkplanMat.diffuseColor    = new BABYLON.Color3.FromInts(128,128,128);
                checkplanMat.emissiveColor   = new BABYLON.Color3.FromInts(128,128,128);
                checkplanMat.diffuseTexture  =  new BABYLON.Texture("ui/white.png",this.root.scene);
                checkplanMat.diffuseTexture.hasAlpha=true;
                this.wipespotplanenode[i].getChildMeshes()[1].material = checkplanMat;
                if(position[i])
                    this.wipespotplanenode[i].position = new BABYLON.Vector3(position[i%position.length].x,position[i%position.length].y,position[i%position.length].z);
                else                    
                    this.wipespotplanenode[i].position = new BABYLON.Vector3(0,0,0);
                if(i>1)
                    this.wipespotplanenode[i].getChildMeshes()[0].scaling = new BABYLON.Vector3(.42,.35,1);
               if(i===4)
                    this.wipespotplanenode[i].rotation.x = BABYLON.Angle.FromDegrees(270).radians();
            }
        }
        loadwipeAlcohal(){

            this.alocohalwipe   =  this.root.gui2D.createImage("alocohalwipeicon","ui/wetwipes.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
            this.alocohalwipe.isVisible = true;
            this.alocohalwipe.isPointerBlocker=false;

            setTimeout(() => {
                this.root.game.engine.runRenderLoop(() => {
                    const width = this.root.game.engine.getRenderWidth();
                    const height = this.root.game.engine.getRenderHeight();
                    this.alocohalwipe.leftInPixels = this.root.scene.pointerX - (width / 2.0);
                    this.alocohalwipe.topInPixels  = this.root.scene.pointerY - (height / 2.0);
                    this.alocohalwipe.isPointerBlocker=false;
                });                
            }, 10000);

            this.touch=false;
            this.root.scene.onPointerObservable.add((pointerInfo) => {      	
                  switch (pointerInfo.type) {
                        case BABYLON.PointerEventTypes.POINTERDOWN:{
                                const pickinfo = this.root.scene.pick(this.root.scene.pointerX, this.root.scene.pointerY);
                                  if(pickinfo.pickedMesh && pickinfo.pickedMesh.parent){
                                    if(pickinfo.pickedMesh.parent.name.includes("wipespot")){
                                        this.touch = true;
                                        this.findSpot(pickinfo.pickedMesh);
                                    }
                                  }
                              }
                          break;
                        case BABYLON.PointerEventTypes.POINTERUP:{
                                this.touch = false;
                            }
                          break;
                        case BABYLON.PointerEventTypes.POINTERMOVE:{ 
                                const pickinfo = this.root.scene.pick(this.root.scene.pointerX, this.root.scene.pointerY);
                                if(pickinfo.pickedMesh && pickinfo.pickedMesh.parent){
                                    if(pickinfo.pickedMesh.parent.name.includes("wipespot")){
                                        if(this.touch){
                                            this.findSpot(pickinfo.pickedMesh);
                                            
                                        }
                                    }
                                }
                            }
                          break;
                      }
                  });





            
            // this.alocohalwipe               = BABYLON.MeshBuilder.CreatePlane("alcohalwipe",{width:.3,height:.3,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.root.scene);
            // const alocohalwipeMat           = new BABYLON.StandardMaterial("alocohalwipeMat");
            // alocohalwipeMat.diffuseColor    = new BABYLON.Color3.FromInts(255,255,255);
            // alocohalwipeMat.emissiveColor   = new BABYLON.Color3.FromInts(255,255,255);
            // alocohalwipeMat.diffuseTexture  = new BABYLON.Texture("ui/wetwipes.png",this.root.scene);
            // alocohalwipeMat.diffuseTexture.hasAlpha=true;
            // this.alocohalwipe.position       = new BABYLON.Vector3(0,0,0);
            // this.alocohalwipe.scaling        = new BABYLON.Vector3(1,1,1);
            // this.alocohalwipe.outlineWidth   = 0;
            // this.alocohalwipe.renderOutline  = false;
            // this.alocohalwipe.material       = alocohalwipeMat;
            // this.alocohalwipe.rotation.x     = BABYLON.Angle.FromDegrees(90).radians();

            // this.alocohalwipe.position =  new BABYLON.Vector3(position[0].x,position[0].y+.5,position[0].z);
            // this.attachOwnPointerDragBehavior(this.alocohalwipe);

        }
        findSpot(mesh){
            for(let i=0;i<this.wipespotplanenode.length;i++){
                 console.log(this.wipespotplanenode[i].name)
                if(this.wipespotplanenode[i].name === mesh.parent.name){
                    this.wipespotplanenode[i].getChildMeshes().forEach(childmesh => {
                        this.chnageColor(childmesh)
                    });
                }
            }
        }
        chnageColor(mesh){
            mesh.material.diffuseColor   = new BABYLON.Color3.FromInts(0,255,230);
            console.log(mesh.material.diffuseColor);
        }


        // attachOwnPointerDragBehavior(mesh){
        //     let pointerDragBehavior = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(1,1,1)});
        //     pointerDragBehavior.moveAttached = false;
        //     pointerDragBehavior.useObjectOrienationForDragging = false;
        //     pointerDragBehavior.onDragStartObservable.add((event)=>{
        //         console.log("startDrag");
        //     })
        //     pointerDragBehavior.onDragObservable.add((event)=>{
        //         pointerDragBehavior.attachedNode.position.x += event.delta.x;
        //         pointerDragBehavior.attachedNode.position.z += event.delta.z;
        //         pointerDragBehavior.attachedNode.position.y = position[0].y+.25;
        //     })
        //     pointerDragBehavior.onDragEndObservable.add((event)=>{
        //     })
        //     mesh.addBehavior(pointerDragBehavior);
        // }
}