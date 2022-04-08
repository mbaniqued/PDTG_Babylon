import * as GUI from 'babylonjs-gui';
import TWEEN from '@tweenjs/tween.js';
import {GameState, usermode,gamemode } from './scene/MainScene';
export default class GUI2D{

     constructor(root){
        this.root = root;
        this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.advancedTexture.layer.layerMask=1;
        this.initUi();
     }
     initUi(){
        this.advancedTexture.idealWidth = 1920;
        this.advancedTexture.idealHeight = 1080;
        // this.advancedTexture.useSmallestIdeal = true
        this.advancedTexture.renderAtIdealSize = true;
        this.resetCamBtn   =  this.createButon("resetcambtn","ui/move.png","#ffffffff","",0,0,72,72,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        // this.resetCamBtn.zIndex =100;
        this.userExitBtn   =  this.createCircle("userexitbtn",72,72,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        const userImg      =  this.createImage("userexitbtn","ui/Users-Exit-icon.png",48,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        userImg.isVisible  = true;

        
        this.userBackBtn   =  this.createButon("userbackbtn","ui/exit_icon.png","#ffffff00","",0,"",48,48,GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,GUI.Control.VERTICAL_ALIGNMENT_TOP,true);
        this.userBackBtn.leftInPixels =-20;
        this.userBackBtn.topInPixels  =20;
        this.userExitBtn.addControl(userImg);
        this.userExitBtn.isVisible=false;

        this.submitBtn    = this.createRectBtn("submitBtn",122,42,1,"#74FF45",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,"V","#FFFFFF",24,true);
        this.submitBtn.isVisible=false;
        
        this.initMainMenu();
        this.initStageMenu();
        this.initRadialMenu();
        this.initLoadingPage();
        this.initObjectiveMenu();
        this.initLevelComplete();
        this.initValidationMenu();
        this.initbackMenu();
        this.initResultShowMenu();
        this.initsubmitMenu();
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

        this.patientModeBtn   = this.createButon("patient","ui/button2.png","#ffffff00","Patient",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.caregiverModeBtn = this.createButon("caregiver","ui/button2.png","#ffffff00","Caregiver",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.userModeBtn = this.createButon("userdropbutton","ui/button.png","#ffffff00","Patient",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);


        
        const gameModeText =  this.createText("gamemodetxt","Game Mode",40,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false) 
        this.setTextOutLine(gameModeText,"#000000",2);

        this.proceedBtn        = this.createButon("proceedbtn","ui/proceed.png","#ffffff00","",24,"#808080",193,78,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.trainingModeBtn   = this.createButon("trainingbtn","ui/button2.png","#ffffff00","Training",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.practiceModeBtn   = this.createButon("practicebtn","ui/button2.png","#ffffff00","Practice",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.assesmentModeBtn  = this.createButon("assesmentbtn","ui/button2.png","#ffffff00","Assessment",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.gameModeBtn       = this.createButon("gameModeBtn","ui/button.png","#ffffff00","Training",24,"#808080",216,56,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        

        
        this.menuContainer.addControl(menuBgImg);
        this.menuContainer.addControl(whiteimg);
        this.menuContainer.addControl(menuBg);
        this.menuContainer.addControl(menufont);
        this.menuContainer.addControl(userModeText);
        this.menuContainer.addControl(gameModeText);
        this.drawMainMenu(true);
        
      }
      drawMainMenu(isDraw){ 
        this.advancedTexture.renderAtIdealSize = true;
        this.menuContainer.isPointerBlocker=true;
        this.menuContainer.isVisible  =  isDraw;
        this.menuContainer.getChildByName("usermodetxt").text = "User Mode";
        this.menuContainer.getChildByName("usermodetxt").topInPixels =-100;
        this.menuContainer.getChildByName("gamemodetxt").text = "Game Mode";
        this.menuContainer.getChildByName("gamemodetxt").topInPixels =60;
        const y  = -40;
        const dy = this.userModeBtn.heightInPixels+2;
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
                  this.patientModeBtn.isVisible    =  false;
                  this.caregiverModeBtn.isVisible  =  false;
              }).start();
              new TWEEN.Tween(this.caregiverModeBtn).to({topInPixels:y},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
        };
        this.userModeBtn.onPointerUpObservable.add(()=> {
              if(!isOpen){
                this.patientModeBtn.isVisible      =  true;
                this.caregiverModeBtn.isVisible    =  true;
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
          this.gameModeBtn.topInPixels      = y2;
          this.practiceModeBtn.topInPixels  = y2;
          this.trainingModeBtn.topInPixels  = y2;
          this.assesmentModeBtn.topInPixels = y2;
          let isOpen2 =false;
          const hidegamemode= ()=>{
            new TWEEN.Tween(this.trainingModeBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.practiceModeBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            new TWEEN.Tween(this.assesmentModeBtn).to({topInPixels:y2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
              isOpen2 = false;
              this.trainingModeBtn.isVisible     =  false;
              this.practiceModeBtn.isVisible     =  false;
              this.assesmentModeBtn.isVisible     =  false;
            }).start();
          };

          this.gameModeBtn.onPointerUpObservable.add(()=> {
            if(!isOpen2){
                isOpen2 = true;
                this.practiceModeBtn.isVisible    =  true;
                this.trainingModeBtn.isVisible    =  true;
                this.assesmentModeBtn.isVisible   =  true;
                new TWEEN.Tween(this.trainingModeBtn).to({topInPixels:y2+dy},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                new TWEEN.Tween(this.practiceModeBtn).to({topInPixels:y2+dy*2},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
                new TWEEN.Tween(this.assesmentModeBtn).to({topInPixels:y2+dy*3},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {}).start();
            }
            else{
                hidegamemode();
            }
          });
          this.trainingModeBtn.onPointerUpObservable.add(()=> {
            this.gameModeBtn.children[1].text="Training";
            this.root.gamemode = gamemode.training;
            hidegamemode();
          });
          this.practiceModeBtn.onPointerUpObservable.add(()=> {
            this.gameModeBtn.children[1].text="Practice";
            this.root.gamemode = gamemode.practice;
            hidegamemode();
          });
          this.assesmentModeBtn.onPointerUpObservable.add(()=> {
            this.gameModeBtn.children[1].text="Assessment";
            this.root.gamemode = gamemode.practice;
            hidegamemode();
          });
          this.proceedBtn._onPointerUp=()=>{
              hideusermode();
              hidegamemode();
              this.drawMainMenu(false);
              this.root.gamestate.state = GameState.levelstage; 
              this.drawStageMenu(true);
          }
      }
      initStageMenu(){
        this.backBtn        = this.createButon("backbtn","ui/backbtn.png","#ffffff00","",24,"#808080",119,67,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.playBtn        = this.createButon("playbtn","ui/play.png","#ffffff00","",24,"#808080",193,78,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.stage1btn      = this.createButon("prepration1btn","ui/button2.png","#ffffff00","Stage1:Prepration",20,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.stagebtn       = this.createButon("stagemodbtn","ui/button.png","#ffffff00","Stage1:Prepration",20,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        
        this.roompreBtn     = this.createButon("roomprebtn","ui/button2.png","#ffffff00","Room Prepration",22,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.itempreBtn     = this.createButon("itemprebtn","ui/button2.png","#ffffff00","Item Prepration",22,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.selfpreBtn     = this.createButon("selfprebtn","ui/button2.png","#ffffff00","Self Prepration",22,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.machinepreBtn  = this.createButon("machineprebtn","ui/button2.png","#ffffff00","Machine Prepration",22,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.phasebtn       = this.createButon("phasebtn","ui/button.png","#ffffff00","Room Prepration",22,"#808080",256,48,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        
      }
      drawStageMenu(isDraw){
          this.advancedTexture.renderAtIdealSize = true;
          // this.root.level   = 0;
          this.menuContainer.isVisible = isDraw;
          this.menuContainer.getChildByName("usermodetxt").text = "Select Stage";
          this.menuContainer.getChildByName("gamemodetxt").text = "Select Phase";
          
          this.playBtn.isVisible = isDraw;
          this.playBtn.topInPixels =300; 
          this.playBtn._onPointerUp=()=>{
            this.drawStageMenu(false);
            hidephasebtn();
            this.root.gamestate.state = GameState.loading;
            this.advancedTexture.renderAtIdealSize = false;
            this.stage1btn.isVisible  =  false;
            this.drawLoadingPage(true);
            this.root.sceneCommon.setView();
            console.log("!!! level!! "+this.root.level);
            this.root.setGame().then((msg)=>{
                console.log(msg);
            });
            switch(this.root.level){
               case 0:
                  this.root.enterScene(1000)
                 break;
               case 1:
                  this.root.enterScene(2000);
                  this.root.gameTaskManager.completeRoomSetUp();
                 break;  
               case 2:
                  this.root.enterScene(3000);
                  this.root.gameTaskManager.completeRoomSetUp();
                  setTimeout(() => {
                    this.root.gameTaskManager.completeItemSetUp();  
                  }, 1500);
                break;  
               case 3:
                  this.root.enterScene(3000);
                  this.root.gameTaskManager.completeRoomSetUp();
                  setTimeout(() => {
                    this.root.gameTaskManager.completeItemSetUp();  
                  }, 1500);
                  setTimeout(() => {
                    this.root.gameTaskManager.completeSelfSetUp();  
                  }, 3200);
                 break; 
            }

          }
          this.backBtn.topInPixels = 400;
          this.backBtn.isVisible   = isDraw;
          this.backBtn._onPointerUp=()=>{
            this.drawStageMenu(false);
            this.stage1btn.isVisible=false;
            hidephasebtn();
            this.drawMainMenu(true);
          }
          this.stagebtn.isVisible  = isDraw;
          this.stagebtn.children[1].leftInPixels =-20;
          const y  = -40;
          const dy = this.stagebtn.heightInPixels+2;
          this.stagebtn.topInPixels  = y;
          this.stage1btn.topInPixels = y;
          
          let isOpen =false;
          this.stagebtn.onPointerUpObservable.add(()=> {
                isOpen =!isOpen;
                // this.stage1btn.isVisible       =  isOpen;
                new TWEEN.Tween(this.stage1btn).to({topInPixels:isOpen?y+dy:y},100).easing(TWEEN.Easing.Quadratic.Out).onComplete(() => {
                  this.stage1btn.isVisible       =  isOpen;
                }).start();
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
            this.root.level   = 0;
            hidephasebtn();
            this.phasebtn.children[1].text="Room Prepration";
        })
        this.itempreBtn.onPointerUpObservable.add(()=>{
          this.root.level   = 1;
          hidephasebtn();
          this.phasebtn.children[1].text="Item Prepration";
        })
        this.selfpreBtn.onPointerUpObservable.add(()=>{
          this.root.level   = 2;
          hidephasebtn();
          this.phasebtn.children[1].text="Self Prepration";
        })
        this.machinepreBtn.onPointerUpObservable.add(()=>{
          this.root.level   = 3;
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
        
        this.radialCircle    =  this.createImage("RadialCircleBig","ui/CircleBig.png",192,192,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.radialCircle.isPointerBlocker=true;
        this.inspectBtn      =  this.createCircle("inspectBtn",54,54,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const inspectImg     =  this.createImage("inspectBtn","ui/magnifying-glass-with-check-mark.png",36,36,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        inspectImg.isVisible=true;
        inspectImg.isPointerBlocker = false;
        this.inspectBtn.isPointerBlocker = true;
        this.inspectBtn.addControl(inspectImg);
        
        this.useBtn      =  this.createCircle("useBtn",54,54,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const useImg     =  this.createImage("useBtn","ui/NicePng_hand-png_45955 (2).png",36,36,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        useImg.isVisible=true;
        useImg.isPointerBlocker=false;
        this.useBtn.isPointerBlocker = true;
        this.useBtn.addControl(useImg);
        
        this.crossBtn      =  this.createCircle("crossbtn",54,54,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const crossImg     =  this.createImage("crossbtn","ui/cross2_png.png",36,36,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        crossImg.isVisible=true;
        crossImg.isPointerBlocker=false;
        this.crossBtn.isPointerBlocker = true;
        this.crossBtn.addControl(crossImg);

        this.drawRadialMenu(false);
      }
      drawRadialMenu(isDraw){
        this.radialCircle.isPointerBlocker=true;
        this.radialCircle.isVisible=isDraw;
        this.inspectBtn.topInPixels =-80;
        this.inspectBtn.isVisible=isDraw;

        this.useBtn.topInPixels = 80;
        this.useBtn.isVisible=false;
        
        this.crossBtn.leftInPixels = 80;
        this.crossBtn.isVisible=isDraw;
      }
      initObjectiveMenu(){

         this.objectiveBg  =  new GUI.StackPanel();    
         this.objectiveBg.isPointerBlocker=true;
         this.objectiveBg.widthInPixels = 400;
         this.objectiveBg.background = "#9EF6FF66";
         this.objectiveBg.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
         this.objectiveBg.verticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
         this.advancedTexture.addControl(this.objectiveBg);   
         this.objectiveBg.ignoreLayoutWarnings = true
        //  this.objectiveBg       =  this.createRect("objectivebg",400,200,5,"#7BABB2B3",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,true);
         
         this.objectiveTitle   =  this.createText("objectivetitle","Room Prepration",32,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
         this.objectiveTitle.widthInPixels=400;
         this.objectiveTitle.heightInPixels=50;
         this.objectiveTitle.textHorizontalAlignment  = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
         this.objectiveTitle.textVerticalAlignment    = GUI.Control.VERTICAL_ALIGNMENT_TOP;
         this.objectiveBg.addControl(this.objectiveTitle);

         this.objectiveTitle2  =  this.createText("objectivetitle2","Current Objective :",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
         this.objectiveTitle2.textHorizontalAlignment  = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
         this.objectiveTitle2.textVerticalAlignment    = GUI.Control.VERTICAL_ALIGNMENT_TOP;
         this.objectiveTitle2.widthInPixels=400;
         this.objectiveTitle2.heightInPixels=50;
         this.objectiveBg.addControl(this.objectiveTitle2);

         this.downArrow =  this.createImage("downarrow","ui/arrow.png",10,34,GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
         this.downArrow.isVisible=true;
         this.downArrow.leftInPixels =-20;
         this.downArrow.rotation =BABYLON.Angle.FromDegrees(270).radians(); 

        this.drawObjectiveMenu(false);
      }
      createBar(msg,width,height){
        const  objectivebar     =  this.createRect("objectivebar",width,height,5,"#567F9033",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        const  rightArrowImage  =  this.createImage("rightarrow","ui/white.png",28,28,GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        rightArrowImage.isVisible=true;
        objectivebar.addControl(rightArrowImage);
        const bartitle          =  this.createText("bartitle",msg,18,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        bartitle.widthInPixels  =  parseInt(width*.9);
        bartitle.heightInPixels =  height;
        bartitle.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        bartitle.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        bartitle.resizeToFit = true;
        bartitle.leftInPixels =40;
        bartitle.textWrapping=true;
        objectivebar._automaticSize =true;
        objectivebar.addControl(bartitle);
        return objectivebar;
      }
      drawObjectiveMenu(isdraw){
        this.objectiveBg.isVisible=isdraw;
        this.objectiveTitle.leftInPixels  = 20;
        this.objectiveTitle2.leftInPixels = 20;
        this.downArrow.rotation =BABYLON.Angle.FromDegrees(270).radians(); 
        
      }
      initLevelComplete(){
        this.winPopUp =  this.createRect("objectivebar",480,320,5,"#96E5ED",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        const title   =  this.createText("popup_tittle","Room PrepRation\n Complete!",36,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.winPopUp.addControl(title);

        this.nextBtn =  this.createRect("nextntn",196,64,5,"#62F56F",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        let btnText   =  this.createText("btnText","Next Phase\n-->",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        btnText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        btnText.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.nextBtn.addControl(btnText);

        this.endsessionBtn =  this.createRect("endsession",128,32,5,"#F55656",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
        btnText   =  this.createText("endsessiontext","End Session",16,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        btnText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        btnText.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        this.endsessionBtn.addControl(btnText);
        this.drawLevelComplete(false);
      }
      drawLevelComplete(isDraw){
        this.winPopUp.isPointerBlocker=true;
        this.winPopUp.isVisible        =  isDraw;
        this.nextBtn.isVisible         =  isDraw;
        this.nextBtn.topInPixels       =  40;
        this.endsessionBtn.isVisible   =  isDraw;
        this.endsessionBtn.topInPixels =  120;
        
      }
      initValidationMenu(){
          this.rightBtn        =  this.createCircle("righBtn",54,54,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
          const rightImg       =  this.createImage("rightimg","ui/green.png",36,36,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
          rightImg.isVisible=true;
          rightImg.isPointerBlocker = false;
          this.rightBtn.isPointerBlocker = true;
          this.rightBtn.addControl(rightImg);
          
          this.wrongBtn      =  this.createCircle("wrongBtn",54,54,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
          const wrongimg     =  this.createImage("wrongimg2","ui/cross2_png.png",36,36,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
          wrongimg.isVisible=true;
          wrongimg.isPointerBlocker=false;
          this.wrongBtn.isPointerBlocker = true;
          this.wrongBtn.addControl(wrongimg);
          
          this.doneBtn      =  this.createCircle("crossbtn",54,54,"white",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true);
          const doneimg     =  this.createImage("crossbtn","ui/Users-Exit-icon.png",36,36,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
          doneimg.isVisible=true;
          doneimg.isPointerBlocker=false;
          this.doneBtn.isPointerBlocker = true;
          this.doneBtn.addControl(doneimg);

          this.validationRect = this.createRect("menucontiner",512,48,2,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,true); 
          const msg = "Is the APD Cassette Package still valid?"
          this.validationText = this.createText("validation_txt",msg,24,"#000000",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false) 
          this.validationRect.addControl(this.validationText);
          this.drawValidationMenu(false);
        
        
      }
      drawValidationMenu(isDraw){
          this.radialCircle.isPointerBlocker=true;
          this.radialCircle.isVisible=isDraw;

          this.validationRect.topInPixels =-200;
          this.validationRect.isVisible=isDraw;

          this.rightBtn.topInPixels  =-54;
          this.rightBtn.leftInPixels =-64;
          this.rightBtn.isVisible=isDraw;
  
          this.wrongBtn.topInPixels  =-54;
          this.wrongBtn.leftInPixels = 64;
          this.wrongBtn.isVisible=isDraw;

            
          this.doneBtn.topInPixels  = 80;
          this.doneBtn.isVisible=isDraw;
        //   this.useBtn.topInPixels = 150;
        //   if(this.root.gamemode === gamemode.training && this.root.level >1)
        //       this.useBtn.isVisible=isDraw;
        //   else
        //       this.useBtn.isVisible=false;
        //   this.crossBtn.leftInPixels = 150;
        //   this.crossBtn.isVisible=isDraw;
      }
      initbackMenu(){
          this.backMenuContainer = new GUI.Container("backMenuContainer");
          this.backMenuContainer.background = "#000000CC";
          const popupRect = this.createRect("popuprect",450,250,5,"#91E2EA",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
          popupRect.isPointerBlocker=false;
          const title     = this.createText("title_txt","Return to Main Menu?",32,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
          title.topInPixels = -100;
          const subtitle  = this.createText("subtitle_txt","(progress will not be saved)",24,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
          subtitle.topInPixels = -60;
          const continueBtn     = this.createRectBtn("continue_btn",156,52,2,"#62F56F",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,"No Continue"
          ,"#FFFFFF",20,false);  
          const arrowTxt = this.createText("arrow_txt","\u2192",32,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
          continueBtn.addControl(arrowTxt);
          continueBtn.topInPixels =20;
          continueBtn.children[0].topInPixels=-10;
          arrowTxt.topInPixels=10;
          arrowTxt.isPointerBlocker = false;
          const menuBtn     = this.createRectBtn("menu_btn",128,36,2,"#F55656",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,"Retun To Main"
          ,"#FFFFFF",14,false);  
          const menuTxt = this.createText("menu_txt","Menu",14,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
          menuTxt.isPointerBlocker = false;
          menuBtn.topInPixels = 75;
          menuBtn.children[0].topInPixels=-7;
          menuTxt.topInPixels=10;
          menuBtn.addControl(menuTxt);
          
          this.backMenuContainer.addControl(popupRect);
          this.backMenuContainer.addControl(subtitle);
          this.backMenuContainer.addControl(title);
          this.backMenuContainer.addControl(continueBtn);
          this.backMenuContainer.addControl(menuBtn);
          this.advancedTexture.addControl(this.backMenuContainer);
          this.drawbackMenu(false);
      }
      drawbackMenu(isdraw){
        
        this.backMenuContainer.isPointerBlocker=true;
        this.backMenuContainer.isVisible = isdraw;
        
      }
       initsubmitMenu(){
          this.submitMenuContainer = new GUI.Container("backMenuContainer");
          this.submitMenuContainer.background = "#000000CC";
          const popupRect = this.createRect("popuprect",450,250,5,"#91E2EA",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
          popupRect.isPointerBlocker=false;
          const title     = this.createText("title_txt","End Therapy session?",32,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
          title.topInPixels = -80;
          

          const continueBtn     = this.createRectBtn("continue_btn",156,52,2,"#62F56F",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,"No Continue"
          ,"#FFFFFF",20,false);  
          const arrowTxt = this.createText("arrow_txt","\u2192",32,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
          continueBtn.addControl(arrowTxt);
          continueBtn.topInPixels =0;
          continueBtn.children[0].topInPixels=-10;
          arrowTxt.topInPixels=10;
          arrowTxt.isPointerBlocker = false;

          const menuBtn     = this.createRectBtn("menu_btn",132,36,2,"#F55656",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,"YES END SESSION"
          ,"#FFFFFF",14,false);  
          menuBtn.topInPixels = 75;
          
          this.submitMenuContainer.addControl(popupRect);
          this.submitMenuContainer.addControl(title);
          this.submitMenuContainer.addControl(continueBtn);
          this.submitMenuContainer.addControl(menuBtn);
          this.advancedTexture.addControl(this.submitMenuContainer);
          this.drawsubmitMenu(false);
      }
      drawsubmitMenu(isdraw){
        
        this.submitMenuContainer.isPointerBlocker=true;
        this.submitMenuContainer.isVisible = isdraw;
        
      }
      initResultShowMenu(){
        this.resultContainer = new GUI.Container("backMenuContainer");
        this.resultContainer.background = "#000000CC";
        
        const resultpopup = this.createRect("resultpopup",1850,900,5,"#9EF6FFE6",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        resultpopup.isPointerBlocker=false;
        this.resultContainer.addControl(resultpopup);

        const title     = this.createText("title_txt","Results",48,"#FFFFFF",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false); 
        title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        resultpopup.addControl(title);

        const contentpopup = this.createRect("contentpopup",1757,697,5,"#6C6C6C40",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        contentpopup.isPointerBlocker=false;
        this.resultContainer.addControl(contentpopup);

        const scrollpopup  =  new GUI.StackPanel();    
        scrollpopup.name ="scrollpopup";
        scrollpopup.widthInPixels = 1565;
        scrollpopup.heightInPixels = 680;
        scrollpopup.background = "#00000052";
        scrollpopup.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        scrollpopup.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        scrollpopup.isVertical = false
        // const scrollpopup = this.createRect("scrollpopup",1565,680,5,"#00000052",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        scrollpopup.isPointerBlocker=false;
        this.resultContainer.addControl(scrollpopup);
        
        const doneResultBtn =  this.createRectBtn("doneresult",192,72,2,"#66FF73",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,"Done","#FFFFFF"
        ,35,false);
        doneResultBtn.topInPixels = 400;
        this.resultContainer.addControl(doneResultBtn);
        this.advancedTexture.addControl(this.resultContainer);
        this.drawResultShowMenu(false);
    }
    createResultBar(msg,width,height){
      const  objectivebar     =  this.createRect("resultbar",width,height,5,"#50F10042",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
      const  rightArrowImage  =  this.createImage("resultarrow","ui/white.png",28,28,GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
      rightArrowImage.isVisible=true;
      objectivebar.addControl(rightArrowImage);
      const bartitle          =  this.createText("bartitle",msg,18,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
      bartitle.widthInPixels  =  parseInt(width*.9);
      bartitle.heightInPixels =  height;
      bartitle.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      bartitle.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      bartitle.resizeToFit = true;
      bartitle.leftInPixels =40;
      bartitle.textWrapping=true;
      objectivebar._automaticSize =true;
      objectivebar.addControl(bartitle);
      return objectivebar;
    }
    drawResultShowMenu(isdraw){
      
      this.resultContainer.isPointerBlocker=true;
      this.resultContainer.isVisible = isdraw;
      
    }
      createImage(name,src,width,height,horizontal,verticle,isadd){
        const image  =  new GUI.Image(name,src);
        image.widthInPixels  = width;
        image.heightInPixels = height;
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
        button.widthInPixels = width;
        button.heightInPixels = height;
        button.color = bgcolor;
        button.background = "ffffff00";
        button.isVisible=false;
        button.horizontalAlignment = horizontal;
        button.verticalAlignment   = verticle;
        button.isPointerBlocker=true;
        if(txt.length>0){
          const text = new GUI.TextBlock(name);
          text.text = txt;
          text.fontFamily = "Shrikhand";
          text.fontSize = fontSize+"px";
          text.color    = fontcolor;
          text.isPointerBlocker=false;
          text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          text.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
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
        circle.widthInPixels   = width;
        circle.heightInPixels  = height;
        circle.color   = color;
        circle.thickness = 0;
        circle.background = color;
        circle.horizontalAlignment = horizontal;
        circle.verticalAlignment   = verticle;
        circle.isVisible=false;
        circle.isPointerBlocker=false;
        if(isadd)
            this.advancedTexture.addControl(circle);   
        // circle.onPointerDownObservable.add(function() {
        // });
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
        rect.widthInPixels  = width;
        rect.heightInPixels = height;
        rect.cornerRadius = radius;
        rect.color = color;
        rect.thickness = 4;
        rect.background = color;
        rect.isPointerBlocker=false;
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
        label.fontSizeInPixels =20;
        label.color = "#A5A5A5";
        label.isPointerBlocker=false;
        rect.isVisible=false;
        rect.addControl(label);
        return rect;
      }
      createRect(name,width,height,radius,color,horizontal,verticle,isadd){
        const rect = new GUI.Rectangle(name);
        rect.widthInPixels  = width;
        rect.heightInPixels = height;
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
      createRectBtn(name,width,height,radius,color,horizontal,verticle,_text,fontcolor,fontSize,isadd){
        const rect = new GUI.Button(name);
        rect.widthInPixels  = width;
        rect.heightInPixels = height;
        rect.cornerRadius = radius;
        rect.color = color;
        rect.thickness = 4;
        rect.background = color;
        rect.isPointerBlocker=true;
        rect.horizontalAlignment = horizontal;
        rect.verticalAlignment   = verticle;
        const text = new GUI.TextBlock(name);
        text.text = _text;
        text.fontFamily = "Shrikhand";
        text.fontSizeInPixels = fontSize;
        text.color    = fontcolor;
        text.isPointerBlocker=false;
        text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        text.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        rect.addControl(text);
        if(isadd)
          this.advancedTexture.addControl(rect);
        return rect;
      }
      createText(name,_text,size,color,horizontal,verticle,isadd){
        const text = new GUI.TextBlock(name);
        text.text = _text;
        text.fontFamily = "Shrikhand";
        text.fontSizeInPixels = size;
        text.fontWeight = "100";
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
      createStackPanel(name,width,height,color,horizontalAlignment,verticalAlignment){
        const panel  =  new GUI.StackPanel(name);    
        panel.widthInPixels = width;
        panel.heightInPixels = height;
        panel.background = color;
        panel.horizontalAlignment = horizontalAlignment;
        panel.verticalAlignment   = verticalAlignment;
        panel.isPointerBlocker=true;
        return panel;
      } 
      createInputField(name,text,placeholder,width,height,bgcolor,fontcolor,horizontalAlignment,verticalAlignment){
        const inputfield = new BABYLON.GUI.InputText(name);
        inputfield.text  = text;
        inputfield.placeholderText  = placeholder;
        inputfield.widthInPixels = width;
        inputfield.heightInPixels = height;
        inputfield.horizontalAlignment = horizontalAlignment;
        inputfield.verticalAlignment = verticalAlignment;
        inputfield.background=bgcolor;
        inputfield.color=fontcolor;
        inputfield.focusedBackground="#FFFFFF00";
        inputfield.promptMessage = text;
        return inputfield;

      }
    
}