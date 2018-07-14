import React, { Component } from 'react';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { doesRoomExist } from '../api';
import { Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router'

const roomCode = Math.random().toString(36).substr(2, 5);

class BoxHome extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: 'Sign Me In',
			roomCodeEmpty: false,
			roomCodeInvalid: false,
			roomCodeInput: '',
			roomCode: roomCode,
			problemProcessing: false,
		}
	}
	handleGenerateRoom = () => {
		const roomCode = Math.random().toString(36).substr(2, 5);
		this.props.history.push('roomSettings/' + roomCode)
	}
	handleRoomCodeInput = (e) => {
		this.setState({
			roomCodeInput: e.target.value
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
					this.props.history.push('join/room/' + data.roomCode)
				}
				else if(data === 'There was a problem processing your request') {
					this.setState({
						problemProcessing: true,
					})
				}
				else {
					this.setState({
						roomCodeInvalid: true,
					})
				}
			})
	}
	
	render() {
		return (
			<div className="box">
			<img src={require('../images/SMI_logo.png')} style={{width: '180px', height: 'auto'}} alt='Sign Me In'/>
				<div className='header'>
					<hr/>
				</div>
				<div className="content">
					<button id="create-room" onClick={this.handleGenerateRoom}>
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

export default withRouter(BoxHome);
