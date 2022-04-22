const action_time=500;
import { ANIM_TIME,randomNumber } from "../scene/MainScene";
import { diasolutionpos1,diasolutionpos2,diasolutionpos3,diasolutionpos4,sanitizerpos1,sanitizerpos2 } from "./cabinetitem";
import { MACHINE_PREPRATION } from "./results";
export const TOTAL_POINTS = 41,TOTAL_SEQUENCE_POINTS =9,TOTAL_TASK=45;
const TASKPOINT=1;
// overall             // 
export default class GameTaskManager{
    constructor(root){
        this.root     = root;
        this.taskPoint = 0;
        this.taskDone  = 0;
        this.isBonus  = [];
        this.isPhase1Comp  = false;
        this.isPhase2Comp  = false;
        this.isPhase3Comp  = false;
        this.isPhase4Comp  = false;

        this.isPhase1Start  = false;
        this.isPhase2Start  = false;
        this.isPhase3Start  = false;
        this.isPhase4Start  = false;
    }
    reset(){
        this.isBonus   = [];
        this.taskPoint = 0;
        this.taskDone  = 0;
        this.isPhase1Comp  = false;
        this.isPhase2Comp  = false;
        this.isPhase3Comp  = false;
        this.isPhase4Comp  = false;

        this.isPhase1Start  = false;
        this.isPhase2Start  = false;
        this.isPhase3Start  = false;
        this.isPhase4Start  = false;
    }
    completeRoomSetUp(){
        setTimeout(() => {
            this.root.doorObject.closedoor=false;
            this.root.doorObject.openCloseDoor(false);
            console.log(" 111completeRoomSetUp 1111");    
        }, action_time);
        setTimeout(() => {
            this.root.lightswitchObject.isLightOff = false;
            this.root.lightswitchObject.setLight();    
            console.log(" 111completeRoomSetUp 2222");
        }, action_time*2);
        setTimeout(() => {
            this.root.fanswitchobject.isFanOff = true;
            this.root.stopFan();
        }, action_time*3);
        setTimeout(() => {
            this.root.windowObject.windowClose=false;
            this.root.windowObject.closeWindow();
        }, action_time*4);
        setTimeout(() => {
            this.root.acItem.isAcOff = false;
            this.root.scene.getMeshByName("acindicator").material.diffuseColor  = new BABYLON.Color3.FromInts(255,0,0);
            this.root.audioManager.playSound(this.root.audioManager.acSound);
            this.root.setAc(false);
        }, action_time*5);
    }
    completeItemSetUp(){
        setTimeout(() => {
            this.root.bpMachineItem.placeItem(ANIM_TIME*.1,true);    
        }, action_time*.2);
        setTimeout(() => {
            this.root.ccpdRecordBook.placeItem(ANIM_TIME*.2,true);    
        }, action_time*.4);
        setTimeout(() => {
            this.root.alcohalItem.placeItem(ANIM_TIME*.3,true);    
        }, action_time*.6);
        setTimeout(() => {
            this.root.connectionItem.placeItem(ANIM_TIME*.4,true);    
        }, action_time*.8);
        setTimeout(() => {
            this.root.maskItem.placeItem(ANIM_TIME*.5,true);    
        }, action_time);
        setTimeout(() => {
            this.root.apdmachinePackage.placeItem(ANIM_TIME*.6,true);    
        }, action_time*1.2);
        setTimeout(() => {
            this.root.drainBagItem.placeItem(ANIM_TIME*.7,true);    
        }, action_time*1.4);
        setTimeout(() => {
            this.root.sanitiserObject[0].placeItem(ANIM_TIME*.8,true);    
        }, action_time*1.6);
        setTimeout(() => {
            this.root.dialysisSolutionObject[0].placeItem(ANIM_TIME*.8,true);    
        }, action_time*1.8);
        setTimeout(() => {
            this.root.dialysisSolutionObject[1].placeItem(ANIM_TIME*.9,true);    
        }, action_time*2);
    }
    completeSelfSetUp(){
        // let bpvalue =   randomNumber(85,110);
        let bpvalue = this.root.bpMonitor.getBpRecord(2)[0];
        this.root.setbpRecord(bpvalue,true);   
        this.root.ccpdRecordBook.state=100;
        this.root.ccpdRecordBook.initAction();
        this.root.ccpdRecordBook.useccpdRecordBook(ANIM_TIME*.5,false);
        this.root.setbpValueCCPD();
        setTimeout(() => {
            this.root.maskItem.useMask(ANIM_TIME*.5); 
        },1000);
    }
    setPracticeMode(){
        this.root.doorObject.initAction(); 
        this.root.lightswitchObject.initAction();
        this.root.fanswitchobject.initAction();
        this.root.acItem.initAction();
        this.root.windowObject.initAction();

        this.root.trollyObject.initAction();
        this.root.tableObject.initAction();
        this.root.cabinetObject.initAction();

        this.root.bpMachineItem.initAction();
        this.root.alcohalItem.initAction();
        this.root.maskItem.initAction();
        this.root.connectionItem.initAction();
        this.root.apdmachinePackage.initAction();
        this.root.drainBagItem .initAction();
        this.root.ccpdRecordBook.initAction();

        this.root.bpMachineItem.enableDrag(true);
        this.root.alcohalItem.enableDrag(true);
        this.root.maskItem.enableDrag(true);
        this.root.connectionItem.enableDrag(true);
        this.root.apdmachinePackage.enableDrag(true);
        this.root.drainBagItem.enableDrag(true);
        this.root.ccpdRecordBook.enableDrag(true);

        
        for(let i=0;i<this.root.dialysisSolutionObject.length;i++){
            this.root.dialysisSolutionObject[i].initAction();
            this.root.dialysisSolutionObject[i].enableDrag(true);
          }
          for(let i=0;i<this.root.sanitiserObject.length;i++){
                this.root.sanitiserObject[i].initAction();
                this.root.sanitiserObject[i].enableDrag(true);
          }
          this.root.handSoapObject.initAction();
          this.root.paperTowelObject.initAction();
          
    }
    level1Result(){
        const result =[];
        result[0] = this.root.doorObject.closedoor;
        result[1] = this.root.lightswitchObject.isLightOff;
        result[2] = this.root.fanswitchobject.isFanOff;
        result[3] = this.root.windowObject.windowClose;
        result[4] = this.root.acItem.isAcOff;
        return result;
    }
    level2Result(){
        const result =[];
        result[0] = this.root.apdmachinePackage.placedPosition ==this.root.apdmachinePackage.tablePosition || this.root.apdmachinePackage.isPlaced;
        result[1] = this.root.ccpdRecordBook.placedPosition    ==this.root.ccpdRecordBook.tablePosition;
        result[2] = this.root.drainBagItem.placedPosition      ==this.root.drainBagItem.tablePosition || this.root.drainBagItem.isPlaced;;
        result[3] = this.root.alcohalItem.placedPosition       ==this.root.alcohalItem.tablePosition;
        result[4] = this.root.bpMachineItem.placedPosition     ==this.root.bpMachineItem.tablePosition;
        result[5] = this.root.connectionItem.placedPosition    ==this.root.connectionItem.tablePosition;
        result[6] = this.root.maskItem.placedPosition          ==this.root.maskItem.tablePosition;

        let cnt=0;
        for(let i=0;i<this.root.dialysisSolutionObject.length;i++){
            if(this.root.dialysisSolutionObject[i].placeOnTable){
                cnt++;
            }
            if(cnt>1)
             result[7] = true;
            
        }
        for(let i=0;i<this.root.sanitiserObject.length;i++){
            if(this.root.sanitiserObject[i].placeOnTable){
                result[8] = true;
            }
        }
        return result;
    }
    level3Result(){
        const result=[];
        result[0] = this.root.bpRecord.length>0;
        result[1] = this.root.ccpdRecordBook.parent === this.root.scene.getCameraByName("maincamera");
        result[2] = this.root.ccpdbpInputField.text.length>0;
        result[3] = this.root.maskItem.parent === this.root.scene.getCameraByName("maincamera");
        result[4] = this.root.handwashactivity.washhand;
        result[5] = this.root.paperTowelObject.usepaperTowel;
        return result;
    }
    level4Result(){
        const result=[]; 
        for(let i=0;i<MACHINE_PREPRATION.length;i++){
          const value={value:""};
          result.push(value);
        }
        result[0].value = this.root.wipeAlcohal.accessAlcohal;
         for(let i=0;i<this.root.sanitiserObject.length;i++){
            if(this.root.sanitiserObject[i].placedPosition == sanitizerpos2){
               result[1].value = true;
               result[24].value = true;
            }
          }
          result[2].value = this.root.apdmachinePackage.valdiationCount>1;
          result[3].value = this.root.apdmachinePackage.apdValidateType[0];
          result[4].value = this.root.apdmachinePackage.apdValidateType[1];
          let check=false,checkCnt=0,validateDialysis=[];
          for(let i=0;i<this.root.dialysisSolutionObject.length;i++){
                check = this.root.dialysisSolutionObject[i].checkAllValidationDone();
                if(check)
                    checkCnt++;
                  result[5].value = checkCnt>1;
                if(this.root.dialysisSolutionObject[i].pickforValidation)
                    validateDialysis.push(i);
          }
          for(let i=0;i<validateDialysis.length;i++){
             let index = validateDialysis[i];
             if(i===0){
                  let value = this.root.dialysisSolutionObject[index].checkValidation["concentration_highlight_plan"];
                  result[6].value = value;
                  value = this.root.dialysisSolutionObject[index].checkValidation["expiry_highlight_plan"];
                  result[7].value = value;
                  value = this.root.dialysisSolutionObject[index].checkValidation["volume_highlight_plan"];
                  result[8].value = value;
                  value = this.root.dialysisSolutionObject[index].checkValidation["greencap_highlight_plan"];
                  result[9].value = value;
                  value = this.root.dialysisSolutionObject[index].checkValidation["cap_highlight_plan"];
                  result[10].value = value;
             }
             if(i===1){
                    let value = this.root.dialysisSolutionObject[index].checkValidation["volume_highlight_plan"];
                    result[11].value = value;
                    value = this.root.dialysisSolutionObject[index].checkValidation["cap_highlight_plan"];
                    result[12].value = value;
                    value = this.root.dialysisSolutionObject[index].checkValidation["greencap_highlight_plan"];
                    result[13].value = value;
                    value = this.root.dialysisSolutionObject[index].checkValidation["concentration_highlight_plan"];
                    result[14].value = value;
                    value = this.root.dialysisSolutionObject[index].checkValidation["expiry_highlight_plan"];
                    result[15].value = value;
              }
          }
          result[16].value = this.root.connectionItem.valdiationCheck>0;
          result[17].value = this.root.connectionItem.valdiationCheck>0;

          result[18].value = this.root.drainBagItem.valdiationCheck>0;
          result[19].value = this.root.drainBagItem.valdiationCheck>0;
          this.root.drainBagItem.meshRoot.getChildMeshes().forEach(childmesh => {
          if(childmesh.id.includes("DrainBagPlasticCover"))
                result[20].value = !childmesh.isVisible;
          });
          result[21].value = this.root.drainBagItem.placedPosition == this.root.drainBagItem.trollyPosition;
          for(let i=0;i<this.root.dialysisSolutionObject.length;i++){
              if(this.root.dialysisSolutionObject[i].placedPosition == diasolutionpos4){
                result[22].value = true;
              }
              if(this.root.dialysisSolutionObject[i].placedPosition == diasolutionpos3){
               result[23].value = true;
            }
          }
          result[25].value = this.root.apdmachinePackage.placedPosition == this.root.apdmachinePackage.trollyPosition;
          result[26].value = this.root.scene.getMeshByName("apd_machinetxt_plan").visibility;
          return result;
    }
    countTaskPoints(){
        const r1 = this.level1Result();
        for(let i=0;i<r1.length;i++){
            if(r1[i]){
              this.taskPoint +=TASKPOINT;  
              this.taskDone++;
            }
        }
        const r2 = this.level2Result();
        for(let i=0;i<r2.length;i++){
            if(r2[i]){
                this.taskPoint +=TASKPOINT;  
                this.taskDone++;
            }
        }
        const r3 = this.level3Result();
        for(let i=0;i<r3.length;i++){
            if(r3[i])
                this.taskDone++;
            if(r3[i] && i!==1)
              this.taskPoint++;  
        }
        const r4 = this.level4Result();
        for(let i=0;i<r4.length;i++){
            if(r4[i].value===true)
                this.taskDone++;
            if(r4[i].value===1)
                this.taskDone++;
            if(r4[i].value===2)
                this.taskDone++;
            
           if(i !==9 && i !==10 && i!==12 && i !==13 && i !==24){
            //    console.log("level4Result  "+i);
                if(r4[i].value===true)
                    this.taskPoint +=TASKPOINT;  
                if(r4[i].value===1)
                    this.taskPoint +=TASKPOINT;  
                if(r4[i].value===2)
                    this.taskPoint +=TASKPOINT;  
           }
        }
        if(r4[9].value>0 &&  r4[10].value>0)   
            this.taskPoint +=TASKPOINT;  
        if(r4[12].value>0 &&  r4[13].value>0)   
            this.taskPoint +=TASKPOINT;  

       console.log(r1.length+r2.length+r3.length+r4.length);     
       if(this.taskPoint>TOTAL_POINTS)
             this.taskPoint =TOTAL_POINTS;
        if(this.taskDone>TOTAL_TASK)
            this.taskDone = TOTAL_TASK;
       console.log("!! total points !!"+this.taskPoint+" 222222  "+this.taskDone);     
    }
    checkPhaseComplete(result){
        let isComp = 0;
        for(let i=0;i<result.length;i++){
            if(result[i].value!==undefined){
                if(result[i].value===true)
                   isComp++;
                if(result[i].value>0)
                    isComp++;
            }
            else{
                if(result[i])
                    isComp++;
            }
        }
         if(isComp>=result.length)
            return true;    
         else   
            return false;    
    }
}