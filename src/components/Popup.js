import React, { Component } from 'react'

export default class Popup extends Component {

  render() {
    return (
      <div>
        <p>{this.props.location.name}</p>
      </div>
    )
  }
}
