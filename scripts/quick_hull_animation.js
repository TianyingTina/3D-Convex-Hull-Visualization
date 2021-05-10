/**
 * Created by tianyingzhang on 4/29/21.
 */
var scene,stats,render,camera,plane,guiControl, controls, states,gui,item;
gui = new dat.GUI();
var triangle_dict = {};
group = new THREE.Group();
states = [];
var num; //number of faces on final convex hull
var F = [];
var g = [];//triangles on the convex hull
//construct triangle_list
// function init_triangledict(){
//     temp_constructor={};
//     for (var i = 0; i < points.length; i++) {
//         for (var j = i + 1; j < points.length; j++) {
//             for (var k = j + 1; k < points.length; k++) {
//                 var dic_key = i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
//                 //current_triangle? visible? color?
//                 temp_constructor[dic_key] = [false, false, "rgb(144, 238, 144)"];
//                 //console.log("current dict:" , temp_constructor[dic_key]);
//             }
//         }
//     }
//     //console.log("temp:" + temp_constructor);
//     return temp_constructor;
// }
//
//
//

function construct_states(){
    //init_triangledict();
    states = [];
    //console.log("This is first:" , triangle_dict);
    states.push({});
    triangles();
}

function triangles() {
    init_g();
    init_F();
    var keys = [];
    var i, j, temp;
    var flag = true;
    num = 0;
    //if (points.length < 4) return;
    //check the points are the same or not, but I have pre-processed the points
    // for(i = 1; i < points.length; i ++){
    //     if(vlen(points[0]-points[i])>0){
    //         swap_points(points[1],points[i]);
    //         flag=false;
    //         break;
    //     }
    // }
    pre_process_points();
    pre_process_triangle();
    var first_triangle_key = "0" + "," + "1" + "," +"2";
    triangle_dict[first_triangle_key] = [true,true,"rgb(255, 13, 27)"];
    temp2 = Object.assign({}, triangle_dict);
    states.push(temp2);

    triangle_dict[first_triangle_key] = [false,false,"rgb(255, 13, 27)"];

    for (i = 3; i < points.length; i++)  //使前四点不共面
    {
        if (check_validation(points[0], points[1], points[2], points[3])) {
            swap_points(points, 3, i);
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
        if (dblcmp(points[i], {a: x,b:y,c:z, ok:temp_ok}) > 0) {
            temp = x;
            x = y;
            y = temp;
        }//change to correct face;
        g[x][y] = g[y][z] = g[z][x] = num;
        F[num] = {a: x,b:y,c:z, ok:temp_ok};
        var key = F[num].a.toString(10) + "," + F[num].b.toString(10) + "," + F[num].c.toString(10);
        keys.push(key);
        console.log("after add the first, F and g", F,g);
        num++;
    }
    for(i = 0; i< keys.length;i++){
        triangle_dict[keys[i]] = [true,true,"rgb(255, 13, 27)"];
    }
    temp2 = Object.assign({}, triangle_dict);
    states.push(temp2);

    for(i = 0; i< keys.length;i++){
        triangle_dict[keys[i]] = [false,true,"rgb(79, 114, 240)"];
    }

    keys = [];


    for (i = 4; i < points.length; i++) {
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
    //console.log(points);
    //console.log("after ic, F ", F);
    //console.log("after ic, ans ", ans);
    return ans;

}

function pre_process_points(){
    max_vlen = 0;
    ans = [];
    for(var i = 0; i < points.length; i++){
        for (var j = i+1; j<points.length;j++){
            vec = vectorV(points[i],points[j]);
            vlen_ij = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
            if (vlen_ij> max_vlen){
                max_vlen = vlen_ij;
                ans = [i,j];
            }
        }
    }
    swap_points(points,ans[0],0);
    swap_points(points,ans[1],1);
    //console.log(points);
}

function pre_process_triangle() {
    var m = vectorV(points[1], points[0]);
    var m_len = Math.sqrt(m.x * m.x + m.y * m.y + m.z * m.z);
    var max_dis = 0;
    var index_needed = 0;
    //console.log(m);
    for (var i = 2; i < points.length; i++) {
        var a = vectorV(points[i], points[0]) ;
        var unit_distance = dotProduct(a,m) / Math.pow(m_len,2);
        var c = {x:m.x *unit_distance,y: m.y*unit_distance,z:m.z*unit_distance};
        var distance_vec = vectorV(a,c);
        var distance = Math.sqrt(distance_vec.x * distance_vec.x + distance_vec.y * distance_vec.y + distance_vec.z * distance_vec.z);;
        //console.log(distance);
        console.log("distance = ",distance);
        if (distance > max_dis) {
            max_dis = distance;
            index_needed = i;
        }
    }
    swap_points(points,index_needed,2);
}

function init(n){
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    var axes = new THREE.AxesHelper(20);

    addPoints(points);
    scene.add(group);

    drawTriangles(states[n]);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth,window.innerHeight);

    document.getElementById("0").appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    guiControl = new function(){
        this.rotationSpeed = 0.00;
    };
    item = gui.add(guiControl, 'rotationSpeed', 0,0.01);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.minDistance = 20.0;
    controls.maxDistance = 400.0;
    controls.dymnamicDampingFactor = 0.1;

}

function dispose_current_scence(){
    group = new THREE.Group();
}

function addPoints(point){
    var point1 = new THREE.Vector3(point[0].x, point[0].y, point[0].z); //创建一个坐标点

    var sphereGeometry = new THREE.SphereGeometry(.1, 0, 0);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        wireframe: false
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.copy(point1);

    group.add(sphere);

    for(var i = 1; i < point.length;i++){
        var new_point = new THREE.Vector3(point[i].x,point[i].y,point[i].z);
        new_sphere = sphere.clone();
        new_sphere.position.copy(new_point);
        group.add(new_sphere);
    }
}

function drawTriangles(triangle_List){

    for (var i = 0; i < points.length-2; i++) {
        for (var j = 0; j < points.length-1; j++) {
            for (var k = 0; k < points.length; k++) {
                var list_key = i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
                if (!(list_key in triangle_List))continue;
                if (triangle_List[list_key][1] === true){
                    //current_triangle? visible? color?
                    //drawTriangle(points[i],points[j],points[k]);
                    // create just one triangle
                    var vertices = new Float32Array([
                        points[i].x,points[i].y,points[i].z,
                        points[j].x,points[j].y,points[j].z,
                        points[k].x,points[k].y,points[k].z
                    ]);
                    var faces = new Uint32Array([
                        // 0, 1, 2 // only one face
                        0,1,2,
                        0,2,1
                    ]);
                    const v1 = new THREE.Vector3(points[i].x,points[i].y,points[i].z);
                    const v2 = new THREE.Vector3(points[j].x,points[j].y,points[j].z);
                    const v3 = new THREE.Vector3(points[k].x,points[k].y,points[k].z);
                    //const geometry = new THREE.Triangle(v1,v2,v3);
                    const geometry = new THREE.BufferGeometry();
                    //const geometry = new THREE.PolyhedronGeometry(vertices, faces, 20, 0)
                    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
                    geometry.setIndex(new THREE.BufferAttribute(faces, 1));
                    const material = new THREE.MeshBasicMaterial({color:triangle_List[list_key][2],opacity: 0.2,
                        transparent: true,});
                    var line = new THREE.Line (geometry, material);
                    var triangle = new THREE.Mesh(geometry, material);
                    group.add(line);
                    group.add(triangle);
                }
            }
        }
    }
}

function animate(){
    requestAnimationFrame(animate);
    group.rotation.y += guiControl.rotationSpeed;//线框模型旋转
    group.rotation.x += guiControl.rotationSpeed;//线框模型旋转
    controls.update();
    stats.update();
    renderer.render(scene,camera);

}


function init_F() {
    for (var i = 0; i < 8*points.length; i++) {
        F.push(0);
    }
    // console.log("After initialization, F: ", F);
}

function init_g() {
    for (var i = 0; i < points.length; i++) {
        g.push([]);
        for (var j = 0; j < points.length; j++) {
            g[i].push('no');
        }
    }
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
            var key =  F[num].a.toString(10) + "," + F[num].b.toString(10) + "," + F[num].c.toString(10);
            triangle_dict[key] = [false,true,"rgb(79, 114, 240)"];
            var temp2 = Object.assign({}, triangle_dict);
            states.push(temp2);
            console.log("Deal Add.");
            num++;
        }
    }
}

function dfs(pointIndex, nowPointIndex) {//set the ok's to 0;
    F[nowPointIndex].ok = false;
    var key = F[nowPointIndex].a.toString(10) + "," + F[nowPointIndex].b.toString(10) + "," + F[nowPointIndex].c.toString(10);
    triangle_dict[key] = [true,true,"rgb(255, 13, 27)"];
    temp2 = Object.assign({}, triangle_dict);
    states.push(temp2);
    triangle_dict[key] = [false,false,"rgb(144, 238, 144)"];
    temp2 = Object.assign({}, triangle_dict);
    states.push(temp2);
    //TODO: visualize
    deal(pointIndex, F[nowPointIndex].b, F[nowPointIndex].a);
    deal(pointIndex, F[nowPointIndex].c, F[nowPointIndex].b);
    deal(pointIndex, F[nowPointIndex].a, F[nowPointIndex].c);
}

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
