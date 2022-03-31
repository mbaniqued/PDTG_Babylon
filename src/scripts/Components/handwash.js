import * as GUI from 'babylonjs-gui';
import { event_objectivecomplete } from '../scene/MainScene';
const msg = "Drag the bubbles HERE in the correct 7 - Step Handwashing Sequence";
// https://www.babylonjs-playground.com/#XCPP9Y#134
// https://playground.babylonjs.com/#XCPP9Y#4718
const iconPos =[[0,-150],[-260,-110],[230,-80],[-109,30],[119,100],[377,60],[-240,165]];
const iconTxt =["Palm to Palm","Between Fingers","Between Fingers","Back of Hands","Back of Fingers","Base of Thumbs","Fingernails","Wrists"];
const endX=-400;
const endY=-392;
const match=["step1","step3","step2","step4","step5","step6","step7"];
export default class HandWash{
     constructor(root){
        this.root = root;
        this.containter = this.root.gui2D.createRect("handwash_container",1280,1080,5,"#ff000000",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,true);
        this.iconContainer = new GUI.Container("icon_container");
        this.handwashIcon=[];
        this.isplaced=[];
        this.createHeader();
        this.containter.addControl(this.iconContainer);
        this.startingPoint = null;
        this.drag = false;
        this.drop = true;
        this.iconStartPos=null;
        this.iconNo=0;
        this.iconStack=[];
        shuffleArray(iconPos);
        for (let i=0;i<iconPos.length;i++){
            this.handwashIcon[i] = this.createhandIcon("step"+(i+1),"ui/handwash/Step"+(i+1)+".png",iconTxt[i],iconPos[i][0],iconPos[i][1]);
            match[i] = "step"+(i+1);
            this.initEvents(i);
            this.isplaced[i] = false;
        }
        this.doneBtn = this.root.gui2D.createRectBtn("dont_btn",128,64,2,"#7EC5DD",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER,"Done","#000000",24,false);
        this.containter.addControl(this.doneBtn);

        
        this.doneBtn.isVisible=false;
        this.doneBtn.onPointerUpObservable.add(()=>{
            this.containter.isVisible=false;
            this.root.gui2D.advancedTexture.renderAtIdealSize = false;
            let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this.root.handSoapObject,level:2,msg:"wash_hands"}});
            document.dispatchEvent(custom_event);
        });
      }
     createHeader(){
        
        this.topHeader  = this.root.gui2D.createRect("handwash_header",1000,200,5,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        this.topHeader.isPointerBlocker=false;
        this.containter.addControl(this.topHeader);
        this.msgtext    = this.root.gui2D.createText("handwash_txt",msg,20,"#000000",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        this.topHeader.addControl(this.msgtext);
        this.topHeader.topInPixels=40;
        const bubbleLeft = this.root.gui2D.createImage("bubbleleft","ui/handwash/bubble_border.png",156,156,GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        bubbleLeft.isVisible=true;
        bubbleLeft.rotation = BABYLON.Angle.FromDegrees(-90).radians();
        bubbleLeft.topInPixels  = -20;
        bubbleLeft.leftInPixels =  70;
        this.containter.addControl(bubbleLeft);
        const bubbleRight = this.root.gui2D.createImage("bubbleright","ui/handwash/bubble_border.png",156,156,GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        bubbleRight.isVisible=true;
        bubbleRight.rotation = BABYLON.Angle.FromDegrees(90).radians();
        bubbleRight.topInPixels  = 150;
        bubbleRight.leftInPixels = -70;
        this.containter.addControl(bubbleRight);
        this.containter.topInPixels =30;
        this.containter.isVisible=true;
     }
     createhandIcon(name,path,msg,xpos,ypos){
         const width  =100;
         const height =100; 
         const iconcontainer = this.root.gui2D.createCircle(name,width+50,height+35,"#ffffff00",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_CENTER);
         const handicon    = this.root.gui2D.createImage("bubbleleft",path,width,height,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
         handicon.isVisible=true;
         handicon.isPointerBlocker=false;
         const bubbleicon  = this.root.gui2D.createImage("bubbleleft","ui/handwash/bubblev2.png",width,height,GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
         bubbleicon.isVisible=true;
         bubbleicon.alpha=.5;
         bubbleicon.isPointerBlocker=false;
         const msgtext    = this.root.gui2D.createText(msg,msg,12,"#000000",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,false);
         msgtext.textHorizontalAlignment  = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
         msgtext.textVerticalAlignment    = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
         msgtext.topInPixels -=10;
         iconcontainer.addControl(handicon);
         iconcontainer.addControl(bubbleicon);
         iconcontainer.addControl(msgtext);
         iconcontainer.isPointerBlocker=false;
         iconcontainer.isVisible=true;
         iconcontainer.leftInPixels = xpos;
         iconcontainer.topInPixels  = ypos;
         this.iconContainer.addControl(iconcontainer);
         return iconcontainer;
      
     }
     drawhandWash(isdraw){
        this.containter.isVisible=isdraw;
        if(isdraw){
         this.root.gui2D.resetCamBtn.isVisible = true;
         this.root.gui2D.resetCamBtn.zIndex =100;
        }
        else
            this.root.gui2D.resetCamBtn.zIndex =0;



     }
    
     initEvents(i){
        
         this.handwashIcon[i].onPointerDownObservable.add((coordinates)=> {
            this.iconNo=i;
            this.startingPoint    = new BABYLON.Vector2(coordinates.x, coordinates.y);
            this.iconStartPos     = new BABYLON.Vector2(this.handwashIcon[i].leftInPixels,this.handwashIcon[i].topInPixels);
            this.drag = true;
            this.drop = false;
            
            console.log("!! down!!! "+this.startingPoint+"   "+this.iconNo);
         });
         this.handwashIcon[i].onPointerUpObservable.add((coordinates)=> {
            this.drag = false;
            this.drop = true; 
            this.startingPoint = null;
            // console.log(this.iconNo+"  22222  "+this.handwashIcon[i].leftInPixels+"     222222 "+this.handwashIcon[i].topInPixels);
            if(this.handwashIcon[i].leftInPixels>-485 && this.handwashIcon[i].topInPixels<-282 && this.handwashIcon[i].leftInPixels<485){
               if(!this.isplaced[i]){
                  this.iconStack.push(this.handwashIcon[this.iconNo]);
                  this.isplaced[i] = true;
               }
               this.updateStack();
               
            }
            else{
                  if(this.isplaced[this.iconNo]){
                     this.remove();
                     this.updateStack();
                     console.log(this.iconStack.length+"     33333333333  "+i);
                     this.isplaced[this.iconNo] = false;
                  }
                this.isplaced[this.iconNo] = false;
                this.handwashIcon[this.iconNo].leftInPixels = iconPos[i][0];
                this.handwashIcon[this.iconNo].topInPixels = iconPos[i][1];
             }
             this.msgtext.isVisible = this.iconStack.length<1;
         });
         const onMove = (coordinates)=>{
            if (!this.startingPoint)
                  return;
               if (this.drag == true && this.drop == false) {
                  let diff = this.startingPoint.subtract(new BABYLON.Vector2(coordinates.x, coordinates.y));
                  this.handwashIcon[this.iconNo].leftInPixels =   this.iconStartPos.x-diff.x;
                  this.handwashIcon[this.iconNo].topInPixels  =   this.iconStartPos.y-diff.y;
               }
         }
         
         this.handwashIcon[i].onPointerMoveObservable.add(onMove); 
         this.iconContainer.onPointerMoveObservable.add(onMove); 
     }
     createStakPanel(){
         this.stackPanel    =  new GUI.StackPanel();    
         this.stackPanel.widthInPixels = this.topHeader.widthInPixels;
         this.stackPanel.heightInPixels = this.topHeader.heightInPixels;
         this.stackPanel.horizontalAlignment =  GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
         this.stackPanel.verticalAlignment   =  GUI.Control.VERTICAL_ALIGNMENT_TOP;
         this.stackPanel.background = "#FFFF00";
         this.stackPanel.topInPixels=40;
         this.stackPanel.isPointerBlocker=true;
         this.stackPanel.isVertical=false;
         this.iconContainer.addControl(this.stackPanel);
     }
     remove(){
        for(let i=0;i<this.iconStack.length;i++){
            if(this.iconStack[i] === this.handwashIcon[this.iconNo]){
               this.iconStack.splice(i,1);
            }
        }
     }
     updateStack(){
         for(let i=0;i<this.iconStack.length;i++){
            this.iconStack[i].leftInPixels =  endX+i*135;  
            this.iconStack[i].topInPixels  = endY;
            console.log(this.iconStack[i].name);
         }
         if(this.iconStack.length>=this.handwashIcon.length){
            let allcorrect=false;
            for(let i=0;i<this.iconStack.length;i++){
               if(match[i] === this.iconStack[i].name)
                  allcorrect = true;
               else   
                  allcorrect = false;
            }
            if(allcorrect){
               this.doneBtn.isVisible=true;
               let custom_event = new CustomEvent(event_objectivecomplete,{detail:{object_type:this,level:2,msg:"handwash_complete"}});
               document.dispatchEvent(custom_event);
            }
         }
     }
     reset(){
         this.doneBtn.isVisible=false;
         this.iconStack=[];
         this.iconStartPos=null;
         this.iconNo=0;
         shuffleArray(iconPos);
         for (let i=0;i<iconPos.length;i++){
               this.handwashIcon[i].leftInPixels = iconPos[i][0];
               this.handwashIcon[i].topInPixels   =iconPos[i][1];
               match[i] = "step"+(i+1);
               this.isplaced[i] = false;
         }
         this.root.gui2D.advancedTexture.renderAtIdealSize = true;
     }
    
}
function shuffleArray(arr) {
   for (let i = arr.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   // console.log(arr);
 }
function CircRectsOverlap(CRX, CRY, CRDX, CRDY, centerX, centerY, radius) {
	if ((Math.abs(centerX - CRX) <= (CRDX + radius)) && (Math.abs(centerY - CRY) <= (CRDY + radius)))
		return true;

	return false;
}