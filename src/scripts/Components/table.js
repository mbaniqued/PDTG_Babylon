import { GameState,ANIM_TIME,rotateState } from "../scene/MainScene";
import TWEEN from "@tweenjs/tween.js";

export default class Table{

    constructor(root,meshobject,pos){
        this.name         = meshobject.name;
        this.root         = root;
        this.meshRoot     = meshobject;
        this.position     = pos;
        this.isdrawerOpen = false;
        this.drawerAnim   = false;
        this.drawerNode   = undefined;
        this.state=0;
        this.setPos();
        this.setDrawer();
        // this.mesh = new BABYLON.TransformNode();
        
        this.initAction();
        this.label = this.root.gui2D.createRectLabel(this.name,160,36,10,"#FFFFFF",this.meshRoot,0,-20);
        this.label._children[0].text = "Drawer";
        this.label.isVisible=false;
        this.label.isPointerBlocker=true;
    }
    setPos(){
        this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
    }
    removeAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(childmesh.name.includes("table")){
                this.root.removeRegisterAction(childmesh);
            }
            this.updateoutLine(childmesh,false);
        });
        
    }
    initAction(){
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(!childmesh.actionManager){
                if(childmesh.name.includes("table"))
                    this.addAction(childmesh);
                childmesh.isPickable = true;
            }
        });
    }
    addTableAction(){
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
            if(childnode.name==="tablenode"){
                    childnode.getChildMeshes().forEach(childmesh => {
                        if(childmesh.name.includes("table")){
                            this.addAction(childmesh);
                        }
                });
            }
        });
    }
    addAction(mesh){
                mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (object)=> {
                    if(rotateState.value ===1)
                        return;
                    this.setLabel();
                    if(this.root.gamestate.state === GameState.inspect)
                        this.updateoutLine(mesh,false);
                    else
                        this.updateoutLine(mesh,true);                        

                    
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (object)=> {
                       this.label.isVisible=false;
                       this.updateoutLine(mesh,false);
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, (object)=> {
                    if(rotateState.value ===1)
                        return;
                    this.setLabel();
                    this.updateoutLine(mesh,true);
                    this.root.scene.onPointerUp=()=>{
                        this.label.isVisible=false;
                        this.updateoutLine(mesh,false);
                    }
                }))
                mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,(object)=> {

                    console.log(rotateState.value+"     "+this.root.gamestate.state+"    "+this.root.camera.radius+"  "+this.root.scene.postProcessesEnabled);
                    if(rotateState.value ===1 || this.root.gamestate.state === GameState.radial || this.root.gamestate.state === GameState.inspect)
                        return;
                    this.updateoutLine(mesh,false);
                    if(this.root.camera.radius>2.5 || (this.root.camera.target.x != this.meshRoot.position.x && this.root.camera.target.y != this.meshRoot.position.y)){
                        if(this.isdrawerOpen)
                            this.state=10;
                        else    
                            this.state=0;
                        this.root.setCameraAnim(isPositive?270:-90,270,45,2.5);
                    }
                    switch(this.state){
                        case 0:
                                this.root.gamestate.state = GameState.default;
                                this.setTableFocusAnim();
                                this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z-.5));
                            break;
                        case 1:
                                if(mesh.parent.name.includes("tabledrawer")){
                                    this.setDrawerAnim();
                                }
                            break;    
                        case 10:
                                this.setTableFocusAnim();
                                this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                                 if(childnode.name==="tabledrawer"){
                                        let drawerNode  = childnode;  
                                        this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.isdrawerOpen?drawerNode.absolutePosition.z-.25:this.meshRoot.position.z-.5));
                                    }
                                });
                                this.root.gamestate.state = GameState.active;
                                this.root.showResetViewButton(true);
                            break;
                    }        
                    this.setLabel();    
                }
                
             )
         )
    }
    setTableFocusAnim(){
        let isPositive =true;
        if(this.root.camera.alpha<BABYLON.Angle.FromDegrees(45).radians())
            isPositive = false;
        // console.log("!! setTableFocusAnim!!! "+isPositive);
        this.root.gamestate.state  =  GameState.focus;
        this.state=1;
        this.root.setCameraAnim(isPositive?270:-90,270,45,2.5);
    }
    setDrawerAnim(){
        this.root.gamestate.state = GameState.active;
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
            if(childnode.name==="tabledrawer"){
                let drawerNode = childnode;  
                if(!this.drawerAnim){
                    // console.log("!!! in drawer!!!");
                    if(this.state===1)
                        this.isdrawerOpen =!this.isdrawerOpen;

                    this.root.audioManager.playSound(this.root.audioManager.drawerSound);
                    let val = this.isdrawerOpen?-120:120; 
                    this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.isdrawerOpen?drawerNode.absolutePosition.z-1.5:this.meshRoot.position.z-.5));
                    // this.root.setFocusOnObject(new BABYLON.Vector3(drawerNode.absolutePosition.x,drawerNode.absolutePosition.y+1,drawerNode.absolutePosition.z+(this.isdrawerOpen?-2:0)));
                    new TWEEN.Tween(drawerNode.position).to({y:drawerNode.position.y+val},ANIM_TIME).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(()=>{
                        this.drawerAnim = true;
                    }).onComplete(() => {
                        this.drawerAnim = false;   
                        if(!this.isdrawerOpen){
                            this.label.isVisible=false;
                        }
                    }).start();
                }
            }
        });
    }
    setDrawer(){
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
            if(childnode.name==="tabledrawer"){
                    let drawerNode = childnode;  
                    drawerNode.position.y =0;
                    this.drawerNode = drawerNode;
            }
        });
    }
    setLabel(){
        if(this.root.camera.radius>2.5)
            this.label._children[0].text = "Table";
         else   
            this.label._children[0].text = this.isdrawerOpen?"Close Drawer":"Open Drawer";
        this.label.isVisible=this.root.gamestate.state == GameState.active && this.root.gamestate.state === GameState.default;
        if(this.root.level===3)
            this.label.isVisible=false;  
    }
    updateoutLine(mesh,value){
            if((mesh.parent.name ==="tableknob"|| mesh.parent.name ==="tabledrawer") && this.root.camera.radius>=3){
                mesh.renderOutline = false;
            }
            else
                mesh.renderOutline = value;
    }
}