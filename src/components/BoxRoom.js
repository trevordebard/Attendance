import React, { Component } from 'react';
import io from 'socket.io-client';
import {socket_url} from '../consts';
import {CSVLink} from 'react-csv';

const socketURL = socket_url;
const headers = [
  {label: 'Name', key: 'name'},
];

export default class BoxRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
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
      this.state.socket.on('fill-page-with-users', (users) => {
        this.setState({
          users: users,
        })
      })
    })
    this.setState({
      socket
    })
  }
  exportNames = () => {
    console.log(this.state.users);
  }

  render() {
    return (
        <div className="box box-room">
        	<div className='header'>
            <h2 className='header-content' >Your room code is:
              <span className='header-content header-room-code'> {this.props.match.params.roomCode}</span>
            </h2>
          </div>
          <hr />
          <div className='content'>
            {this.state.users == null || !this.state.users.length ? 'There are currently no users' : (
              <div className='room-names-grid box-room'>
                {this.state.users.map((element, i) => {
                  return(<p className='box-room-names-cell'>{element.name}</p>)
                })}
              </div>
            )}
            <br/>
            <button style={{width: '50%'}}>
              <CSVLink data={this.state.users} style={{color: 'white'}} filename={"SignMeIn.csv"}  target="_blank" headers={headers}>
                  Download Names
              </CSVLink>
            </button>
          </div>
        </div>
    );
  }
}
