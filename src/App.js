import React, { Component } from 'react';
import './App.css';
import BoxHome from './components/BoxHome';
import { Transition, List } from 'semantic-ui-react';
import BoxRoom from './components/BoxRoom';
import BoxJoinRoom from './components/BoxJoinRoom';
import { Switch, BrowserRouter, Route } from 'react-router-dom'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nextVisible: null,
			boxHomeVisibility: true,
			boxJoinRoomVisibility: false,
			animation: 'fly left',
			duration: 600,
			roomCode: null
		};
	}

	showBoxRoom = (roomCode) => {
		this.setState({
			animation: 'fly right',
			boxHomeVisibility: false,
			boxJoinRoomVisibility: false,
			boxRoomVisibility: true,
		});
		window.location.href = window.location.origin + '/room/' + roomCode;
	}
	showBoxJoinRoom = (roomCode) => {
		this.setState({
			animation: 'fly right',
			boxHomeVisibility: false,
			boxJoinRoomVisibility: true,
			boxRoomVisibility: false,
		});
		window.location.href = window.location.origin + '/join/room/' + roomCode;
	}

	/**
	 * When BoxHome hides, this checks to see what to display next
	 */
	onBoxHomeHide = () => {
		const nextVisible = this.state.nextVisible;
		if(nextVisible === 'BoxJoinRoom')  {
			this.toggleBoxJoinRoom();
		}
		else if(nextVisible === 'BoxRoom') {
			this.toggleBoxRoom();
		}
	}

	render() {
		const {  boxHomeVisibility, animation } = this.state;
		console.log(this.state);
		return (
			<div>
				<BrowserRouter>
					<div>
					<Route
						render={({ match }) => ( console.log(match) ||
							<Switch>
								<Route exact path='/'
									render={(match) => (
										<Transition.Group as={List} duration={1000} divided size='huge' verticalAlign='middle'>
											<Transition animation={animation} visible={boxHomeVisibility} transitionOnMount={true}>
												<List.Item>
													<BoxHome match={match} showBoxJoinRoom={this.showBoxJoinRoom} showBoxRoom={this.showBoxRoom}/>
												</List.Item>
											</Transition>
										</Transition.Group>
									)}
								>
								</Route>
								<Route exact path='/room/:roomCode'
									render={(match) => (
										<Transition.Group as={List}  duration={1000} size='huge' verticalAlign='middle'>
											<Transition animation={'fly left'} transitionOnMount={true}>
												<List.Item>
													<BoxRoom match={match}/>
												</List.Item>
											</Transition>
										</Transition.Group>
									)}
									>
								</Route>
								<Route exact path='/join/room/:roomCode'
									render={(match) => (
										<Transition.Group as={List}  duration={1000} size='huge' verticalAlign='middle'>
											<Transition animation={'fly left'} transitionOnMount={true}>
												<List.Item>
													<BoxJoinRoom match={match}/>
												</List.Item>
											</Transition>
										</Transition.Group>
									)}
									>
								</Route>
							</Switch>
						)}/>
						</div>
				</BrowserRouter>
			</div>
		);
	}
}

export default App;
