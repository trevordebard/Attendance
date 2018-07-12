import React, { Component } from 'react';
import io from 'socket.io-client';
import {socket_url} from '../consts';

const socketURL = socket_url;
console.log('socket url is ' + socketURL);

export default class BoxJoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyName: null,
      multipleSignInAttempts: null,
      nameSubmitted: false,
      socket: null,
    };
  }
  componentWillMount() {
    this.initSocket();
  }
  initSocket = () => {
    const socket = io(socketURL);
    socket.on('connect', () => {
      console.log('connected');
      this.state.socket.emit('join-room', this.props.match.params.roomCode)
    })
    this.setState({
      socket
    })
  }

  enterName = (e) => {
    if(e.keyCode === 13) {
      this.joinRoom();
    }
  }

  joinRoom = () => {
    this.state.socket.emit('new-user', this.props.match.params.roomCode, document.getElementById('enter-name-input').value, (success) => {
      if(success) {
        this.setState({
          nameSubmitted: true,
        });


        let roomsJoined = window.localStorage.getItem('roomsJoined');
        let roomsArray = [];
        if(roomsJoined) {
          roomsArray = JSON.parse(roomsJoined);
          roomsArray.push(this.props.match.params.roomCode);
        }
        else {
          roomsArray = [`${this.props.match.params.roomCode}`];
        }
        window.localStorage.setItem('roomsJoined', JSON.stringify(roomsArray));
        //window.localStorage.setItem('roomsJoined', this.props.match.params.roomCode);
     }
    });
  }

  render() {
    let { emptyName, multipleSignInAttempts, nameSubmitted } = this.state;
    
    /**
     * Check to see if the user has joined this room or not
     */
    let roomsJoined = window.localStorage.getItem('roomsJoined');
    if(roomsJoined) {
      let roomsArray = JSON.parse(roomsJoined);
      if(roomsArray.includes(this.props.match.params.roomCode)) {
          multipleSignInAttempts = true;
          nameSubmitted = true;
      }
    }
    
    return (
      <div className="container">
        <div id="enter-name-box" className="box">
        {!nameSubmitted &&
            <div>
              <input id="enter-name-input" type="text" placeholder="Enter your name" onKeyDown={this.enterName} />
              <button id="enter-name-btn" onClick={this.joinRoom}>
                Submit
              </button>
            </div>
        }
        {emptyName
          && (
          <p id="enter-name-empty" className="box-validation">
              You must enter a name.
          </p>
          )
        }
        { multipleSignInAttempts ?
            (
              <h3 id="fail-message">
                  You may only sign in once!
              </h3>
            ) : (
              nameSubmitted &&
               (
                <h3 id="success-message">
                    Your name was submitted!
                </h3>
              )
            )
        }
        </div>
      </div>
    );
  }
}
