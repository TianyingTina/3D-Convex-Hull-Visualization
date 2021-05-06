/**
 * Created by tianyingzhang on 5/4/21.
 */
//todo: degenration
var points =
    [
        {x: 4, y: -15, z: 7}, {x: -4, y: -14, z: -7},
        {x: 8, y: 10, z: -12}, {x: -9, y: 14, z: -12},
        {x: 4, y: 6, z: 6}, {x: -14, y: 4, z: -6}
    ];
const n = points.length;

gift_wrapping(points);

function generate_dic_key(a, b) {
    return a.toString(10) + "," + b.toString(10);
}

function init_T() {
    temp_constructor = {};
    for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
            var dic_key = i.toString(10) + "," + j.toString(10);
            temp_constructor[dic_key] = 0;
        }
    }
    return temp_constructor;
}

//find three first points.
function dblcmp(pointA, facepoint0,facepoint1,facepoint2)//redo the check same plane take face as a parameter. If positive, the same direction.
{
    var m = vectorV(facepoint1, facepoint0);
    var n = vectorV(facepoint2, facepoint0);
    var t = vectorV(pointA, facepoint0);
    return dotProduct(cross(m, n), t);
}
function gift_wrapping(point_list) {
    //find three first points.
    find_first_point(point_list);
    find_second_point(point_list);
    find_third_point(point_list);
    //console.log(point_list);
    if (dblcmp(point_list[3], point_list[0],point_list[1],point_list[2]) > 0) {
        temp = point_list[0];
        point_list[0] = point_list[1];
        point_list[1] = temp;
        console.log("swap");
    }
    var Z = [];
    var Q = [];
    var T = [];
    var F = [0, 1, 2];
    T = init_T();
    T[generate_dic_key(F[0], F[1])] = 1;
    T[generate_dic_key(F[1], F[2])] = 1;
    T[generate_dic_key(F[0], F[2])] = 1;
    //console.log(T);
    Q.push(F);
    Z.push(F);
    while (Q.length > 0) {
        F = Q.pop();
        console.log("Q.pop: ", F);
        console.log(Q);
        for (var i = 0; i < 3; i++) {
            console.log("i = ", i);
            if (i === 2) {
                var p = F[0];
                var q = F[2];
                var r = F[1]
            }
            if (i === 1) {
                p = F[1];
                q = F[2];
                r = F[0]
            }
            if (i === 0) {
                p = F[0];
                q = F[1];
                r = F[2];

            }
            console.log("current edge:", p, q);
            if (T[generate_dic_key(p, q)] > 1) {
                //do nothing
                //console.log("check current dic:", generate_dic_key(p, q), ":", T[generate_dic_key(p, q)]);
            }
            else {

                //find the corresponding triangle
                var min_angle = 190;
                var index_needed = 0;
                for (var j = 0; j < n; j++) {
                    //console.log("current j:" ,j);
                    if (j !== p && j !== q && j !== r && !checkCollinear(point_list[p], point_list[q], point_list[j])) {
                        if (dblcmp(point_list[j], point_list[p],point_list[q],point_list[r]) > 0) {
                            temp = p;
                            p = q;
                            q = temp;
                            console.log("swap P and Q");
                            console.log("");
                        }
                        console.log("j=",j);
                        var pr = vectorV(point_list[r],point_list[p]);
                        var pq = vectorV(point_list[q],point_list[p]);
                        var pj = vectorV(point_list[j],point_list[p]);
                        var angle = Math.atan2(dotProduct(cross(cross(pr,pq),cross(pq,pj)),{x:pq.x/vlen(pq),y:pq.y/vlen(pq),z:pq.z/vlen(pq)}),dotProduct(cross(pr,pq),cross(pq,pj)))*180/Math.PI;
                        // normal_1 = triangle_normal(point_list[p],point_list[q],point_list[r]);
                        // normal_2 = triangle_normal(point_list[p],point_list[q],point_list[j]);
                        // var angle = (180/Math.PI) * Math.acos(dotProduct(normal_1, normal_2) / (vlen(normal_1) * vlen(normal_2)));
                        console.log(angle);
                        //if (angle < 0){angle = 90;}
                        if (angle < min_angle) {
                            console.log("angle:",angle,"less then min_angle", min_angle);
                            min_angle = angle;
                            index_needed = j;
                        }
                    }
                }
                //console.log("added vertex:",index_needed);
                if (index_needed !== 0) {
                    var triangle_list = [p, q, index_needed].sort();
                    T[generate_dic_key(triangle_list[0], triangle_list[1])] += 1;
                    T[generate_dic_key(triangle_list[1], triangle_list[2])] += 1;
                    T[generate_dic_key(triangle_list[0], triangle_list[2])] += 1;
                    Z.push(triangle_list);
                    Q.push(triangle_list);
                    //console.log("triangle added:", p, q, index_needed);
                }

            }
        }
        console.log("Q is: ", Q);
        console.log("Z is: ", Z);
        //break;

    }

}


function triangle_normal(point1, point2, point3) {
    var a1 = point2.x - point1.x;
    var b1 = point2.y - point1.y;
    var c1 = point2.z - point1.z;
    var a2 = point3.x - point1.x;
    var b2 = point3.y - point1.y;
    var c2 = point3.z - point1.z;
    var a = b1 * c2 - b2 * c1;
    var b = a2 * c1 - a1 * c2;
    var c = a1 * b2 - b1 * a2;
    var d = (-a * point1.x - b * point1.y - c * point1.z);
    return {x: a, y: b, z: c};
}

