=========================== PDTG============================
Development Enviroment 
Html,javascript
.Framework -> BABYLON.JS, Version 4.2 //https://www.babylonjs.com/

Installation
.npm is required to install the dependency of the project
>>npm i.
>>npm run start  This command will run the project on local host.

Production 
>> npm run build
>> bundle.js file will be created in /dist/ directive 			
Project Structure 
	index.htnl 
	--- canvas & progress circle is created in the file
 directive :src/scripts/
	.List of classes
		1 index.js			
			1. This is the entry point of the application. key function is startScene() which is called in the index.html file to start the scene
		2 SceneOptimiser.js
			1. This class can be used  for the optimize the scene  // refer the link for more details https://doc.babylonjs.com/divingDeeper/scene/sceneOptimizer      
		3 SceneManager.js 
			1. This class is used for the multiple scene state, we have only one scene.  
		4 LoaderManager.js
			1. This is class is responsible for the load all the 3d glb models,it contains the loading progress & loading finish.
			2. how to load file, this.assetsManager.addMeshTask("room_reference","","models/","roomscene.glb");   
		5 gui.js			
			1. This is the class for the 2d UI,load 2D image,create rectangle,circles & text are implemented in that class 
				key fuctions ---
					1. initUi()
					2. initMainMenu()
					3. drawMainMenu()
					4. initStageMenu()
					5. drawStageMenu()
					6. initRadialMenu()
					7. drawRadialMenu()
					8. initObjectiveMenu()
					9. drawObjectiveMenu()
					8. initResultShowMenu()
					9. drawResultShowMenu()

		6 GameManager.js	
			1. This class create the BABYLON Engine instance, it is render the our scene & handle the resize of scene
		7 Enviroment.js
			2. This class create the instance of BABYLON scene,BABYLON camera,BABYLON lights.
		8 audioManager.js
			3. This class load the audio effects & play that effects. 

GameComponent classes
	directive :src/scripts/Components/
	1. acremote.js 	
		1. Interaction with the AC-Remote & its functionality implemented in that class
	2. alcohalwipe.js
		1. This is responsible for alocohal-wipe  cleaning Functionality 
	3. BpMonitor.js
		1. This class is giving the BP monitor value 
	4. cabinet.js
		1. Interaction with cabinet & cabinet door animations implemented in that class,
		key functions
			1. openCloseDoor()
			2. doorAnimation()    
	5. cabinetitem.js    	
		1. This class is used for the interaction with Dialysis solution & HandSanitizer.
		2. All the functionality of the dialysis solution & HandSanitizer like drag,drop,validation is implemented in that class.    
	6. doorobject.js
		1. Interaction with door and animations is implemented in that class.
	7. fanswitch.js      	
		1. Interaction with fan witch to turn on-off fan is implemented in that class.
		 key functions -- 
			1. startFan()
			2. stopFan();
	8. GameTaskManager.js 	
		1. This class performs the game task like
			 1. Room setup.
			 2. Item setup.
			 3. Self setup 
			 4. Check the result of levels,calculate the points for the pratice mode & assessment mode.
		key functions --
			1. completeRoomSetUp()
			2. completeItemSetUp()
			3. completeSelfSetUp()
			4. setPracticeMode()
	9. handwash.js
			1. In that class all the 7 bubble are created with drag & drop functionality.
		key functions --
			1. createhandIcon()
			2. updateStack()
			3. drawhandWash(). 
	10. item.js
			1. This is main class for the interaction with all the table items like 
				1. Bp Machine
				2. Connection Shield
				3. Alcohal Wipe
				4. Mask
				5. Drain Bag
				6. CCPD Record Book
				7. APD Machine
			All items functionality like interaction, drag,drop,validation,inspections,use are implemented in that class.
				key Functions --
					1. usebpMachine()
					2. useccpdRecordBook()
					3. useccpdRecordBook()
					4. useMask()
					5. showItem()
					6. resetItem()
					7. updateoutLine()
	11. lightswitch.js
			1. Interaction with light switch to turn light On/Off is implemented in that class.
	11. result.js
			1. This class is create the UI of the practice & assessment mode result screen.
	12. sinkitem.js
			1. Interaction with the sink area object Paper towel & Hand Soap, all functionality of that objects are implemented in that class.  	
	12. table.js
			1. Interaction with the table & table drawer animation is implemented in that class.
	13. trolly.js
			1. Interaction with the APD Machine & Apd trolly is implemented in that class.
	14. windowframe.js
			1. Interaction with the window & animation of window is implemented in that class.

MainRoot Class
.directive :src/scripts/scene/
 	MainScene.js				
		1. THis is parent class for our all objects,all the objects variable & its instance are initialize in that class.
		2. Using the instance of that MainScene class we can access all other objects property & functions.
			Key Functions
			 1. initScene(), (all the objects instance are created in that functions).
			 2. objectiveListner(), (this function get the record of the objects activity like fan on/off, objects placed on the tables,AC On/Off ).
			 3. resetScene(), (this function reset all the objects & instance for prepare the different different modes).
			 4. createapdmachineText(), (it creates the apd machine text over the APD machine).
			 5. createconnectionItemValidation(), (it creates the validation date text & correct or wrong symbol).
			 6.	createdrainBagValidation(),  (it creates the validation date text & correct or wrong symbol).
			 7. createApdPackageValidatiion(), (it creates the validation date text & correct or wrong symbol).
			 8. createBpText(), (it creates 3 BP Machine values text ).
			 9. setCameraTarget(), (this function set the default camera view ).
			 10. setCameraAnim(), (this is the function to animate camera angle to focus the object).
			 11. setFocusOnObject(), (this is the function to animate the camera position to focus the object).
			 12. startFan(), (it start the fan animation).
			 13. initacParticle() (this function initialize the AC particle animation).
		 	 14. setGame(),  (this function is called to start the game in different mode).
			 15. handleUI(), (pointer events of backbutton,backmenu,submit button is handle in that function).
			 16. enterScene(), (this function is called after loading page to enter the room ).
			 17. startGame(), (this function set the trainig mode objectives & practice/ assessment mode).
		 	 18. checkObjectiveTraining(), (this function check the training mode objective completion).
			 19. createccpdCanvas(), (this function create the input fields & title for the CCPD record book).
			 20. updateResult(), (this function get the record for practice mode & assessment mode result based on user activity).


	Events Of Objects interaction								
	1. BABYLON.ActionManager.OnPointerOverTrigger (this event occurs when out pointer comes over the mesh).
	2. BABYLON.ActionManager.OnPointerOutTrigger  (this event occurs when out pointer goes out from the mesh).
	3. BABYLON.ActionManager.OnPickTrigger	(this event occurs when pointer over the mesh & user click on the mesh).

Table & Cabinet Objects functions property
	constructor(name,root,meshobject,pos,placedpos,rotation)
		1. this is the constructor prototype with parameters like 
		2. name, paas the name of the object according to type of the object  
		3. root, this is the mainscene class instance;
		4. meshobject, this is the 3d mesh object which we load from loadmanager class
		5. pos,position of the meshobject
		6. placedpos, this is the table top place position of the object
		7. rotation, this is rotation value of object when place on the top of table
initDrag()
		1. it initialize the drag event of the objects
		2 DragObservableEvents
			1. onDragStartObservable when drag start
			2. onDragObservable when object is dragging
			3. onDragEndObservable when drag end
initAction()
		1.initialize the object interaction events 
			1. OnPointerOverTrigger
			2. OnPickTrigger		
			3. OnPointerOutTrigger

								