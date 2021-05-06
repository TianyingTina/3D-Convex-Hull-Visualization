/**
 * Created by tianyingzhang on 4/27/21.
 */
const points = [
    { x: -3, y: 4, z: 0 },
    { x: 1, y: 2, z: 3 },
    { x: -3, y: 5, z: 10 },
    { x: -8, y: -5, z: 10 },
    { x: 8, y: 1, z: 9 },
    { x: -5, y: 9, z: 10 },
    { x: 9, y: -8, z: -8 },
    { x: 1, y: 5, z: 1 },
    { x: -4, y: -1, z: -5 },
    { x: -7, y: -4, z: 6 }
];
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#cc")
});

renderer.setClearColor(0xEEEEEE);
renderer.setSize(window.innerWidth, window.innerHeight);

//xyz-axis
var axes = new THREE.AxisHelper(20);//记住，蓝色轴为z轴，红色轴为x轴。绿色轴为y轴
scene.add(axes);

//a point
var point1 = new THREE.Vector3(points[0].x, points[0].y, points[0].z); //创建一个坐标点

var sphereGeometry = new THREE.SphereGeometry(.1, 20, 20);
var sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x7777ff,
    wireframe: false
});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

sphere.position.copy(point1);

scene.add(sphere);

for(var i = 1; i < points.length;i++){
    var new_point = new THREE.Vector3(points[i].x,points[i].y,points[i].z);
    new_sphere = sphere.clone();
    new_sphere.position.copy(new_point);
    scene.add(new_sphere);
}
camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;
camera.lookAt(scene.position);

// 执行一次渲染器，GPU渲染成图像，绘制到canvas里面呈现
 renderer.render(scene, camera);
// //帧数统计
// var stats = new THREE.Stats();
// document.body.appendChild(stats.dom);//简单的直接添加的方法
// function animate(){
//     requestAnimationFrame(animate);
//     renderer.render(scene,camera);
//     stats.update();//更新animate函数 ，添加统计更新
// }