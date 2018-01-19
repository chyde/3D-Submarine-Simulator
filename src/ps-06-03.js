////////////////////////////////////////////////////////////////////////////////
// Add a directional light
////////////////////////////////////////////////////////////////////////////////

/*global THREE, Coordinates, document, window*/

var camera, subCam, scene, renderer, effectController;
var cameraControls, axes;
var canvasWidth, canvasHeight;
// TODO: Swap out these values for good ones
//var clock = new THREE.Clock();
var gridX = true;
var gridY = false;
var gridZ = false;
var axes = true;
var ground = true;
var arm, forearm, body, handLeft, handRight;

var forwardThurst, turnThrust, diveThrust;


var clock = new THREE.Clock();

function init() {
   // From fillScene.js (Taken out to modularize)
   //fillScene();

	//var canvasWidth = 1000;
	//var canvasHeight = 494;
	// For grading the window is fixed in size; here's general code:
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0x48A8D8, 1.0 );

	// CAMERAS
	camera = new THREE.PerspectiveCamera( 35, canvasWidth/ canvasHeight, 1, 10000 );
	camera.position.set( -1160, 350, -600 );
   
   subCam = new THREE.PerspectiveCamera( 35, canvasWidth/ canvasHeight, 1, 10000 );
   //subCam = new THREE.PerspectiveCamera( 45, canvasWidth / canvasHeight, 1, 7000 );
	subCam.position.set( 0, 0, 0 );
	subCam.lookAt( new THREE.Vector3( 100, 0, 0 ) );

	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,310,0);
   
   //OPTIONS
   axes = false;
   
   
   //ANIMATION
   //robosub.animated = props;

}

function drawHelpers() {
	Coordinates.drawGround({size:10000});
	Coordinates.drawGrid({size:10000,scale:0.01});
   if (axes){
      Coordinates.drawAllAxes({axisLength:200,axisRadius:1,axisTess:50});
   }
}

function addToDOM() {
	var container = document.getElementById('container');
	var canvas = container.getElementsByTagName('canvas');
	if (canvas.length>0) {
		container.removeChild(canvas[0]);
	}
	container.appendChild( renderer.domElement );
}

function setupGui() {

	effectController = {
		newAxes: axes,

      forwardThrust: 15,
      turnThrust: 5,
      diveThrust: 0.0
	};

	var gui = new dat.GUI();
	
	var h = gui.addFolder("Thrust Controls");
   h.add(effectController, "forwardThrust", -100, 100, 1).name("Forward Thrust %");
   h.add(effectController, "turnThrust", -100, 100, 1).name("Turning Thrust %");
   h.add(effectController, "diveThrust", -100, 100, 1).name("Diving Thrust %");
}
function handleMovement(delta)
{
   robosub.rotation.y += -delta * effectController.turnThrust * Math.PI/180;
   //Rotation before and after movement makes a difference!
   robosub.position.x += Math.cos(robosub.rotation.y) * delta * effectController.forwardThrust*5;
   robosub.position.z += -Math.sin(robosub.rotation.y) * delta * effectController.forwardThrust*5;
   
   
   robosub.position.y += delta * effectController.diveThrust;

}

var subCamTarget = new THREE.Vector3();
function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
   
   handleMovement(delta);
   
   renderer.enableScissorTest( false );
	renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
	renderer.clear();
	renderer.render( scene, camera );
	
	// Student: set rearCam so it's pointing in the opposite direction than the camera
	//rearTarget.subVectors(camera.position, cameraControls.target);
   // rearTarget.add(camera.position);
	subCam.position.copy(robosub.position);
   subCam.rotation.copy(robosub.rotation);
   subCam.rotation.y += -90 * Math.PI/180;
   subCam.position.y += 30;
    // rearview render
	renderer.enableScissorTest( true );
	// setScissor could be set just once in this particular case,
	// since it never changes, and then just enabled/disabled
	renderer.setScissor( 0, 0.6 * canvasHeight,
		0.4 * canvasWidth, 0.4 * canvasHeight );
	renderer.setViewport( 0, 0.6 * canvasHeight,
		0.4 * canvasWidth, 0.4 * canvasHeight );
	renderer.clear();
	renderer.render( scene, subCam );	
}

function animate() {
	window.requestAnimationFrame(animate);
	render();
}


try {
	init();
	fillScene();
	drawHelpers();
	addToDOM();
   setupGui();
	animate();
} catch(e) {
	var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
	$('#container').append(errorReport+e);
}
