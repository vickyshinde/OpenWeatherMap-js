function defaultSettings(){
  var settings = {};
    settings.co = {
      Latitude: "", 
      Longitude: ""
    },
    settings.key = "70fd0d8e4091568e4be8ed5a3aafb3dd",
    settings.cnt = "6",
    settings.units = "metric"  
  return settings;
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.");
    }
}

(function(global) {
  getLocation();
    var weatherInfo = [];
    var moduleData = {
        getweatherInfo: function() {
            return weatherInfo;
        },
        setweatherInfo: function(value) {
            weatherInfo = value;
        }
    }
    global.module = moduleData;
})(this);

function showPosition(position) {
  var settings = defaultSettings();
  settings.co.Latitude = position.coords.latitude;
  settings.co.Longitude = position.coords.longitude;
    /*console.log("Latitude: " + position.coords.latitude)
    console.log("Longitude: " + position.coords.longitude);*/
    var primaryUrl = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + settings.co.Latitude + "&lon=" + settings.co.Longitude + "&APPID="+ settings.key + "&cnt=" + settings.cnt + "&units="+ settings.units;
    console.log(primaryUrl)
    fetch = function(url, success) {
      $.ajax({
          url: url,
          type: 'GET',
          success:success,
          error: function() {
              alert("data is not found")
          }
      });
   }
    fetch(primaryUrl, function(response) {
        module.setweatherInfo(response)
        showWeather(module.getweatherInfo());
            /*console.log(response)
            console.log(primaryUrl)*/
    });
    showWeather = function(data) {
      var dateTime;
      var temperature;
      var tempMax;
      var tempMin;
      var pressure;
      var cloudinfo;
      var description;
      var icon;
      var humidity;
      var currentDate = new Date().toDateString();

      $(".countryCity").text(data.city.name + ", "+ data.city.country);    
      
      for(i = 0; i<data.list.length; i++) {
          var apiDate = new Date(data.list[i].dt * 1000).toDateString();
          currentDate = currentDate == apiDate ? "Today" : apiDate;

          dateTime = "<p class='date'>"+currentDate+"</p>";
          temperature = "<p><span>Temperature :</span> "+data.list[i].temp.day+"°C </p>";
          tempMin = "<p><span>Min / Max temp :</span> "+data.list[i].temp.min+"";
          tempMax = "<span> / </span> "+data.list[i].temp.max+"</p>";
          pressure = "<p><span>Pressure :</span> "+data.list[i].pressure+"</p>";
          humidity = "<p><span>Humidity :</span> "+data.list[i].humidity+"%</p>";
          for(v = 0; v<data.list[i].weather.length; v++) {
            cloudinfo = "<p><span>Weather Info :</span> "+data.list[i].weather[v].main+"</p>";
            description = "<p><span>Description :</span> "+data.list[i].weather[v].description+"</p>";
            icon = "<img src='http://openweathermap.org/img/w/" + data.list[i].weather[v].icon +".png'>";
          };
          $("#weatherApp").append("<li class='col-md-4'><div class='weatherList'>"+icon+""+dateTime+""+temperature+""+cloudinfo+""+description+""+pressure+""+humidity+""+tempMin+""+tempMax+"</div></li>");
      };

    };
};