function find_third_point(point_list) {
    //[0] and [1] are the first 2 points
    var normal_length = Math.pow(vlen(vectorV(point_list[1], point_list[0])), 2) / (point_list[1].y - point_list[0].y);
    var normal_point = {x: point_list[0].x, y: point_list[0].y + normal_length, z: point_list[0].z};
    var normal = vectorV(normal_point, point_list[1]);
    var my_triangle = triangle_normal(point_list[0], point_list[1], point_list[2]);
    var min_angle = Math.acos(Math.abs(dotProduct(normal, my_triangle)) / (vlen(my_triangle) * vlen(normal)));
    var index_needed = 0;
    for (var i = 2; i < n; i++) {
        my_triangle = triangle_normal(point_list[0], point_list[1], point_list[i]);
        var angle = Math.acos(Math.abs(dotProduct(normal, my_triangle)) / (vlen(my_triangle) * vlen(normal)));
        if (angle <= min_angle) {
            min_angle = angle;
            index_needed = i;
        }

    }
    console.log("third:", index_needed);
    swap_points(point_list, index_needed, 2);
}

function vectorV(pointA, pointB) {
    return {x: pointA.x - pointB.x, y: pointA.y - pointB.y, z: pointA.z - pointB.z};
}
function swap_points(the_array, index1, index2) {
    var temp;
    temp = the_array[index1];
    the_array[index1] = the_array[index2];
    the_array[index2] = temp;
    //console.log(the_array);
}
function find_first_point(point_list) {
    var min_y = point_list[0].y;
    var index_needed = 0;
    for (var i = 0; i < n; i++) {
        if (point_list[i].y < min_y) {
            min_y = point_list[i].y;
            index_needed = i;
        }
    }
    swap_points(point_list, index_needed, 0);
    //console.log(point_list);
}

//console.log(find_first_point(points));f
function find_second_point(point_list) {
    const normal = {x: 0, y: point_list[0].y, z: 0};
    var newVec = vectorV(point_list[1], point_list[0]);
    var min_angle = Math.asin(Math.abs(dotProduct(normal, newVec)) / (vlen(newVec) * vlen(normal))) * 180 / Math.PI;
    //console.log(min_angle);
    var index_needed = 1;
    for (var i = 1; i < n; i++) {
        newVec = vectorV(point_list[i], point_list[0]);
        var angle = Math.asin(Math.abs(dotProduct(normal, newVec)) / (vlen(newVec) * vlen(normal))) * 180 / Math.PI;
        //console.log(angle);
        if (angle < min_angle) {
            min_angle = angle;
            index_needed = i;
            //console.log(index_needed);
        }

    }
    console.log("second: ", index_needed);
    swap_points(point_list, index_needed, 1);
    //console.log(points);
}

function dotProduct(pointA, pointB) {
    return (pointA.x * pointB.x + pointA.y * pointB.y + pointA.z * pointB.z);
}
function vlen(pointA) {
    return Math.sqrt(pointA.x * pointA.x + pointA.y * pointA.y + pointA.z * pointA.z);
}

function checkCollinear(p0, p1, p2) {
    point01 = vectorV(p0, p1);
    point12 = vectorV(p1, p2);
    checkP = cross(point01, point12);
    return (checkP.x - checkP.y + checkP.z === 0)
}

function cross(pointA, pointB) {
    var x = (pointA.y * pointB.z) - (pointA.z * pointB.y);
    var y = (pointA.z * pointB.x) - (pointA.x * pointB.z);
    var z = (pointA.x * pointB.y) - (pointA.y * pointB.x);
    return {x: x, y: y, z: z};
}

function equation_plane(point1, point2,point3) {
    var a1 = point2.x - point1.x;
    var b1 = point2.y - point1.y;
    var c1 = point2.z - point1.z;
    var a2 = point3.x - point1.x;
    var b2 = point3.y - point1.y;
    var c2 = point3.z - point1.z;
    var a = b1 * c2 - b2 * c1;
    var b = a2 * c1 - a1 * c2;
    var c = a1 * b2 - b1 * a2;
    var d = (-a * point1.x - b * point1.y - c * point1.z);
    my_plane.a = a;
    my_plane.b = b;
    my_plane.c = c;
    my_plane.d = d;
    return my_plane;
}
function sign(p1,p2,p3,p4){
    equation_plane(p2,p3,p4);
    check_value = my_plane.a * p1.x + my_plane.b * p1.y + my_plane.c * p1.z + my_plane.d;
    if (check_value >= 0){
        return "L";
    }
    if (check_value <= 0){
        return "R";
    }
}

var my_plane = {
    a: 0,
    b: 0,
    c: 0,
    d: 0
};
function brute_force(){
    var side = [];
    result_triangles = [];
    for(i = 0; i < points.length-2; i ++){
        for (j = i+1; j < points.length-1;j ++){
            for (k = j + 1; k < points.length;k ++){
                if (!checkCollinear(points[i],points[j],points[k])){
                    //test all of the other points
                    for (l = 0; l < points.length; l ++){
                        if (l !== i && l !== j && l !== k){
                            side.push(sign(points[l],points[i],points[j],points[k]));
                        }
                    }
                    var side_Set = new Set(side);
                    if (Array.from(side_Set).length < 2){
                        result_triangles.push([i,j,k]);
                    }
                    side = [];
                }
            }
        }
    }
    return result_triangles;
}
console.log("brute force: ", brute_force());