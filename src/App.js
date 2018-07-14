import React, { Component } from 'react';
import './App.css';
import BoxHome from './components/BoxHome';
import BoxRoom from './components/BoxRoom';
import BoxJoinRoom from './components/BoxJoinRoom';
import BoxRoomSettings from './components/BoxRoomSettings';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Fader from 'react-fader'

const uuid = window.localStorage.getItem('uuid');
if(!uuid) {
	window.localStorage.setItem('uuid', createUUID())
}
function createUUID() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}
class App extends Component {
	render() {
		return (
			<BrowserRouter>
			<Route render={({ location }) => (
				<Fader>
					<Switch key={location.key} location={location}>
					<Route exact path='/roomSettings/:roomCode' render={(match) =>
						<BoxRoomSettings key={match.location.pathname} {...match}/>
					}
					/>
					<Route exact path='/room/:roomCode' render={(match) =>
						<BoxRoom key={match.location.pathname} {...match}/>
					}
					/>
					<Route exact path='/join/room/:roomCode'
						render={(match) => (
							<BoxJoinRoom key={match.location.pathname} {...match}/>
						)}
					/>
					<Route exact path='/' render={(match)=> 
						<BoxHome key={match.location.pathname} {...match} showBoxJoinRoom={this.showBoxJoinRoom} showBoxRoom={this.showBoxRoom}/>
					}/>
					</Switch>
				</Fader>
			)}/>
			</BrowserRouter>
		)};
}
export default App;
