import * as GUI from 'babylonjs-gui';
const msg = "Drag the bubbles HERE in the correct 7 - Step Handwashing Sequence";
// https://www.babylonjs-playground.com/#XCPP9Y#134
export default class HandWash{
     constructor(root){
        this.root = root;
        this.handwashIcon=[];
        this.createHeader();
        
     }
     createHeader(){
        this.containter = this.root.gui2D.createRect("handwash_container",1000,600,5,"#ff0000",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,true);
        this.topHeader  = this.root.gui2D.createRect("handwash_header",900,150,5,"#ffffff",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        this.containter.addControl(this.topHeader);
        this.msgtext    = this.root.gui2D.createText("handwash_txt",msg,20,"#000000",GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        this.topHeader.addControl(this.msgtext);
        this.topHeader.topInPixels=40;
        const bubbleLeft = this.root.gui2D.createImage("bubbleleft","ui/handwash/bubble_border.png",128,128,GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        bubbleLeft.isVisible=true;
        bubbleLeft.rotation = BABYLON.Angle.FromDegrees(-90).radians();
        bubbleLeft.topInPixels = -30;
        this.containter.addControl(bubbleLeft);
        const bubbleRight = this.root.gui2D.createImage("bubbleright","ui/handwash/bubble_border.png",128,128,GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,GUI.Control.VERTICAL_ALIGNMENT_TOP,false);
        bubbleRight.isVisible=true;
        bubbleRight.rotation = BABYLON.Angle.FromDegrees(90).radians();
        bubbleRight.topInPixels = 110;
        this.containter.addControl(bubbleRight);
        this.containter.topInPixels =30;
        this.containter.isVisible=false;
     }
     createhandIcon(){

     }
     drawhandWash(isdraw){
        this.containter.isVisible=isdraw;
     }
}