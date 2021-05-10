//todo: degenration

// gift_wrapping(points);
var scene, stats, render, camera, plane, guiControl, controls, states, gui, item;
gui = new dat.GUI();
var triangle_dict = {};
group = new THREE.Group();
states = [];

function construct_states() {
    states = [];
    states.push({});
    triangles();
}

function init(n) {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    var axes = new THREE.AxesHelper(20);
    //scene.add(axes);
    addPoints(points);
    scene.add(group);

    drawTriangles(states[n]);

    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.getElementById("0").appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);


    guiControl = new function () {
        this.rotationSpeed = 0.00;
    };
    item = gui.add(guiControl, 'rotationSpeed', 0, 0.01);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.minDistance = 20.0;
    controls.maxDistance = 400.0;
    controls.dymnamicDampingFactor = 0.1;
}

function dispose_current_scence() {
    group = new THREE.Group();
}

function addPoints(point) {
    var point1 = new THREE.Vector3(point[0].x, point[0].y, point[0].z);

    var sphereGeometry = new THREE.SphereGeometry(.1, 0, 0);
    var sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        wireframe: false
    });
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.position.copy(point1);

    group.add(sphere);

    for (var i = 1; i < point.length; i++) {
        var new_point = new THREE.Vector3(point[i].x, point[i].y, point[i].z);
        new_sphere = sphere.clone();
        new_sphere.position.copy(new_point);
        group.add(new_sphere);
    }
}

