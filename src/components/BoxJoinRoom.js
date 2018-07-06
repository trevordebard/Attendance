import React, { Component } from 'react';
import io from 'socket.io-client';
const socketURL = process.env.REACT_APP_SOCKET_URL;
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
      this.state.socket.emit('join-room', this.props.roomCode)
    })
    this.setState({
      socket
    })
  }

  enterName = (e) => {
    if(e.keyCode === 13) {
      console.log(this.props)
      this.state.socket.emit('new-user', this.props.match.match.params.roomCode, e.target.value, (success) => {
        if(success) {
          this.setState({
            nameSubmitted: true,
          })
       }
      });
    }
  }

  render() {
    const { emptyName, multipleSignInAttempts, nameSubmitted } = this.state;
    return (
      <div className="container">
        <div id="enter-name-box" className="box">
        {!nameSubmitted &&
            <div>
              <input id="enter-name-input" type="text" placeholder="Enter your name" onKeyDown={this.enterName} />
              <button id="enter-name-btn">
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
          { nameSubmitted
            && (
            <h3 id="success-message">
                Your name was submitted!
            </h3>
            )
          }
          {multipleSignInAttempts
            && (
            <h3 id="fail-message">
                You may only sign in once!
            </h3>
            )
        }
        </div>
      </div>
    );
  }
}
