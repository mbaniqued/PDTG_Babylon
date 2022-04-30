import * as GUI from 'babylonjs-gui';

export const ROOM_PREPRATION=["Close the Door","Switch on the Lights","Turn-off the Fan","Close the window","Turn off the AC using the remote"];
export const ITEM_PREPRATION=["Place the APD Cassette Package on the table","Place the CCPD Record Book on the table","Place the Drain Bag Package on the table"
,"Place the Alcohal wipe on the table","Place the BP monitor on the table","Place the Connection Shiels on the table","Place the Face Mask on the table","Place the Dialysis Solution on the table"
,"Place the Hand Disinfectant on the table"];
export const SELF_PREPRATION=["Measure your blood pressure using the BP Monitor","Access the CCPD Record Book","Record your BP in the CCPD Record Book","Use a Face Mask"
,"Navigate to the sink,and wash you hands","Dry your hands with the paper towel"]
export const MACHINE_PREPRATION=["Use the alcohol wipes to clean the APD Machine and Rack","Place the hand disinfectant on the APD Rack","Inspect and Validate the APD Cassette Package"
,"Validate Field:APD Cassette Package Expiry Date","Validate Field:APD Cassette Connection Lines","Inspect and validate the selected Dialysis Solutions","Validate Field : Dialysis Solution Concentration"
,"Validate Field : Dialysis Solution Expiration Date","Validate Field : Dialysis Solution Volume","Validate Field : Dialysis Solution Green Frangible Seal"
,"Validate Field : Dialysis Solution Blue Twist Cap","Validate Field : Dialysis Solution Volume","Validate Field : Dialysis Solution Blue Twist Cap","Validate Field : Dialysis Solution Green Frangible Seal"
,"Validate Field : Dialysis Solution Concentration","Validate Field : Dialysis Solution Expiration Date","Inspect and validate the Connection Shield","Validate Field : Connection Shield Expiry Date"
,"Inspect and validate the Drain Bag","Validate Field : Drain Bag Expiry Date","Open the drain bag packaging","Place the Drain Bag on the bottom tray of the APD Rack"
,"Place the Dialysis Solution on top of the APD Machine","Place the Dialysis Solution on top of the APD Rack","Place the hand disinfectant on the APD Rack"
,"Place the APD Cassette Package on top of the APD Rack","Navigate to the APD Machine, and click on the green button to turn-on the device"
,]

