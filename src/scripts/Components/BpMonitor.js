import { randomNumber } from "../scene/MainScene";
const RANDOMBP=0,LOWBP=1,NORMALBP=2,ELEVATED=3,HBPSTAGE1=4,HBPSTAGE2=5,HTCRISIS=6;
export class BP_Monitior{
    constructor(){
        this.bpCat = NORMALBP;
        this.systolicRange  = 0;
        this.diastolicRange = 0;
        this.pulse =0;
        this.duration=0;
    }
    RandomSystolic(bpCat){
        let systolicRange = 120;
        if (bpCat == LOWBP){
            systolicRange = randomNumber(60, 79);
        }
        else if (bpCat == NORMALBP){
            systolicRange = randomNumber(80, 119);
        }
        else if (bpCat == ELEVATED){
            systolicRange = randomNumber(120, 129);
        }
        else if (bpCat == HBPSTAGE1){
            systolicRange = randomNumber(130, 139);
        }
        else if (bpCat == HBPSTAGE2){

            systolicRange = randomNumber(140, 180);
        }
        else if (bpCat == HTCRISIS){
            systolicRange = randomNumber(181, 200);
        }
        else{
            systolicRange = randomNumber(90, 120);
        }
        return systolicRange;
    }
    RandomDiastolic(bpCat){
        let diastolicRange = 120;
        if (bpCat == LOWBP){
            diastolicRange = randomNumber(50, 59);
        }
        else if (bpCat == NORMALBP){
            diastolicRange = randomNumber(60, 80);
        }
        else if (bpCat == ELEVATED){
            diastolicRange = randomNumber(70, 79);
        }
        else if (bpCat == HBPSTAGE1){
            diastolicRange = randomNumber(80, 89);
        }
        else if (bpCat == HBPSTAGE2){
            diastolicRange = randomNumber(90, 120);
        }
        else if (bpCat == HTCRISIS){
            diastolicRange = randomNumber(120, 140);
        }
        else{
            diastolicRange = randomNumber(60, 80);
        }
        return diastolicRange;
    }
    randomPulse(){
        let pulse = randomNumber(60, 100);
        return pulse;
    }
    getBpRecord(bpCat){
        console.log("getBpRecord"+"    "+bpCat);
         this.systolicRange   = Math.floor(this.RandomSystolic(bpCat));
         this.diastolicRange  = Math.floor(this.RandomDiastolic(bpCat));
         this.pulse           = Math.floor(this.randomPulse());   
         console.log("getBpRecord"+"   222222 "+this.systolicRange+"      "+this.diastolicRange+"      "+this.pulse);
        return [this.systolicRange,this.diastolicRange,this.pulse];
    }
}