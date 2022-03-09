import { ObjectState,ANIM_TIME } from "../scene/Basic";
import TWEEN from "@tweenjs/tween.js";

export default class Table{

    constructor(root,meshobject,pos){
        this.name         = meshobject.name;
        this.root         = root;
        this.meshRoot     = meshobject;
        this.position     = pos;
        this.isdrawerOpen = false;
        this.drawerAnim   = false;
        this.state=0;
        this.setPos();
        // this.mesh = new BABYLON.TransformNode();
        this.initMeshOutline();
        this.meshRoot.getChildMeshes().forEach(childmesh => {
            if(childmesh)
                this.addAction(childmesh);
        });
    }
    setPos(){
        this.meshRoot.position.set(this.position.x,this.position.y,this.position.z);
    }
    addAction(mesh){
        mesh.actionManager = new BABYLON.ActionManager(this.root.scene);
        mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,(object)=> {
                    console.log(this.root.gamestate.state);
                    if(this.state>0 && this.root.gamestate.state === ObjectState.default)
                            this.state =0;
                    if(this.root.gamestate.state === ObjectState.default){
                        if(mesh.name==="table3"){
                            new TWEEN.Tween(this.root.camera).to({alpha:BABYLON.Angle.FromDegrees(270).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {
                                this.root.gamestate.state  =  ObjectState.focus;
                                this.state=1;
                                this.setDrawerBorder(1);
                            }).start();
                            new TWEEN.Tween(this.root.camera).to({beta:BABYLON.Angle.FromDegrees(50).radians()},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            new TWEEN.Tween(this.root).to({radius:2.5},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onComplete(() => {}).start();
                            this.root.setFocusOnObject(new BABYLON.Vector3(this.meshRoot.position.x,this.meshRoot.position.y,this.meshRoot.position.z-.5));
                        }
                    }
                    else if(this.state===1 && (this.root.gamestate.state === ObjectState.focus || this.root.gamestate.state === ObjectState.active)){
                        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                                if(childnode.name==="tabledrawer"){
                                    this.root.gamestate.state = ObjectState.active;
                                    let drawerNode = childnode;  
                                    if(!this.drawerAnim){
                                        console.log("!!! in drawer!!!");
                                        this.isdrawerOpen =!this.isdrawerOpen;
                                        let val = this.isdrawerOpen?-120:120; 
                                        this.root.setFocusOnObject(new BABYLON.Vector3(drawerNode.absolutePosition.x,drawerNode.absolutePosition.y+1,drawerNode.absolutePosition.z+(this.isdrawerOpen?-2:0)));
                                        new TWEEN.Tween(drawerNode.position).to({y:drawerNode.position.y+val},ANIM_TIME).easing(TWEEN.Easing.Linear.None).onUpdate(()=>{
                                            this.drawerAnim = true;
                                        }).onComplete(() => {
                                            this.drawerAnim = false;   
                                            if(!this.isdrawerOpen){
                                                this.reset();
                                            }
                                        }).start();
                                    }
                                }
                            
                        });
                    }
                }
             )
         )
    }
    reset(){
        this.state=0;
        this.isdrawerOpen = false;
        this.drawerAnim   = false;
        this.root.gamestate.state = ObjectState.default;
        this.setDrawerBorder(-1);
        // this.root.setCameraTarget();
    }
    initMeshOutline(){
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
                if(childnode.name.includes("tablenode")){
                    childnode.getChildMeshes().forEach(childmesh=>{
                        this.root.loaderManager.setPickable(childmesh,1); 
                    });
                }
                this.setDrawerBorder(-1);
        });
    }
    setDrawerBorder(value){
        this.meshRoot.getChildTransformNodes().forEach(childnode=>{
            if(childnode.name.includes("tabledrawer")){
                childnode.getChildMeshes().forEach(childmesh=>{
                    this.root.loaderManager.setPickable(childmesh,value); 
                });
            }
        });
    }
}