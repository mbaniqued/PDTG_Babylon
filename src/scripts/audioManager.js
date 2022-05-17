import { Sound } from "babylonjs";
export class AudioManager{
        constructor(root){
            this.root = root;
            this.acSound=null;
            this.windowSlideSound=null;
            this.doorOpenSound=null;
            this.doorCloseSound=null;
            this.cabinetOpen=null;
            this.cabinetClose=null;
            this.drawerSound=null;
            this.pageFlipSound=null;
            this.loadSound();
        }
        loadSound(){
            this.acSound          = new Sound("acremote_sfx", "/sounds/acremote_sfx.mp3", this.root.scene);
            this.windowSlideSound = new Sound("window_slide", "/sounds/window_slide.mp3", this.root.scene);
            this.doorOpenSound    = new Sound("doorOpen2_sfx", "/sounds/doorOpen2_sfx.mp3", this.root.scene);
            this.doorCloseSound   = new Sound("doorClose_sfx", "/sounds/doorClose_sfx.mp3", this.root.scene);
            this.cabinetOpen      = new Sound("cabinet_sfx", "/sounds/cabinet_sfx.mp3", this.root.scene);
            this.cabinetClose     = new Sound("cabinetClose_sfx", "/sounds/cabinetClose_sfx.mp3", this.root.scene);
            this.drawerSound      = new Sound("drawer_sfx", "/sounds/drawer_sfx.mp3", this.root.scene);
            this.pageFlipSound    = new Sound("pageFlip_sfx", "/sounds/pageFlip_sfx.mp3", this.root.scene);
        }
        playSound(sound){
            if(sound && sound.isReady())
                sound.play();
        }
}