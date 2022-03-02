import "./index.css";
import {GameManger} from './scripts/GameManager';
export let gameManager = undefined;
let buildVersion=0.1;
window["startScene"] = startScene;
// window["getVersion"]        = getVersion;
// window["relaeseEngine"]     = relaeseEngine;
function startScene(){
    if(gameManager !== undefined){
        if(gameManager.engine){
            console.log(gameManager.engine);
            relaeseEngine();
        }
    }
    else{
        console.log("!! Fresh!!!");
        gameManager = new GameManger("game");
    }
    if(document.getElementById("start_game")!== null)
        document.getElementById("start_game").style.display = "none";

    document.getElementById("loader_spiner").style.display = "block";
}
function relaeseEngine(){
    console.log("!! 1111relaeseEngine111111 !!!");
    gameManager.engine.dispose();
    gameManager.engine = null;
    gameManager = null;
    gameManager = new GameManger("game");
    console.log("!! 22222relaeseEngine2222 !!!");
}
function getVersion(){
     return "v_"+buildVersion;
}