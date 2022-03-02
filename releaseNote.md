===== V
= add flame sensor
	- value / factor distance
= change the frequency of the color sensor as a distance sensor
= configure maximum force the user input, mass body (public values)
= integrate the new shape ( correct dimensions shape, holder fan)
	= delete fan wires (3d asset)
= should add function to fan (run/off) (animation should be not too fast) , using ui button (test purpose)
= make the robot more metallic/shiny (enhance the way of looking)
= Robot force/movment 
	= review how we apply force on the wheels 
	= apply forcs as it is given (user input)
	= the robot doesn't stop , even after stop button

=== V
- integrate the new scene


v1.0
	- add all sensor in carmanager file as a member object
v1.1
	- add light indicator
v1.2
	- add camera follow/unfollow api in wrapper 
	- hide the ui 
	- api for show/hide raycast 
	- add brand name in the border material 
	- add api for turn on/off robot light 6 
	- change distance sensor light cube with sphere

v1.3		
	add startRecording global function in MyRecorder.js
	add stopRecording  global function in MyRecorder.js
v1.4		
	-- wrapper class name  MyRobo.js
	-- createMyRobot()  this function will create the instance of MyRobo class & you can access all the wrapper functions
	-- getleftMotorPower() will return leftmotor power of the robot
	-- getrightMotorPower() will return rightmotor power of the robot
	-- applyRoboEnginesPowers(leftval,rightval) this function  will apply the power to robot
	-- applyRoboEnginesBrake this function apply brake to robot
	-- switchFanAnim(bool) this function will on/off the fan of robot we need to pass boolean value
	-- getColorSensorValue() this function will return left IR sensor value	
	-- getColorSensorValue() this function will return left & right IR sensor value	
	-- getDistanceSenseorValue() this function will return distance sensor value
	-- getRobotPosition() this function will return current position of robot
	-- getRobotVelocity() this function will return current velocity of robot
	-- getAllSensorValue() this function will return all sensor value together
	-- turnOnRobotLight() this function will turn on light of robot
	-- turnOffRobotLight() this function will turn off light of robot
	-- showRayCast() this function will show raycast of the all sensor of robot
	-- hideRayCast()  this function will hide raycast of the all sensor of robot
	-- followCamera() this function will enable the camera for follow the robot 
	-- unfollowCamera() this function will disable the camera for follow the robot
	
v1.5 
	-- EventListener define in  utils.js
	  --- Utils.events.candleDown
	  --- Utils.events.boardDown
	  --- Utils.events.candleRobotCollision
	  --- Utils.events.candleBlowOff
	  --- Utils.events.boardRobotCollision
	  --- Utils.events.changemotor 
      all events are register in the FireFightingScene.js 

v1.6
	 -- scene configuration
	 setCandle(no) this function is set the candle of firefighting scene by passing the number  	//SceneConfig.js
	 setRobotPosition(x,y,z) this function will set the robot position in the  firefighting scene 	//SceneConfig.js

v1.7
	 -- startFireFighting() this function will start babylon with firefighting  scene define in index.js file
	 -- restartFireFightingScene() this function will restart firefighting scene without need to refresh the page
	 -- resizeBabylonEngine() this function will resize the engine rendring with the current width & height of the page
v1.8 
	 -- implement index database to save video blob object  // MyDb.js
	 -- startRecording() will begin the record of the scene  //MyRecorder.js
	 -- stopRecording() will stop the record of the scene & save the video blob object in to indexDB   //MyRecorder.js
	 -- add showVideo() api will show video of the our recorded scene  // video.js

v1.9 -- add boolean variable in the startRecording(isBuffer,isDownload)	for the downloading & buffering
	 -- add config for the frameRate setting in MyRecorder constructor
	 -- add SceneOptimiser api for the keep the scene framerate stable in SceneOptimiser.js  ref link "https://doc.babylonjs.com/divingDeeper/scene/sceneOptimizer"
	 -- add ballon animation after blow off the candel BallonAnim.js

v1.10 -- add showFPS api which return framerate of the current scene 	GameManager.js   
	  -- change starting camera animation from zoom-in to zoom out then change in the rotation 
	  -- solve the exception of indexDB
	  -- correct the collsion of robot wiht board 

v1.11 -- getCandleState() api which return the state of all the candles
	  -- downLoadVideo() api get the videoblob from the indexdatabase & download it into webm format

v1.12 -- add fps variable in StartRecording function (fps,isbuffer,isDownload)  add 3 parameter
	  -- change the name format when download the file in downloadvideo function
	  -- change IR sensor value formula 
	  -- solve the restart scene issue 
v1.13
	 -- solve the candel & board disappear issue
	 -- add the distance sensor with 3 rays file name /helper/DistanceSensorGenerator2.js
	 -- add the world step in the WorldManager function name updateWorld(framerate) pass the current framerate of the scene

v0.1  -- add the api for optimise the scene startOptimiser,stopOptimiser in SceneOptimiser.js
	  -- add the loader spinner for the showing loading of babylon assets, add class in index.css & add spinner div in index.html
	  -- add the track camera api trackCamera("string") "robot"/ "scene" in CarManager.js  	

v0.2  -- add relaeseEngine() in index.js file for the release the babylon engine to launch again successfully.
	  -- add startRenderLoop,stopRenderLoop api for controlling the render
	  -- add removeListner() function in FireFightingScene.js, 	it will remove all custom events when we restart the scene. 

v0.3  -- replace the 3d file Fire_Challenge.glb with scene.glb placed at  models/scene/ folder
	  -- change texture size of firefightingscene carpet size from 1024 to 512 and tile texture from 512 to 256
	  -- now from the code i apply 3d scene material in the LoaderManager .js 
      -- change the method of read texture in ColorSensorGenerator now it will read texture only once during play
	  -- placed the scene texture png file in textures folder

v0.4  -- solve the issue of flame sensor reading the flame after its blow off 


