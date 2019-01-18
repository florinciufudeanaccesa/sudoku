import { h, Component } from 'preact';
import firebase from 'firebase';
import Home from './home';
import Index from './Index';
import { Router } from 'preact-router'; 

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */	
	 componentWillMount() {
		var config = {
	        apiKey: "AIzaSyAXghyBCDpI5miHEJoBW1AgWrhRvrJwYW0",
	        authDomain: "sudoku-8d6ca.firebaseapp.com",
	        databaseURL: "https://sudoku-8d6ca.firebaseio.com",
	        projectId: "sudoku-8d6ca",
	        storageBucket: "sudoku-8d6ca.appspot.com",
	        messagingSenderId: "993771677054"
	      };
	    if (firebase.apps.length === 0) {
	      firebase.initializeApp(config);
	    }
	}
	handleRoute = e => {
		this.currentUrl = e.url;
	}
	render() {
		return (
			<div id="app">
				<Home/>
			</div>
		);
	}
}
