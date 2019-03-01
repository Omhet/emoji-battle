// function isCollide(a, b) {
//     return !(
//         ((a.y + a.d) < (b.y)) ||
//         (a.y > (b.y + b.d)) ||
//         ((a.x + a.d) < b.x) ||
//         (a.x > (b.x + b.d))
//     );
// }

function overlap(a, b) {
  //square dist
  var r = a.r + b.r;
  r *= r;
  var thisCenterX = a.x;
  var thisCenterY = a.y;
  var otherCenterX = b.x;
  var otherCenterY = b.y;
  var sqDist =
    Math.pow(thisCenterX - otherCenterX, 2) +
    Math.pow(thisCenterY - otherCenterY, 2);
  return r > sqDist;
}

//should be called only for circle vs circle
function collide(other) {
  if (overlap(other)) {
    var thisCenterX = this.center.x + this.offset.x;
    var thisCenterY = this.center.y + this.offset.y;
    var otherCenterX = other.center.x + other.offset.x;
    var otherCenterY = other.center.y + other.offset.y;
    var a = pInst.atan2(thisCenterY - otherCenterY, thisCenterX - otherCenterX);
    var radii = this.radius + other.radius;
    var intersection = abs(
      radii - dist(thisCenterX, thisCenterY, otherCenterX, otherCenterY)
    );

    var displacement = createVector(
      pInst.cos(a) * intersection,
      pInst.sin(a) * intersection
    );

    return displacement;
  } else {
    return createVector(0, 0);
  }
}
