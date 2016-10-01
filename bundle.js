/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	// var oui = require('ouioui');
	var vShaderSource = __webpack_require__(1);
	var fShaderSource = __webpack_require__(2);
	var creator = __webpack_require__(3);
	var matrix = __webpack_require__(4);
	var geometries = __webpack_require__(32);

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
	var normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
	// var colorUniformLocation = gl.getUniformLocation(program, 'u_color');
	var matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
	var fudgeLocation = gl.getUniformLocation(program, 'u_fudgeFactor');
	var colorLocation = gl.getUniformLocation(program, "u_color");
	var reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection");

	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

	setGeometry();

	var normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.enableVertexAttribArray(normalAttributeLocation);
	gl.vertexAttribPointer(normalAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

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
	  // Set the color to use
	  gl.uniform4fv(colorLocation, [1, 1, 1, 1]); // green

	  // set the light direction.
	  gl.uniform3fv(reverseLightDirectionLocation, normalize([0.5, 0.7, 1]));
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

	function setNormals() {
	  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometries.cubeNormals()), gl.STATIC_DRAW);
	}

	function normalize(a) {
	  var r = [];
	  var s = 0;
	  for(var i = 0; i < a.length; i ++) {
	    s += a[i];
	  }
	  for(var i = 0; i < a.length; i ++) {
	    r.push(a[i] / s);
	  }

	  return r
	}


/***/ },

/***/ 1:
/***/ function(module, exports) {

	module.exports = "attribute vec4 a_position;\nattribute vec3 a_normal;\n\nuniform mat4 u_worldViewProjection;\nuniform mat4 u_world;\n\nuniform float u_fudgeFactor;\nuniform mat4 u_matrix;\nvarying vec3 v_normal;\n\nvoid main() {\n  vec4 position = u_matrix * a_position;\n  float zToDivideBy = 1.0 + position.z * u_fudgeFactor;\n  gl_Position = vec4(position.xy / zToDivideBy, position.zw);\n\n  // gl_Position = u_worldViewProjection * a_position;\n\n  v_normal = a_normal;\n}\n"

/***/ },

/***/ 2:
/***/ function(module, exports) {

	module.exports = "precision mediump float;\n\nvarying vec3 v_normal;\n\nuniform vec3 u_reverseLightDirection;\nuniform vec4 u_color;\n\nvoid main() {\n  vec3 normal = normalize(v_normal);\n\n  float light = dot(normal, u_reverseLightDirection);\n\n  gl_FragColor = u_color;\n\n  // Lets multiply just the color portion (not the alpha)\n  // by the light\n  gl_FragColor.rgb *= light;\n}\n"

/***/ },

/***/ 3:
/***/ function(module, exports) {

	var creator = {
	  shader: function(gl, type, source) {
	    var shader = gl.createShader(type);
	    gl.shaderSource(shader, source);
	    gl.compileShader(shader);
	    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	    if (success) {
	      return shader;
	    }

	    console.log(gl.getShaderInfoLog(shader));
	    gl.deleteShader(shader);
	  },

	  program: function(gl, vertexShader, fragmentShader) {
	    var program = gl.createProgram();
	    gl.attachShader(program, vertexShader);
	    gl.attachShader(program, fragmentShader);
	    gl.linkProgram(program);
	    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	    if (success) {
	      return program;
	    }

	    console.log(gl.getProgramInfoLog(program));
	    gl.deleteProgram(program);
	  }
	}

	module.exports = creator;


/***/ },

