var restaurants=[];
var all=[];
var focusInfoWindow;
var map;
var user_id=66;
var markers = [];
var focusList;
var infoWindows=[];
var userPosition = { lat: 23.973875, lng: 120.982024 };
var dt = new Date();
  var date=new Date();
  var day=(date.getDay());
  var hour=(date.getHours());
  var minute=(date.getMinutes());
  var now=(hour*60)+minute;
  

  jQuery(document).ready(function($) {
      // $.get('/getJson').success(function(restaurants){
      //   //console.log(restaurants)
  });
  
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 22.999533, lng: 120.203401}
    });

    geoFindMe();
    //includeData();
  }

  function geoFindMe() {
    if (!navigator.geolocation) {
        alert("很抱歉，您的瀏覽器不支援定位服務");
        includeData();
        return;
    }

    function success(position) {
        var userLat = position.coords.latitude;
        var userLng = position.coords.longitude;

        userPosition = {
            lat: userLat,
            lng: userLng
        };
        includeData();
    };

    function error() {
        //alert("已取消定位功能");
        includeData();
    };
    navigator.geolocation.getCurrentPosition(success, error);
  }

  function includeData() {
    $.get( "/list", function( data ) {
      //console.log(data[293].餐飲店家名稱);
      //console.log(data[293].favorite);
      show_Data(data);
      $('#opening_hours').change(function(){

        if ( $('#opening_hours').val() == 'all' ) {
            deleteMarkers();
            document.getElementById('sidebar-left').innerHTML = "";
            show_Data(data);
        }else if($('#opening_hours').val() == 'opening'){
            deleteMarkers();
            document.getElementById('sidebar-left').innerHTML = "";
            var working=[];

            for(var i=0;i<data.length;i++){
              if(day!=data[i].WorkingExcp&&day>=data[i].WorkingWeek[0]&&day<=data[i].WorkingWeek[1]){
                 
                 if(data[i].WorkingTime.length==2){
                    if(data[i].WorkingTime[1]>now>data[i].WorkingTime[0]){
                      working.push(data[i]);

                    }else{
                      console.log(1);
                    }
                 }else if(data[i].WorkingTime.length==4){
                    if(data[i].WorkingTime[1]>now>data[i].WorkingTime[0]||data[i].WorkingTime[3]>now>data[i].WorkingTime[2]){
                      working.push(data[i]);
                      // alert(data[i].WorkingTime[1]+">="+now+">="+data[i].WorkingTime[0]);
                    }else{
                      console.log(2);
                    }
                 }else if(data[i].WorkingTime.length==6){
                    if(data[i].WorkingTime[1]>now>data[i].WorkingTime[0]||data[i].WorkingTime[3]>now>data[i].WorkingTime[2]||data[i].WorkingTime[5]>now>data[i].WorkingTime[4]){
                      working.push(data[i]);

                    }else{
                      console.log(3);
                    }
                 }else if(data[i].WorkingTime.length==8){
                     if(data[i].WorkingTime[1]>now>data[i].WorkingTime[0]||data[i].WorkingTime[3]>now>data[i].WorkingTime[2]||data[i].WorkingTime[5]>now>data[i].WorkingTime[4]||data[i].WorkingTime[7]>now>data[i].WorkingTime[6]){
                      working.push(data[i]);

                    }else{
                      console.log(4);
                    }
                 }else{
                  console.log(5);
                 }
              }else{
                console.log(6);
              }
            }

            show_Data(working);
        }else{

        }
      });

    });
  }
  //setMarkers(map);

  function show_Data(restaurants) {
    infoWindows=[];
    //console.log(restaurants[0].favorite);
    for (var i = 0 ; i < restaurants.length; i++) {
      var dataLocation = restaurants[i].店家地址;
      // console.log(restaurants[i].店家地址);
      //console.log(restaurants[i].favorite);
      //var fav = restaurants[i].favorite;
      if (restaurants[i].favorite.indexOf(user_id) >=0) {  
          dataFavoriteHtml = '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">';
      } else {
          dataFavoriteHtml = '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">';
      }

      create_Marker(i,restaurants[i].id,restaurants[i].餐飲店家名稱,restaurants[i].X坐標,restaurants[i].Y坐標,restaurants[i].店家地址,restaurants[i].店家電話,restaurants[i].營業時間,dataFavoriteHtml,restaurants[i].Type);
      //setMarkers(restaurants);
      
      $('#sidebar-left' ).append(
          '<li id="fr"><a href="javascript:focusLocation(\'' + i + '\')" class="clearfix"><div id="fr2"  class="chcolor"><h3>'+restaurants[i].餐飲店家名稱+'</h3>'+
          '<ul><li>'+restaurants[i].店家地址+'</li><br/>'+
          '<li>'+restaurants[i].店家電話+'</li><br/>'+
          '<li>'+restaurants[i].營業時間+'</li><br/></ul>'+
          '<button id="favorite" onclick="change_Favorite(\''+restaurants[i].id+'\',\''+restaurants[i].餐飲店家名稱+'\',\''+restaurants[i].店家地址+'\',\''+restaurants[i].店家電話+'\',\''+restaurants[i].營業時間+'\', true ,$(this),\''+i+'\')">'+dataFavoriteHtml+'</button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + restaurants[i].店家地址 + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
          '</a></div></li>');
      }
    //   console.log(restaurant[2]);
  }

  function create_Marker(dataCount,id,res_name,res_X,res_Y,res_address,res_phone,res_time,favorite,res_type) {
    // Adds markers to the map.
    //console.log(typeof(res_type));
    infowindow = new google.maps.InfoWindow();
    //console.log(restaurants[i].店家地址);
    // Marker sizes are expressed as a Size of X,Y where the origin of the image
    // (0,0) is located in the top left of the image.

    // Origins, anchor positions and coordinates of the marker increase in the X
    // direction to the right and in the Y direction down.
    var image
    var dataImageUrl;
    switch (res_type){
      case 1:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/chicken.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
          //dataImageUrl: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/chicken.png';
        break;
      case 2:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/spaguetti.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
          //dataImageUrl: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/spaguetti.png';
        break;
      case 3:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/cupcake.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
          //dataImageUrl: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/cupcake.png';
        break;
      case 4:
        image = {
          url: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/tea.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
          //dataImageUrl: 'https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/tea.png';
        break;
    }

    var shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly'
    };
    //console.log(res_X);

    var marker = new google.maps.Marker({
        position: {lat: res_Y, lng: res_X},
        map: map,
        icon: image
                    //shape: shape,
                    //title: restaurant[0],
                    //zIndex: restaurant[3]
    });
    markers.push(marker);
    
    // var markerCluster = new MarkerClusterer(map, markers,
    //   {imagePath: 'assets/img/m'});
    //console.log(markerCluster);

    var infowindow = new google.maps.InfoWindow({
        content: 
        '<div class="res_name" ><h3>'+res_name+'</h3></div>'+
        '<ul>'+
        '<li>'+res_address+'</li><br/>'+
        '<li>'+res_phone+'</li><br/>'+
        '<li>'+res_time+'</li><br/>'+
              //'<li>──────────────</li><br>'+
        '<li><button id="favorite" onclick="change_Favorite(\''+id+'\',\''+res_name+'\',\''+res_address+'\',\''+res_phone+'\',\''+res_time+'\', false ,$(this),\''+dataCount+'\')">'+dataFavoriteHtml+'</button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + res_address + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
        '</ul>',
              
        maxWidth: 400
    });
    

    marker.addListener('click', function() {
      
      if (focusInfoWindow != null) {
          focusInfoWindow.close();
      }
      infowindow.open(map, marker);
      focusInfoWindow = infowindow;
      map.setZoom(16);
      map.panTo(marker.getPosition());
    });
    infoWindows.push(infowindow);
    //console.log(infowindow);
    
  }

  function focusLocation(dataCount) {
    if (focusInfoWindow != null) {
        focusInfoWindow.close();
    }
    if (focusList != null) {
        focusList.removeClass('selected');
    }
    //console.log(markers);
    var focusMarker = markers[dataCount];
    //console.log(focusMarker);
    focusInfoWindow = infoWindows[dataCount];
    //console.log(focusInfoWindow);
    var listCount = Number(dataCount) + 1;
    focusList = $('#sidebar-left > li:nth-child(' + listCount + ')');

    focusInfoWindow.open(map, focusMarker);
    map.panTo(focusMarker.getPosition());
    map.setZoom(18);

    focusMarker.setAnimation(google.maps.Animation.BOUNCE);
    window.setTimeout(function() {
        focusMarker.setAnimation(null);
    }, 2250);

    focusList.addClass('selected');

    $('.filter').hide();
  }


  function change_Favorite(res_id,res_name,res_address,res_phone,res_time,islist,dataElemet,dataCount){

    //未收藏
    if(dataElemet.html() == '<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">'){
      dataElemet.html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">');
          
      $.post('/collect', {'res_id': res_id,'user_id': user_id}).success(function(data){
                //console.log(res_id);
        if(data=='success'){
                  //window.location.reload(" page.index ");
                  //alert('刪除成功');
        }else{
                  //alert('刪除失敗');
        }
      });

      var listCount = Number(dataCount) + 1;
      if (islist) {//左邊欄位
        var infowindow = infoWindows[dataCount];

        infowindow.setContent('<div class="res_name" ><h3>'+res_name+'</h3></div>'+
        '<ul>'+
        '<li>'+res_address+'</li><br/>'+
        '<li>'+res_phone+'</li><br/>'+
        '<li>'+res_time+'</li><br/>'+
              //'<li>──────────────</li><br>'+
        '<li><button id="favorite" onclick="change_Favorite(\''+res_id+'\',\''+res_name+'\',\''+res_address+'\',\''+res_phone+'\',\''+res_time+'\', false ,$(this),\''+dataCount+'\')"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png"></button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + res_address + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
        '</ul>');
      }else{//右邊地圖
        console.log(listCount);
        $('#sidebar-left > li:nth-child(' + listCount + ') button:nth-child(' + 3 + ')').html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/heart.png">');
      }


    }else { //已收藏
      dataElemet.html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">');

        $.post('/remove', {'res_id': res_id,'user_id': user_id}).success(function(data){
                //console.log(res_id);
          if(data=='success'){
                  //window.location.reload(" page.index ");
                  //alert('刪除成功');
          }else{
                  //alert('刪除失敗');
          }
        });

        var listCount = Number(dataCount) + 1;
        if (islist) {//左邊欄位
          var infowindow = infoWindows[dataCount];

          infowindow.setContent('<div class="res_name" ><h3>'+res_name+'</h3></div>'+
          '<ul>'+
          '<li>'+res_address+'</li><br/>'+
          '<li>'+res_phone+'</li><br/>'+
          '<li>'+res_time+'</li><br/>'+
                //'<li>──────────────</li><br>'+
          '<li><button id="favorite" onclick="change_Favorite(\''+res_id+'\',\''+res_name+'\',\''+res_address+'\',\''+res_phone+'\',\''+res_time+'\', false ,$(this),\''+dataCount+'\')"><img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png"></button><button onclick="window.open(\'https://maps.google.com/?saddr=' + userPosition.lat + ',' + userPosition.lng + '&daddr=' + res_address + '\',\'_blank\')" class="route"><img src="https://raw.githubusercontent.com/zitim/tainan/master/public/assets/img/google.png"></button></li>'+
          '</ul>');
        }else{//右邊地圖
          console.log(listCount);
          $('#sidebar-left > li:nth-child(' + listCount + ') button:nth-child(' + 3 + ')').html('<img src="https://raw.githubusercontent.com/zitim/Tainan_restaurant/master/public/assets/img/empty-heart.png">');
        }
    }
  }
  function show_Favorite(){
    var show_Favorite=[]

    deleteMarkers();
    document.getElementById('sidebar-left').innerHTML = "";
        
    $.get( "/list", function( data ) {
      
      for (var i = 0; i < data.length; i++) {
        if (data[i].favorite.indexOf(user_id)>=0) {
          show_Favorite.push(data[i]);
        }
      }

      var center = { lat: 23.099533, lng: 120.203401 };
      map.panTo(center);
      map.setZoom(10);
      show_Data(show_Favorite);
      

    });
  }
  function opening_hour(){

  }

  function working(){
    var working=[]
    deleteMarkers();
    document.getElementById('sidebar-left').innerHTML = ""; 
    // var day=date.getDay();
    var date=new Date();
    var day=(date.getDay()+1);
    var hour=(date.getHours());
    var minute=(date.getMinutes());

    $.get( "/list", function( data ) {
      for(var i=0;i<data.length;i++){
        var format=(data[i].營業時間)
      .replace(/週/g,"")
      .replace(/一/g,"1")
      .replace(/二/g,"2")
      .replace(/三/g,"3")
      .replace(/四/g,"4")
      .replace(/五/g,"5")
      .replace(/六/g,"6")
      .replace(/日/g,"7");
      
      if(format.indexOf('/')==-1){
       if(day>=format[0]&&day<=format[2]){
          working.push(data[i]);
       }
      }

      }
      show_Data(working);
      var center = { lat: 23.099533, lng: 120.203401 };
      map.panTo(center);
      map.setZoom(10);
    });
  }
  
  function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }

  function clearMarkers() {
    setMapOnAll(null);
  }

  function deleteMarkers() {
    //console.log(123);
     clearMarkers();
     markers = [];
  }

