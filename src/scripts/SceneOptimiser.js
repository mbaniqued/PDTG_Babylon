export default class SceneOptimiser{

        constructor(targertframeRate,time,scene){
            this.options = new BABYLON.SceneOptimizerOptions(targertframeRate,time);
            BABYLON.SceneOptimizerOptions.LowDegradationAllowed();
            BABYLON.SceneOptimizerOptions.ModerateDegradationAllowed();
            BABYLON.SceneOptimizerOptions.HighDegradationAllowed();
            this.options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1.5));
            this.optimizer = new BABYLON.SceneOptimizer(scene,this.options);
            this.optimizer.onSuccessObservable.add(function () {
                console.log("optimizer.onSuccessObservable");
            });
            this.optimizer.onNewOptimizationAppliedObservable.add(function (optim) {
                console.log("optimizer.onNewOptimizationAppliedObservable");
            });
            this.optimizer.onFailureObservable.add(function () {
                console.log("optimizer.onFailureObservable");
            });
            window["startOptimiser"] = this.startOptimiser.bind(this);
            window["stopOptimiser"] = this.stopOptimiser.bind(this);
        }
        startOptimiser(){
            this.optimizer.start();
        } 
        stopOptimiser(){
            this.optimizer.stop();
        } 
}