const FOCUSCOLOR  = "#50F10042";
const DISABECOLOR = "#D6D6D642";
const GREYCOLOR   = "#84848442";
export class Result{
     constructor(root){
        this.root = root;
        
        this.createRoomResult();
        this.createItemResult();
        this.createSelfResult();
        this.createMachineResult();
     }
     createRoomResult(){
        this.roomPreparation = new GUI.Container("room_container");   
        this.roomPreparation.isVisible =false;
        this.roomTime=undefined;
        this.roomPreparation.isPointerBlocker=true;
        this.roomPreparation.widthInPixels  = 500;
        this.roomPreparation.heightInPixels = 600;
        this.roomPreparation.background = "#BCE6EC";
        this.roomPreparation.paddingLeftInPixels=10;
        
        const container =  this.root.gui2D.resultContainer.getChildByName("allmode_scroll_viewer");
        const container2 = container.getChildByName("scrollcontainer");
        container2.addControl(this.roomPreparation);

        const title = this.root.gui2D.createText("roomtitle","Room Prepration",36,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        title.paddingTopInPixels =5;
        this.roomPreparation.addControl(title);

        const accuracytxt = this.root.gui2D.createText("accuracytitle","Accuracy",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracytxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        accuracytxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracytxt.topInPixels=50;
        this.roomPreparation.addControl(accuracytxt);

        const accuracyresult = this.root.gui2D.createText("accuracyresult","100%",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracyresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        accuracyresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracyresult.topInPixels=70;
        accuracyresult.leftInPixels=-60;
        this.roomPreparation.addControl(accuracyresult);

        const durationtxt = this.root.gui2D.createText("durationtitle","Duration",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationtxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        durationtxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationtxt.topInPixels=50;
        durationtxt.leftInPixels=50;
        this.roomPreparation.addControl(durationtxt);

        const durationresult = this.root.gui2D.createText("durationresult","40s",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        durationresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationresult.topInPixels=70;
        durationresult.leftInPixels=-60;
        this.roomPreparation.addControl(durationresult);

        const contentpanel = new GUI.StackPanel("room_content_container");   
        contentpanel.widthInPixels = this.roomPreparation.widthInPixels;
        contentpanel.heightInPixels = this.roomPreparation.heightInPixels-100;
        contentpanel.background = "#FFFFFF00";
        contentpanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contentpanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contentpanel.topInPixels=130;
        this.roomPreparation.addControl(contentpanel);
         for(let i=0;i<ROOM_PREPRATION.length;i++){
             const resultbar = this.root.gui2D.createResultBar(ROOM_PREPRATION[i],480,80);
             resultbar.paddingTopInPixels = 10;
             contentpanel.addControl(resultbar);
         }
     }
     updateRoomResult(result){
        const containter =this.roomPreparation.getChildByName("room_content_container");
        let taskdone=0;
        for(let i=0;i<ROOM_PREPRATION.length;i++){
            const bar   = containter.children[i];
            const arrow = bar.getChildByName("resultarrow");
            arrow.isVisible = result[i];
            if(result[i])
              taskdone++;
            const cross = bar.getChildByName("cross");
            cross.isVisible = false;
            bar.color = result[i]?FOCUSCOLOR:DISABECOLOR;
            bar.background = result[i]?FOCUSCOLOR:DISABECOLOR;
        }
        const accuracyResult = this.roomPreparation.getChildByName("accuracyresult");
        const accuracy       =  parseInt((taskdone/ROOM_PREPRATION.length)*100);
        accuracyResult.text  = accuracy+"%";
        const durationResult = this.roomPreparation.getChildByName("durationresult");
        let time="";
        if(this.roomTime){
            const finaltime = getTime(this.roomTime);
            const hours     = finaltime[0];
            const minutes   = finaltime[1];
            const seconds   = finaltime[2];
            if(hours>0)
                time = hours+":"+minutes+":"+seconds;
            else if(minutes>0)
                time = minutes+":"+seconds;
             else   
                time = seconds;
        }
        durationResult.text  = this.roomTime=== undefined?"N/A":time+"s";
        this.roomTime = undefined;
     }
     createItemResult(){
        this.itemPreparation = new GUI.Container("item_container");   
        this.itemTime=undefined;
        this.itemPreparation.isVisible = false;
        this.itemPreparation.isPointerBlocker=true;
        this.itemPreparation.widthInPixels  = 500;
        this.itemPreparation.heightInPixels = 600;
        this.itemPreparation.background = "#BCE6EC";
        this.itemPreparation.paddingLeftInPixels=10;
        
        const container =  this.root.gui2D.resultContainer.getChildByName("allmode_scroll_viewer");
        const container2 = container.getChildByName("scrollcontainer");
        container2.addControl(this.itemPreparation);

        const title = this.root.gui2D.createText("roomtitle","Item Prepration",36,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        title.paddingTopInPixels =5;
        this.itemPreparation.addControl(title);

        const accuracytxt = this.root.gui2D.createText("accuracytitle","Accuracy",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracytxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        accuracytxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracytxt.topInPixels=50;
        this.itemPreparation.addControl(accuracytxt);

        const accuracyresult = this.root.gui2D.createText("accuracyresult","100%",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracyresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        accuracyresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracyresult.topInPixels=70;
        accuracyresult.leftInPixels=-60;
        this.itemPreparation.addControl(accuracyresult);

        const durationtxt = this.root.gui2D.createText("durationtitle","Duration",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationtxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        durationtxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationtxt.topInPixels=50;
        durationtxt.leftInPixels=50;
        this.itemPreparation.addControl(durationtxt);

        const durationresult = this.root.gui2D.createText("durationresult","40s",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        durationresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationresult.topInPixels=70;
        durationresult.leftInPixels=-60;
        this.itemPreparation.addControl(durationresult);

        const contentscrollpanel = new GUI.ScrollViewer("item_scroll_container");
        contentscrollpanel.name = "item_scroll_container";
        contentscrollpanel.widthInPixels = this.itemPreparation.widthInPixels;
        contentscrollpanel.heightInPixels = this.itemPreparation.heightInPixels-150;
        contentscrollpanel.paddingLeftInPixels=5;
        contentscrollpanel.topInPixels=130;
        contentscrollpanel.color = "#FFFFFF00";
        contentscrollpanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        const contentpanel = new GUI.StackPanel("item_content_container");   
        contentpanel.name = "item_content_container";
        // contentpanel.widthInPixels = this.itemPreparation.widthInPixels;
        // contentpanel.heightInPixels = this.itemPreparation.heightInPixels-100;
        contentpanel.background = "#FFFFFF00";
        contentpanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contentpanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contentscrollpanel.addControl(contentpanel);
        this.itemPreparation.addControl(contentscrollpanel);
         for(let i=0;i<ITEM_PREPRATION.length;i++){
             const resultbar = this.root.gui2D.createResultBar(ITEM_PREPRATION[i],450,80);
             resultbar.paddingTopInPixels = 10;
             contentpanel.addControl(resultbar);
             resultbar.background = FOCUSCOLOR;
             resultbar.color = FOCUSCOLOR;
         }
     }
     updateItemResult(result){
        const containter  =this.itemPreparation.getChildByName("item_scroll_container");
        const containter1 =containter.getChildByName("item_content_container");
        let taskdone=0;
        for(let i=0;i<ITEM_PREPRATION.length;i++){
            const bar   = containter1.children[i];
            const cross = bar.getChildByName("cross");
            cross.isVisible = false;
            const arrow = bar.getChildByName("resultarrow");
            arrow.isVisible = result[i];
            if(result[i])
               taskdone++;
            bar.color = result[i]?FOCUSCOLOR:DISABECOLOR;
            bar.background = result[i]?FOCUSCOLOR:DISABECOLOR;
        }
        const accuracyResult = this.itemPreparation.getChildByName("accuracyresult");
        const accuracy       =  parseInt((taskdone/ITEM_PREPRATION.length)*100);
        accuracyResult.text  = accuracy+"%";
        const durationResult = this.itemPreparation.getChildByName("durationresult");
        let time="";
        if(this.itemTime){
            const finaltime = getTime(this.itemTime);
            const hours   = finaltime[0];
            const minutes = finaltime[1];
            const seconds = finaltime[2];
            if(hours>0)
                time = hours+":"+minutes+":"+seconds;
            else if(minutes>0)
                time = minutes+":"+seconds;
             else   
                time = seconds;
        }
        durationResult.text  = this.itemTime=== undefined?"N/A":time+"s";
        this.itemTime = undefined;
     }
     createSelfResult(){
        this.selfPreparation = new GUI.Container("self_container");   
        this.selfTime = undefined;
        this.selfPreparation.isVisible=false;
        this.selfPreparation.isPointerBlocker=true;
        this.selfPreparation.widthInPixels  = 500;
        this.selfPreparation.heightInPixels = 600;
        this.selfPreparation.background = "#BCE6EC";
        this.selfPreparation.paddingLeftInPixels=10;
        
        const container =  this.root.gui2D.resultContainer.getChildByName("allmode_scroll_viewer");
        const container2 = container.getChildByName("scrollcontainer");
        container2.addControl(this.selfPreparation);

        const title = this.root.gui2D.createText("selftitle","Self Prepration",36,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        title.paddingTopInPixels =5;
        this.selfPreparation.addControl(title);

        const accuracytxt = this.root.gui2D.createText("accuracytitle","Accuracy",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracytxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        accuracytxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracytxt.topInPixels=50;
        this.selfPreparation.addControl(accuracytxt);

        const accuracyresult = this.root.gui2D.createText("accuracyresult","100%",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracyresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        accuracyresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracyresult.topInPixels=70;
        accuracyresult.leftInPixels=-60;
        this.selfPreparation.addControl(accuracyresult);

        const durationtxt = this.root.gui2D.createText("durationtitle","Duration",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationtxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        durationtxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationtxt.topInPixels=50;
        durationtxt.leftInPixels=50;
        this.selfPreparation.addControl(durationtxt);

        const durationresult = this.root.gui2D.createText("durationresult","40s",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        durationresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationresult.topInPixels=70;
        durationresult.leftInPixels=-60;
        this.selfPreparation.addControl(durationresult);

        const contentpanel = new GUI.StackPanel("self_content_container");   
        contentpanel.widthInPixels = this.selfPreparation.widthInPixels;
        contentpanel.heightInPixels = this.selfPreparation.heightInPixels-100;
        contentpanel.background = "#FFFFFF00";
        contentpanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contentpanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contentpanel.topInPixels=130;
        this.selfPreparation.addControl(contentpanel);
         for(let i=0;i<SELF_PREPRATION.length;i++){
             const resultbar = this.root.gui2D.createResultBar(SELF_PREPRATION[i],480,i===0?80:60);
             resultbar.paddingTopInPixels = 10;
             contentpanel.addControl(resultbar);
         }
     }
     updateselfResult(result){
        const containter =this.selfPreparation.getChildByName("self_content_container");
        let taskdone=0;
        for(let i=0;i<SELF_PREPRATION.length;i++){
            const bar   = containter.children[i];
            const arrow = bar.getChildByName("resultarrow");
            arrow.isVisible = result[i];
            if(result[i])
                taskdone++;
            const cross = bar.getChildByName("cross");
            cross.isVisible = false;
            
            bar.color = result[i]?FOCUSCOLOR:DISABECOLOR;
            bar.background = result[i]?FOCUSCOLOR:DISABECOLOR;
        }
        const accuracyResult = this.selfPreparation.getChildByName("accuracyresult");
        const accuracy       =  parseInt((taskdone/SELF_PREPRATION.length)*100);
        accuracyResult.text  = accuracy+"%";
        const durationResult = this.selfPreparation.getChildByName("durationresult");
        let time="";
        if(this.selfTime){
            const finaltime = getTime(this.selfTime);
            const hours   = finaltime[0];
            const minutes = finaltime[1];
            const seconds = finaltime[2];
            if(hours>0)
                time = hours+":"+minutes+":"+seconds;
            else if(minutes>0)
                time = minutes+":"+seconds;
             else   
                time = seconds;
        }
        durationResult.text  = this.selfTime=== undefined?"N/A":time+"s";
        this.selfTime = undefined;
     }
     createMachineResult(){
        this.machinePreparation = new GUI.Container("machine_container");   
        this.machinePreparation.isVisible = false;
        this.machineTime = undefined;
        this.machinePreparation.isPointerBlocker=true;
        this.machinePreparation.widthInPixels  = 500;
        this.machinePreparation.heightInPixels = 600;
        this.machinePreparation.background = "#BCE6EC";
        this.machinePreparation.paddingLeftInPixels=10;
        
        const container =  this.root.gui2D.resultContainer.getChildByName("allmode_scroll_viewer");
        const container2 = container.getChildByName("scrollcontainer");
        container2.addControl(this.machinePreparation);

        const title = this.root.gui2D.createText("roomtitle","Machine Prepration",36,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        title.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        title.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        title.paddingTopInPixels =5;
        this.machinePreparation.addControl(title);

        const accuracytxt = this.root.gui2D.createText("accuracytitle","Accuracy",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracytxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        accuracytxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracytxt.topInPixels=50;
        this.machinePreparation.addControl(accuracytxt);

        const accuracyresult = this.root.gui2D.createText("accuracyresult","100%",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        accuracyresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        accuracyresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        accuracyresult.topInPixels=70;
        accuracyresult.leftInPixels=-60;
        this.machinePreparation.addControl(accuracyresult);

        const durationtxt = this.root.gui2D.createText("durationtitle","Duration",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationtxt.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        durationtxt.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationtxt.topInPixels=50;
        durationtxt.leftInPixels=50;
        this.machinePreparation.addControl(durationtxt);

        const durationresult = this.root.gui2D.createText("durationresult","40s",24,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,false);
        durationresult.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        durationresult.textVerticalAlignment   = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        durationresult.topInPixels=70;
        durationresult.leftInPixels=-60;
        this.machinePreparation.addControl(durationresult);

        const contentscrollpanel = new GUI.ScrollViewer("machine_scroll_container");
        contentscrollpanel.widthInPixels = this.machinePreparation.widthInPixels;
        contentscrollpanel.heightInPixels = this.machinePreparation.heightInPixels-150;
        contentscrollpanel.paddingLeftInPixels=5;
        contentscrollpanel.topInPixels=130;
        contentscrollpanel.color = "#FFFFFF00";
        contentscrollpanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        const contentpanel = new GUI.StackPanel("machine_content_container");   
        // contentpanel.widthInPixels = this.machinePreparation.widthInPixels;
        // contentpanel.heightInPixels = this.machinePreparation.heightInPixels-100;
        contentpanel.background = "#FFFFFF00";
        contentpanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        contentpanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        contentscrollpanel.addControl(contentpanel);
        this.machinePreparation.addControl(contentscrollpanel);
        const distractors1 = this.root.gui2D.createResultBar("Unnecessary Action :Dialysis Solution-Serial Number",450,80);
        distractors1.name = "distractors1";
        distractors1.paddingTopInPixels = 10;
       //  contentpanel.addControl(distractors1);
        distractors1.background = GREYCOLOR;
        distractors1.color = GREYCOLOR;
        let cross = distractors1.getChildByName("cross");
        cross.isVisible=true;
        let correct = distractors1.getChildByName("resultarrow");
        correct.isVisible=false;
        distractors1.isVisible=false;

        const distractors2 = this.root.gui2D.createResultBar("Unnecessary Action :Dialysis Solution-Serial Type",450,80);
        distractors2.name = "distractors2";
        distractors2.paddingTopInPixels = 10;
       //  contentpanel.addControl(distractors2);
        distractors2.background = GREYCOLOR;
        distractors2.color = GREYCOLOR;
        cross = distractors2.getChildByName("cross");
        cross.isVisible=true;
        correct = distractors2.getChildByName("resultarrow");
        correct.isVisible=false;
        distractors2.isVisible=false;
        let cnt =0;
         for(let i=0;i<MACHINE_PREPRATION.length+2;i++){
             if(i===16){
                contentpanel.addControl(distractors1);
             }
             else if(i===17){
                contentpanel.addControl(distractors2);
             }
             else{
                // console.log(MACHINE_PREPRATION.indexOf("Inspect and validate the Connection Shield"));  
                const resultbar = this.root.gui2D.createResultBar(MACHINE_PREPRATION[cnt],450,80);
                resultbar.paddingTopInPixels = 10;
                contentpanel.addControl(resultbar);
                resultbar.background = FOCUSCOLOR;
                resultbar.color = FOCUSCOLOR;
                cnt++;
             }
         }
     }
     updateMachineResult(result){
        const containter  = this.machinePreparation.getChildByName("machine_scroll_container");
        const containter1 = containter.getChildByName("machine_content_container");
        let taskdone=0;
        console.table(result);
        let count=0;
        for(let i=0;i<MACHINE_PREPRATION.length+2;i++){
             if(i===16){
                const distractors1bar = containter1.getChildByName("distractors1");
                distractors1bar.isVisible=this.root.gameTaskManager.distractors1;
                taskdone--;
             }
             else if(i===17){
                 const distractors2bar = containter1.getChildByName("distractors2")
                 distractors2bar.isVisible=this.root.gameTaskManager.distractors2;
                 taskdone--;
            }
            else{
                const bar   = containter1.children[i];
                const arrow = bar.getChildByName("resultarrow");
                arrow.isVisible=false;
                const cross = bar.getChildByName("cross");
                cross.isVisible=false;
                bar.color = DISABECOLOR;
                bar.background = DISABECOLOR;
                if(result[count].value  === true){
                    arrow.isVisible = true;
                    bar.color       = FOCUSCOLOR;
                    bar.background  = FOCUSCOLOR;
                    taskdone++;
                    // console.log("trueeeeeeeeeeee");
                }
                if(result[count].value===1){
                    arrow.isVisible = true;
                    bar.color       = FOCUSCOLOR;
                    bar.background = FOCUSCOLOR;
                    taskdone++;
                    // console.log("11111111111111111111");
                }
                else if(result[count].value===2){
                    cross.isVisible = true;
                    bar.color = GREYCOLOR;
                    bar.background = GREYCOLOR;
                    taskdone++;
                    // console.log("222222222222");
                }
                count++;
            }
        }
        // const distractors1bar = containter1.getChildByName("distractors1")
        // distractors1bar.isVisible=this.root.gameTaskManager.distractors1;

        // const distractors2bar = containter1.getChildByName("distractors2")
        // distractors2bar.isVisible=this.root.gameTaskManager.distractors2;
        
        // console.log("!! task sone!! "+taskdone+"   "+MACHINE_PREPRATION.length);
        const accuracyResult = this.machinePreparation.getChildByName("accuracyresult");
        const accuracy       =  parseInt((taskdone/MACHINE_PREPRATION.length)*100);
        if(accuracy<0)
            accuracy=0;
        accuracyResult.text  = accuracy+"%";
        const durationResult = this.machinePreparation.getChildByName("durationresult");
        let time="";
        if(this.machineTime){
            const finaltime = getTime(this.machineTime);
            const hours   = finaltime[0];
            const minutes = finaltime[1];
            const seconds = finaltime[2];
            if(hours>0)
                time = hours+":"+minutes+":"+seconds;
            else if(minutes>0)
                time = minutes+":"+seconds;
             else   
                time = seconds;
        }
        durationResult.text  = this.machineTime=== undefined?"N/A":time+"s";
        this.machineTime     = undefined;
     }
     
}
export function getTime(miliseconds){
    const time = Math.floor(miliseconds/1000);
    const sec_num = parseInt(time,10);
    const hours   = Math.floor(sec_num/3600);
    const minutes = Math.floor(sec_num/60)%60;
    const seconds = sec_num%60;
    return [hours,minutes,seconds];
}