function drawTriangles(triangle_List) {
    for (var i = 0; i < points.length - 2; i++) {
        for (var j = 0; j < points.length - 1; j++) {
            for (var k = 0; k < points.length; k++) {
                var list_key = i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
                if (!(list_key in triangle_List))continue;
                if (triangle_List[list_key][1] === true) {
                    //current_triangle? visible? color?
                    //drawTriangle(points[i],points[j],points[k]);
                    // create just one triangle
                    var vertices = new Float32Array([
                        points[i].x, points[i].y, points[i].z,
                        points[j].x, points[j].y, points[j].z,
                        points[k].x, points[k].y, points[k].z
                    ]);
                    var faces = new Uint32Array([
                        // 0, 1, 2 // only one face
                        0, 1, 2,
                        0, 2, 1
                    ]);
                    const v1 = new THREE.Vector3(points[i].x, points[i].y, points[i].z);
                    const v2 = new THREE.Vector3(points[j].x, points[j].y, points[j].z);
                    const v3 = new THREE.Vector3(points[k].x, points[k].y, points[k].z);
                    //const geometry = new THREE.Triangle(v1,v2,v3);
                    const geometry = new THREE.BufferGeometry();
                    //const geometry = new THREE.PolyhedronGeometry(vertices, faces, 20, 0)
                    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
                    geometry.setIndex(new THREE.BufferAttribute(faces, 1));
                    const material = new THREE.MeshBasicMaterial({
                        color: triangle_List[list_key][2], opacity: 0.2,
                        transparent: true,
                    });
                    var line = new THREE.Line(geometry, material);
                    var triangle = new THREE.Mesh(geometry, material);
                    group.add(line);
                    group.add(triangle);
                }
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += guiControl.rotationSpeed;//线框模型旋转
    group.rotation.x += guiControl.rotationSpeed;//线框模型旋转
    controls.update();
    stats.update();
    renderer.render(scene, camera);
}

function generate_dic_key(a, b) {
    return a.toString(10) + "," + b.toString(10);
}

function tKey(i, j, k) {
    return i.toString(10) + "," + j.toString(10) + "," + k.toString(10);
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
function dblcmp(pointA, facepoint0, facepoint1, facepoint2){
    //redo the check same plane take face as a parameter. If positive, the same direction.
    var m = vectorV(facepoint1, facepoint0);
    var n = vectorV(facepoint2, facepoint0);
    var t = vectorV(pointA, facepoint0);
    return dotProduct(cross(m, n), t);
}

function triangles() {
    //find three first points.
    find_first_point();
    find_second_point();
    find_third_point();
    //console.log(points);
    if (dblcmp(points[3], points[0], points[1], points[2]) > 0) {
        temp = points[0];
        points[0] = points[1];
        points[1] = temp;
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
    var key_t = tKey(F[0], F[1], F[2]);
    triangle_dict[key_t] = [true, true, "rgb(255, 13, 27)"];
    temp2 = Object.assign({}, triangle_dict);
    states.push(temp2);
    triangle_dict[key_t] = [false, true, "rgb(79, 114, 240)"];
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
            if (T[generate_dic_key(p, q)] > 1) {
                //do nothing
                //console.log("check current dic:", generate_dic_key(p, q), ":", T[generate_dic_key(p, q)]);
            }
            else {
                //find the corresponding triangle
                var min_angle = 190;
                var index_needed = 0;
                for (var j = 0; j < points.length; j++) {
                    //console.log("current j:" ,j);
                    if (j !== p && j !== q && j !== r && !checkCollinear(points[p], points[q], points[j])) {
                        if (dblcmp(points[j], points[p], points[q], points[r]) > 0) {
                            temp = p;
                            p = q;
                            q = temp;
                            console.log("swap P and Q");
                            console.log("");
                        }
                        console.log("j=", j);
                        var pr = vectorV(points[r], points[p]);
                        var pq = vectorV(points[q], points[p]);
                        var pj = vectorV(points[j], points[p]);
                        var angle = Math.atan2(dotProduct(cross(cross(pr, pq), cross(pq, pj)), {
                                x: pq.x / vlen(pq),
                                y: pq.y / vlen(pq),
                                z: pq.z / vlen(pq)
                            }), dotProduct(cross(pr, pq), cross(pq, pj))) * 180 / Math.PI;
                        // normal_1 = triangle_normal(points[p],points[q],points[r]);
                        // normal_2 = triangle_normal(points[p],points[q],points[j]);
                        // var angle = (180/Math.PI) * Math.acos(dotProduct(normal_1, normal_2) / (vlen(normal_1) * vlen(normal_2)));
                        console.log(angle);
                        //if (angle < 0){angle = 90;}
                        if (angle < min_angle) {
                            console.log("angle:", angle, "less then min_angle", min_angle);
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
                    console.log(triangle_list);
                    Z.push(triangle_list);

                        key_t = tKey(triangle_list[0], triangle_list[1], triangle_list[2]);
                        triangle_dict[key_t] = [true, true, "rgb(255, 13, 27)"];
                        temp2 = Object.assign({}, triangle_dict);
                        states.push(temp2);

                        triangle_dict[key_t] = [false, true, "rgb(79, 114, 240)"];

                    Q.push(triangle_list);
                    //console.log("triangle added:", p, q, index_needed);
                }

            }
        }
        console.log("Q is: ", Q);
        console.log("Z is: ", Z);
    }
    temp2 = Object.assign({}, triangle_dict);
    states.push(temp2);
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

function find_third_point() {
    //[0] and [1] are the first 2 points
    var normal_length = Math.pow(vlen(vectorV(points[1], points[0])), 2) / (points[1].y - points[0].y);
    var normal_point = {x: points[0].x, y: points[0].y + normal_length, z: points[0].z};
    var normal = vectorV(normal_point, points[1]);
    var my_triangle = triangle_normal(points[0], points[1], points[2]);
    var min_angle = Math.acos(Math.abs(dotProduct(normal, my_triangle)) / (vlen(my_triangle) * vlen(normal)));
    var index_needed = 0;
    for (var i = 2; i < points.length; i++) {
        my_triangle = triangle_normal(points[0], points[1], points[i]);
        var angle = Math.acos(Math.abs(dotProduct(normal, my_triangle)) / (vlen(my_triangle) * vlen(normal)));
        if (angle <= min_angle) {
            min_angle = angle;
            index_needed = i;
        }

    }
    console.log("third:", index_needed);
    swap_points(points, index_needed, 2);
}

function vectorV(pointA, pointB) {
    return {x: pointA.x - pointB.x, y: pointA.y - pointB.y, z: pointA.z - pointB.z};
}

function swap_points(the_array, index1, index2) {
    var temp;
    temp = the_array[index1];
    the_array[index1] = the_array[index2];
    the_array[index2] = temp;
}

function find_first_point() {
    var min_y = points[0].y;
    var index_needed = 0;
    for (var i = 0; i < points.length; i++) {
        if (points[i].y < min_y) {
            min_y = points[i].y;
            index_needed = i;
        }
    }
    swap_points(points, index_needed, 0);
}

function find_second_point() {
    const normal = {x: 0, y: points[0].y, z: 0};
    var newVec = vectorV(points[1], points[0]);
    var min_angle = Math.asin(Math.abs(dotProduct(normal, newVec)) / (vlen(newVec) * vlen(normal))) * 180 / Math.PI;
    //console.log(min_angle);
    var index_needed = 1;
    for (var i = 1; i < points.length; i++) {
        newVec = vectorV(points[i], points[0]);
        var angle = Math.asin(Math.abs(dotProduct(normal, newVec)) / (vlen(newVec) * vlen(normal))) * 180 / Math.PI;
        //console.log(angle);
        if (angle < min_angle) {
            min_angle = angle;
            index_needed = i;
            //console.log(index_needed);
        }
    }
    swap_points(points, index_needed, 1);
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