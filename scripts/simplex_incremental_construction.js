/**
 * Created by tianyingzhang on 5/5/21.
 */
//check the first 4 points are not on the same plane
//check the first 3 points are not on the same line
var points =
    [
        {x: 4, y: -15, z: 7}, {x: -4, y: -14, z: -7},
        {x: 8, y: 10, z: -12}, {x: -9, y: 14, z: -12},
        {x: 4, y: 6, z: 6}, {x: -14, y: 4, z: -6}
    ];//the points we have
const n = points.length; //the number of points
console.log(n);
var F = [];
incremental_construction(points);

function vlen(pointA_index) {
    return Math.sqrt(points[pointA_index].x * points[pointA_index].x + points[pointA_index].y * points[pointA_index].y + points[pointA_index].z * points[pointA_index].z);
}

function dblcmp(pointA, face)//redo the check same plane take face as a parameter. If positive, the same direction.
{
    var m = vectorV(points[face.b], points[face.a]);
    var n = vectorV(points[face.c], points[face.a]);
    var t = vectorV(pointA, points[face.a]);
    return dotProduct(cross(m, n), t);
}


// console.log(check_validation(a,b,c,d));
function dotProduct(pointA, pointB) {
    return (pointA.x * pointB.x + pointA.y * pointB.y + pointA.z * pointB.z);
}

function cross(pointA, pointB) {
    var x = (pointA.y * pointB.z) - (pointA.z * pointB.y);
    var y = (pointA.z * pointB.x) - (pointA.x * pointB.z);
    var z = (pointA.x * pointB.y) - (pointA.y * pointB.x);
    return {x: x, y: y, z: z};
}


function vectorV(pointA, pointB) {
    return {x: pointA.x - pointB.x, y: pointA.y - pointB.y, z: pointA.z - pointB.z};
}

function checkCollinear(p0, p1, p2) {
    point01 = vectorV(p0, p1);
    point12 = vectorV(p1, p2);
    checkP = cross(point01, point12);
    return (checkP.x - checkP.y + checkP.z === 0)
}

function check_validation(p0, p1, p2, p3) {
    var checkV = dotProduct(vectorV(p3, p0), cross(vectorV(p2, p0), vectorV(p1, p0)));
    //console.log(checkV);
    if (checkV === 0) return false;
    else return true;
}

function swap_points(the_array, index1, index2) {
    var temp;
    temp = the_array[index1];
    the_array[index1] = the_array[index2];
    the_array[index2] = temp;
    //console.log(the_array);
}
// console.log(swap_points([1,2,3,4,5,6,7,8,9,10],2,6));

function incremental_construction(point_list) {
    var i, j, temp;
    var flag = true;
    num = 0;
    if (n < 4) return;
    //check the points are the same or not, but I have pre-processed the points
    // for(i = 1; i < n; i ++){
    //     if(vlen(points[0]-points[i])>0){
    //         swap_points(points[1],points[i]);
    //         flag=false;
    //         break;
    //     }
    // }
    for (i = 2; i < n; i++)   //使前三点不共线
    {
        if (checkCollinear(point_list[0], point_list[1], point_list[2]) === false) {
            swap_points(point_list, 2, i);
            flag = false;
            break;
        }
        console.log("i'm now in check three points.")
    }
    if (flag) {
        console.log("3 fail.");
        return;
    }
    flag = true;
    for (i = 3; i < n; i++)  //使前四点不共面
    {
        if (check_validation(point_list[0], point_list[1], point_list[2], point_list[3])) {
            swap_points(point_list, 3, i);
            flag = false;
            break;
        }
        //console.log("i'm now in check four points.")
    }
    if (flag) {
        //console.log("4 fail.");
        return;
    }
    for (i = 0; i < 4; i++) {//construct the very first polyhedron(tetrahedron)
        var x = (i + 1) % 4;
        var y = (i + 2) % 4;
        var z = (i + 3) % 4;
        var temp_ok = true;
        if (dblcmp(point_list[i], {a: x,b:y,c:z}) > 0) {
            temp = x;
            x = y;
            y = temp;
        }//change to correct face;
        F.push([x,y,z].sort());
        console.log("after add the first, F and g", F);
    }


    //TODO: visualization

    for (i = 4; i < n; i++) {
        for(j = 0;j < F.length;j++) {
            var current_face = F[j];
            if (current_face !== "no" && (i !== F[j][0] && i !== F[j][1] && i !== F[j][2])) {

                F.push([F[j][1], F[j][0], i].sort());
                F.push([F[j][2], F[j][1], i].sort());
                F.push([F[j][0], F[j][2], i].sort());
                F = unique(F);
                console.log(F);
            }
        }
        //TODO: visualize(F); red and blue


    }
    console.log(F);
    return F;

}
function unique(arr) {
    return Array.from(new Set(arr))
}