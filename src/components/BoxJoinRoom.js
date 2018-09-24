import React, { Component } from 'react';
import io from 'socket.io-client';
import {socket_url} from '../consts';
import { getRequiredParams } from '../api';
import { Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom'

const socketURL = socket_url;

const styles = {
  inputFields: {
    marginBottom: '15px',
    width: '90%'
  }
}

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
    document.getElementById('enter-name-btn').disabled = true;

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
      document.getElementById('enter-name-btn').disabled = false;
      console.log(data);
     }
    });
  }

  render() {
    let { emptyName, multipleSignInAttempts, nameSubmitted, reqs } = this.state;
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
                  reqs.map((element, i) => {
                    if(i === 0) {
                      return (<input id={element} style={styles.inputFields} name={element} type="text" placeholder={`Enter First and Last Name`}/>)
                    }
                    return(<input id={element} style={styles.inputFields} name={element} type="text" placeholder={`Enter ${element.split('-').join(' ')}`}/>)
                  }
                  )
                }
                </form>
              <button id="enter-name-btn" onClick={this.joinRoom}>
                Submit
              </button>
              <Divider id='or' horizontal>or</Divider>
              
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
        <Link to={`/room/${this.props.match.params.roomCode}`}>
          <p>
            View Room Users
          </p>
        </Link>
        </div>
      </div>
    );
  }
}
