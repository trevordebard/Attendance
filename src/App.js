import React, { Component } from 'react';
import './App.css';
import BoxHome from './components/BoxHome';
import BoxRoom from './components/BoxRoom';
import BoxJoinRoom from './components/BoxJoinRoom';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Fader from 'react-fader'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
			<Route render={({ location }) => (
				<Fader>
					<Switch key={location.key} location={location}>
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
