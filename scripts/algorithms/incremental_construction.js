//check the first 4 points are not on the same plane
//check the first 3 points are not on the same line
var sample_face = {a: 0, b: 0, c: 0, ok: false};
var points =
    [
        {x: 4, y: -15, z: 7}, {x: -4, y: -14, z: -7},
        {x: 8, y: 10, z: -12}, {x: -9, y: 14, z: -12},
        {x: 4, y: 6, z: 6}, {x: -14, y: 4, z: -6}
    ];//the points we have
const n = points.length; //the number of points
console.log(n);
var num; //number of faces on final convex hull
var F = [];
var g = [];//triangles on the convex hull
// const a = {x: 2, y: 4, z: 0};
// const b = {x: 2, y: 9, z: 8};
// const c = {x: 6, y: 13, z: 9};
// const d = {x: 2, y: 7, z: 0};

function init_F() {
    for (var i = 0; i < 8*n; i++) {
        F.push(0);
    }
    // console.log("After initialization, F: ", F);
}
function init_g() {
    for (var i = 0; i < n; i++) {
        g.push([]);
        for (var j = 0; j < n; j++) {
            g[i].push('no');
        }
    }
}

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

function deal(newPointIndex, facePointAIndex, facePointBIndex) {
    f = g[facePointAIndex][facePointBIndex];
    if (F[f].ok) {
        if (dblcmp(points[newPointIndex], F[f]) > 0)//Is this face visible for the new point?
            dfs(newPointIndex, f);
        else {
            a = facePointBIndex;
            b = facePointAIndex;
            c = newPointIndex;
            g[newPointIndex][facePointBIndex] = g[facePointAIndex][newPointIndex] = g[facePointBIndex][facePointAIndex] = num;
            F[num] = {a:a,b:b,c:c,ok:true};
            //TODO: visualization
            console.log("Deal Add.");
            num++;
        }
    }
}

function dfs(pointIndex, nowPointIndex) {//set the ok's to 0;
    F[nowPointIndex].ok = false;
    //TODO: visualize
    deal(pointIndex, F[nowPointIndex].b, F[nowPointIndex].a);
    deal(pointIndex, F[nowPointIndex].c, F[nowPointIndex].b);
    deal(pointIndex, F[nowPointIndex].a, F[nowPointIndex].c);
}

// console.log(check_validation(a,b,c,d));
function dotProduct(pointA, pointB) {
    return (pointA.x * pointB.x + pointA.y * pointB.y + pointA.z * pointB.z);
}

// function vlen(){     //向量长度
//     return Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
// }
// console.log(vlen());

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
    init_g();
    init_F();
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
        if (dblcmp(point_list[i], {a: x,b:y,c:z, ok:temp_ok}) > 0) {
            temp = x;
            x = y;
            y = temp;
        }//change to correct face;
        g[x][y] = g[y][z] = g[z][x] = num;
        F[num] = {a: x,b:y,c:z, ok:temp_ok};
        console.log("after add the first, F and g", F,g);
        num++;
    }

    //TODO: visualization

    for (i = 4; i < n; i++) {
        for (j = 0; j < num; j++) {
            if (F[j].ok && dblcmp(points[i], F[j]) > 0) {
                dfs(i,j);//visible face
                break;
            }
        }

    }
    temp = num;
    ans = [];
    for (i = 0 ; i < temp; i++) {
        if (F[i].ok === true){
            ans.push(F[i]);
        }

    }
    console.log(points);
    console.log("after ic, F ", F);
    console.log("after ic, ans ", ans);
    return ans;

}
