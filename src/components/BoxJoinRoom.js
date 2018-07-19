import React, { Component } from 'react';
import io from 'socket.io-client';
import {socket_url} from '../consts';
import { getRequiredParams } from '../api';

const socketURL = socket_url;
let reqname, reqemail, reqphone;
reqname = reqemail = reqphone = true;

export default class BoxJoinRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emptyName: null,
      multipleSignInAttempts: null,
      nameSubmitted: false,
      socket: null,
      reqs: [],
    }
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
  componentDidMount() {
    getRequiredParams(this.props.match.params.roomCode)
      .then((data) => {
        if(data.success === true) {
          this.setState({
            reqs: JSON.parse(data.result.reqs),
          })
        }
      })
  }

  enterName = (e) => {
    if(e.keyCode === 13) {
      if(this.state.reqphone) {
        document.getElementById("phone").focus();
      }
      else if(this.state.reqemail) {
        document.getElementById("email").focus();
      }
      else {
        this.joinRoom();
      }
    }
  }
  enterPhone = (e) => {
    if(e.keyCode === 13) {
      if(this.state.reqemail) {
        document.getElementById("email").focus();
      }
      else {
        this.joinRoom();
      }
    }
  }
  enterEmail = (e) => {
    if(e.keyCode === 13) {
        this.joinRoom();
    }
  }

  joinRoom = () => {
    const reqs = document.getElementById('reqs');
    console.log(reqs.childNodes);
    let reqArray = []
    reqs.childNodes.forEach((element) => {
      reqArray.push({[element.id]: element.value})
    })
    
    this.state.socket.emit('new-user', this.props.match.params.roomCode, reqArray, (data) => {
      if(data.success) {
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
     }
     else {
       console.log(data);
     }
    });
  }

  render() {
    let { emptyName, multipleSignInAttempts, nameSubmitted, reqs } = this.state;
    const { reqname, reqphone, reqemail } = this.state;
    // Check to see if the user has joined this room or not
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
                <form id="reqs">
                {
                  reqs.map(element =>
                    <input id={element} name={element} type="text" placeholder={`Enter ${element}`}/>
                  )
                }
                </form>
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
                    Submitted!
                </h3>
              )
            )
        }
        </div>
      </div>
    );
  }
}
