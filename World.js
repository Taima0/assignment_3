// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix  * u_GlobalRotateMatrix * u_ModelMatrix * (a_Position);
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0; 
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  varying vec2 v_UV;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;

    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV, 1.0,1.0);

    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); //sky block

    } else if (u_whichTexture == 1){
     gl_FragColor = texture2D(u_Sampler1, v_UV); //floor

     } else if (u_whichTexture == 2){
     gl_FragColor = texture2D(u_Sampler2, v_UV); //blocks
     }
     else {gl_FragColor = vec4(1,.2,.2,1);
     
    }
  }`

//Global Varibales
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;

function setupWebGL(){
  // Retrieve <canvas> element
  // Get the rendering context for WebGL
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST)

}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  // Get the storage location of u_ModelMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  // Get the storage location of u_ModelMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return;
  }

  u_whichTexture= gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}

function initTextures(){
  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  if (!image0 || !image1) {
    console.log('Failed to create the texture object');
    return false;
  }

  image0.onload = function(){ sendTexturetoGLSL(image0, u_Sampler0, 0); }
  image0.src = 'sky.png';

  image1.onload = function(){ sendTexturetoGLSL(image1, u_Sampler1, 1); }
  image1.src = 'dirt_floor.png'; //512 x 512

  image2.onload = function(){ sendTexturetoGLSL(image2, u_Sampler2, 2); }
  image2.src = 'wall.png'; //512 x 512

  return true;
}

/*

function sendTexturetoGLSL(image, sampler, whichtext){
  var texture = gl.createTexture();
  var texture1 = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
  if (whichtext == 0) {
    gl.activeTexture(gl.TEXTURE0); //sky
  } else if (whichtext == 1) {
    gl.activeTexture(gl.TEXTURE1); //floor
  }
  
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
  //img.crossOrigin = "anonymous";

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(sampler, whichtext);

  console.log('finished loadTextures', sampler);

  //gl.clear(gl.COLOR_BUFFER_BIT);   

  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
} */

function sendTexturetoGLSL(image, sampler, whichtext) {
    var texture = gl.createTexture(); // Only create one texture at a time
    if (!texture) {
      console.log('Failed to create the texture object');
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
    if (whichtext == 0) {
      gl.activeTexture(gl.TEXTURE0); // Activate texture unit 0 for the sky
    } else if (whichtext == 1) {
      gl.activeTexture(gl.TEXTURE1); // Activate texture unit 1 for the floor
    } else if (whichtext == 2) {
      gl.activeTexture(gl.TEXTURE2); // Activate texture unit 2 for the blocks
    }
  
    gl.bindTexture(gl.TEXTURE_2D, texture); // Bind the created texture to the active texture unit
  
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); // Set texture parameters
  
    // Upload the image data to the GPU
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
    // Link the sampler uniform to the corresponding texture unit
    gl.uniform1i(sampler, whichtext);
  
    console.log(`Finished loading texture for whichtext=${whichtext}`);
  }
  

function convertCoord(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y]);
}

const POINT=0;
const TRIANGLE=1;
const CIRCLE=2;
//UI Global Varibales
let g_selectionColor = [1.0,1.0,1.0,1.0];
let g_sizeSlider = 5;
let g_selectedType=POINT;
let g_segments=10;
let g_globalAngle = 0;
let g_yellowAngle = 0;
let g_boxAngle=0;
let g_yellowAnimation=false;
let g_magAnimation=false;


function addActionsForHtmlUI(){
    document.getElementById('green').addEventListener('input', function() { g_selectionColor[1] = this.value/100;});
    document.getElementById('red').addEventListener('input', function() { g_selectionColor[0] = this.value/100;});
    document.getElementById('blue').addEventListener('input', function() { g_selectionColor[2] = this.value/100});
    document.getElementById('clearButton').onclick = function() { g_shapesList=[]; renderAllShapes();};

    document.getElementById('pointButton').onclick = function() { g_selectedType=POINT};
    document.getElementById('triangleButton').onclick = function() { g_selectedType=TRIANGLE};
    document.getElementById('circleButton').onclick = function() { g_selectedType=CIRCLE};
    //Shape slider
    document.getElementById('sizeSlider').addEventListener('input', function() { g_sizeSlider = this.value});
    document.getElementById('circleSlider').addEventListener('input', function() { g_segments = this.value});
    document.getElementById('angleSlider').addEventListener('mousemove', function() { g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById('armSlider').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes(); });
    document.getElementById('footSlider').addEventListener('mousemove', function() { g_boxAngle = this.value; renderAllShapes(); });
    document.getElementById('animationYellowOn').onclick = function() {g_yellowAnimation=true;};
    document.getElementById('animationYellowOff').onclick = function() {g_yellowAnimation=false;};
    document.getElementById('animationMagOn').onclick = function() {g_magAnimation=true;};
    document.getElementById('animationMagOff').onclick = function() {g_magAnimation=false;};
    

}


function main() {
  setupWebGL();

  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  document.onkeydown = keydown;

  initTextures();
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;

var g_shapesList = []; 

function tick(){
  //g_seconds=performance.now()/1000.0-g_startTime;
  //console.log(g_seconds);

  updateAnimationAngle();

  renderAllShapes();

  requestAnimationFrame(tick);
}

function keydown(ev){
  //w u a s d keys
  //move right (d key)
  if (ev.keyCode == 68){ //d key right
    g_camera.right();
  } else if (ev.keyCode == 65 ){ //a key left
    g_camera.left();
  } else if (ev.keyCode == 87){  //w key up
    g_camera.forward();
  } else if (ev.keyCode == 83){ //s key back
    g_camera.back();
  } else if (ev.keyCode == 81){ //rotate left Q
    g_camera.rotateLeft();
  } else if (ev.keyCode == 69){ //rotate right E
    g_camera.rotateRight()
  }

  renderAllShapes();
  console.log(ev.keyCode);
}







//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];

function updateAnimationAngle(){
  if (g_yellowAnimation){
    g_yellowAngle = (45*Math.sin(g_seconds));
  } 
  if (g_magAnimation) {
    g_boxAngle = (45*Math.sin(3*g_seconds));
  }
}

var g_eye = [0, 0, 3];
var g_at = [0,0,-100];
var g_up = [0,1,0];
var g_camera = new Camera();

var g_map= [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 1, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
  [2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 1],
  [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 2, 0, 1, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
  
  ];


function drawMap() {
  for (let y = 0; y < g_map.length; y++) {  
    for (let x = 0; x < g_map[y].length; x++) {  
      if (g_map[y][x] > 0) {  
        var body = new Cube();  
        body.textureNum = 2;  
        body.matrix.translate(0, -0.75, 0); 
        body.matrix.translate(x - 16, 0, y - 16);  
        body.render(); 
      }
    }
  }
}

function renderAllShapes(){

  var projMat= new Matrix4();
  projMat.setPerspective(50,1* canvas.width /canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false,projMat.elements);

  var viewMat= new Matrix4();
  viewMat.setLookAt(g_camera.position.elements[0], g_camera.position.elements[1], g_camera.position.elements[2], g_camera.direction.elements[0], g_camera.direction.elements[1], g_camera.direction.elements[2], g_camera.up.elements[0], g_camera.up.elements[1], g_camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  //gl.uniformMatrix4fv(u_ModelMatrix, false, globalRotMat.elements);

  // Clear <canvas.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

 
  //draw a test traingle
//drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0,  0.0,0.0,0.0] );

//dra floor 
  var floor = new Cube();
  floor.textureNum = 1;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(32,0,32);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  //sky 
  var sky = new Cube();
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -0.5, -.5);
  sky.render();


  var floor = new Cube();
  floor.textureNum = 1;
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(32,0,32);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  //sky 
  var sky = new Cube();
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-.5, -0.5, -.5);
  sky.render();

  var trunk = new Cube();
  trunk.color = [0.55, 0.27, 0.07, 1.0]; 
  trunk.matrix.translate(-0.25, -0.75, 0.0);
  trunk.matrix.scale(0.2, 0.8, 0.2); 
  trunk.render();


  var leaves1 = new Cube();
  leaves1.color = [0.0, 0.8, 0.0, 1.0]; 
  leaves1.matrix.translate(-0.45, 0.05, 0.0); 
  leaves1.matrix.scale(0.6, 0.6, 0.6); 
  leaves1.render();

  var leaves2 = new Cube();
  leaves2.color = [0.0, 0.8, 0.0, 1.0]; 
  leaves2.matrix.translate(-0.35, 0.45, 0.0); 
  leaves2.matrix.scale(0.4, 0.4, 0.4);
  leaves2.render();

  var leaves3 = new Cube();
  leaves3.color = [0.0, 0.8, 0.0, 1.0]; 
  leaves3.matrix.translate(-0.25, 0.75, 0.0); 
  leaves3.matrix.scale(0.3, 0.3, 0.3);
  leaves3.render();

  drawMap();

}

function click(ev) {
  [x,y] = convertCoord(ev);

  let point;
  if (g_selectedType==POINT){
    point = new Point();
  } else if (g_selectedType==TRIANGLE){
    point = new Triangle();
  } else {
    point = new Circle();
  }
  point.position = [x,y];
  point.color = g_selectionColor.slice();
  point.size = g_sizeSlider;
  g_shapesList.push(point);


  renderAllShapes();
}