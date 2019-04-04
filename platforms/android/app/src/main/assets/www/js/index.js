document.addEventListener("deviceready", onDeviceReady);

function onDeviceReady() {
    console.log("启动");
    var options = {
        frequency: 1500000,
        maximumAge: 3600000,
        timeout: 3000,
        enableHighAccuracy: true,
    };
    watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}

function onSuccess(position) {
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    document.getElementById("show").innerHTML = "纬度为：" + longitude + "，经度为：" + latitude + "，海拔：" + position.coords.altitude;
    var map = new BMap.Map("container");
    // 创建地图实例  
    // var point = new BMap.Point(longitude, latitude);
    var point = new BMap.Point(113.485681, 23.107074);
    // 创建点坐标  
    map.centerAndZoom(point, 17);
    // 初始化地图，设置中心点坐标和地图级别

    var polygon = new BMap.Polygon([
        new BMap.Point(113.485353, 23.107497),
        new BMap.Point(113.486198, 23.107385),
        new BMap.Point(113.486058, 23.106704),
        new BMap.Point(113.48534, 23.106716)
    ], {
        strokeColor: "blue",
        strokeWeight: 2,
        strokeOpacity: 0.5
    }); //创建多边形

    map.addOverlay(polygon);

    var marker = new BMap.Marker(point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

    console.log("成功获取位置！");
    navigator.geolocation.clearWatch(watchID);
    document.getElementById("decidepoint").onclick = function (point) {
        console.log("判断" + point + "是否在指定范围中");
        var result = BMapLib.GeoUtils.isPointInPolygon(point, polygon);
        if (result) {
            alert("你不在指定范围！");
        } else {
            alert("你在指定范围中！");
        }
    };
}

function onError() {
    alert("获取位置失败！");
}

// function decidePoint(point) {
//     console.log("判断" + point + "是否在指定范围中");
//     var result = BMapLib.GeoUtils.isPointInPolygon(point, polygon);
//     if (result) {
//         alert("你不在指定范围！");
//     } else {
//         alert("你在指定范围中！");
//     }
// }