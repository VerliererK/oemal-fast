if ( WEBGL.isWebGLAvailable() === false ) {
  document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var camera, controls, scene, renderer;

init();
//render(); // remove when using next line for animation loop (requestAnimationFrame)
animate();

function init() {

    scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x444444);

    renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    var world = document.getElementById('foot3DView');
    world.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 200);

    // controls

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;
    controls.enableZoom = true;
    controls.enablePan = false;
  
    controls.minDistance = 100;
    controls.maxDistance = 500;

    controls.maxPolarAngle = Math.PI;


    // lights

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);

    var light = new THREE.DirectionalLight(0x888888);
    light.position.set( - 1,  - 1,  - 1);
    scene.add(light);

    var light = new THREE.AmbientLight(0x222222);
    scene.add(light);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

    render();

}

function render() {

    renderer.render(scene, camera);

}

function removeAllMesh() {
    var meshes = scene.children.filter(object=>object.type=='Mesh')
    for (i = 0; i < meshes.length; i++) { 
        scene.remove(meshes[i]);
    }
    meshes.length = 0;
}

function load(files) {
    if (files.length > 0 && files[0]) {
        var reader = new FileReader();
        reader.onload = function (event) {
            try {
                var data = JSON.parse(event.target.result);
                console.log(data);
                drawzq(data.zq);
            } catch (e) {
                console.log("parse json failed: " + e);
            }
        };
        reader.readAsText(files[0]);

    }
}

function drawzq(zq) {
  var rows = zq.length;
  var cols = zq[0].length;
  console.log(rows);
  console.log(cols);
  /*
  var geometry = new THREE.BufferGeometry();
  var numPoints = rows * cols;
  var positions = new Float32Array( numPoints * 3 );
  var colors = new Float32Array( numPoints * 3 );
  var color = new THREE.Color( 0, 0, 0 );

  var k = 0;
  for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
          var x = i;
          var y = j;
          var z = zq[i][j];
          positions[ 3 * k ] = x;
                    positions[ 3 * k + 1 ] = y;
                    positions[ 3 * k + 2 ] = z;
          k++;
                    colors[ 3 * k ] = color.r;
                    colors[ 3 * k + 1 ] = color.g;
                    colors[ 3 * k + 2 ] = color.b;
      }
  }
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    geometry.computeBoundingBox();
  
  var pointSize = 1;
  var material = new THREE.PointsMaterial({
          size: pointSize,
          vertexColors: THREE.VertexColors
      });
  var model = new THREE.Points(geometry, material);
  */
  
  var geometry = new THREE.Geometry();
    
  for(var i = 0; i < rows; i++) {
      for(var j = 0; j < cols; j++) {
      var z = zq[i][j];
      geometry.vertices.push(new THREE.Vector3(i, j, z));
      }
  }
  
  for(var i = 0; i < rows - 1; i++) {
      for(var j = 0; j < cols - 1; j++) {
      var leftTop = i * cols + j;
          var rightBottom = (i+1) * cols + (j+1);
          
      if(geometry.vertices[leftTop].z >= 0 && geometry.vertices[leftTop + 1].z >= 0 && geometry.vertices[rightBottom - 1].z >= 0)
        geometry.faces.push(new THREE.Face3( leftTop, leftTop + 1, rightBottom - 1 ));
      if(geometry.vertices[leftTop + 1].z >= 0 && geometry.vertices[rightBottom].z >= 0 && geometry.vertices[rightBottom - 1].z >= 0)
            geometry.faces.push(new THREE.Face3( leftTop + 1, rightBottom, rightBottom - 1 ));
      }
  }
  
  geometry.computeBoundingBox();
  geometry.computeFaceNormals(true);
  geometry.computeVertexNormals(true);
  geometry.rotateZ(90);
  
  var lut = new Lut( "rainbow", 512 );
  lut.setMax(geometry.boundingBox.max.z * 0.9);
  for(var i = 0; i < geometry.faces.length; i++) {
    var face = geometry.faces[i];
    
    var a_z = geometry.vertices[face.a].z;
    var b_z = geometry.vertices[face.b].z;
    var c_z = geometry.vertices[face.c].z;
    
    face.vertexColors[0] = lut.getColor(a_z);
    face.vertexColors[1] = lut.getColor(b_z);
    face.vertexColors[2] = lut.getColor(c_z);
  }
  
  //var material = new THREE.MeshLambertMaterial();
  var material = new THREE.MeshBasicMaterial({vertexColors: THREE.VertexColors});
  material.side = THREE.DoubleSide;
  var model = new THREE.Mesh( geometry, material );
  model.name = 'foot';
  
  var center = new THREE.Vector3();
  var bbox = geometry.boundingBox;
  center.x = (bbox.max.x + bbox.min.x) / 2;
  center.y = (bbox.max.y + bbox.min.y) / 2;
  center.z = (bbox.max.z + bbox.min.z) / 2;

  scene.add(model);

  var radius = (bbox.max.x - bbox.min.x) / 2.0;
  var aspect = camera.aspect;
  var fov = 45;
  var horizontalFOV = 2.0 * Math.atan(Math.tan(fov * .017453292519943295 / 2.0) * aspect) * .017453292519943295;
  var distance = radius / Math.sin(fov * .017453292519943295 / 2.0) * 1.15;
  camera.position.copy(new THREE.Vector3(center.x, center.y, center.z + distance))

  controls.target.set(center.x, center.y, center.z);
  controls.minDistance = distance * 0.1;
  controls.maxDistance = distance * 10;

}
