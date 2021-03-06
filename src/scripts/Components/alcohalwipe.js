import {event_objectivecomplete } from "../scene/MainScene";
const position =[{x: -2.35,y: 1.80,z:2.19},{x: -2.35,y: 1.80,z:2.86},{x:-3.34,y:2.089,z:2.68},{x:-3.34,y:2.089,z:2.32},{x:-3.349,y:2,z:2.1},{x:-3.5 ,y:1.800,z:2}]
const fillMode =["#d6ffd6","#c7ffc7","#b8ffb8","#a8ffa8","#99ff99","#99ff99","#8aff8a","#7aff7a","#6bff6b","#5cff5c","#4dff4d","#3dff3d","#2eff2e","#1fff1f"];
let colorCounter=0;
import { Color3,Vector3,TransformNode,StandardMaterial,MeshBuilder,Angle,Mesh,PointerEventTypes } from "babylonjs";
import { Control } from "babylonjs-gui";

export default class AlcoholWipe{

        constructor(root){
            this.root = root;    
            this.wipespotplanenode=[];
            this.cleanCnt=[];
            this.wipespotplanenode[0]  = new TransformNode("wipeplan_node");
            const wipespotplane        = MeshBuilder.CreatePlane("wipeplan",{width:2,height:1,sideOrientation: Mesh.FRONTSIDE},this.root.scene);
            wipespotplane.name = "wipeplan"
            const mat              = new StandardMaterial("wipeplanmat",this.root.scene);
            mat.diffuseColor       = new Color3.FromInts(0,255,230);
            mat.emissiveColor      = new Color3.FromInts(0,255,230);
            wipespotplane.rotation.x   = Angle.FromDegrees(90).radians();
            wipespotplane.position     = new Vector3(0,0,0)
            wipespotplane.scaling      = new Vector3(.6,.69,1)
            wipespotplane.outlineWidth  = 0;
            wipespotplane.renderOutline = false;
            mat.alpha=.2;
            mat.roughness=.7
            wipespotplane.material = mat;
            wipespotplane.parent = this.wipespotplanenode[0];

            const checkplan              = wipespotplane.clone("wipeplan2");
            checkplan.name = "wipeplan2";
            const checkplanMat           = new StandardMaterial("checkplanMat");
            checkplanMat.diffuseColor    = new Color3.FromInts(128,128,128);
            checkplanMat.emissiveColor   = new Color3.FromInts(128,128,128);
            checkplanMat.diffuseTexture  =  new BABYLON.Texture("ui/white.png",this.root.scene);
            checkplanMat.diffuseTexture.hasAlpha=true;
            checkplan.position     = new Vector3(0,.001,0);
            checkplan.scaling      = new Vector3(.1,.2,1);
            checkplan.outlineWidth  = 0;
            checkplan.renderOutline = false;
            checkplan.material = checkplanMat;
            checkplan.parent = this.wipespotplanenode[0];
            this.wipespotplanenode[0].position = new Vector3(position[0].x,position[0].y,position[0].z);
            this.createWipeCleanSopt();
            this.createwipeAlcohalIcon();
            for(let i=0;i<this.wipespotplanenode.length;i++){
                this.cleanCnt[i] = 0;
                this.wipespotplanenode[i].name = "wipespot"+i;
                this.drawalcohalwipe(false,i);
            }
            this.usealcohalwipe=false;
            this.accessAlcohal=false;

            
        }
        createWipeCleanSopt(){
            for(let i=1;i<6;i++){
                this.wipespotplanenode[i]   = this.wipespotplanenode[0].clone("wipeplan_node"+i);
                this.wipespotplanenode[i].getChildMeshes()[0].material = this.wipespotplanenode[0].getChildMeshes()[0].material.clone();
                this.wipespotplanenode[i].getChildMeshes()[1].material = this.wipespotplanenode[0].getChildMeshes()[1].material.clone();
                this.wipespotplanenode[i].position = new Vector3(position[i%position.length].x,position[i%position.length].y,position[i%position.length].z);
                if(i>1)
                    this.wipespotplanenode[i].getChildMeshes()[0].scaling = new Vector3(.42,.35,1);
               if(i===4)
                    this.wipespotplanenode[i].rotation.x = Angle.FromDegrees(270).radians();
            }
        }
        createwipeAlcohalIcon(){
            this.alocohalwipe   =  this.root.gui2D.createImage("alocohalwipeicon","ui/wetwipes.png",100,100,Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,true);
            this.alocohalwipe.alpha=0;
            this.msg            =  this.root.gui2D.createText("bartitle","Click & swipe to clean\n the highlighted areas",32,"#ffffff",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
            this.msg.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
            this.msg.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;
            this.alocohalwipe.isVisible = false;
            this.alocohalwipe.zIndex=0;
            this.msg.isVisible = false;
            this.msg.isPointerBlocker=false;
            this.msg.leftInPixels=300;
            this.msg.topInPixels=30;
            this.root.scene.registerBeforeRender(()=> {
                if(this.usealcohalwipe){
                    // const width  = this.root.game.engine.getRenderWidth();
                    // const height = this.root.game.engine.getRenderHeight();
                    // this.alocohalwipe.leftInPixels = this.root.scene.pointerX;
                    // this.alocohalwipe.topInPixels  = this.root.scene.pointerY-height;
                    // this.alocohalwipe.isPointerBlocker=false;
                    document.getElementById("alcoholwipeicon").style.left = this.root.scene.pointerX-this.alocohalwipe.widthInPixels/2 + "px";
                    document.getElementById("alcoholwipeicon").style.top = this.root.scene.pointerY-this.alocohalwipe.heightInPixels/2+"px";
                }
            });       
            this.touch=false;
            this.root.scene.onPointerObservable.add((pointerInfo) => {      	
            if(this.usealcohalwipe && this.alocohalwipe.isVisible){
                switch (pointerInfo.type) {
                    case PointerEventTypes.POINTERDOWN:{
                            const pickinfo = this.root.scene.pick(this.root.scene.pointerX, this.root.scene.pointerY);
                                if(pickinfo.pickedMesh && pickinfo.pickedMesh.parent){
                                    if(pickinfo.pickedMesh.parent.name.includes("wipespot")){
                                        this.touch = true;
                                        this.findSpot(pickinfo.pickedMesh);
                                    }
                                }
                            }
                        break;
                    case PointerEventTypes.POINTERUP:{
                            this.touch = false;
                        }
                        break;
                    case PointerEventTypes.POINTERMOVE:
                            const pickinfo = this.root.scene.pick(this.root.scene.pointerX, this.root.scene.pointerY);
                            if(pickinfo.pickedMesh && pickinfo.pickedMesh.parent){
                                if(pickinfo.pickedMesh.parent.name.includes("wipespot")){
                                    if(this.touch){
                                        this.findSpot(pickinfo.pickedMesh);
                                        
                                    }
                                }
                            }
                        
                        break;
                    }
                }
            });
        }
        findSpot(mesh){
            for(let i=0;i<this.wipespotplanenode.length;i++){
                if(this.wipespotplanenode[i].name === mesh.parent.name){
                    // console.log(this.wipespotplanenode[i].name)
                    let color =  fillMode[this.cleanCnt[i]];
                    this.changeColor(this.wipespotplanenode[i].getChildMeshes()[1],color);
                    let val =.2-this.cleanCnt[i]*.01;
                    if(val<0)
                        val=0;
                    this.changeAlpha(this.wipespotplanenode[i].getChildMeshes()[0],val);

                    if(this.cleanCnt[i]<fillMode.length-1){
                        if(colorCounter%2==0)
                            this.cleanCnt[i]++;
                    }
                    else{
                        this.wipespotplanenode[i].getChildMeshes()[0].setEnabled(false);
                    }
                    colorCounter++;                     
                }
            }
            if(this.checkallClear()){
                let tout = setTimeout(() => {
                    this.root.tableObject.setTableFocusAnim();
                    this.root.setFocusOnObject(new Vector3(this.root.tableObject.meshRoot.position.x,this.root.tableObject.meshRoot.position.y,this.root.tableObject.meshRoot.position.z-1));
                    clearTimeout(tout)
                }, 500);
                document.getElementById("alcoholwipeicon").style.display = "none";
                this.accessAlcohal=true;
                this.usealcohalwipe=false;
                this.alocohalwipe.isVisible = false;
                this.msg.isVisible = false;
                for(let i=0;i<this.wipespotplanenode.length;i++){
                    this.drawalcohalwipe(false,i);
                }
                let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this.root.alcohalItem,level:3,msg:"wipe_clear"}});
                document.dispatchEvent(custom_event);

            }
        }
        changeColor(mesh,color){
            mesh.material.diffuseColor   = new Color3.FromHexString(color);
            mesh.material.emissiveColor  = new Color3.FromHexString(color);
        }
        changeAlpha(mesh,value){
            mesh.material.alpha   = value;
        }
        checkallClear(){
            let cnt=0;
            let allclear=false;
            for(let i=0;i<this.wipespotplanenode.length;i++){
                
                if(!this.wipespotplanenode[i].getChildMeshes()[0].isEnabled())
                    cnt++;
                if(cnt>=this.wipespotplanenode.length)    
                    allclear = true;
                else    
                    allclear = false;
            }
            return allclear;
        }
        hideWipeClean(){
            this.usealcohalwipe=false;
            this.alocohalwipe.isVisible=false;
            this.msg.isVisible = false;
            for(let i=0;i<this.wipespotplanenode.length;i++){
                this.drawalcohalwipe(false,i);
            }
            document.getElementById("alcoholwipeicon").style.display = "none";
        }
        reset(){
            this.accessAlcohal=false;
            this.usealcohalwipe=true;
            this.alocohalwipe.isVisible=true;
            this.msg.isVisible=true;
            for(let i=0;i<this.wipespotplanenode.length;i++){
                this.cleanCnt[i]=0;
                colorCounter=0;
                this.wipespotplanenode[i].getChildMeshes()[0].material.diffuseColor   = new Color3.FromInts(0,255,230);
                this.wipespotplanenode[i].getChildMeshes()[0].material.emissiveColor  = new Color3.FromInts(0,255,230);
                this.wipespotplanenode[i].getChildMeshes()[0].material.alpha =.2;
                this.wipespotplanenode[i].getChildMeshes()[1].material.diffuseColor   = new Color3.FromInts(128,128,128);
                this.wipespotplanenode[i].getChildMeshes()[1].material.emissiveColor  = new Color3.FromInts(128,128,128);
                this.drawalcohalwipe(true,i);
            }   
            document.getElementById("alcoholwipeicon").style.display = "block";
            
        }
        drawalcohalwipe(draw,i){
            this.wipespotplanenode[i].getChildMeshes()[0].setEnabled(draw);
            this.wipespotplanenode[i].getChildMeshes()[1].setEnabled(draw);
            this.alocohalwipe.isVisible = draw;
            this.root.gui2D.resetCamBtn.zIndex=draw?100:0;
            this.root.gui2D.userBackBtn.zIndex=draw?100:0;
            this.root.gui2D.submitBtn.zIndex=draw?100:0;
            this.root.gui2D.submitBtn2.zIndex=draw?100:0;
        }
}   