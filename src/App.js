import React, { Component } from 'react';
import './App.css';
import BoxHome from './components/BoxHome';
import { Transition, List } from 'semantic-ui-react';
import BoxRoom from './components/BoxRoom';
import BoxJoinRoom from './components/BoxJoinRoom';
import { Switch, BrowserRouter, Route, Redirect } from 'react-router-dom'
import { AnimatedSwitch, spring} from 'react-router-transition';

function bounce(val) {
	return spring(val, {
	  stiffness: 330,
	  damping: 22,
	});
  }
  
  // child matches will...
  const bounceTransition = {
	// start in a transparent, upscaled state
	atEnter: {
	  opacity: 0,
	  scale: 1.2,
	},
	// leave in a transparent, downscaled state
	atLeave: {
	  opacity: bounce(0),
	  scale: bounce(0.8),
	},
	// and rest at an opaque, normally-scaled state
	atActive: {
	  opacity: bounce(1),
	  scale: bounce(1),
	},
  };
  function mapStyles(styles) {
	return {
	  opacity: styles.opacity,
	  transform: `scale(${styles.scale})`,
	};
  }  
class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nextVisible: null,
			boxHomeVisibility: '',
			boxJoinRoomVisibility: 'none',
			boxRoomVisibility: 'none',
			duration: 600,
			roomCode: null,
		};
	}

	showBoxRoom = (roomCode) => {
		console.log(roomCode)
		this.setState({
			roomCode: roomCode
		});
		//window.location.href = window.location.origin + '/room/' + roomCode;
	}
	showBoxJoinRoom = (roomCode) => {
		this.setState({
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
		const {  boxHomeVisibility } = this.state;
		console.log(this.state);
		
		return (
				<BrowserRouter>
					<AnimatedSwitch
						atEnter={bounceTransition.atEnter}
						atLeave={bounceTransition.atLeave}
						atActive={bounceTransition.atActive}
						runOnMount={true}
						mapStyles={mapStyles}
						className="switch-wrapper"
						>
							<Route exact path='/' render={(match)=> 
								<BoxHome {...match} showBoxJoinRoom={this.showBoxJoinRoom} showBoxRoom={this.showBoxRoom}/>
							}/>
							<Route exact path='/room/:roomCode' render={(match) =>
								<BoxRoom {...match}/>
							}
							/>
							<Route exact path='/join/room/:roomCode'
								render={(match) => (
									<BoxJoinRoom {...match}/>
								)}
							/>
					</AnimatedSwitch>
				</BrowserRouter>
		)};
}
export default App;
