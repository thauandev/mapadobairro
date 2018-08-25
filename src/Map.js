import React, {Component} from 'react';
import LocationList from './LocationList';

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'alllocations': [
        {
          'name': "Prezunic",
          'type': "Super Mercado",
          'latitude': -22.8917377,
          'longitude': -43.2690373,
          'streetAddress': "Rua Miguel Cervantes, 240- Cachambi, Rio de Janeiro"
        }, {
          'name': "Colégio Santa Monica",
          'type': "Escola",
          'latitude': -22.893396,
          'longitude': -43.272514,
          'streetAddress': " Rua Herminia, 2 - Cachambi, Rio de Janeiro"
        }, {
          'name': "Norte Shopping",
          'type': "Shopping",
          'latitude': -22.88660344,
          'longitude': -43.2836437,
          'streetAddress': "Avenida Dom Hélder Câmara, 5474 - Cachambi, Rio de Janeiro"
        }, {
          'name': "Cachambeer",
          'type': "Bar/Restaurante",
          'latitude': -22.88636622,
          'longitude': -43.27688453,
          'streetAddress': "Rua Cachambi, 475, Lj. A - Cachambi, Rio de Janeiro"
        }, {
          'name': "Hospital Assim",
          'type': "Hospital",
          'latitude': -22.8954459,
          'longitude': -43.2764379,
          'streetAddress': "Rua Tenente Costa, 160 - Cachambi, Rio de Janeiro"
        }, {
          'name': "Paróquia Jesus Divino Mestre",
          'type': "Igreja Católica",
          'latitude': -22.8918825,
          'longitude': -43.2667509,
          'streetAddress': " Rua Velinda Mauricio da Fonseca, 66 - Cachambi, Rio de Janeiro"
        }, {
          'name': "Shopping Nova América",
          'type': "Shopping",
          'latitude': -22.8768019,
          'longitude': -43.2714294,
          'streetAddress': " Av. Pr. Martin Luther King Jr., 126, Rio de Janeiro"
        }
      ],
      'map': '',
      'infowindow': '',
      'prevmarker': ''
    };

    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
  }

  componentDidMount() {

    window.initMap = this.initMap;

    loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyAIyqCgAsK9t_AZ3atPsBXPYPbZO6nPv1g&callback=initMap')
  }

  initMap() {
    const self = this;

    const mapview = document.getElementById('map');
    mapview.style.height = window.innerHeight + "px";
    const map = new window.google.maps.Map(mapview, {
      center: {
        lat: -22.8899874,
        lng: -43.2736259
      },
      zoom: 16,
      mapTypeControl: false
    });

    const InfoWindow = new window.google.maps.InfoWindow({});

    window.google.maps.event.addListener(InfoWindow, 'closeclick', function() {
      self.closeInfoWindow();
    });

    this.setState({'map': map, 'infowindow': InfoWindow});

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, 'click', function() {
      self.closeInfoWindow();
    });

    let alllocations = [];
    this.state.alllocations.forEach(function(location) {
      let longname = location.name + ' - ' + location.type;
      const marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(location.latitude, location.longitude),
        animation: window.google.maps.Animation.DROP,
        map: map
      });

      marker.addListener('click', function() {
        self.openInfoWindow(marker);
      });

      location.longname = longname;
      location.marker = marker;
      location.display = true;
      alllocations.push(location);
    });
    this.setState({'alllocations': alllocations});
  }

  openInfoWindow(marker) {
    this.closeInfoWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({'prevmarker': marker});
    this.state.infowindow.setContent('Carregando...');
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(0, -200);
    this.getMarkerInfo(marker);
  }

  getMarkerInfo(marker) {
    const self = this;
    const clientId = "OJNLTRXYH5A0YQ0XSLKHWUNGIHMNYEOQVE4XEBYDWGPDGSN4";
    const clientSecret = "YYWPN5QM3PB2G054ZAQQNSLI1FORJQ4HTZ31QIJKMPVQ3PL4";
    const url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
    fetch(url).then(function(response) {
      if (response.status !== 200) {
        self.state.infowindow.setContent("Desculpe ocorreu um erro!");
        return;
      }

      response.json().then(function(data) {
        const location_data = data.response.venues[0];
        const name = '<b class = "address">' + location_data.name + '</b> <br>';
        const address = location_data.location.address + '<br>';
        const city = location_data.location.city + '<br>';
        const readMore = '<a href="https://foursquare.com/v/' + location_data.id + '" target="_blank">Veja mais no Foursquare</a>'
        self.state.infowindow.setContent(name + address + city + readMore);
      });
    }).catch(function(err) {
      self.state.infowindow.setContent("Desculpe ocorreu um erro!");
    });
  }

  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({'prevmarker': ''});
    this.state.infowindow.close();
  }

  render() {
    return (<div>
      <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow} closeInfoWindow={this.closeInfoWindow}/>
      <div role= "application" aria-label ="map-app" id="map"></div>
    </div>);
  }
}

export default Map;

function loadMapJS(src) {
  let ref = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Não foi possível carregar o Google Maps");
  };
  ref.parentNode.insertBefore(script, ref);
}
