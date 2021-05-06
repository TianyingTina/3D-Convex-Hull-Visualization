var points = [];

function generate_points(number) {
    var random_points = [];

    function Random(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function generate_point(n, min, max) {
        for (var i = 0; i < n; i++) {
            var rp = {x: Random(min, max), y: Random(min, max), z: Random(min, max)};
            random_points.push(rp);
        }
    }

    function unique(arr) {
        return Array.from(new Set(arr))
    }

    generate_point(number, -15, 15);
    random_points = unique(random_points);
    console.log(random_points);
    points = random_points;
    return random_points;
}