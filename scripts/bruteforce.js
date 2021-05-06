/**
 * Created by tianyingzhang on 4/27/21.
 */
var my_plane = {
    a: 0,
    b: 0,
    c: 0,
    d: 0
};

// var points =
//     [
//         { x: 4, y: -15, z: 7 },
//         { x: -9, y: 14, z: -12 },
//         { x: 8, y: 10, z: -12 },
//         { x: -4, y: -14, z: -7 },
//         { x: 4, y: 6, z: 6 },
//         { x: -14, y: 4, z: -6 }
//     ];

side = [];
function triangles(){
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

// console.log(triangles());



function dotProduct(pointA, pointB) {
    return (pointA.x * pointB.x + pointA.y * pointB.y + pointA.z * pointB.z);
}

function cross(pointA, pointB) {
    x = (pointA.y * pointB.z) - (pointA.z * pointB.y);
    y = (pointA.z * pointB.x) - (pointA.x * pointB.z);
    z = (pointA.x * pointB.y) - (pointA.y * pointB.x);
    return {x: x, y: y, z: z};
}

function vectorV(pointA, pointB) {
    return {x: pointA.x - pointB.x, y: pointA.y - pointB.y, z: pointA.z - pointB.z};
}

function checkCollinear(p0,p1,p2){
    point01 = vectorV(p0,p1);
    point12 = vectorV(p1,p2);
    checkP =  cross(point01, point12);
    return (checkP.x -  checkP.y + checkP.z === 0)
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