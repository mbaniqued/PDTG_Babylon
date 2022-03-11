import * as GUI from 'babylonjs-gui';
import { GameState } from './scene/MainScene';
import { setShowMenu } from './Components/item';
export default class GUI2D{

     constructor(root){
        this.root = root;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.initUi();
     }
     initUi(){
        this.advancedTexture.idealWidth = 1920;
        this.resetCamBtn   =  this.createButon("resetcambtn","ui/move.png","#ffffffff","",0,0,72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        this.userExitBtn   =  this.createCircle("userexitbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        const userImg      =  this.createImage("userexitbtn","ui/Users-Exit-icon.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        userImg.isVisible  = true;
        this.userExitBtn.addControl(userImg);
        this.userExitBtn.isVisible=false;
        this.initMainMenu();
        this.initRadialMenu();
      }
      initMainMenu(){
        
        this.menuContainer =  this.createRect("menucontiner",1920,1080,0,"#FFFFFF00",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const menuBg       =  this.createRect("menubg2",1920,1080,0,"#7EC5DDE6",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        const whiteimg     =  this.createRect("menubg3",1920,1080,0,"#FFFFFF73",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        const menuBgImg    =  this.createImage("menubg1","ui/apd_bg.PNG",1920,1080,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        menuBgImg.isVisible=true;
        const menufont    =  this.createText("menufont","Peritoneal Dialysis \nGame",90,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false) 
        this.setTextOutLine(menufont,"#000000",2);
        menufont.top =-180;
        const userModeText =  this.createText("userMode","User Mode",30,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false) 
        userModeText.top =-40;
        this.setTextOutLine(userModeText,"#000000",2);

        this.userModeBtn = this.createButon("userdropbutton","ui/button.png","#ffffff00","Patient",24,"#FFFFFF",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        this.userModeBtn.isVisible=true;

        this.patientModeBtn = this.createButon("patient","ui/button2.png","#ffffff00","Patient",24,"#FFFFFF",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        this.patientModeBtn.isVisible=true;

        this.caregiverModeBtn = this.createButon("caregiver","ui/button2.png","#ffffff00","Caregiver",24,"#FFFFFF",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        this.caregiverModeBtn.isVisible=true;

        
        this.menuContainer.addControl(menuBgImg);
        this.menuContainer.addControl(whiteimg);
        this.menuContainer.addControl(menuBg);
        this.advancedTexture.addControl(this.caregiverModeBtn);
        this.advancedTexture.addControl(this.patientModeBtn);
        this.advancedTexture.addControl(this.userModeBtn);
        this.advancedTexture.addControl(this.menuContainer);
        this.menuContainer.addControl(menufont);
        this.menuContainer.addControl(userModeText);
        this.drawMainMenu(true);
      }
      drawMainMenu(isDraw){
        this.menuContainer.isVisible =isDraw;
        this.patientModeBtn.isVisible =isDraw;
        this.caregiverModeBtn.isVisible =isDraw;
        this.userModeBtn.isVisible =isDraw;
        this.userModeBtn.top =20;
        const y = 20;
        const dy = 56;
        this.patientModeBtn.top  =  y+dy;
        this.caregiverModeBtn.top = y+dy*2;
      }
      initRadialMenu(){
        
        this.radialCircle =  this.createImage("RadialCircleBig","ui/CircleBig.png",350,350,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);

        this.inspectBtn      =  this.createCircle("inspectBtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const inspectImg     =  this.createImage("inspectBtn","ui/magnifying-glass-with-check-mark.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        inspectImg.isVisible=true;
        this.inspectBtn.addControl(inspectImg);
        
        this.useBtn      =  this.createCircle("useBtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const useImg     =  this.createImage("useBtn","ui/NicePng_hand-png_45955 (2).png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        useImg.isVisible=true;
        this.useBtn.addControl(useImg);
        
        this.crossBtn      =  this.createCircle("crossbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const crossImg     =  this.createImage("crossbtn","ui/cross2_png.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        crossImg.isVisible=true;
        this.crossBtn.addControl(crossImg);

        this.drawRadialMenu(false);
      }
      drawRadialMenu(isDraw){

        this.radialCircle.isVisible=isDraw;

        this.inspectBtn.top ="-150px";
        this.inspectBtn.isVisible=isDraw;

        this.useBtn.top ="150px";
        this.useBtn.isVisible=isDraw;

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
        image.isPointerBlocker=true;
        image.horizontalAlignment = horizontal;
        image.verticalAlignment   = verticle;
        image.color="#ff0000";
        if(isadd)
            this.advancedTexture.addControl(image);   
        return image;
        
      } 
      
      createButon(name,src,bgcolor,txt,fontSize,fontcolor,width,height,horizontal,verticle,isadd){
        const button = new GUI.Button.CreateImageOnlyButton(name, src);
        button.width = width+"px";
        button.height = height+"px";
        button.color = bgcolor;
        button.background = "ffffff00";
        button.isPointerBlocker=false;
        button.isVisible=false;
        button.horizontalAlignment = horizontal;
        button.verticalAlignment   = verticle;
        if(txt.length>0){
          const text = new GUI.TextBlock(name);
          text.text = txt;
          text.fontFamily = "Shrikhand";
          text.fontSize = fontSize+"px";
          text.color    = fontcolor;
          // text.isPointerBlocker=true;
          text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          text.verticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTERverticle;
          button.addControl(text);
        }
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
        console.log(event+"    "+buttontype);
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
      createRectLabel(name,width,height,radius,color,mesh,linkOffsetX,linkOffsetY){
        const rect = new GUI.Rectangle(name);
        rect.width = width+"px";
        rect.height = height+"px";
        rect.cornerRadius = radius;
        rect.color = color;
        rect.thickness = 4;
        rect.background = color;
        rect.isPointerBlocker=true;
        this.advancedTexture.addControl(rect);

        const label = new GUI.TextBlock(name+"txt");
        label.text =  name;
        label.fontSize =20+"px";
        label.color = "#A5A5A5";
        label.isPointerBlocker=true;
        
        rect.addControl(label);

        rect.linkWithMesh(mesh);   
        rect.linkOffsetY = linkOffsetY;
        rect.linkOffsetX = linkOffsetX;
        return rect;
      }
      createRect(name,width,height,radius,color,horizontal,verticle,isadd){
        const rect = new GUI.Rectangle(name);
        rect.width = width+"px";
        rect.height = height+"px";
        rect.cornerRadius = radius;
        rect.color = color;
        rect.thickness = 4;
        rect.background = color;
        rect.isPointerBlocker=true;
        rect.horizontalAlignment = horizontal;
        rect.verticalAlignment   = verticle;
        if(isadd)
          this.advancedTexture.addControl(rect);
        return rect;
      }
      createText(name,_text,size,color,horizontal,verticle,isadd){
        const text = new GUI.TextBlock(name);
        text.text = _text;
        text.fontFamily = "Shrikhand";
        text.fontSize = size+"px";
        text.color    = color;
        text.isPointerBlocker=true;
        text.horizontalAlignment = horizontal;
        text.verticalAlignment   = verticle;
        if(isadd)
          this.advancedTexture.addControl(text);
        return text;
      }
      setTextOutLine(textObj,color,widht){
        textObj.outlineColor = color;
        textObj.outlineWidth = widht;
      }
    
}