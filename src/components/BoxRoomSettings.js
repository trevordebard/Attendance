import React, { Component } from 'react';
import { Checkbox, Form, Icon, Label, Input } from 'semantic-ui-react'
import { createRoom, doesRoomExist, didCreateRoom } from '../api';

const styles = {
    reqsInput: {
        width: '80%',
        borderTop: 'none',
        borderLeft: 'none',
        borderRadius: '0',
        borderRight: 'none'
    },
}

export default class BoxRoomSettings extends Component {
    constructor(props) {
		super(props)
		this.state = {
			title: 'What information do you need?',
			tooManyAttempts: false,
            problemProcessing: false,
            permissionToModify: false,
            phoneChecked: false,
            emailChecked: false,
            numFormFields: 1,
        }
    }
    componentDidMount() {
        doesRoomExist(this.props.roomCode)
            .then((data) => {
                // If the room exists, check to see if the user created it
                if(data.exists) {
                    this.props.history.push('/');
                }

                // This code is currently unused, but will be useful whenever I add ability to edit room settings
                /*
                if(data.exists === true) {
                    didCreateRoom(this.props.roomCode, window.localStorage.getItem('uuid'))
                    .then((data) => {
                        if(data.didCreate) {
                            this.setState({
                                permissionToModify: true,
                            })
                        }
                        else {
                            this.setState({
                                title: 'You do not have permission to modify room settings'
                            })
                        }
                    })
                }*/
                // If the room does not exist, allow user to modify settings and create it
                else {
                    this.setState({
                        permissionToModify: true,
                    })
                }
            })
        
    }
    handleCreateRoom = () => {
		let roomsCreatedInLastHour = window.localStorage.getItem('creationTimestamps');
		let creationTimestamps = JSON.parse(roomsCreatedInLastHour);
		let count = 0;
		let currentTime = new Date().getTime();
        // Check if user has created any rooms
		if(roomsCreatedInLastHour) {
			let del = [];
			// Iterate through array of time and update creation count
			for(let i=0; i < creationTimestamps.length; i++){
				if(creationTimestamps[i] > currentTime - 3600000) { //if the timestamp occurred within the last hour
					count++;
				}
				else {
					del.push(i);
				}
			}
			// Delete any timestamps over an hour old
			for(let i in del) {
				creationTimestamps.splice(i, 1);
			}
		}
		else {
			creationTimestamps = [currentTime];
		}
		if(count > 5) {
			this.setState({
				tooManyAttempts: true,
			})
		}
		else {
            const uuid = window.localStorage.getItem('uuid');
            const form = document.getElementById('reqs-form');
            const reqs = ['name'];
            for(let element of form) {
                if(element.type == 'text') {
                    reqs.push(element.value);
                }
            }
            // Iterate throught input fields to get reqs
            // If if field text is empty, ignore it
            // Otherwise add it to the array 
            console.log(reqs);
			createRoom(this.props.roomCode, uuid, reqs)
                .then((data) => {
                    if (data.success) {
                        creationTimestamps.push(currentTime);
                        window.localStorage.setItem('creationTimestamps', JSON.stringify(creationTimestamps))
                        let roomsCreated = window.localStorage.getItem('roomsCreated');
                        let roomsCreatedArray;
                        if(roomsCreated) {
                            roomsCreatedArray = JSON.parse(roomsCreated);
                            roomsCreatedArray.push(data.room);
                        }
                        else {
                            roomsCreatedArray = [data.room];
                        }
                        window.localStorage.setItem('roomsCreated', JSON.stringify(roomsCreatedArray));
                        this.setState({
                            roomCode: data.room,
                        })
                        this.props.history.push('/room/' +data.room)
                    } else {
                        this.setState({
                            title: 'Error processing request...',
                            roomCode: 'ERROR'
                        })
                    }
                }
            )
		}
    }
    handlePhoneChange = () => {
        this.setState({
            phoneChecked: !this.state.phoneChecked,
        })
    }
    handleEmailChange = () => {
        this.setState({
            emailChecked: !this.state.emailChecked,
        })
    }
    addRequirement = () => {
        this.setState({
            numFormFields: this.state.numFormFields+1,
        })
    }
    getFormFields = () => {
        let array = []
        for(let i = 0; i < this.state.numFormFields; i++) {
            array.push(
                <Form.Field className='reqs-input-field'>
                    <Checkbox tabIndex='-1' defaultChecked/>
                    <input placeholder='Enter field' type='text' className='reqs-input' style={styles.reqsInput} autoFocus/>
                </Form.Field>
            )
        }
        return array;
    }
    
  render() {
    const { permissionToModify } = this.state;
    return (
      <div className='box'>
        <h3>{this.state.title}</h3>
        <div className='header'>
            <hr/>
        </div>
        { permissionToModify===true ? (
            <div className='content' style={{textAlign: 'left', alignSelf: 'left'}}>
                <Form id='reqs-form'>
                    <Form.Field>
                        <Checkbox disabled checked name='name' label='Name' />
                    </Form.Field>
                    {this.getFormFields()}
                    <Form.Field>
                        <Icon name="plus" onClick={this.addRequirement}/>
                    </Form.Field>
                </Form>
                <button onClick={this.handleCreateRoom} style={{marginTop: '20px'}}>Create Room</button>
                {this.state.tooManyAttempts &&
                    <p className="box-validation">You're doing that too much. Try again in an hour.</p>
                }
                {this.state.problemProcessing && 
                    <p className="box-validation">Sorry, there was a problem processing your request.</p>
                }
            </div>
        ) : (
            <div/>
        )}
      </div>
    )
  }
};
