import React, { Component } from 'react';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { createRoom, doesRoomExist } from '../api';
import { Header, Divider } from 'semantic-ui-react';
import {Link, Redirect} from 'react-router-dom';

var animationEnd = (function(el) {
	var animations = {
		"animation": "animationend",
		"OAnimation": "oAnimationEnd",
		"MozAnimation": "mozAnimationEnd",
	   "WebkitAnimation": "webkitAnimationEnd"
	}

	for(var t in animations) {
		if(el.style[t] !== undefined) {
			return animations[t];
		}
	}
})(document.createElement("fakeelement"));

const roomCode = Math.random().toString(36).substr(2, 5);
class BoxHome extends Component {
	constructor(props) {
		super(props)
		console.log(props);
		this.state = {
			title: 'Sign Me In',
			roomCodeEmpty: false,
			roomCodeInvalid: false,
			roomCodeInput: '',
			roomCode: roomCode,
			redirect: false,
		}
	}

	handleRoomCodeInput = (e) => {
		this.setState({
			roomCodeInput: e.target.value
		})
	}
	handleCreateRoom = () => {
		
		createRoom(`${roomCode}`)
			.then((data) => {
				if (data.success) {
					//this.props.toggleBoxHome(false, data.room, 'BoxRoom');
					//this.props.match.history.push(`/room/${data.room}`);
					this.setState({
						roomCode: data.room,
						redirect: true,
					})
				} else {
					this.setState({
						title: data,
						roomCode: 'ERROR'
					})
				}
			})
	}

	enterRoomCode = (e) => {
		/**
		 * If the user clicks enter, check if the room exists.
		 * If the room exists, allow the user to view BoxJoinRoom
		 * else if the room does not exist, modify the state to reflect that
		 */
		if(e.keyCode === 13) {
			let id = e.target.value;
			if(id === '') {
				this.setState({
					roomCodeEmpty: true,
				});
			}
			else {
				this.joinRoom();
			}
		}
	}
	joinRoom = () => {
		this.setState({
			roomCodeEmpty: false,
		});
		doesRoomExist(this.state.roomCodeInput)
			.then((data) => {
				if (data.exists === true) {
					this.props.showBoxJoinRoom(this.state.roomCodeInput);
				} else {
					this.setState({
						roomCodeInvalid: true,
					})
				}
			})
	}
	
	render() {
		return (
			<div className="box">
				{this.state.redirect && 
					<Redirect push to={`/room/${roomCode}`} />
				}
						<div className='header'>
							<Header size='medium'>{this.state.title}</Header>
							<hr/>
						</div>
						<div className="content">
							<button id="create-room" onClick={this.handleCreateRoom}>
								Generate room
							</button>
						<Divider id='or' horizontal>or</Divider>

						<span>
							<input onKeyDown={this.enterRoomCode} onChange={this.handleRoomCodeInput} type="text" id="room-code-input" placeholder="Enter room code" />
							<i id="enter-room-btn" onClick={this.joinRoom} className="fa fa-angle-right" />
						</span>

						{this.state.roomCodeEmpty && 
							<p id="room-code-empty" className="box-validation">You must enter a room code.</p>
						}
						{this.state.roomCodeInvalid && 
							<p id="room-code-invalid" className="box-validation">Sorry, that room does not exist.</p>
						}
					</div>
				</div>

			);
	}
}

export default BoxHome;
