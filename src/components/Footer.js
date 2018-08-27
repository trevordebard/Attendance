import React, { Component } from 'react';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

const footer = {
    position: 'fixed',
    left: 0,
    bottom: 5,
    width: '100%',
    color: 'white',
    textAlign: 'center',
}
const a = {
    textDecoration: 'none',
    color: 'inherit',
}
class Footer  extends Component {
    render() {
        return (
            <div style={footer} className="footer">
                Created by Trevor DeBardeleben
                <br/>
                <a style={a} href="mailto:trevordebard@gmail.com" rel="noopener noreferrer" target="_blank" ><i style={{fontSize: '1.2em'}} className="fa fa-envelope" />&nbsp;&nbsp;</a>
                <a style={a} href="http://github.com/trevordebard" rel="noopener noreferrer" target="_blank"><i style={{fontSize: '1.2em'}} className="fa fa-github"></i></a>
            </div>
        );
    }
}

export default Footer;
