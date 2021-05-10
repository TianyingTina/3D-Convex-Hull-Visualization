var scene,stats,render,camera,plane,guiControl, controls, states,gui,item;
gui = new dat.GUI();
var triangle_dict;
const n = points.length; //the number of points
var F = [];
group = new THREE.Group();
states = [];
//construct triangle_list
function init_triangledict(){
    temp_constructor={};
    for (var i = 0; i < points.length; i++) {
        for (var j = i + 1; j < points.length; j++) {
            for (var k = j + 1; k < points.length; k++) {
                var dic_key = i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
                //current_triangle? visible? color?
                temp_constructor[dic_key] = [false, false, "rgb(144, 238, 144)"];
                //console.log("current dict:" , temp_constructor[dic_key]);
            }
        }
    }
    //console.log("temp:" + temp_constructor);
    return temp_constructor;
}

function construct_states(){
    init_triangledict();
    states = [];
    console.log("This is first:" , triangle_dict);
    states.push(triangle_dict);
    triangles();
}

function triangles() {
    console.log("run triangles");
    var temp_triangle_dic = Object.assign({}, triangle_dict);
    var temp2 = Object.assign({}, triangle_dict);
    var i, j, temp;
    var flag = true;
    var keys = [];
    //three points are not collinear
    for (i = 2; i < points.length; i++) {
        if (checkCollinear(points[0], points[1], points[2]) === false) {
            swap_points(points, 2, i);
            flag = false;
            break;
        }
    }
    if (flag) {
        console.log("3 fail.");
        return;
    }
    flag = true;
    //4 points are not in the same plane
    for (i = 3; i < points.length; i++){
        if (check_validation(points[0], points[1], points[2], points[3])) {
            swap_points(points, 3, i);
            flag = false;
            break;
        }
        console.log("i'm now in check four points.")
    }
    if (flag) {
        console.log("4 fail.");
        return;
    }
    for (i = 0; i < 4; i++) {//construct the very first polyhedron(tetrahedron)
        var x = (i + 1) % 4;
        var y = (i + 2) % 4;
        var z = (i + 3) % 4;
        var temp_ok = true;
        if (dblcmp(points[i], {a: x,b:y,c:z}) > 0) {
            temp = x;
            x = y;
            y = temp;
        }//change to correct face;
        F.push([x,y,z].sort());
        //console.log("push here.");

        var current_triangle = F[i][0].toString(10) + "," + F[i][1].toString(10) + "," + F[i][2].toString(10);
        keys.push(current_triangle);
        temp_triangle_dic[current_triangle]= [true,true,"rgb(255, 13, 27)"];

        //console.log("after add the first, F and g", F);
    }
    temp2 = Object.assign({}, temp_triangle_dic);
    states.push(temp2);
    //console.log("show the first polygon");
    for(var k = 0;k<keys.length;k++){
        if(temp_triangle_dic[keys[k]][0] ===true){
            temp_triangle_dic[keys[k]]=[false,true,"rgb(79, 114, 240)"];
        }
    }
    temp2 = Object.assign({}, temp_triangle_dic);
    states.push(temp2);
    keys = [];

    for (i = 4; i < points.length; i++) {
        for(j = 0;j < F.length;j++) {
            var current_face = F[j];
            if (current_face !== "no" && (i !== F[j][0] && i !== F[j][1] && i !== F[j][2])) {

                F.push([F[j][1], F[j][0], i].sort());
                var key_1 = [F[j][1], F[j][0], i].sort();
                var key_1_code = key_1[0].toString(10) + "," + key_1[1].toString(10) + "," + key_1[2].toString(10);
                F.push([F[j][2], F[j][1], i].sort());
                var key_2 = [F[j][2], F[j][1], i].sort();
                var key_2_code = key_2[0].toString(10) + "," + key_2[1].toString(10) + "," + key_2[2].toString(10);
                F.push([F[j][0], F[j][2], i].sort());
                var key_3 = [F[j][0], F[j][2], i].sort();
                var key_3_code = key_3[0].toString(10) + "," + key_3[1].toString(10) + "," + key_3[2].toString(10);
                keys.push(key_1_code);
                keys.push(key_2_code);
                keys.push(key_3_code);

                F = unique(F);
                console.log(F);
            }
        }
        //TODO: visualize(F); red and blue
        keys = unique(keys);
        for(var l = 0; l < keys.length; l++){
                temp_triangle_dic[keys[l]]=[true,true,"rgb(255, 13, 27)"];
        }
        temp2 = Object.assign({}, temp_triangle_dic);
        states.push(temp2);
        for(var m = 0;m<keys.length;m++){
            if(temp_triangle_dic[keys[m]][0] ===true){
                temp_triangle_dic[keys[m]]=[false,true,"rgb(79, 114, 240)"];
            }
        }
        temp2 = Object.assign({}, temp_triangle_dic);
        states.push(temp2);
        keys = [];
    }
    console.log(F);
    return F;
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

function drawTriangle(p1,p2,p3){
    // create just one triangle
    var vertices = new Float32Array([
        p1.x,p1.y,p1.z,
        p2.x,p2.y,p2.z,
        p3.x,p3.y,p3.z
    ]);
    var faces = new Uint32Array([
        // 0, 1, 2 // only one face
        0,1,2,
        0,2,1
    ]);
    const v1 = new THREE.Vector3(p1.x,p1.y,p1.z);
    const v2 = new THREE.Vector3(p2.x,p2.y,p2.z);
    const v3 = new THREE.Vector3(p3.x,p3.y,p3.z);
    //const geometry = new THREE.Triangle(v1,v2,v3);
    const geometry = new THREE.BufferGeometry();
    //const geometry = new THREE.PolyhedronGeometry(vertices, faces, 20, 0)
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.setIndex(new THREE.BufferAttribute(faces, 1));
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    var triangle = new THREE.Mesh(geometry, material);
    group.add(triangle);
}

function drawTriangles(triangle_List){
    for (var i = 0; i < points.length-2; i++) {
        for (var j = i + 1; j < points.length-1; j++) {
            for (var k = j + 1; k < points.length; k++) {
                var list_key = i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
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
                        transparent: false,});
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

function unique(arr) {
    return Array.from(new Set(arr))
}