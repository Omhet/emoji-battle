function isCollide(a, b) {
    return !(
        ((a.y + a.d) < (b.y)) ||
        (a.y > (b.y + b.d)) ||
        ((a.x + a.d) < b.x) ||
        (a.x > (b.x + b.d))
    );
}
