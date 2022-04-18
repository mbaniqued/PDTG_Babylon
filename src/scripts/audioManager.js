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
            this.acSound          = new BABYLON.Sound("acremote_sfx", "/sounds/acremote_sfx.mp3", this.root.scene);
            this.windowSlideSound = new BABYLON.Sound("window_slide", "/sounds/window_slide.mp3", this.root.scene);
            this.doorOpenSound    = new BABYLON.Sound("doorOpen2_sfx", "/sounds/doorOpen2_sfx.mp3", this.root.scene);
            this.doorCloseSound   = new BABYLON.Sound("doorClose_sfx", "/sounds/doorClose_sfx.mp3", this.root.scene);
            this.cabinetOpen      = new BABYLON.Sound("cabinet_sfx", "/sounds/cabinet_sfx.mp3", this.root.scene);
            this.cabinetClose     = new BABYLON.Sound("cabinetClose_sfx", "/sounds/cabinetClose_sfx.mp3", this.root.scene);
            this.drawerSound      = new BABYLON.Sound("drawer_sfx", "/sounds/drawer_sfx.mp3", this.root.scene);
            this.pageFlipSound    = new BABYLON.Sound("pageFlip_sfx", "/sounds/pageFlip_sfx.mp3", this.root.scene);
        }
        playSound(sound){
            if(sound && sound.isReady())
                sound.play();
        }
}