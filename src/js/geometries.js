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
  }
}

module.exports = geometries
