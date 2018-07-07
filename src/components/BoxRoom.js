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
      this.state.socket.emit('join-room', 'ROOM CODE GOES HERE')
      this.state.socket.on('fill-page-with-users', (users) => {
        console.log(users);
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
            <h3 className='header-content' >Your room code is:
              <h1 className='header-content'> {this.props.match.params.roomCode}</h1>
            </h3>
          </div>
          <hr />
          <div>
            <Grid celled columns={4}>
            {this.state.users == null || !this.state.users.length ? 'There are currently no users' : (
              this.state.users.map((element, i) => {
                return(<Grid.Column className='grid-cell'>{element.name}</Grid.Column>)
              })
            )}
            </Grid>
          </div>
        </div>
    );
  }
}
