import { SceneOptimizerOptions,HardwareScalingOptimization,SceneOptimizer} from "babylonjs"; 
export default class SceneOptimiser{

        constructor(targertframeRate,time,scene){
            try {
                this.options = new SceneOptimizerOptions(targertframeRate,time);
                // BABYLON.SceneOptimizerOptions.LowDegradationAllowed(targertframeRate);
                // BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
                // BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
                this.options.addOptimization(new HardwareScalingOptimization(0,1));
                this.optimizer = new SceneOptimizer(scene,this.options);
                this.optimizer.onSuccessObservable.add(()=> {
                    console.log("optimizer.onSuccessObservable");
                });
                this.optimizer.onNewOptimizationAppliedObservable.add((optim)=> {
                    console.log("optimizer.onNewOptimizationAppliedObservable");
                });
                this.optimizer.onFailureObservable.add( ()=> {
                    console.log("!!! optimizer.onFailureObservable!! "+this.optimizer.currentFrameRate);
                });
                // window["startOptimiser"] = this.startOptimiser.bind(this);
                // window["stopOptimiser"] = this.stopOptimiser.bind(this);
            } catch (error) {
                console.log(error);
            }
           
        }
        startOptimiser(){
            this.optimizer.start();
        } 
        stopOptimiser(){
            this.optimizer.stop();
        } 
}