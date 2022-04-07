const action_time=500;
import { ANIM_TIME,randomNumber } from "../scene/MainScene";
export default class GameTaskManager{
    constructor(root){

        this.root = root;
    }
    completeRoomSetUp(){


        setTimeout(() => {
            this.root.doorObject.closedoor=false;
            this.root.doorObject.openCloseDoor(false);
            console.log(" 111completeRoomSetUp 1111");    
        }, action_time*.2);
        setTimeout(() => {
            this.root.lightswitchObject.isLightOff = false;
            this.root.lightswitchObject.setLight();    
            console.log(" 111completeRoomSetUp 2222");
        }, action_time*4);
        setTimeout(() => {
            this.root.fanswitchobject.isFanOff = true;
            this.root.stopFan();
        }, action_time*.6);
        setTimeout(() => {
            this.root.windowObject.windowClose=false;
            this.root.windowObject.closeWindow();
        }, action_time*.8);
        setTimeout(() => {
            this.root.setAc(false);
        }, action_time);
    }
    completeItemSetUp(){
        setTimeout(() => {
            this.root.bpMachineItem.placeItem(ANIM_TIME*.1);    
        }, action_time*.2);
        setTimeout(() => {
            this.root.ccpdRecordBook.placeItem(ANIM_TIME*.2);    
        }, action_time*.4);
        setTimeout(() => {
            this.root.alcohalItem.placeItem(ANIM_TIME*.3);
        }, action_time*.6);
        setTimeout(() => {
            this.root.connectionItem.placeItem(ANIM_TIME*.4);    
        }, action_time*.8);
        setTimeout(() => {
            this.root.maskItem.placeItem(ANIM_TIME*.5);    
        }, action_time);
        setTimeout(() => {
            this.root.apdmachinePackage.placeItem(ANIM_TIME*.6);    
        }, action_time*1.2);
        setTimeout(() => {
            this.root.drainBagItem.placeItem(ANIM_TIME*.7);
        }, action_time*1.4);
        setTimeout(() => {
            this.root.sanitiserObject[0].placeItem(ANIM_TIME*.8);
        }, action_time*1.6);
        setTimeout(() => {
            this.root.dialysisSolutionObject[0].placeItem(ANIM_TIME*.8);
        }, action_time*1.8);
        setTimeout(() => {
            this.root.dialysisSolutionObject[1].placeItem(ANIM_TIME*.9);
        }, action_time*2);
    }
    completeSelfSetUp(){
        let bpvalue =   randomNumber(85,110);
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
}