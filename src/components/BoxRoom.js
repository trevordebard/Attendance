import React, { Component } from 'react';
import io from 'socket.io-client';
import { Grid } from 'semantic-ui-react';

const socketURL = process.env.REACT_APP_SOCKET_URL;
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

  render() {
    return (
        <div className="box box-room">
        	<div className='header'>
            <p className='header-content' >Your room code is:
              <span className='header-content header-room-code'> {this.props.match.params.roomCode}</span>
            </p>
          </div>
          <hr />
          <div>
            <Grid celled columns={4}>
            {this.state.users == null || !this.state.users.length ? 'There are currently no users' : (
              this.state.users.map((element, i) => {
                return(<Grid.Column key={i} className='grid-cell'>{element.name}</Grid.Column>)
              })
            )}
            </Grid>
          </div>
        </div>
    );
  }
}
