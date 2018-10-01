import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import _ from 'lodash'
import { Grid, Card, Icon, Image, Label, Item, Message, Search, Header, Segment, Loader, Dimmer, Progress, Button } from 'semantic-ui-react'

/************************************************************************************************/
/****************** Semantic UI React's Search Demonstration  ***********************************/  
/************************************************************************************************/  

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			restaurants: [],	
			selectedrestaurant: null,		
			selectedrestaurantlocation: null,					
			isLoading: false,
			results: [],
			value:''			
		};
	}
	
	componentWillMount() {
    this.resetComponent();
	this.loadItems();
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  
  handleResultSelect = (e, { result }) => { 
	var location = '';
	
	if(this.state.selectedrestaurant!=null && this.state.selectedrestaurant.address!=null) {
	
		location = this.state.selectedrestaurant.address.address1 + " " +this.state.selectedrestaurant.address.address2
		+ " " +this.state.selectedrestaurant.address.city+ " " +this.state.selectedrestaurant.address.state
		+ " " +this.state.selectedrestaurant.address.zip+ " " +this.state.selectedrestaurant.address.country;
	}
	
	this.setState({ value: result.name, selectedrestaurant: result, selectedrestaurantlocation: location });			
  }

  
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.name)
	  var arr = [];
	  arr = _.filter(this.state.restaurants, isMatch);
      this.setState({
        isLoading: false,
        results: arr,
      })
    }, 300)
  }

	
	loadItems() {
		
        var self = this;

        var url = 'http://localhost:4200/restaurants/fetchRestaurantsForDemo';
       

		axios.get(url)
      .then(res => {
		  console.log('response:'+res.data);
		  
			this.setState({ restaurants: res.data, loading: false  });
			console.log(this.state.restaurants);
		  
		})
	   .catch(error => {
	   console.log('error:'+error);
	 });
	 
       
    }


  /******************* custom result renderer *****************************************************************************/
  
  resultRenderer = (props) =>
    <div key={props.name} className="container">
		<div className="fieldValue">{props.name}</div>
		<div className="fieldValue">{props.title}</div>
		<div className="fieldValue">{props.highlight}</div>
		<div className="fieldTitleExtra">{props.star} Stars</div>				
    </div>;


	
    render() {
		
		return (
        <Grid>
		
			<Grid.Column width={6}>
				<div className="jumbotron">Search By Restaurant Name</div>
				<Search
					loading={this.state.isLoading}
					onResultSelect={this.handleResultSelect}
					onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
					results={this.state.results}
					value={this.state.value}
					resultRenderer={this.resultRenderer}
					{...this.props}
					className="search"
				/>
			  
				{this.state.selectedrestaurant!=null && 
				<div className="selectionContainer">
					<div className="fieldValue">{this.state.selectedrestaurant.name}</div>
					<div className="fieldValue">{this.state.selectedrestaurant.title}</div>
					<div className="fieldValue">{this.state.selectedrestaurant.highlight}</div>				
					{this.state.selectedrestaurant.address!=null && 		
					<div className="fieldValue">Location :
					{this.state.selectedrestaurantlocation}
					</div>		
					}		
					<div className="fieldTitleExtra">{this.state.selectedrestaurant.star} Stars</div>
				</div>
				}
		
			</Grid.Column>
			
			<Grid.Column width={10}>
			  <Segment>
				<Header>State</Header>
				<pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state, null, 2)}</pre>
				<Header>Options</Header>
				<pre style={{ overflowX: 'auto' }}>{JSON.stringify(this.state.restaurants, null, 2)}</pre>
			  </Segment>
			</Grid.Column>
		
      </Grid>
	  );
    }
};

export default App;
