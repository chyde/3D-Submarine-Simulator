//Global Variables to deal with the sub
var robosub, hull, frame, propellor, props, propMaterial, propMaterials;
/* This is where the geometry of our sub is simulated.
 * We construct a Object3D containing our lovely sub.
 * NOTE: the Global variables
 */


function fillScene() {
   var VIEW_BIRD = false;
   var sphere, cylinder, cube;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x48A8D8, 0.0003 );

	// LIGHTS
   // COMMENTED OUT FOR SAFETY //addLighting(scene);
   
   //AMBIENT LIGHT
   scene.add( new THREE.AmbientLight( 0x111111 ) );

   //DIRECTIONAL LIGHT
   var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
   directionalLight.position.set( 0.1, 1, 0.1 );
   scene.add( directionalLight );
   
   // some objects
	var x,z;
	
	for ( x = -4500; x <= 4500; x += 1000 ) {
		for ( z = -4500; z <= 4500; z += 1000 ) {
			var coneMaterial = new THREE.MeshLambertMaterial();
			// color wheel
			var coneDistance = Math.sqrt( x*x + z*z );
			// convert from angle to value in 2*PI range
			var colorHue = Math.acos( x / coneDistance );
			if ( z > 0 )
			{
				colorHue = Math.PI*2 - colorHue;
			}
			var colorSat = 1 - (coneDistance / 6364);
			coneMaterial.color.setHSL((colorHue+1)/(Math.PI*2), colorSat, 0.6 );
			coneMaterial.ambient.copy( coneMaterial.color );
			var cone = new THREE.Mesh( 
				new THREE.CylinderGeometry( 100 - colorSat*100, colorSat*100, 300 ), coneMaterial );
			cone.position.set( x, 150, z );
			scene.add( cone );
		}
	}

   robosub = new THREE.Object3D();
   //hull Material
   var glassMaterial = new THREE.MeshPhongMaterial( 
      { color: 0x0, specular: 0xFFFFFF, shininess: 100, opacity: 0.5, transparent: true } );
   glassMaterial.ambient.copy( glassMaterial.color );
   
   //fame material
   var frameMaterial = new THREE.MeshLambertMaterial(  ); //{ shininess: 0.5 }
   frameMaterial.color.setHex( 0xd3d3d3 );
   //frameMaterial.specular.setRGB( 0.2, 0.2, 0.2 );
   frameMaterial.ambient.copy( frameMaterial.color );
   
   propMaterials = [];
   //All 6 materials
   for(i = 0; i < 6; i ++)
   {
      var propMaterial = new THREE.MeshLambertMaterial(  ); //{ shininess: 0.5 }
      propMaterial.color.setHex( 0xffff00 );
      //frameMaterial.specular.setRGB( 0.2, 0.2, 0.2 );
      propMaterial.ambient.copy( propMaterial.color );
      propMaterials.push( propMaterial );
   }
   
   

   //HULL Dimensions
   var hullRadius = 100;//mm diameter
   var hullLength = 600;//mm length
    // Frame dimensions
   var framePieceWidth = 20;
   var frameWidth = 400;
   var frameMountLength = 200;
   var frameLength = 620;
   var frameHeight = hullRadius*4;
   var propRadius = 35;
   var propLength = 90;
   var bevelRadius = 1;//mm
   
   hull = new THREE.Object3D();
   //HULL
   var cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry( hullRadius, hullRadius, hullLength, 32 ), glassMaterial );
   cylinder.position.x = 0;
   cylinder.position.y = 0.7*frameHeight;// 160 + 390/2;
   cylinder.position.z = 0;
   //Lay flat on z axis
   cylinder.rotation.z = 90 * Math.PI/180;
   hull.add( cylinder );
   
   //Battery
   cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry( hullRadius/2, hullRadius/2, hullLength, 32 ), glassMaterial );
   cylinder.position.x = 0;
   cylinder.position.y = hullRadius/2 + framePieceWidth;// 160 + 390/2;
   cylinder.position.z = 0;
   //Lay flat on z axis
   cylinder.rotation.z = 90 * Math.PI/180;
   hull.add( cylinder );
   
   frame = new THREE.Object3D();
   for(var semetrical = -1; semetrical <= 1; semetrical += 2)
   {
      //Bottom outside struts
      cube = new THREE.Mesh(
         new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, frameLength, bevelRadius ),
                            frameMaterial );
      cube.position.x = 0;	// centered on origin along X
      cube.position.y = framePieceWidth/2.0;
      cube.position.z = (frameWidth/2.0-framePieceWidth/2.0) * semetrical;
      cube.rotation.y = 90 * Math.PI/180;
      frame.add( cube );
      
      
      
      //Middle outside struts
      cube = new THREE.Mesh(cube.geometry.clone(), frameMaterial );
      cube.position.y = framePieceWidth/2.0 + 0.6*frameHeight;
      cube.position.z = (frameWidth/2.0-framePieceWidth/2.0) * semetrical;
      cube.rotation.y = 90 * Math.PI/180;
      frame.add( cube );
      
      //End horizontals
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameWidth-framePieceWidth*2, bevelRadius ),
                            frameMaterial );
      cube.position.y = -framePieceWidth/2.0 + frameHeight;//+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0) * semetrical;
      robosub.add( cube );
      
      //End horizontals top
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameWidth-framePieceWidth*2, bevelRadius ),
                            frameMaterial );
      cube.position.y = framePieceWidth/2.0 + frameHeight*0.4;//+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0) * semetrical;
      frame.add( cube );
      
      
      //vertical left
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameHeight, bevelRadius ),
                            frameMaterial );
      cube.position.y =  frameHeight/2;  //+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0) * semetrical;
      cube.position.z = frameWidth/2.0 - framePieceWidth/2.0;
      cube.rotation.x = 90 * Math.PI/180;
      frame.add( cube );
      
      //vertical right
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameHeight, bevelRadius ),
                            frameMaterial );
      cube.position.y =  frameHeight/2;  //+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0) * semetrical;
      cube.position.z = -frameWidth/2.0 + framePieceWidth/2.0
      cube.rotation.x = 90 * Math.PI/180;
      frame.add( cube );
      
      //Engine Mount Frame Endpeice
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameWidth, bevelRadius ),
                            frameMaterial );
      cube.position.y = framePieceWidth/2.0 + frameHeight*0.4;//+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0 + frameMountLength) * semetrical;
      frame.add( cube );
      
      //Engine Mount Frame left
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameMountLength-framePieceWidth, bevelRadius ),
                            frameMaterial );
      cube.position.y = framePieceWidth/2.0 + frameHeight*0.4;//+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0 + frameMountLength/2) * semetrical;
      cube.position.z = -frameWidth/2.0 + framePieceWidth/2.0;
      cube.rotation.y = 90 * Math.PI/180;
      frame.add( cube );
      
      //Engine Mount Frame right
      cube = new THREE.Mesh(new THREE.BeveledBlockGeometry( framePieceWidth, framePieceWidth, 
                                                     frameMountLength-framePieceWidth, bevelRadius ),
                            frameMaterial );
      cube.position.y = framePieceWidth/2.0 + frameHeight*0.4;//+ 0.6*frameHeight;
      cube.position.x = (frameLength/2.0 + framePieceWidth/2.0 + frameMountLength/2) * semetrical;
      cube.position.z = frameWidth/2.0 - framePieceWidth/2.0;
      cube.rotation.y = 90 * Math.PI/180;
      frame.add( cube );
   }
      
   //ENGINES
   var engines_pos = [];
   //positions
   engines_pos.push( new THREE.Vector3(0,0.9*frameHeight,0.9*(frameWidth/2)) );//Center left
   engines_pos.push( new THREE.Vector3(0,0.9*frameHeight,-0.9*(frameWidth/2)) );//Center Right
   engines_pos.push( new THREE.Vector3(frameLength/2 + frameMountLength/2 + framePieceWidth*3,
                     0.6*frameHeight,-0.4*frameWidth ));
   engines_pos.push( new THREE.Vector3(-(frameLength/2 + frameMountLength/2+ framePieceWidth*3),
                     0.6*frameHeight,-0.4*frameWidth ));
   engines_pos.push( new THREE.Vector3(frameLength/2 + frameMountLength/2 + framePieceWidth*3,
                     0.6*frameHeight,0.4*frameWidth ));
   engines_pos.push( new THREE.Vector3(-(frameLength/2 + frameMountLength/2+ framePieceWidth*3),
                     0.6*frameHeight,0.4*frameWidth ));
   
   var tmp_prop, propObj;
   props = new THREE.Object3D();           
   for(i = 0; i < 6; i++)
   {
      propellor = propellor = new THREE.Mesh(
        new THREE.CylinderGeometry( propRadius, propRadius, propLength*0.2, 32 ), propMaterials[i] );
      propellor.position.y = -propLength*0.4;
      tmp_prop = new THREE.Mesh(
        new THREE.CylinderGeometry( propRadius*0.6, propRadius*0.6, propLength*0.8, 32 ), propMaterials[i] );
      tmp_prop.position.y = propLength*0.1;
      propObj = new THREE.Object3D();
      propObj.add(propellor);
      propObj.add(tmp_prop);
      propObj.position.copy(engines_pos[i]);
      props.add( propObj);
   }
   
   //Rotations
   props.children[0].rotation.x = -45 * Math.PI/180; //Center Left
   props.children[1].rotation.x = 45 * Math.PI/180; //Center Right
   props.children[2].rotation.x = 90 * Math.PI/180; //Back Right
   props.children[2].rotation.z = 135 * Math.PI/180;
   props.children[3].rotation.x = 90 * Math.PI/180; //Front Right
   props.children[3].rotation.z = 45 * Math.PI/180;
   props.children[4].rotation.x = 90 * Math.PI/180; //Back Left
   props.children[4].rotation.z = 45 * Math.PI/180;
   props.children[5].rotation.x = -90 * Math.PI/180; //Front Left
   props.children[5].rotation.z = 45 * Math.PI/180;
   
   
   props.rotation.y = 180 * Math.PI/180;
   robosub.add( props );
   robosub.add( frame );
   robosub.add( hull );

   //robosub.position.y = frameHeight/2;
   scene.add( robosub );
   robosub.animated = props;
   
   
   //RETURN
   return scene;
}








