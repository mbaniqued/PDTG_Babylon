import {AdvancedDynamicTexture,Button,Control,TextBlock,Container,StackPanel,Image,Rectangle,Ellipse,InputText,ScrollViewer } from 'babylonjs-gui';
import TWEEN from '@tweenjs/tween.js';
import {GameState, usermode,gamemode } from './scene/MainScene';
export default class GUI2D{

     constructor(root){
        this.root = root;
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.advancedTexture.layer.layerMask=1;
        let dpr = window.devicePixelRatio;
        // if(dpr<1)
        //    dpr =1;
        // if(dpr>1)
        //    dpr=1;
        // console.log(this.advancedTexture.renderScale+"      "+window.devicePixelRatio);
        this.advancedTexture.renderScale = 2;
        // const sceneSize = Math.min(window.innerWidth, window.innerHeight);
        // this.advancedTexture.scale(dpr);
        // this.advancedTexture.rootContainer.scaleX = 1;
        // this.advancedTexture.rootContainer.scaleY = 1;
        this.initUi();
     }
     initUi(){
        this.advancedTexture.idealWidth = 1920;
        this.advancedTexture.idealHeight = 1080;
        this.advancedTexture.useSmallestIdeal = false;
        this.advancedTexture.renderAtIdealSize = true;
        this.resetCamBtn   =  this.createButon("resetcambtn","ui/move.png","#ffffffff","",0,0,72,72,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        
        this.userBackBtn   =  this.createButon("userbackbtn","ui/exit_icon.png","#ffffff00","",0,"",48,48,Control.HORIZONTAL_ALIGNMENT_RIGHT,Control.VERTICAL_ALIGNMENT_TOP,true);
        this.userBackBtn.leftInPixels =-20;
        this.userBackBtn.topInPixels  = 20;

        this.userExitBtn   =  this.createCircle("userexitbtn",72,72,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_BOTTOM,true);
        const userImg      =  this.createImage("userexitbtn","ui/Users-Exit-icon.png",48,48,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        userImg.isPointerBlocker=false;
        userImg.isVisible  = true;
        this.userExitBtn.addControl(userImg);
        this.userExitBtn.isVisible=false;
        this.userExitBtn.isPointerBlocker=true;

        this.submitBtn       = this.createRectBtn("submitBtn",92,42,1,"#74FF45",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,"","#FFFFFF",0,true);
        const downArrow      = this.createImage("arrow","ui/arrow.png",24,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        downArrow.rotation   = BABYLON.Angle.FromDegrees(270).radians(); 
        downArrow.isVisible  = true;
        downArrow.isPointerBlocker=false;
        this.submitBtn.addControl(downArrow);
        this.submitBtn.isVisible=false;

        this.submitBtn2      = this.createRectBtn("submit2Btn",123,82,1,"#74FF45",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,"SUBMIT","#FFFFFF",18,true);
        this.submitBtn2.children[0].topInPixels =35;
        
        const submitimg      = this.createImage("submit_img","ui/check_png3.png",48,48,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,false);
        submitimg.isVisible  = true;
        submitimg.isPointerBlocker=false;
        this.submitBtn2.addControl(submitimg);
        this.submitBtn2.isVisible=false;

        
        this.initMainMenu();
        this.initStageMenu();
        this.initRadialMenu();
        this.initLoadingPage();
        this.initObjectiveMenu();
        this.initLevelComplete();
        this.initValidationMenu();
        this.initbackMenu();
        this.initsubmitMenu();
        this.initResultShowMenu();
      }
      initMainMenu(){
        
        this.menuContainer =  this.createRect("menucontiner",1920,1080,0,"#FFFFFF00",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);

        const menuBg       =  this.createRect("menubg2",1920,1080,0,"#7EC5DDE6",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        menuBg.isPointerBlocker=true;
        const whiteimg     =  this.createRect("menubg3",1920,1080,0,"#FFFFFF73",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        whiteimg.isPointerBlocker=true;
        const menuBgImg    =  this.createImage("menubg1","ui/apd_bg.PNG",1920,1080,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        menuBgImg.isVisible=true;
        menuBgImg.isPointerBlocker=true;
        
        const menufont    =  this.createText("menufont","Peritoneal Dialysis \nGame",90,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,false) 
        this.setTextOutLine(menufont,"#000000",2);
        menufont.topInPixels =-240;
        const userModeText =  this.createText("usermodetxt","User Mode",40,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false) 
        this.setTextOutLine(userModeText,"#000000",2);

        this.patientModeBtn   = this.createButon("patient","ui/button2.png","#ffffff00","Patient",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.caregiverModeBtn = this.createButon("caregiver","ui/button2.png","#ffffff00","Caregiver",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.userModeBtn = this.createButon("userdropbutton","ui/button.png","#ffffff00","Patient",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);


        
        const gameModeText =  this.createText("gamemodetxt","Game Mode",40,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false) 
        this.setTextOutLine(gameModeText,"#000000",2);

        this.proceedBtn        = this.createButon("proceedbtn","ui/proceed.png","#ffffff00","",24,"#808080",193,78,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.trainingModeBtn   = this.createButon("trainingbtn","ui/button2.png","#ffffff00","Training",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.practiceModeBtn   = this.createButon("practicebtn","ui/button2.png","#ffffff00","Practice",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.assesmentModeBtn  = this.createButon("assesmentbtn","ui/button2.png","#ffffff00","Assessment",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.gameModeBtn       = this.createButon("gameModeBtn","ui/button.png","#ffffff00","Training",24,"#808080",216,56,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        

        
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
        this.proceedBtn.topInPixels = 250;
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
            this.root.gamemode = gamemode.assessment;
            hidegamemode();
          });
          this.proceedBtn._onPointerUp=()=>{
              BABYLON.Engine.audioEngine.unlock();
              hideusermode();
              hidegamemode();
              this.drawMainMenu(false);
              this.root.gamestate.state = GameState.levelstage; 
              this.drawStageMenu(true);
              // this.root.scene.getEngine().enterFullscreen();
              document.body.requestFullscreen();
          }
      }
      initStageMenu(){
        this.backBtn        = this.createButon("backbtn","ui/backbtn.png","#ffffff00","",24,"#808080",119,67,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.playBtn        = this.createButon("playbtn","ui/play.png","#ffffff00","",24,"#808080",193,78,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.stage1btn      = this.createButon("prepration1btn","ui/button2.png","#ffffff00","Stage1:Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.stagebtn       = this.createButon("stagemodbtn","ui/button.png","#ffffff00","Stage1:Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        
        this.roompreBtn     = this.createButon("roomprebtn","ui/button2.png","#ffffff00","Room Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.itempreBtn     = this.createButon("itemprebtn","ui/button2.png","#ffffff00","Item Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.selfpreBtn     = this.createButon("selfprebtn","ui/button2.png","#ffffff00","Self Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.machinepreBtn  = this.createButon("machineprebtn","ui/button2.png","#ffffff00","Machine Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.phasebtn       = this.createButon("phasebtn","ui/button.png","#ffffff00","Room Preparation",19,"#808080",256,66,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.phasebtnDisable = this.createRect("disable_rect",256,66,4,"#A2A2A280",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        this.phasebtnDisable.isVisible=false;
        this.phasebtnDisable.isPointerBlocker=false;
      }
      drawStageMenu(isDraw){
          this.advancedTexture.renderAtIdealSize = true;
          // this.root.level   = 0;
          this.menuContainer.isVisible = isDraw;
          this.menuContainer.getChildByName("usermodetxt").text = "Select Stage";
          this.menuContainer.getChildByName("gamemodetxt").text = "Select Phase";
          
          this.playBtn.isVisible = isDraw;
          this.playBtn.topInPixels =250; 
          this.playBtn._onPointerUp=()=>{
            this.drawStageMenu(false);
            hidephasebtn();
            this.root.gamestate.state = GameState.loading;
            this.advancedTexture.renderAtIdealSize = false;
            this.stage1btn.isVisible  =  false;
            this.phasebtnDisable.isVisible = false;
            this.drawLoadingPage(true);
            this.root.sceneCommon.setView();
            if(this.root.gamemode === gamemode.assessment)
              this.root.level =0;
            console.log("!!! level!! "+this.root.level);
            this.root.setGame().then((msg)=>{
                console.log(msg);
                switch(this.root.level){
                  case 0:
                      this.root.enterScene(1500);
                    break;
                  case 1:
                     this.root.gameTaskManager.completeRoomSetUp();
                     this.root.enterScene(2000);
                    break;  
                  case 2:
                     this.root.gameTaskManager.completeRoomSetUp();
                     setTimeout(() => {
                       this.root.gameTaskManager.completeItemSetUp();  
                     }, 1500);
                     this.root.enterScene(3000);
                   break;  
                  case 3:
                     this.root.gameTaskManager.completeRoomSetUp();
                     setTimeout(() => {
                       this.root.gameTaskManager.completeItemSetUp();  
                     }, 1500);
                     setTimeout(() => {
                       this.root.gameTaskManager.completeSelfSetUp();  
                     }, 2900);
                     this.root.enterScene(3000);
                    break; 
                }
            });
          }
          this.backBtn.topInPixels = 350;
          this.backBtn.isVisible   = isDraw;
          this.backBtn._onPointerUp=()=>{
            this.drawStageMenu(false);
            this.stage1btn.isVisible=false;
            this.phasebtnDisable.isVisible = false;
            hidephasebtn();
            this.drawMainMenu(true);
            this.root.gamestate.state = GameState.menu; 
          }
          this.stagebtn.isVisible  = isDraw;
          this.stagebtn.children[1].leftInPixels =-10;
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
          this.phasebtn.isEnabled  = this.root.gamemode !== gamemode.assessment;
          this.phasebtnDisable.isVisible = this.root.gamemode === gamemode.assessment;
          this.phasebtnDisable.topInPixels= y2;
          this.phasebtn.isVisible = isDraw;
          this.phasebtn.children[1].leftInPixels =-10;
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
        switch(this.root.level){
            case 0:
                this.phasebtn.children[1].text="Room Preparation";
              break;
            case 1:
                this.phasebtn.children[1].text="Item Preparation";
            break;
            case 2:
                this.phasebtn.children[1].text="Self Preparation";
            break;
            case 3:
                this.phasebtn.children[1].text="Machine Preparation";
            break;
        }
        this.roompreBtn.onPointerUpObservable.add(()=>{
            this.root.level   = 0;
            hidephasebtn();
            this.phasebtn.children[1].text="Room Preparation";
        })
        this.itempreBtn.onPointerUpObservable.add(()=>{
          this.root.level   = 1;
          hidephasebtn();
          this.phasebtn.children[1].text="Item Preparation";
        })
        this.selfpreBtn.onPointerUpObservable.add(()=>{
          this.root.level   = 2;
          hidephasebtn();
          this.phasebtn.children[1].text="Self Preparation";
        })
        this.machinepreBtn.onPointerUpObservable.add(()=>{
          this.root.level   = 3;
          hidephasebtn();
          this.phasebtn.children[1].text="Machine Preparation";
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
        this.loaginBg =  this.createRect("loadingBg",1920,1080,0,"#7EC5DDB3",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        const title   =  this.createText("title","Preparing the room...",60,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,false); 
        this.setTextOutLine(title,"#000000",2);
        title.leftInPixels = -550;
        title.topInPixels  =  400;
        this.loaginBg.addControl(title);
        this.loaginBg.isVisible=false;
      }
      drawLoadingPage(isDraw){
        this.loaginBg.isVisible=isDraw;
      }
      initRadialMenu(){
        
        this.radiaMenuContainer  = new Container("radialcontainer");        
        this.advancedTexture.addControl(this.radiaMenuContainer);
        this.radialCircle    =  this.createImage("RadialCircleBig","ui/CircleBig.png",192,192,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        this.radialCircle.isPointerBlocker=true;
        this.inspectBtn      =  this.createCircle("inspectBtn",54,54,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        const inspectImg     =  this.createImage("inspectBtn","ui/magnifying-glass-with-check-mark.png",36,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        inspectImg.isVisible=true;
        inspectImg.isPointerBlocker = false;
        this.inspectBtn.isPointerBlocker = true;
        this.inspectBtn.addControl(inspectImg);
        
        this.useBtn      =  this.createCircle("useBtn",54,54,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        const useImg     =  this.createImage("useBtn","ui/NicePng_hand-png_45955 (2).png",36,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        useImg.isVisible=true;
        useImg.isPointerBlocker=false;
        this.useBtn.isPointerBlocker = true;
        this.useBtn.addControl(useImg);
        
        this.crossBtn      =  this.createCircle("crossbtn",54,54,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        const crossImg     =  this.createImage("crossbtn","ui/cross2_png.png",36,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        crossImg.isVisible=true;
        crossImg.isPointerBlocker=false;
        this.crossBtn.isPointerBlocker = true;
        this.crossBtn.addControl(crossImg);

        this.radiaMenuContainer.addControl(this.radialCircle);  
        this.radiaMenuContainer.addControl(this.crossBtn);  
        this.radiaMenuContainer.addControl(this.useBtn);  
        this.radiaMenuContainer.addControl(this.inspectBtn);  

        this.drawRadialMenu(false);
      }
      drawRadialMenu(isDraw){
        this.radiaMenuContainer.isPointerBlocker=true;
        this.radiaMenuContainer.isVisible=isDraw;
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

         this.objectiveBg  =  new StackPanel();    
         this.objectiveBg.isPointerBlocker=true;
         this.objectiveBg.widthInPixels = 400;
         this.objectiveBg.background = "#9EF6FF66";
         this.objectiveBg.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
         this.objectiveBg.verticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;
         this.advancedTexture.addControl(this.objectiveBg);   
         this.objectiveBg.ignoreLayoutWarnings = true
        //  this.objectiveBg       =  this.createRect("objectivebg",400,200,5,"#7BABB2B3",Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_TOP,true);
         
         this.objectiveTitle   =  this.createText("objectivetitle","Room Preparation",32,"#ffffff",Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_TOP,false);
         this.objectiveTitle.widthInPixels=400;
         this.objectiveTitle.heightInPixels=40;
         this.objectiveTitle.textHorizontalAlignment  = Control.HORIZONTAL_ALIGNMENT_LEFT;
         this.objectiveTitle.textVerticalAlignment    = Control.VERTICAL_ALIGNMENT_TOP;
         this.objectiveBg.addControl(this.objectiveTitle);

         this.objectiveTitle2  =  this.createText("objectivetitle2","Current Objective :",24,"#ffffff",Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_TOP,false);
         this.objectiveTitle2.textHorizontalAlignment  = Control.HORIZONTAL_ALIGNMENT_LEFT;
         this.objectiveTitle2.textVerticalAlignment    = Control.VERTICAL_ALIGNMENT_TOP;
         this.objectiveTitle2.widthInPixels=400;
         this.objectiveTitle2.heightInPixels=36;
         this.objectiveBg.addControl(this.objectiveTitle2);

         this.downArrow =  this.createImage("downarrow","ui/arrow.png",10,34,Control.HORIZONTAL_ALIGNMENT_RIGHT,Control.VERTICAL_ALIGNMENT_CENTER,false);
         this.downArrow.isVisible=true;
         this.downArrow.leftInPixels =-20;
         this.downArrow.rotation =BABYLON.Angle.FromDegrees(270).radians(); 

        this.drawObjectiveMenu(false);
      }
      createBar(msg,width,height){
        const  objectivebar     =  this.createRect("objectivebar",width,height,5,"#567F9033",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,false);
        const  rightArrowImage  =  this.createImage("rightarrow","ui/white.png",28,28,Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,false);
        rightArrowImage.isVisible=true;
        objectivebar.addControl(rightArrowImage);
        const bartitle          =  this.createText("bartitle",msg,18,"#ffffff",Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,false);
        bartitle.widthInPixels  =  parseInt(width*.8);
        bartitle.heightInPixels =  height;
        bartitle.lineSpacing    = -5;
        bartitle.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        bartitle.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        bartitle.resizeToFit = false;
        bartitle.leftInPixels =40;
        // bartitle.paddingTopInPixels =2;
        bartitle.textWrapping=true;
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
        this.winPopUp =  this.createRect("objectivebar",480,320,5,"#96E5ED",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        const title   =  this.createText("popup_tittle","Room Preparation\n Complete!",36,"#ffffff",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;
        this.winPopUp.addControl(title);

        this.nextBtn =  this.createRect("nextntn",196,64,5,"#62F56F",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        let btnText   =  this.createText("btnText","Next Phase\n-->",24,"#ffffff",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        btnText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        btnText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;
        this.nextBtn.addControl(btnText);

        this.endsessionBtn =  this.createRect("endsession",128,32,5,"#F55656",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,true);
        btnText   =  this.createText("endsessiontext","End Session",16,"#ffffff",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        btnText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        btnText.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;

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
          this.radiaMenuContainer2  = new Container("radialcontainer2");        
          this.advancedTexture.addControl(this.radiaMenuContainer2);
          this.radialCircle2    =  this.createImage("RadialCircleBig","ui/CircleBig.png",192,192,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          
          this.rightBtn        =  this.createCircle("righBtn",54,54,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          const rightImg       =  this.createImage("rightimg","ui/green.png",36,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          rightImg.isVisible=true;
          rightImg.isPointerBlocker = false;
          this.rightBtn.isPointerBlocker = true;
          this.rightBtn.addControl(rightImg);
          
          this.wrongBtn      =  this.createCircle("wrongBtn",54,54,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          const wrongimg     =  this.createImage("wrongimg2","ui/cross2_png.png",36,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          wrongimg.isVisible=true;
          wrongimg.isPointerBlocker=false;
          this.wrongBtn.isPointerBlocker = true;
          this.wrongBtn.addControl(wrongimg);
          
          this.doneBtn      =  this.createCircle("crossbtn",54,54,"white",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          const doneimg     =  this.createImage("crossbtn","ui/Users-Exit-icon.png",36,36,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          doneimg.isVisible=true;
          doneimg.isPointerBlocker=false;
          this.doneBtn.isPointerBlocker = true;
          this.doneBtn.addControl(doneimg);

          this.validationRect = this.createRect("menucontiner",512,48,2,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          const msg = "Is the APD Cassette Package still valid?"
          this.validationText = this.createText("validation_txt",msg,24,"#000000",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,false); 
          this.validationRect.addControl(this.validationText);

          this.radiaMenuContainer2.addControl(this.radialCircle2);
          this.radiaMenuContainer2.addControl(this.rightBtn);
          this.radiaMenuContainer2.addControl(this.wrongBtn);
          this.radiaMenuContainer2.addControl(this.doneBtn);
          this.radiaMenuContainer2.addControl(this.validationRect);
          this.drawValidationMenu(false);
        
        
      }
      drawValidationMenu(isDraw){

          this.radiaMenuContainer2.isPointerBlocker=true;
          this.radiaMenuContainer2.isVisible = isDraw;

          this.radialCircle2.isVisible=isDraw;

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
        
      }
      initbackMenu(){
          this.backMenuContainer = new Container("backMenuContainer");
          this.backMenuContainer.background = "#000000CC";
          const popupRect = this.createRect("popuprect",450,250,5,"#91E2EA",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          popupRect.isPointerBlocker=false;
          const title     = this.createText("title_txt","Return to Main Menu?",32,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          title.topInPixels = -100;
          const subtitle  = this.createText("subtitle_txt","(progress will not be saved)",24,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          subtitle.topInPixels = -60;
          const continueBtn     = this.createRectBtn("continue_btn",156,52,2,"#62F56F",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,"No Continue"
          ,"#FFFFFF",20,false);  
          const arrowTxt = this.createText("arrow_txt","\u2192",32,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          continueBtn.addControl(arrowTxt);
          continueBtn.topInPixels =20;
          continueBtn.children[0].topInPixels=-10;
          arrowTxt.topInPixels=10;
          arrowTxt.isPointerBlocker = false;
          const menuBtn     = this.createRectBtn("menu_btn",128,36,2,"#F55656",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,"Retun To Main"
          ,"#FFFFFF",14,false);  
          const menuTxt = this.createText("menu_txt","Menu",14,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
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
        this.backMenuContainer.zIndex=101;
        this.backMenuContainer.isPointerBlocker=true;
        this.backMenuContainer.isVisible = isdraw;
        
      }
       initsubmitMenu(){
          this.submitMenuContainer = new Container("backMenuContainer");
          this.submitMenuContainer.background = "#000000CC";
          const popupRect = this.createRect("popuprect",450,250,5,"#91E2EA",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
          popupRect.isPointerBlocker=false;
          const title     = this.createText("title_txt","End Therapy session?",32,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          title.topInPixels = -80;
          

          const continueBtn     = this.createRectBtn("continue_btn",156,52,2,"#62F56F",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,"No Continue"
          ,"#FFFFFF",20,false);  
          const arrowTxt = this.createText("arrow_txt","\u2192",32,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          continueBtn.addControl(arrowTxt);
          continueBtn.topInPixels =0;
          continueBtn.children[0].topInPixels=-10;
          arrowTxt.topInPixels=10;
          arrowTxt.isPointerBlocker = false;

          const resultBtn     = this.createRectBtn("result_btn",132,36,2,"#F55656",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,"YES END SESSION"
          ,"#FFFFFF",14,false);  
          resultBtn.topInPixels = 75;
          
          this.submitMenuContainer.addControl(popupRect);
          this.submitMenuContainer.addControl(title);
          this.submitMenuContainer.addControl(continueBtn);
          this.submitMenuContainer.addControl(resultBtn);
          this.advancedTexture.addControl(this.submitMenuContainer);
          this.drawsubmitMenu(false);
      }
      drawsubmitMenu(isdraw){
        this.submitMenuContainer.zIndex=101;
        this.submitMenuContainer.isPointerBlocker=true;
        this.submitMenuContainer.isVisible = isdraw;
        
      }
      initResultShowMenu(){
        this.resultContainer = new Container("backMenuContainer");
        this.resultContainer.background = "#000000CC";
        
        const resultpopup = this.createRect("resultpopup",1850,900,5,"#9EF6FFE6",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        resultpopup.isPointerBlocker=true;
        this.resultContainer.addControl(resultpopup);

        const title     = this.createText("title_txt","Results",48,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
        title.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;
        resultpopup.addControl(title);

        const contentpopup = this.createRect("contentpopup",1757,697,5,"#6C6C6C40",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        contentpopup.isPointerBlocker=true;
        this.resultContainer.addControl(contentpopup);


        const modescrollpanel = new ScrollViewer("allmode_scroll_viewer");
        modescrollpanel.isPointerBlocker=true;
        this.resultContainer.addControl(modescrollpanel);

        const scrollpopup  =  new StackPanel("scrollcontainer");    
        scrollpopup.isPointerBlocker=true;
        scrollpopup.widthInPixels  = 2200;
        scrollpopup.heightInPixels = 680;
        scrollpopup.background = "#00000052";
        scrollpopup.topInPixels=250;
        scrollpopup.isVertical = false;

        modescrollpanel.widthInPixels  = scrollpopup.widthInPixels-600;
        modescrollpanel.heightInPixels = scrollpopup.heightInPixels;
        modescrollpanel.horizontalBar.isPointerBlocker=true;
        modescrollpanel.verticalBar.alpha=0;
        modescrollpanel.verticalBar.isEnabled=false;
        
        modescrollpanel.background = "#ffffff00";
        modescrollpanel.color = "#ffffff00";
        
        modescrollpanel.addControl(scrollpopup);
        
        
        //assesment result
        const assesmentContainer =  new Container("assesmentcontainer");
        assesmentContainer.isPointerBlocker=true;
        this.resultContainer.addControl(assesmentContainer);
        const titlestage1  = this.createText("titlestage1","STAGE 1 : Preparation",42,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
        titlestage1.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        titlestage1.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_TOP;
        titlestage1.topInPixels=150;
        assesmentContainer.addControl(titlestage1);
        assesmentContainer.isVisible=false;
        
        const value=["Duration:","Overall Accuracy:","Steps Accuracy:","Sequence Accuracy:"];
        for(let i=0;i<value.length;i++){
          const valuetext  = this.createText(value[i],value[i],36,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          valuetext.topInPixels = -150+i*100;
          valuetext.leftInPixels = 400;
          valuetext.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
          valuetext.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
          assesmentContainer.addControl(valuetext);
        }
        const value2=["duration_value","overall_value","steps_value","sequence_value"];
        for(let i=0;i<value2.length;i++){
          const valuetext  = this.createText(value2[i],i==0?"0s":"0%",36,"#FFFFFF",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false); 
          valuetext.topInPixels = -150+i*100;
          valuetext.leftInPixels = -400;
          valuetext.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
          valuetext.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
          assesmentContainer.addControl(valuetext);
        }

        const leftRect = this.createRectBtn("leftRectBtn",64,500,5,"#6E6E6E40",Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,"","",0,false);
        this.resultContainer.addControl(leftRect);
        const leftArrow      =  this.createImage("leftArrow","ui/arrow.png",36,36*3,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        leftArrow.isVisible=true;
        leftRect.addControl(leftArrow);
        leftRect.leftInPixels =90;
        
        const rightRect = this.createRectBtn("rightRectBtn",64,500,5,"#6E6E6E40",Control.HORIZONTAL_ALIGNMENT_RIGHT,Control.VERTICAL_ALIGNMENT_CENTER,"","",0,false);
        this.resultContainer.addControl(rightRect);
        const rightArrow      =  this.createImage("leftArrow","ui/arrow.png",36,36*3,Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,false);
        rightArrow.isVisible=true;
        rightArrow.rotation = BABYLON.Angle.FromDegrees(180).radians();
        rightRect.addControl(rightArrow);
        rightRect.leftInPixels =-90;

        const doneResultBtn =  this.createRectBtn("doneresult",192,72,2,"#66FF73",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_CENTER,"Done","#FFFFFF"
        ,35,false);
        doneResultBtn.topInPixels = 400;
        this.resultContainer.addControl(doneResultBtn);
        this.advancedTexture.addControl(this.resultContainer);
        this.drawResultShowMenu(false);
        leftRect.onPointerUpObservable.add(()=>{
            if(this.root.resultPage===1){
              this.root.resultPage--;
              assesmentContainer.isVisible=true;
              modescrollpanel.isVisible=false;
            }
        });
        rightRect.onPointerUpObservable.add(()=>{
          if(this.root.resultPage===0){
             this.root.resultPage++;
             assesmentContainer.isVisible=false;
             modescrollpanel.isVisible=true;
           }
        });
    }
    createResultBar(msg,width,height){
      const  objectivebar     =  this.createRect("resultbar",width,height,5,"#50F10042",Control.HORIZONTAL_ALIGNMENT_CENTER,Control.VERTICAL_ALIGNMENT_TOP,false);
      const  rightArrowImage  =  this.createImage("resultarrow","ui/green.png",28,28,Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,false);
      rightArrowImage.isVisible=true;
      objectivebar.addControl(rightArrowImage);

      const  wrongArrowImage  =  this.createImage("cross","ui/cross2_png.png",28,28,Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,false);
      wrongArrowImage.isVisible=true;
      objectivebar.addControl(wrongArrowImage);
      const bartitle          =  this.createText("bartitle",msg,18,"#ffffff",Control.HORIZONTAL_ALIGNMENT_LEFT,Control.VERTICAL_ALIGNMENT_CENTER,false);
      bartitle.lineSpacing    = -2;
      
      bartitle.widthInPixels  =  parseInt(width*.85);
      bartitle.heightInPixels =  height;
      bartitle.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      bartitle.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
      bartitle.resizeToFit = false;
      bartitle.leftInPixels =40;
      bartitle.textWrapping=true;
      // bartitle.paddingTopInPixels =2;
      objectivebar.addControl(bartitle);
      return objectivebar;
    }
    drawResultShowMenu(isdraw){
      this.advancedTexture.renderAtIdealSize = true;
      this.resultContainer.zIndex=101;
       this.resultContainer.isPointerBlocker=true;
       this.resultContainer.isVisible = isdraw;
       const assesmentcontainer = this.resultContainer.getChildByName("assesmentcontainer");
       assesmentcontainer.isVisible = this.root.gamemode === gamemode.assessment;
       const rightRectBtn = this.resultContainer.getChildByName("rightRectBtn");
       rightRectBtn.isVisible = this.root.gamemode === gamemode.assessment;
       const leftRectBtn = this.resultContainer.getChildByName("leftRectBtn");
       leftRectBtn.isVisible = this.root.gamemode === gamemode.assessment;

       const allmode_scroll_viewer = this.resultContainer.getChildByName("allmode_scroll_viewer");
       allmode_scroll_viewer.horizontalBar.alpha     = this.root.gamemode === gamemode.practice?0:1;
       allmode_scroll_viewer.horizontalBar.isEnabled = this.root.gamemode === gamemode.assessment;
       
       
       
      }
     createImage(name,src,width,height,horizontal,verticle,isadd){
        const image  =  new Image(name,src);
        image.widthInPixels  = width;
        image.heightInPixels = height;
        image.populateNinePatchSlicesFromImage = true;
        // image.stretch = BABYLON.Image.STRETCH_NINE_PATCH;
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
        const button = new Button.CreateImageOnlyButton(name, src);
        button.widthInPixels = width;
        button.heightInPixels = height;
        button.color = bgcolor;
        button.background = "ffffff00";
        button.isVisible=false;
        button.horizontalAlignment = horizontal;
        button.verticalAlignment   = verticle;
        button.isPointerBlocker=true;
        if(txt.length>0){
          const text = new TextBlock(name);
          text.text = txt;
          text.fontFamily = "Shrikhand";
          text.fontSize = fontSize+"px";
          text.color    = fontcolor;
          text.isPointerBlocker=false;
          text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
          text.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
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
        const circle   = new Ellipse(name);
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
        const rect = new Rectangle(name);
        rect.widthInPixels  = width;
        rect.heightInPixels = height;
        rect.cornerRadius = radius;
        rect.color = "#000000";
        rect.thickness = 4;
        rect.background = color;
        rect.isPointerBlocker=false;
        rect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect.verticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        this.advancedTexture.addControl(rect);
        rect.linkOffsetXInPixels = linkOffsetX;
        rect.linkOffsetYInPixels = linkOffsetY;
        rect.linkWithMesh(mesh);   
        
        const label = new TextBlock(name+"txt");
        label.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        label.verticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        label.text =  name;
        label.fontSizeInPixels =20;
        label.color = "#A5A5A5";
        label.isPointerBlocker=false;
        rect.isVisible=false;
        rect.addControl(label);
        return rect;
      }
      createRect(name,width,height,radius,color,horizontal,verticle,isadd){
        const rect = new Rectangle(name);
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
        const rect = new Button(name);
        rect.widthInPixels  = width;
        rect.heightInPixels = height;
        rect.cornerRadius = radius;
        rect.color = color;
        rect.thickness = 4;
        rect.background = color;
        rect.isPointerBlocker=true;
        rect.horizontalAlignment = horizontal;
        rect.verticalAlignment   = verticle;
        const text = new TextBlock(name);
        text.text = _text;
        text.fontFamily = "Shrikhand";
        text.fontSizeInPixels = fontSize;
        text.color    = fontcolor;
        text.isPointerBlocker=false;
        text.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        text.textVerticalAlignment   = Control.VERTICAL_ALIGNMENT_CENTER;
        rect.addControl(text);
        if(isadd)
          this.advancedTexture.addControl(rect);
        return rect;
      }
      createText(name,_text,size,color,horizontal,verticle,isadd){
        const text = new TextBlock(name);
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
        const panel  =  new StackPanel(name);    
        panel.widthInPixels = width;
        panel.heightInPixels = height;
        panel.background = color;
        panel.horizontalAlignment = horizontalAlignment;
        panel.verticalAlignment   = verticalAlignment;
        panel.isPointerBlocker=true;
        return panel;
      } 
      createInputField(name,text,placeholder,width,height,bgcolor,fontcolor,horizontalAlignment,verticalAlignment){
        const inputfield = new InputText(name);
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