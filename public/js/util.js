function overlap(a, b) {
  return !(
    a.y + a.d < b.y ||
    a.y > b.y + b.d ||
    a.x + a.d < b.x ||
    a.x > b.x + b.d
  );
}

// function overlap(a, b) {
//   //square dist
//   var r = a.r + b.r;
//   r *= r;
//   var thisCenterX = a.x;
//   var thisCenterY = a.y;
//   var otherCenterX = b.x;
//   var otherCenterY = b.y;
//   var sqDist =
//     Math.pow(thisCenterX - otherCenterX, 2) +
//     Math.pow(thisCenterY - otherCenterY, 2);
//   return r > sqDist;
// }

// //should be called only for circle vs circle
// function collide(a, b) {
//   if (overlap(a, b)) {
//     var thisCenterX = a.x;
//     var thisCenterY = a.y;
//     var otherCenterX = b.x;
//     var otherCenterY = b.y;
//     var angle = Math.atan2(
//       thisCenterY - otherCenterY,
//       thisCenterX - otherCenterX
//     );
//     var radii = a.r + b.r;
//     var intersection = Math.abs(
//       radii - dist(thisCenterX, thisCenterY, otherCenterX, otherCenterY)
//     );

//     var displacement = createVector(
//       Math.cos(angle) * intersection,
//       Math.sin(angle) * intersection
//     );

//     return displacement;
//   } else {
//     return createVector(0, 0);
//   }
// }
