import React, {Component} from 'react';
import Location from './Location';

class LocationList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'locations': '',
      'query': '',
      'suggestions': true
    };

    this.filterLocations = this.filterLocations.bind(this);
    this.toggleSuggestions = this.toggleSuggestions.bind(this);
  }

  filterLocations(event) {
    this.props.closeInfoWindow();
    const {value} = event.target;
    let locations = [];
    this.props.alllocations.forEach(function(location) {
      if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({'locations': locations, 'query': value});
  }

  componentWillMount() {
    this.setState({'locations': this.props.alllocations});
  }

  toggleSuggestions() {
    this.setState({
      'suggestions': !this.state.suggestions
    });
  }

  render() {
    let locationlist = this.state.locations.map(function(listItem, index) {
      return (<Location key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>);
    }, this);

    return (<div className="search">
      <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Filtre" value={this.state.query} onChange={this.filterLocations}/>
      <ul>
        {this.state.suggestions && locationlist}
      </ul>
      <button className="button" onClick={this.toggleSuggestions}>Mostre/Oculte as sugestões</button>
    </div>);
  }
}

export default LocationList;
