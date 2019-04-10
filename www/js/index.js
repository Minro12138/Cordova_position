document.addEventListener("deviceready", onDeviceReady);

var longitude = undefined;
var latitude = undefined;

function onDeviceReady() {
    console.log("启动");
    navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, {
        enableHighAccuracy: true
    });
    console.log(watchMapPosition());
    console.log("实时监控");
    $("#re").on("click", watchMapPosition);
}

function getMap(data) {
    console.log("getMap!");
    console.log(""+JSON.stringify(data));
    document.getElementById("show").innerHTML = "纬度为：" + longitude + "，经度为：" + latitude;
    var map = new BMap.Map("container");
    // 创建地图实例  
    console.log(latitude);
    console.log(longitude);
    map.centerAndZoom(data.points[0], 18);
    // 初始化地图，设置中心点坐标和地图级别

    var marker = new BMap.Marker(data.points[0]); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中

    var overlay = [
        new BMap.Point(113.485353, 23.107497),
        new BMap.Point(113.486198, 23.107385),
        new BMap.Point(113.486058, 23.106704),
        new BMap.Point(113.48534, 23.106716)
    ];

    var polygon = new BMap.Polygon(overlay, {
        strokeColor: "blue",
        strokeWeight: 2,
        strokeOpacity: 0.5
    }); //创建多边形
    map.addOverlay(polygon);

    // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    console.log("成功获取位置！");

    document.getElementById("decidepoint").onclick = function () {
        console.log("判断是否在指定范围中");
        var result = BMapLib.GeoUtils.isPointInPolygon(data.points[0], polygon);
        if (result == true) {
            alert("你在指定范围！成功签到！");
            $("#footer").text("签到成功！");
        } else {
            alert("请在指定范围中签到！");
            $("#footer").text("你不在指定区域签到，请检查当前位置！");
        }
    };

}

//实时监控位置
function watchMapPosition() {
    var options = {
        frequency: 3000,
        maximumAge: 300000,
        timeout: 5000,
        enableHighAccuracy: true,
    };
    console.log("监控函数执行");
    return navigator.geolocation.watchPosition(onMapWatchSuccess, onMapError, options);
}

//获取位置成功
function onMapSuccess(position) {
    console.log("Success！");
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
    translatePoint(longitude,latitude);
}

//实时监控位置成功
var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;
    console.log("监控中");
    console.log(updatedLatitude);
    console.log(updatedLongitude);
    if (updatedLatitude != latitude && updatedLongitude != longitude) {

        latitude = updatedLatitude;
        longitude = updatedLongitude;

        translatePoint(updatedLongitude,updatedLatitude);
    }
}

//转换坐标
function translatePoint(lon, lat) {
    var convertor = new BMap.Convertor();
    var pointArr = [];
    var ggPoint = new BMap.Point(lon,lat);
    pointArr.push(ggPoint);
    convertor.translate(pointArr, 1, 5, getMap);
}

function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function onError() {
    alert("获取位置失败！");
}