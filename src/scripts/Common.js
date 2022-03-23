export default class Common{
     constructor(root){
        this.root          = root;                    
        this.game          = root.game;
        this.scene         = null;
        this.camera        = null; 
        this.animFrameRate = 60;
        this.camDirection  = {deltaVal:1,margin:50}; 
        this.camVector     = new BABYLON.Vector3(0,3.2,0);
        
      //   this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        
        
     }
     createScene(name) {
        this.scene = new BABYLON.Scene(this.game.engine);
        this.scene.name = name;
        this.scene.clearColor = BABYLON.Color3.FromHexString("#000000");
        
        // this.env=this.scene.createDefaultEnvironment()
        this.scene.environmentTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("models/environment/autoshop_01_4k.env",this.scene);
        this.scene.enablePrePassRenderer();
        this.setLight();
        
        return this.scene;
     }
     createCamera(scene) {
        this.camera = new BABYLON.ArcRotateCamera("maincamera",0,0,10,this.camVector,scene);
      //   this.camRoot = new BABYLON.TransformNode("camroot");
      //   this.camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0,3,-1),scene);
        this.camera.fov   = 1;
        this.camera.layerMask=1;
        this.camera.inputs.clear();
      
        this.camera.inputs.addPointers();
        this.camera.inputs.addMouseWheel();
        this.camera.position.set(0,this.camVector.y,0);
        this.camera.setTarget(this.camVector);
        this.camera.attachControl(this.game.canvas, true);  
        this.camera.maxZ = 100;
        this.camera.wheelPrecision = 50;
        this.camera.useBouncingBehavior = false;
      //   this.camera.parent = this.camRoot;
        this.createminiMapCamera();
        this.scene.activeCameras = [];
        this.scene.activeCameras.push(this.camera);
      //this.scene.activeCameras.push(this.miniMapCam);
        this.setView();
        this.scene.cameraToUseForPointers = this.camera;
        return this.camera;
      }
      setLight() {
        this.hemiLight = new BABYLON.HemisphericLight("HemiLight",new BABYLON.Vector3(0,10,0),this.scene);
        this.hemiLight.intensity    = .1;
        this.hemiLight.diffuse      = new BABYLON.Color3(1, 1, 1);
        this.hemiLight.specular     = new BABYLON.Color3(0, 0, 0);
        this.hemiLight.groundColor  = new BABYLON.Color3(1,1,1);


        this.directionalLight             = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0,-5,0), this.scene);
        this.directionalLight.intensity   =.1;
        this.directionalLight.diffuse     = new BABYLON.Color3(1, 1, 1);
        this.directionalLight.specular    = new BABYLON.Color3(0, 0, 0);

      }
      setView(){
            this.camera.setTarget(new BABYLON.Vector3(-3,3,0));
            this.camera.lowerRadiusLimit = 1;
            this.camera.upperRadiusLimit = 100;
            this.camera.radius          = 3;
            this.camera.alpha           = BABYLON.Angle.FromDegrees(220).radians();
            this.camera.beta            = BABYLON.Angle.FromDegrees(90).radians();
            this.camera.lowerBetaLimit  = BABYLON.Angle.FromDegrees(0).radians();
            this.camera.upperBetaLimit  = BABYLON.Angle.FromDegrees(180).radians();
      }
      updateCam(){
            if(this.root.gui2D.resetCamBtn.isVisible || this.root.gui2D.radialCircle.isVisible)
                 return; 
            if(this.scene.pointerX>0 && this.scene.pointerX<=this.camDirection.margin){
                  this.camera.alpha += BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
                  if(this.camera.alpha>=BABYLON.Angle.FromDegrees(359).radians())
                        this.camera.alpha = BABYLON.Angle.FromDegrees(0).radians();
            }
            else if( this.scene.pointerX>window.innerWidth-this.camDirection.margin &&  this.scene.pointerX<window.innerWidth){
                  this.camera.alpha -= BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
                  if(this.camera.alpha<=0)
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
            this.miniMapCam.viewport = new BABYLON.Viewport(0.7,0.5,0.2,.3);
            this.miniMapCam.viewport.height =  this.miniMapCam.viewport.width*1.4;
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
            
            

            // const camframe = BABYLON.MeshBuilder.CreatePlane("camframe_plane",{width:.5,height:.25,sideOrientation: BABYLON.Mesh.FRONTSIDE},this.scene);
            // let camframeplanMaterial = new BABYLON.StandardMaterial("camframeplane_mat", this.scene);
            // camframe.rotation.y = 0;
            // camframe.position   = new BABYLON.Vector3(2.04,.57,.5);
            // camframe.parent = this.camera;
            // camframe.layerMask=1;
            // camframe.material   = camframeplanMaterial;
            // camframeplanMaterial.emissiveColor = new BABYLON.Color3.FromInts(0,0,0);
            // camframe.isPickable=false;
            // camframe.renderOutline=false;
            // camframe.enableEdgesRendering(.9999999);	
            // camframe.edgesWidth = 1.0;
            // camframe.edgesColor = new BABYLON.Color4(.5,.5,.5,1);
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
        }
        removeMiniCam(){
            this.scene.activeCameras.splice(1,1);
        }
      // updateCam(){
      //     if(this.scene.pointerX>0 && this.scene.pointerX<=this.camDirection.margin){
      //           this.camera.rotation.y -= BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
      //     }
      //     else if( this.scene.pointerX>window.innerWidth-this.camDirection.margin &&  this.scene.pointerX<window.innerWidth){
      //           this.camera.rotation.y = BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
      //     }
      //     else if(this.scene.pointerY>0 && this.scene.pointerY<=this.camDirection.margin){
      //           if(this.camera.rotation.x>-.1)
      //              this.camera.cameraRotation.x = -BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
      //           else
      //              this.camera.cameraRotation.x = 0;
      //     }
      //     else if( this.scene.pointerY>window.innerHeight-this.camDirection.margin &&  this.scene.pointerY<window.innerHeight){
      //         let val  =  BABYLON.Angle.FromRadians(this.camera.rotation.x).degrees();
      //         if(this.camera.rotation.x<.5)
      //             this.camera.cameraRotation.x = BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
      //         else
      //             this.camera.cameraRotation.x = 0;
      //     }
      // } 
}