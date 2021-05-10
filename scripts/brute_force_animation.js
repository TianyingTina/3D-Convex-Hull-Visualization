/**
 * Created by tianyingzhang on 4/29/21.
 */
var scene,stats,render,camera,plane,guiControl, controls, states,gui,item;
gui = new dat.GUI();
var triangle_dict;
group = new THREE.Group();
var my_plane = {
    a: 0,
    b: 0,
    c: 0,
    d: 0
};
side = [];
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
    states.push(triangle_dict);
    triangles();
}

function init(n){

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    var axes = new THREE.AxesHelper(20);
    //scene.add(axes);

     //addPlane();
     addPoints(points);
     scene.add(group);

     drawTriangles(states[n]);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);


    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));//渲染器清除颜色 ：淡灰色
    renderer.setSize(window.innerWidth,window.innerHeight);

     document.getElementById("0").appendChild(renderer.domElement);

   // renderer.render(scene, camera);

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

function addPlane(){
    var planeGeometry = new THREE.PlaneGeometry(60, 60);
    var planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        opacity: 10,
        transparent: true,
    });
    plane = new THREE.Mesh(planeGeometry, planeMaterial);//填充

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);
}

function addPoints(point){
    var point1 = new THREE.Vector3(point[0].x, point[0].y, point[0].z);

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
    group.rotation.y += guiControl.rotationSpeed;
    group.rotation.x += guiControl.rotationSpeed;
    controls.update();
    stats.update();
    renderer.render(scene,camera);
}

function triangles(){
    var result_triangles = [];
    var temp_triangle_dic = Object.assign({}, triangle_dict);
    var temp2 = Object.assign({}, triangle_dict);
    for(i = 0; i < points.length; i ++){
        for (j = i+1; j < points.length;j ++){
            for (k = j + 1; k < points.length;k ++){
                if (!checkCollinear(points[i],points[j],points[k])){
                    var current_triangle = i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
                    temp_triangle_dic[current_triangle]= [true,true,"rgb(255, 13, 27)"];
                    temp2 = Object.assign({}, temp_triangle_dic);
                    states.push(temp2);
                    //run vis
                    //test all of the other points
                    for (l = 0; l < points.length; l ++){
                        if (l !== i && l !== j && l !== k){
                            side.push(sign(points[l],points[i],points[j],points[k]));
                            //sleep(2000);
                            //console.log("wake up");

                        }
                    }
                    var side_Set = new Set(side);
                    if (Array.from(side_Set).length < 2){
                        result_triangles.push([points[i],points[j],points[k]]);
                        temp_triangle_dic[current_triangle] = [false,true,"rgb(79, 114, 240)"];
                        temp2 = Object.assign({}, temp_triangle_dic);
                        states.push(temp2);
                    }
                    else{
                        temp_triangle_dic[current_triangle] = [false,false,"rgb(144, 238, 144)"];
                        temp2 = Object.assign({}, temp_triangle_dic);
                        states.push(temp2);
                    }

                    side = [];
                }
            }
        }
    }
    return result_triangles;
}

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