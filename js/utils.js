static class PointConverter{
    convertValueIntoPoint(value) {
        return new Point(value[0], value[1], value[2], value[3], value[4]);
    }
}