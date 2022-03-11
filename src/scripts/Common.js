export default class Common{
     constructor(root){
        this.root          = root;                    
        this.game          = root.game;
        this.scene         = null;
        this.camera        = null; 
        this.animFrameRate = 60;
        this.camDirection  = {deltaVal:1,margin:50}; 
        this.camVector = new BABYLON.Vector3(0,3.2,0);
      //   this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        
        
     }
     createScene(name) {
        this.scene = new BABYLON.Scene(this.game.engine);
        this.scene.name = name;
        this.scene.clearColor = BABYLON.Color3.FromHexString("#000");
        // this.env=this.scene.createDefaultEnvironment()
        this.scene.environmentTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData("models/environment/autoshop_01_4k.env",this.scene);
        // this.hdrTexture = new BABYLON.HDRCubeTexture("models/environment/room.hdr",this.scene, 128, false, true, false, true);
        // this.scene.environmentTexture = this.hdrTexture;
        // this.scene.enablePrePassRenderer();
        this.setLight();
        return this.scene;
     }
     createCamera(scene) {
        this.camera = new BABYLON.ArcRotateCamera("cameraera",0,0,10,this.camVector,scene);
        this.camRoot = new BABYLON.TransformNode("camroot");
      //   this.camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0,3,-1),scene);
        this.camera.fov   = .6;
        
        this.camera.inputs.clear();
      // this.camera.useAutoRotationBehavior = true;
        this.camera.inputs.addPointers();
        this.camera.inputs.addMouseWheel();
        this.camera.position.set(0,this.camVector.y,0);
        this.camera.setTarget(this.camVector);
        this.camera.attachControl(this.game.canvas, true);  
        this.camera.maxZ = 100;
        this.camera.wheelPrecision = 50;
        this.camera.useBouncingBehavior = false;
        this.camera.parent = this.camRoot;
        // this.camRoot.rotationQuaternion = new BABYLON.Quaternion(0,0,0,1);
        this.setView();
        return this.camera;
      }
      setLight() {
        this.hemiLight = new BABYLON.HemisphericLight("HemiLight",new BABYLON.Vector3(0,10,0),this.scene);
        this.hemiLight.intensity = .1;
        this.hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
        this.hemiLight.specular = new BABYLON.Color3(0, 0, 0);
        this.hemiLight.groundColor = new BABYLON.Color3(1,1,1);


        this.directionalLight          = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0,-5,0), this.scene);
        this.directionalLight.intensity =.1;
        this.directionalLight.diffuse  = new BABYLON.Color3(1, 1, 1);
        this.directionalLight.specular = new BABYLON.Color3(0, 0, 0);

      }
      setView(){
            this.camera.lowerRadiusLimit = 1;
            this.camera.upperRadiusLimit = 100;
            this.camera.radius          = 3;
            this.camera.alpha           = BABYLON.Angle.FromDegrees(-90).radians();
            this.camera.beta            = BABYLON.Angle.FromDegrees(90).radians();
            this.camera.lowerBetaLimit  = BABYLON.Angle.FromDegrees(0).radians();
            this.camera.upperBetaLimit  = BABYLON.Angle.FromDegrees(180).radians();
      }
      updateCam(){
            if(this.root.gui2D.resetCamBtn.isVisible || this.root.gui2D.radialCircle.isVisible)
                 return; 
            if(this.scene.pointerX>0 && this.scene.pointerX<=this.camDirection.margin){
                  this.camera.alpha += BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
                  if(this.camera.alpha>=BABYLON.Angle.FromDegrees(360).radians())
                        this.camera.alpha = BABYLON.Angle.FromDegrees(0).radians();
            }
            else if( this.scene.pointerX>window.innerWidth-this.camDirection.margin &&  this.scene.pointerX<window.innerWidth){
                  this.camera.alpha -= BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
                  if(this.camera.alpha<=0)
                        this.camera.alpha = BABYLON.Angle.FromDegrees(360).radians();
            }
            else if(this.scene.pointerY>0 && this.scene.pointerY<=this.camDirection.margin){
                  console.log(this.camera.beta);
                  if(this.camera.beta<1.7)
                        this.camera.beta += BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
            }
            else if( this.scene.pointerY>window.innerHeight-this.camDirection.margin &&  this.scene.pointerY<window.innerHeight){
                  if(this.camera.beta>.9)
                        this.camera.beta -= BABYLON.Angle.FromDegrees(this.camDirection.deltaVal).radians();
            }
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