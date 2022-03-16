import * as GUI from 'babylonjs-gui';
import TWEEN from '@tweenjs/tween.js';
import { usermode } from './scene/MainScene';
import { gamemode } from './scene/MainScene';
 import { GameState } from './scene/MainScene';
export default class GUI2D{

     constructor(root){
        this.root = root;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.initUi();
     }
     initUi(){
        this.advancedTexture.idealWidth = 1920;
        this.advancedTexture.idealHeight = 1080;
        this.advancedTexture.renderAtIdealSize = true;
        this.resetCamBtn   =  this.createButon("resetcambtn","ui/move.png","#ffffffff","",0,0,72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        this.userExitBtn   =  this.createCircle("userexitbtn",120,120,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        const userImg      =  this.createImage("userexitbtn","ui/Users-Exit-icon.png",72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        userImg.isVisible  = true;
        this.userExitBtn.addControl(userImg);
        this.userExitBtn.isVisible=false;
        this.initMainMenu();
        this.initStageMenu();
        this.initRadialMenu();
        this.initLoadingPage();
      }
      initMainMenu(){
        
        this.menuContainer =  this.createRect("menucontiner",1920,1080,0,"#FFFFFF00",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const menuBg       =  this.createRect("menubg2",1920,1080,0,"#7EC5DDE6",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        const whiteimg     =  this.createRect("menubg3",1920,1080,0,"#FFFFFF73",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        const menuBgImg    =  this.createImage("menubg1","ui/apd_bg.PNG",1920,1080,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        menuBgImg.isVisible=true;
        const menufont    =  this.createText("menufont","Peritoneal Dialysis \nGame",90,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false) 
        this.setTextOutLine(menufont,"#000000",2);
        menufont.topInPixels =-240;
        const userModeText =  this.createText("usermodetxt","User Mode",40,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false) 
        this.setTextOutLine(userModeText,"#000000",2);

        this.patientModeBtn   = this.createButon("patient","ui/button2.png","#ffffff00","Patient",24,"#808080",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.caregiverModeBtn = this.createButon("caregiver","ui/button2.png","#ffffff00","Caregiver",24,"#808080",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.userModeBtn = this.createButon("userdropbutton","ui/button.png","#ffffff00","Patient",24,"#FFFFFF",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);


        
        const gameModeText =  this.createText("gamemodetxt","Game Mode",40,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false) 
        this.setTextOutLine(gameModeText,"#000000",2);

        this.proceedBtn        = this.createButon("assesment","ui/proceed.png","#ffffff00","",24,"#808080",193,78,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.trainingModeBtn   = this.createButon("training","ui/button2.png","#ffffff00","Training",24,"#808080",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.assesmentModeBtn  = this.createButon("assesment","ui/button2.png","#ffffff00","Assessment",24,"#808080",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.practiceModeBtn   = this.createButon("practice","ui/button2.png","#ffffff00","Practice",24,"#808080",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.gameModeBtn       = this.createButon("gameModeBtn","ui/button.png","#ffffff00","Practice",24,"#FFFFFF",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        

        
        this.menuContainer.addControl(menuBgImg);
        this.menuContainer.addControl(whiteimg);
        this.menuContainer.addControl(menuBg);
        
        this.menuContainer.addControl(menufont);
        this.menuContainer.addControl(userModeText);
        this.menuContainer.addControl(gameModeText);
        this.drawMainMenu(true);
      }
      drawMainMenu(isDraw){ 
        this.menuContainer.isVisible  =  isDraw;
        this.menuContainer.getChildByName("usermodetxt").text = "User Mode";
        this.menuContainer.getChildByName("usermodetxt").topInPixels =-100;
        this.menuContainer.getChildByName("gamemodetxt").text = "Game Mode";
        this.menuContainer.getChildByName("gamemodetxt").topInPixels =60;
        

        const y  = -40;
        const dy = 54;
        this.userModeBtn.children[1].leftInPixels =-20;
        this.userModeBtn.isVisible = isDraw;
        this.proceedBtn.isVisible = isDraw;
        this.proceedBtn.topInPixels = 300;
        this.userModeBtn.topInPixels = y;
        this.caregiverModeBtn.topInPixels = y;
        this.patientModeBtn.topInPixels   = y;
        let isOpen=false;
        const hideusermode= ()=>{
                new TWEEN.Tween(this.patientModeBtn).to({topInPixels:y},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                  isOpen = false;
                  this.patientModeBtn.isVisible       =  false;
                  this.caregiverModeBtn.isVisible     =  false;
              }).start();
              new TWEEN.Tween(this.caregiverModeBtn).to({topInPixels:y},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        };
        this.userModeBtn.onPointerUpObservable.add(()=> {
                if(!isOpen){
                  this.patientModeBtn.isVisible       =  true;
                  this.caregiverModeBtn.isVisible     =  true;
                  new TWEEN.Tween(this.patientModeBtn).to({topInPixels:y+dy},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                    isOpen = true;
                  }).start();
                  new TWEEN.Tween(this.caregiverModeBtn).to({topInPixels:y+dy*2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                }
                else{
                  hideusermode();
                }
          });
          this.patientModeBtn.onPointerUpObservable.add(()=> {
                hideusermode();
                this.userModeBtn.children[1].text="Patient";
                this.root.userMode = usermode.patient;
          });
          this.caregiverModeBtn.onPointerUpObservable.add(()=> {
              hideusermode();
              this.userModeBtn.children[1].text="CareGiver";
              this.root.userMode = usermode.caregiver;
          });
          const y2 = 120;  
          this.gameModeBtn.children[1].leftInPixels =-20;
          this.gameModeBtn.isVisible = isDraw;
          this.gameModeBtn.topInPixels    = y2;
          this.practiceModeBtn.topInPixels  = y2;
          this.trainingModeBtn.topInPixels  = y2;
          this.assesmentModeBtn.topInPixels = y2;

          
          let isOpen2 =false;
          const hidegamemode= ()=>{
            
            new TWEEN.Tween(this.practiceModeBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.trainingModeBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.assesmentModeBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
              isOpen2 = false;
              this.practiceModeBtn.isVisible     =  false;
              this.trainingModeBtn.isVisible     =  false;
              this.assesmentModeBtn.isVisible     =  false;
            }).start();
          };

          this.gameModeBtn.onPointerUpObservable.add(()=> {
            if(!isOpen2){
                isOpen2 = true;
                this.practiceModeBtn.isVisible    =  true;
                this.trainingModeBtn.isVisible    =  true;
                this.assesmentModeBtn.isVisible   =  true;
                new TWEEN.Tween(this.practiceModeBtn).to({topInPixels:y2+dy},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                new TWEEN.Tween(this.trainingModeBtn).to({topInPixels:y2+dy*2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                new TWEEN.Tween(this.assesmentModeBtn).to({topInPixels:y2+dy*3},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            }
            else{
                hidegamemode();
            }
          });
          this.practiceModeBtn.onPointerUpObservable.add(()=> {
            this.gameModeBtn.children[1].text="Practice";
            this.root.gamemode = gamemode.practice;
            hidegamemode();
          });
          this.trainingModeBtn.onPointerUpObservable.add(()=> {
            this.gameModeBtn.children[1].text="Training";
            this.root.gamemode = gamemode.training;
            hidegamemode();
          });
          this.assesmentModeBtn.onPointerUpObservable.add(()=> {
            this.gameModeBtn.children[1].text="Assessment";
            this.root.gamemode = gamemode.assessment;
            hidegamemode();
          });
          this.proceedBtn._onPointerUp=()=>{
              this.drawMainMenu(false);
              hideusermode();
              hidegamemode();
              this.root.gamestate.state = GameState.levelstage; 
              this.drawStageMenu(true);
          }

      }
      initStageMenu(){
        this.backBtn        = this.createButon("backbtn","ui/backbtn.png","#ffffff00","",24,"#808080",119,67,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.playBtn        = this.createButon("playbtn","ui/play.png","#ffffff00","",24,"#808080",193,78,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.stage1btn      = this.createButon("prepration1btn","ui/button2.png","#ffffff00","Stage1:Prepration",22,"#808080",218,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.stagebtn       = this.createButon("stagemodbtn","ui/stagebtn.png","#ffffff00","Stage1:Prepration",22,"#FFFFFF",300,60,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        
        this.roompreBtn     = this.createButon("roomprebtn","ui/button2.png","#ffffff00","Room Prepration",22,"#808080",278,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.itempreBtn     = this.createButon("itemprebtn","ui/button2.png","#ffffff00","Item Prepration",22,"#808080",278,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.selfpreBtn     = this.createButon("selfprebtn","ui/button2.png","#ffffff00","Self Prepration",22,"#808080",278,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.machinepreBtn  = this.createButon("machineprebtn","ui/button2.png","#ffffff00","Machine Prepration",22,"#808080",278,53,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.phasebtn       = this.createButon("phasebtn","ui/stagebtn.png","#ffffff00","Room Prepration",22,"#FFFFFF",300,60,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        
      }
      drawStageMenu(isDraw){
          this.menuContainer.isVisible = isDraw;
          this.menuContainer.getChildByName("usermodetxt").text = "Select Stage";
          this.menuContainer.getChildByName("gamemodetxt").text = "Select Phase";
          
          this.playBtn.isVisible = isDraw;
          this.playBtn.topInPixels =300; 
          this.playBtn._onPointerUp=()=>{
            this.drawStageMenu(false);
            hidephasebtn();
            
            this.stage1btn.isVisible       =  false;
            this.advancedTexture.renderAtIdealSize = false;
            this.root.gamestate.state = GameState.loading;
            this.drawLoadingPage(true);
            this.root.sceneCommon.setView();
              let tout = setTimeout(() => {
                  clearTimeout(tout);
                  this.drawLoadingPage(false);
                  this.root.gamestate.state = GameState.default;
                  this.root.setCameraTarget();
                  new TWEEN.Tween(this.root.camera).to({alpha: BABYLON.Angle.FromDegrees(-90).radians()},1000).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
              }, 2000);

          }
          this.backBtn.topInPixels =400;
          this.backBtn.isVisible  = isDraw;
          this.backBtn._onPointerUp=()=>{
            this.drawStageMenu(false);
            this.stage1btn.isVisible=false;
            hidephasebtn();
            this.drawMainMenu(true);
          }


          this.stagebtn.isVisible  = isDraw;
          this.stagebtn.children[1].leftInPixels =-20;
          const y  = -40;
          const dy = 54;
          this.stagebtn.topInPixels  = y;
          this.stage1btn.topInPixels = y;
          this.stage1btn.scaleX = 1.2;
          
          let isOpen =false;
            this.stagebtn.onPointerUpObservable.add(()=> {
              if(!isOpen){
                this.stage1btn.isVisible       =  true;
                new TWEEN.Tween(this.stage1btn).to({topInPixels:y+dy},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                  isOpen = true;
                }).start();
              }
              else{
                  new TWEEN.Tween(this.stage1btn).to({topInPixels:y},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                    isOpen = false;
                    this.stage1btn.isVisible       =  false;
                  }).start();
            }
          });
         this.stage1btn.onPointerUpObservable.add(()=>{
            isOpen = false;
            this.stage1btn.isVisible       =  false;
          })
          const y2 = 120;  
          this.phasebtn.isVisible = isDraw;
          this.phasebtn.children[1].leftInPixels =-20;
          this.phasebtn.topInPixels= y2;
          this.roompreBtn.topInPixels= y2;
          this.itempreBtn.topInPixels= y2;
          this.selfpreBtn.topInPixels= y2;
          this.machinepreBtn.topInPixels= y2;

          let isopen2=false;
          this.phasebtn.onPointerUpObservable.add(()=> {
            if(!isopen2){
                isopen2 = true;
               this.roompreBtn.isVisible       =  true;
               this.itempreBtn.isVisible       =  true;
               this.selfpreBtn.isVisible       =  true;
               this.machinepreBtn.isVisible    =  true;
              new TWEEN.Tween(this.roompreBtn).to({topInPixels:y2+dy},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {isopen2 = true;}).start();
              new TWEEN.Tween(this.itempreBtn).to({topInPixels:y2+dy*2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
              new TWEEN.Tween(this.selfpreBtn).to({topInPixels:y2+dy*3},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
              new TWEEN.Tween(this.machinepreBtn).to({topInPixels:y2+dy*4},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            }
            else{
                hidephasebtn();
           }
        });
        this.roompreBtn.onPointerUpObservable.add(()=>{
            hidephasebtn();
            this.phasebtn.children[1].text="Room Prepration";
        })
        this.itempreBtn.onPointerUpObservable.add(()=>{
          hidephasebtn();
          this.phasebtn.children[1].text="Item Prepration";
        })
        this.selfpreBtn.onPointerUpObservable.add(()=>{
          hidephasebtn();
          this.phasebtn.children[1].text="Self Prepration";
        })
        this.machinepreBtn.onPointerUpObservable.add(()=>{
          hidephasebtn();
          this.phasebtn.children[1].text="Machine Prepration";
        })
        const hidephasebtn =()=>{
          new TWEEN.Tween(this.roompreBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
          new TWEEN.Tween(this.itempreBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
          new TWEEN.Tween(this.selfpreBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
          new TWEEN.Tween(this.machinepreBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
            isopen2 = false;
            this.roompreBtn.isVisible       =  false;
            this.itempreBtn.isVisible       =  false;
            this.selfpreBtn.isVisible       =  false;
            this.machinepreBtn.isVisible    =  false;
          }).start();
        }

      }
      initLoadingPage(){
        this.loaginBg =  this.createRect("loadingBg",1920,1080,0,"#7EC5DDB3",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const title   =  this.createText("title","Preparing the room...",60,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false); 
        this.setTextOutLine(title,"#000000",2);
        title.leftInPixels = -550;
        title.topInPixels  =  300;
        this.loaginBg.addControl(title);
        this.loaginBg.isVisible=false;
      }
      drawLoadingPage(isDraw){
        this.loaginBg.isVisible=isDraw;
      }
      initRadialMenu(){
        
        this.radialCircle    =  this.createImage("RadialCircleBig","ui/CircleBig.png",350,350,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
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
        const button = GUI.Button.CreateImageOnlyButton(name, src);
        button.width = width+"px";
        button.height = height+"px";
        button.color = bgcolor;
        button.background = "ffffff00";
        button.isVisible=false;
        button.horizontalAlignment = horizontal;
        button.verticalAlignment   = verticle;
        button._moveToProjectedPosition
        if(txt.length>0){
          const text = new GUI.TextBlock(name);
          text.text = txt;
          text.fontFamily = "Shrikhand";
          text.fontSize = fontSize+"px";
          text.color    = fontcolor;
          text.isPointerBlocker=false;
          text.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          text.verticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTERverticle;
          button.addControl(text);
        }
        if(isadd)
            this.advancedTexture.addControl(button);    
          // button.onPointerDownObservable.add(()=> {
          //   this.handleButton(0,button.name);
          // });
          // button.onPointerUpObservable.add(()=> {
          //   this.handleButton(2,button.name);
          // });
          // button.onPointerEnterObservable.add(()=> {
          // });
          // button.onPointerOutObservable.add(()=> {
          // });    
          
          
        return button;  
      }
      handleButton(event,buttontype){
          // switch(event){
          //    case 0:
          //        break;
          //     case 1:
          //       break;
          //     case 2:
          //         switch(buttontype){
          //            case this.resetCamBtn.name:
          //                this.root.setCameraTarget(); 
          //               break;
          //         }
          //       break;
          // }
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
        circle.verticalAlignment   = verticle;
        circle.isVisible=false
        if(isadd)
            this.advancedTexture.addControl(circle);   
        circle.onPointerDownObservable.add(function() {
        });
        // circle.onPointerUpObservable.add(()=> {
        //   this.handleButton(2,circle.name);
        
        // });
        // circle.onPointerEnterObservable.add(()=> {
        //   // this.handleButton(0,circle.name);
        // });
        // circle.onPointerOutObservable.add(()=> {
        //   // this.handleButton(1,circle.name);
        
        // });    
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
        rect.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect.verticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.advancedTexture.addControl(rect);
        rect.linkOffsetXInPixels = linkOffsetX;
        rect.linkOffsetYInPixels = linkOffsetY;
        rect.linkWithMesh(mesh);   

        const label = new GUI.TextBlock(name+"txt");
        label.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        label.verticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        label.text =  name;
        label.fontSize =20+"px";
        label.color = "#A5A5A5";
        label.isPointerBlocker=true;
        
        rect.addControl(label);
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