import React, { Component } from 'react';
import './App.css';
import BoxHome from './components/BoxHome';
import BoxRoom from './components/BoxRoom';
import BoxJoinRoom from './components/BoxJoinRoom';
import BoxRoomSettings from './components/BoxRoomSettings';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Fader from 'react-fader'
import Footer from './components/Footer';

/**
 * All of this UUID and roomCode code eventually needs to be done by the server.
 */
const uuid = window.localStorage.getItem('uuid');
const roomCode = Math.random().toString(36).substr(2, 5);
if(!uuid) {
	window.localStorage.setItem('uuid', createUUID())
}
function createUUID() {
	function s4() {
	  return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

class App extends Component {
	
	render() {
		return (
			<div>
			<BrowserRouter>
				<Route render={({ location }) => (
					<Fader>
						<Switch key={location.key} location={location}>
						<Route exact path='/roomSettings' render={(match) =>
							<BoxRoomSettings key={match.location.pathname} roomCode={roomCode} {...match}/>
						}
						/>
						<Route exact path='/room/:roomCode' render={(match) =>
							<BoxRoom key={match.location.pathname} {...match} />
						}
						/>
						<Route exact path='/join/room/:roomCode'
							render={(match) => (
								<BoxJoinRoom key={match.location.pathname} {...match}/>
							)}
							/>
						<Route exact path='/' render={(match)=> 
							<BoxHome key={match.location.pathname} {...match} toggleRoomSettings={this.toggleRoomSettings} showBoxJoinRoom={this.showBoxJoinRoom} showBoxRoom={this.showBoxRoom}/>
						}/>
						</Switch>
					</Fader>
				)}/>
			</BrowserRouter>
			<Footer/>
			</div>
		)};
}
export default App;
