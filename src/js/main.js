// var oui = require('ouioui');
var vShaderSource = require('../glsl/vertex.glsl');
var fShaderSource = require('../glsl/fragment.glsl');
var creator = require('./creator.js');
var matrix = require('./matrix.js');
var canvas = document.getElementById('myCanvas');
var gl = canvas.getContext('webgl');

var vShader = creator.shader(gl, gl.VERTEX_SHADER, vShaderSource);
var fShader = creator.shader(gl, gl.FRAGMENT_SHADER, fShaderSource);
var program = creator.program(gl, vShader, fShader);

var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

var colorUniformLocation = gl.getUniformLocation(program, 'u_color');
var matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
gl.useProgram(program);

var positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.uniform4f(colorUniformLocation, 1, 0, 1, 1);
gl.clearColor(0.0, 0.0, 0.0, 1.0);


var Params = function() {
  this.message = 'hello';
  this.translateX = 100;
  this.translateY = 100;
  this.rotateX = 0;
  this.rotateY = 0;
  this.rotateZ = 0;
}

var params = new Params();

window.onload = function() {
  var gui = new dat.GUI();
  gui.add(params, 'translateX', 0, 1000).onChange(draw);
  gui.add(params, 'translateY', 0, 1000).onChange(draw);
  gui.add(params, 'rotateX', 0, 10).onChange(draw);
  gui.add(params, 'rotateY', 0, 10).onChange(draw);
  gui.add(params, 'rotateZ', 0, 10).onChange(draw);
}
draw();
// requestAnimationFrame(draw);

function draw() {
  //clear canvas
  // gl.clear(gl.COLOR_BUFFER_BIT);

  var projectionMat = matrix.project(960, 600, 800);
  var translationMat = matrix.translate(params.translateX, params.translateY, 0);
  var rotateXMat = matrix.rotateX(params.rotateX);
  var rotateYMat = matrix.rotateY(params.rotateY);
  var rotateZMat = matrix.rotateZ(params.rotateZ);

  var transformation = matrix.multiply(rotateXMat, rotateYMat);
  transformation = matrix.multiply(transformation, rotateZMat);
  transformation = matrix.multiply(transformation, translationMat);
  transformation = matrix.multiply(transformation, projectionMat);
  //set transformation
  setTriangle(gl, 0, 0, 0, 0, 300, 0, 500, 0, 0);
  gl.uniformMatrix4fv(matrixUniformLocation, false, transformation);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

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
