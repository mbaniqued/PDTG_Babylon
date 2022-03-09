import * as GUI from 'babylonjs-gui';
import { ObjectState } from './scene/Basic';
import { setShowMenu } from './Components/item';
export default class GUI2D{

     constructor(root){
        this.root = root;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.initUi();
     }
     initUi(){
        this.advancedTexture.idealWidth = 1920;
        this.resetCamBtn  =  this.createButon("resetcambtn","ui/move.png",100,100,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        this.radialCircle =  this.createImage("RadialCircleBig","ui/CircleBig.png",350,350,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        

        this.correctBtn      =  this.createCircle("correctbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const correctBtn     =  this.createImage("correctbtn","ui/magnifying-glass-with-check-mark.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        correctBtn.isPointerBlocker = true;
        correctBtn.isVisible=true;
        this.correctBtn.addControl(correctBtn);
        

        this.handBtn      =  this.createCircle("handbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const handBtn     =  this.createImage("handbtn","ui/NicePng_hand-png_45955 (2).png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        handBtn.isPointerBlocker = true;
        handBtn.isVisible=true;
        this.handBtn.addControl(handBtn);

        this.crossBtn      =  this.createCircle("crossbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const crossBtn     =  this.createImage("crossbtn","ui/cross2_png.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        crossBtn.isPointerBlocker = true;
        crossBtn.isVisible=true;
        this.crossBtn.addControl(crossBtn);
        this.drawRadialMenu(false);

        this.userExitBtn   =  this.createCircle("userexitbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        const userExit     =  this.createImage("userexitbtn","ui/Users-Exit-icon.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        userExit.isVisible = true;
        userExit.isPointerBlocker = true;
        this.userExitBtn.zIndex=10;
        this.userExitBtn.addControl(userExit);
        this.userExitBtn.isVisible=false;

        
         
      }
      drawRadialMenu(isDraw){

        this.radialCircle.isVisible=isDraw;
        this.correctBtn.top ="-150px";
        this.correctBtn.isVisible=isDraw;

        this.handBtn.top ="150px";
        this.handBtn.isVisible=isDraw;

        this.crossBtn.left ="150px";
        this.crossBtn.isVisible=isDraw;
      }
      createImage(name,src,width,height,horizontal,verticle,isadd){
        const image  =  new GUI.Image(name,src);
        image.width  = width+"px";
        image.height = height+"px";
        image.populateNinePatchSlicesFromImage = true;
        // image.stretch = BABYLON.GUI.Image.STRETCH_NINE_PATCH;
        image.isVisible=false;
        image.horizontalAlignment = horizontal;
        image.verticalAlignment   = verticle;
        image.color="red";
        if(isadd)
            this.advancedTexture.addControl(image);   
        return image;
        
      } 
      createButon(name,src,width,height,horizontal,verticle,isadd){
        const button = new GUI.Button.CreateImageOnlyButton(name, src);
        button.width = width+"px";
        button.height = height+"px";
        button.color = "#ffffffff";
        button.background = "ffffff00";
        button.isVisible=false;
        button.horizontalAlignment = horizontal;
        button.verticalAlignment   = verticle;
        if(isadd)
            this.advancedTexture.addControl(button);    
        button.onPointerDownObservable.add(function() {
          
          });
          button.onPointerUpObservable.add(()=> {
            this.handleButton(2,button.name);
          
          });
          button.onPointerEnterObservable.add(()=> {
            this.handleButton(0,button.name);
          });
          button.onPointerOutObservable.add(()=> {
            this.handleButton(1,button.name);
          
          });    
          button.onPointerMoveObservable.add((coordinates)=> {
          
          });  
          
        return button;  
      }
      handleButton(event,buttontype){
          switch(event){
             case 0:
                 break;
              case 1:
                break;
              case 2:
                  switch(buttontype){
                     case this.resetCamBtn.name:
                         this.root.setCameraTarget(); 
                        break;
                    
                  }
                break;
          }
        // console.log(event+"    "+buttontype);
      }
      createCircle(name,width,height,color,horizontal,verticle,isadd){
        const circle   = new GUI.Ellipse(name);
        circle.width   = width+"px";
        circle.height  = height+"px";
        circle.color   = color;
        circle.thickness = 0;
        circle.background = color;
        circle.horizontalAlignment = horizontal;
        circle.verticalAlignment = verticle;
        if(isadd)
            this.advancedTexture.addControl(circle);   
        circle.onPointerDownObservable.add(function() {
          
        });
        circle.onPointerUpObservable.add(()=> {
          this.handleButton(2,circle.name);
        
        });
        circle.onPointerEnterObservable.add(()=> {
          this.handleButton(0,circle.name);
        });
        circle.onPointerOutObservable.add(()=> {
          this.handleButton(1,circle.name);
        
        });    
        circle.onPointerMoveObservable.add((coordinates)=> {
        
        });  
        return circle;
      }
}