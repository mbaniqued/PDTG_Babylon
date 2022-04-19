export const FOV=.78;
const start_fov=1.2;
export const LIGHTOFF=.05,LIGHTON=.5;
import { GameState,IS_DRAG } from "./scene/MainScene";
export default class Common{
     constructor(root){
        this.root          = root;                    
        this.game          = root.game;
        this.scene         = null;
        this.camera        = null; 
        this.animFrameRate = 60;
        this.camDirection  = {deltaVal:1,margin:50}; 
        this.camVector     = new BABYLON.Vector3(0,3.2,0);
     }
     createScene(name) {
        this.scene = new BABYLON.Scene(this.game.engine);
        this.scene.name = name;
        this.scene.clearColor = BABYLON.Color3.FromHexString("#000000");
        
      //   this.env = this.scene.createDefaultEnvironment();
      //   this.env.setMainColor(new BABYLON.Color3.FromInts(255,253,227));
      //   this.scene.environmentTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("models/environment/autoshop_01_4k.env",this.scene);
      //   this.scene.environmentTexture.level=0;
      //     this.scene.enablePrePassRenderer();
      //     this.scene.enableSubSurfaceForPrePass();
          this.setLight();
        
        return this.scene;
     }
     createCamera(scene) {
        this.camera = new BABYLON.ArcRotateCamera("maincamera",0,0,10,this.camVector,scene);
        this.camera.fov   = start_fov;
        this.camera.layerMask=1;
        this.camera.inputs.clear();
      //   this.camera.inputs.addPointers();
      //   this.camera.inputs.addMouseWheel();
        this.camera.position.set(0,0,0);
        this.camera.setTarget(this.camVector);
        this.camera.attachControl(this.game.canvas, true);  
        this.camera.maxZ = 100;
        this.camera.wheelPrecision = 50;
        this.camera.useBouncingBehavior = false;
        this.createminiMapCamera();
        this.scene.activeCameras = [];
        this.scene.activeCameras.push(this.camera);
        this.setView();
        this.scene.cameraToUseForPointers = this.camera;
        return this.camera;
      }
      setLight() {
        this.hemiLight              = new BABYLON.HemisphericLight("HemiLight",new BABYLON.Vector3(-100,100,-100),this.scene);
      //   this.hemiLight.groundColor  = new BABYLON.Color3.FromInts (255,255,255);
        this.hemiLight.diffuse      = new BABYLON.Color3.FromInts (255,253,227);
        this.hemiLight.specular     = new BABYLON.Color3.FromInts (0,0,0);
        
        this.directionalLight             = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(100,-100,-40), this.scene);
        this.directionalLight.diffuse     = new BABYLON.Color3.FromInts (255,253,227);
        this.directionalLight.specular    = new BABYLON.Color3.FromInts (0,0,0);

      }
      setView(){
            this.hemiLight.intensity         = 0;
            this.directionalLight.intensity  = LIGHTOFF;
            this.camera.fov   = start_fov;
            this.camera.setTarget(new BABYLON.Vector3(-4,3,-.5));
            this.camera.position.set(0,0,0);
            this.camera.lowerRadiusLimit = 0;
            this.camera.upperRadiusLimit = 100;
            this.camera.radius          = 3;
            this.camera.alpha           = BABYLON.Angle.FromDegrees(230).radians();
            this.camera.beta            = BABYLON.Angle.FromDegrees(90).radians();
            this.camera.lowerBetaLimit  = BABYLON.Angle.FromDegrees(0).radians();
            this.camera.upperBetaLimit  = BABYLON.Angle.FromDegrees(180).radians();
      }
      updateCam(){
            // console.log("!!! updateCam!!! "+BABYLON.Angle.FromRadians(this.camera.alpha).degrees());
            if(IS_DRAG.value || this.root.scene.getMeshByName("ccpdplane").isVisible)
                return;  
            if(this.root.gui2D.resetCamBtn.isVisible ||  this.root.gui2D.radialCircle.isVisible || this.root.gui2D.userExitBtn.isVisible)
                 return; 
            if(this.scene.pointerX>0 && this.scene.pointerX<=this.camDirection.margin){
                  this.camera.alpha += BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
                  if(this.camera.alpha>BABYLON.Angle.FromDegrees(359).radians()){
                        this.camera.alpha = BABYLON.Angle.FromDegrees(0).radians();
                        console.log("!! innnnnnnnn set!!1");

                  }
            }
            else if( this.scene.pointerX>window.innerWidth-this.camDirection.margin &&  this.scene.pointerX<window.innerWidth){
                  this.camera.alpha -= BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
                  if(this.camera.alpha<0)
                        this.camera.alpha = BABYLON.Angle.FromDegrees(359).radians();
                        
            }
            else if(this.scene.pointerY>0 && this.scene.pointerY<=this.camDirection.margin){
                  if(this.camera.beta<1.7)
                        this.camera.beta += BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
            }
            else if( this.scene.pointerY>window.innerHeight-this.camDirection.margin &&  this.scene.pointerY<window.innerHeight){
                  if(this.camera.beta>.9)
                        this.camera.beta -= BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
            }
        } 
        createminiMapCamera(){
            this.miniMapCam = new BABYLON.ArcRotateCamera("minimapcamera",0,0,10,this.minimapTarget,this.scene);
            this.miniMapCam.viewport = new BABYLON.Viewport(0.7,0.5,0.2,.2);
            this.miniMapCam.viewport.height =  this.miniMapCam.viewport.width*1.1;
            this.miniMapCam.target = new BABYLON.Vector3(0,0,0);
            this.miniMapCam.position.set(0,0,0);
            this.miniMapCam.detachControl(this.game.canvas,false);  
            this.miniMapCam.alpha=BABYLON.Angle.FromDegrees(0).radians();
            this.miniMapCam.beta=BABYLON.Angle.FromDegrees(100).radians();
            this.miniMapCam.radius=2;     
            this.miniMapCam.lowerRadiusLimit=2;
            this.miniMapCam.upperRadiusLimit=2;
            this.miniMapCam.lowerAlphaLimit=this.miniMapCam.alpha;
            this.miniMapCam.upperAlphaLimit=this.miniMapCam.alpha;
            this.miniMapCam.lowerBetaLimit=this.miniMapCam.beta;
            this.miniMapCam.upperBetaLimit=this.miniMapCam.beta;
            this.miniMapCam.layerMask=2;
            this.miniMapCam.inputs.clear();

            // this.camBorder = BABYLON.MeshBuilder.CreatePlane("camBorder",{width:.38,height:.28,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
            // let borderMat = new BABYLON.StandardMaterial("camBorderMat", this.scene);
            // borderMat.diffuseColor  = new BABYLON.Color3.FromInts(0,0,0);
            // borderMat.emissiveColor = new BABYLON.Color3.FromInts(0,0,0);
            // // this.camBorder.renderOutline=true;
            // this.camBorder.isPickable=false;
            // this.camBorder.material = borderMat;
            // // this.camBorder.outlineColor = new BABYLON.Color3.FromInts(240,240,240);
            // this.camBorder.parent = this.camera;
            // this.camBorder.position.set(.53,.13,1.05);
            // this.camBorder.visibility=0;
            
        }
        setminiCamTarget(objecttype){
            this.addMiniCam();  
            
            switch(objecttype){
                  case 0:
                        this.miniMapCam.target.set(-3.8,4.89,.10);//for fan
                        this.miniMapCam.alpha=BABYLON.Angle.FromDegrees(0).radians();
                        this.miniMapCam.lowerAlphaLimit=this.miniMapCam.alpha;
                        this.miniMapCam.upperAlphaLimit=this.miniMapCam.alpha;
                        this.miniMapCam.lowerBetaLimit=this.miniMapCam.beta;
                        this.miniMapCam.upperBetaLimit=this.miniMapCam.beta;
                        break;
                  case 1:
                        this.miniMapCam.alpha=BABYLON.Angle.FromDegrees(270).radians();
                        this.miniMapCam.target.set(-6.09,4.5,2.7);//for ac
                        this.miniMapCam.lowerAlphaLimit=this.miniMapCam.alpha;
                        this.miniMapCam.upperAlphaLimit=this.miniMapCam.alpha;
                        this.miniMapCam.lowerBetaLimit=this.miniMapCam.beta;
                        this.miniMapCam.upperBetaLimit=this.miniMapCam.beta;
                        break;
            }
        }
        addMiniCam(){
            if(this.scene.activeCameras.length<2)  
            this.scene.activeCameras.push(this.miniMapCam);

            this.root.camBorder.isVisible=true;
        }
        removeMiniCam(){
            this.scene.activeCameras.splice(1,1);
            this.root.camBorder.isVisible=false;
        }
}