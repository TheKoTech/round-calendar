import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers'
import React, { Component } from 'react'
import RingSpan from './RingSpan'

function pad(num, size) {
	const numStr = num.toString()
	return '0'.repeat(size - numStr.length) + numStr
}

export default class Calendar extends Component {
	constructor(props) {
		super(props)
		this.sec = 0
		this.state = {
			secRotation: this.sec,
			spanList: []
		}
	}

	componentDidMount() {
		const spanProps = [];
		for (let i = 0; i <= 59; i++) {
			const sp = {
				text: i,
				rotation: (i) * 6
			}
			spanProps.push(sp);
		}
		this.timerID = setInterval(() => {
			this.sec = (this.sec + 1) % 60
			this.setState({secRotation: this.sec * (-6)})
		}, 1000);
		this.setState({
			spanList: spanProps.map((prop) =>
				<RingSpan key={prop.text} text={pad(prop.text, 2)} rotation={prop.rotation} />
			)
		})
	}

	componentWillUnmount() {
    clearInterval(this.timerID);
  }

	render() {
		return (
			<div className="ring_timer">
				<div className='ring_seconds' style={{
					transform: 'rotate(' + this.state.secRotation + 'deg)',
					height: '100%',
					transition: 'transform 0.5s ease'
				}}>
					{this.state.spanList}
				</div>
				<button onClick={() => { this.setState({rotation: this.sec}) }}>test</button>
			</div>
		)
	}
}
