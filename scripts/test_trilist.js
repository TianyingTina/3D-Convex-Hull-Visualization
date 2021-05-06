/**
 * Created by tianyingzhang on 4/29/21.
 */
// var triangle_dict = {};
// for (var i = 0; i < 20; i++) {
//     for (var j = i + 1; j < 20; j++) {
//         for (var k = j + 1; k < 20; k++) {
//             dic_key = i.toString(10) +","+ j.toString(10) + "," + k.toString(10);
//             if(i + j + k === 20){
//             triangle_dict[dic_key] = ["yes", "color"];
//             }
//             else{
//                 triangle_dict[dic_key] = ["no","nocolor"];
//             }
//         }
//     }
// }
// console.log(triangle_dict);
const n = 5;
g = [];
for(var i = 0; i < n; i ++){
    g.push([]);
    for(var j = 0; j < n; j++){
        g[i].push(0);
    }
}
console.log(g[4][4]);



// function pre_process_points(point_list){
//     max_vlen = 0;
//     ans = [];
//     for(var i = 0; i < n; i++){
//         for (var j = i+1; j<n;j++){
//             vec = vectorV(point_list[i],point_list[j]);
//             vlen_ij = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
//             if (vlen_ij> max_vlen){
//                 max_vlen = vlen_ij;
//                 ans = [i,j];
//             }
//         }
//     }
//     swap_points(point_list,ans[0],0);
//     swap_points(point_list,ans[1],1);
//     //return ans
// }
//console.log(pre_process_points(points));
function pre_process_triangle(point_list) {
    var m = vectorV(point_list[1], point_list[0]);
    var m_len = Math.sqrt(m.x * m.x + m.y * m.y + m.z * m.z);
    var max_dis = 0;
    var index_needed = 0;
    console.log(m);
    for (var i = 2; i < n; i++) {
        distance = Math.abs(dotProduct(vectorV(point_list[i], m))) / m_len;
        if (distance > max_dis) {
            max_dis = distance;
            index_needed = i;
        }
    }
    return i;
}
// pre_process_points(points);
console.log(pre_process_triangle(points));