/***/ 4:
/***/ function(module, exports) {

	var matrix = {
	  translate: function(tx, ty, tz) {
	    return [
	       1,  0,  0,  0,
	       0,  1,  0,  0,
	       0,  0,  1,  0,
	       tx, ty, tz, 1
	    ];
	  },
	  rotateX: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	      1, 0, 0, 0,
	      0, c, s, 0,
	      0, -s, c, 0,
	      0, 0, 0, 1
	    ];
	  },
	  rotateY: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	      c, 0, -s, 0,
	      0, 1, 0, 0,
	      s, 0, c, 0,
	      0, 0, 0, 1
	    ];
	  },
	  rotateZ: function(angleInRadians) {
	    var c = Math.cos(angleInRadians);
	    var s = Math.sin(angleInRadians);

	    return [
	       c, s, 0, 0,
	      -s, c, 0, 0,
	       0, 0, 1, 0,
	       0, 0, 0, 1,
	    ];
	  },
	  scale: function(sx, sy, sz) {
	    return [
	      sx, 0,  0,  0,
	      0, sy,  0,  0,
	      0,  0, sz,  0,
	      0,  0,  0,  1,
	    ];
	  },
	  project: function(width, height, depth) {
	    return [
	       2 / width, 0, 0, 0,
	       0, -2 / height, 0, 0,
	       0, 0, 2 / depth, 0,
	      -1, 1, 0, 1,
	    ];
	  },
	  multiply: function(a, b) {
	    var a00 = a[0*4+0];
	    var a01 = a[0*4+1];
	    var a02 = a[0*4+2];
	    var a03 = a[0*4+3];
	    var a10 = a[1*4+0];
	    var a11 = a[1*4+1];
	    var a12 = a[1*4+2];
	    var a13 = a[1*4+3];
	    var a20 = a[2*4+0];
	    var a21 = a[2*4+1];
	    var a22 = a[2*4+2];
	    var a23 = a[2*4+3];
	    var a30 = a[3*4+0];
	    var a31 = a[3*4+1];
	    var a32 = a[3*4+2];
	    var a33 = a[3*4+3];
	    var b00 = b[0*4+0];
	    var b01 = b[0*4+1];
	    var b02 = b[0*4+2];
	    var b03 = b[0*4+3];
	    var b10 = b[1*4+0];
	    var b11 = b[1*4+1];
	    var b12 = b[1*4+2];
	    var b13 = b[1*4+3];
	    var b20 = b[2*4+0];
	    var b21 = b[2*4+1];
	    var b22 = b[2*4+2];
	    var b23 = b[2*4+3];
	    var b30 = b[3*4+0];
	    var b31 = b[3*4+1];
	    var b32 = b[3*4+2];
	    var b33 = b[3*4+3];
	    return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
	            a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
	            a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
	            a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
	            a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
	            a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
	            a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
	            a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
	            a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
	            a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
	            a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
	            a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
	            a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
	            a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
	            a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
	            a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
	  }
	}

	module.exports = matrix;


/***/ },

/***/ 32:
/***/ function(module, exports) {

	var geometries = {
	  cube: function(l) {
	    return [
	      //front
	      0, 0, 0,
	      0, l, 0,
	      l, 0, 0,
	      l, 0, 0,
	      0, l, 0,
	      l, l, 0,

	      //left
	      0, 0, 0,
	      0, 0, l,
	      0, l, 0,
	      0, l, 0,
	      0, 0, l,
	      0, l, l,

	      //right
	      l, 0, 0,
	      l, l, l,
	      l, 0, l,
	      l, 0, 0,
	      l, l, 0,
	      l, l, l,


	      //back
	      0, 0, l,
	      l, 0, l,
	      0, l, l,
	      0, l, l,
	      l, 0, l,
	      l, l, l,


	      //top
	      0, 0, 0,
	      l, 0, 0,
	      0, 0, l,
	      0, 0, l,
	      l, 0, 0,
	      l, 0, l,

	      //bottom
	      0, l, 0,
	      0, l, l,
	      l, l, 0,
	      l, l, 0,
	      0, l, l,
	      l, l, l
	    ];
	  },
	  cubeNormals: function(l) {
	    return [
	      //front
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      0, 0, 1,
	      //left
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,
	      -1, 0, 0,

	      //right
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,
	      1, 0, 0,

	      //back
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,
	      0, 0, -1,

	      //top
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,
	      0, 1, 0,

	      //bottom
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	      0, -1, 0,
	    ];
	  }
	}

	module.exports = geometries


/***/ }

/******/ });