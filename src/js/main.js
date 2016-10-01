// var oui = require('ouioui');
var vShaderSource = require('../glsl/vertex.glsl');
var fShaderSource = require('../glsl/fragment.glsl');
var creator = require('./creator.js');
var matrix = require('./matrix.js');
var geometries = require('./geometries.js');

var canvas = document.getElementById('myCanvas');
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

var gl = canvas.getContext('webgl');

var vShader = creator.shader(gl, gl.VERTEX_SHADER, vShaderSource);
var fShader = creator.shader(gl, gl.FRAGMENT_SHADER, fShaderSource);
var program = creator.program(gl, vShader, fShader);

gl.useProgram(program);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
var colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
// var colorUniformLocation = gl.getUniformLocation(program, 'u_color');
var matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
var fudgeLocation = gl.getUniformLocation(program, 'u_fudgeFactor');

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

setGeometry();

var colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(colorAttributeLocation);
gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

setColor();

// gl.uniform4f(colorUniformLocation, 1, 0, 1, 1);

var params = {
  translateX: 600,
  translateY: 200,
  translateZ: 0,
  rotateX: 1,
  rotateY: 1,
  rotateZ: 1,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  fudgeFactor: 1.0
}


window.onload = function() {
  var gui = new dat.GUI();
  gui.add(params, 'translateX', 0, 1000).onChange(draw);
  gui.add(params, 'translateY', 0, 1000).onChange(draw);
  gui.add(params, 'translateZ', 0, 400).onChange(draw);
  gui.add(params, 'rotateX', 0, 10).onChange(draw);
  gui.add(params, 'rotateY', 0, 10).onChange(draw);
  gui.add(params, 'rotateZ', 0, 10).onChange(draw);
  gui.add(params, 'scaleX', 0, 5).onChange(draw);
  gui.add(params, 'scaleY', 0, 5).onChange(draw);
  gui.add(params, 'scaleZ', 0, 5).onChange(draw);
  gui.add(params, 'fudgeFactor', 0.0, 2.0).onChange(draw);
}

draw();
// requestAnimationFrame(draw);

function draw() {
  //clear canvas
  gl.clearColor(1.0, 0.8, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var projectionMat = matrix.project(gl.canvas.width, gl.canvas.height, 1000);
  var translationMat = matrix.translate(params.translateX, params.translateY, params.translateZ);
  var rotateXMat = matrix.rotateX(params.rotateX);
  var rotateYMat = matrix.rotateY(params.rotateY);
  var rotateZMat = matrix.rotateZ(params.rotateZ);
  var scaleMat = matrix.scale(params.scaleX, params.scaleY, params.scaleZ);

  var transformation = matrix.multiply(scaleMat, rotateXMat);
  transformation = matrix.multiply(transformation, rotateYMat);
  transformation = matrix.multiply(transformation, rotateZMat);
  transformation = matrix.multiply(transformation, translationMat);
  transformation = matrix.multiply(transformation, projectionMat);
  //set transformation

  gl.uniform1f(fudgeLocation, params.fudgeFactor);
  gl.uniformMatrix4fv(matrixUniformLocation, false, transformation);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  // requestAnimationFrame(draw);
}

//utils
function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function setTriangle(gl, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1, z1,
    x2, y2, z2,
    x3, y3, z3
  ]), gl.STATIC_DRAW);
}

function setGeometry() {
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometries.cube(200)), gl.STATIC_DRAW)
}

function setColor() {
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
    //front RED
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,
    255, 0, 0,

    //left YELLOW
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,
    255, 255, 0,

    //right PINK
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,
    255, 0, 255,

    //back BLUE
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,
    0, 0, 255,

    //top GREEN
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,
    0, 255, 0,

    //bottom LIGHT BLUE
    0, 255, 255,
    0, 255, 255,
    0, 255, 255,
    0, 255, 255,
    0, 255, 255,
    0, 255, 255
  ]), gl.STATIC_DRAW);
}
