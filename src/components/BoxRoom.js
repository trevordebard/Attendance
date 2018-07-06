import React, { Component } from 'react';
import io from 'socket.io-client';
import { Grid, Header } from 'semantic-ui-react';

const socketURL = process.env.REACT_APP_SOCKET_URL;

export default class BoxRoom extends Component {
  constructor(props) {
    super(props);
    console.log(props);
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
      this.state.socket.emit('join-room', this.props.match.match.params.roomCode)
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
      <div className="container">
        <div id="room-view" className="box box-room">
          <Header size='small' id="box-room-title">Your room code is: <Header size='huge'>{this.props.match.match.params.roomCode}</Header>
          </Header>
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
      </div>
    );
  }
}
