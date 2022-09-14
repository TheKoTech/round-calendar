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
		this.date = new Date()
		this.state = {
			secStyle: {
				transition: 'transform 0.35s ease',
				transform: 'rotate(' + String(this.date.getSeconds() * (- 6)) + 'deg)'
			},
			secRotation: this.date,
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
			this.date = new Date();

			if (this.date.getSeconds() === 0) {
				console.log('this.date.getSecods() === 0');
				this.setState({
					secStyle: {
						transition: 'transform 0.4s ease',
						transform: 'rotate(-360deg)'
					}
				},
					() => setTimeout(() =>
						{
							this.setState({
								secStyle: {
									transition: 'none',
									transform: 'rotate(0deg)'
								}
							})
						}, 500)
					)
			
			} else {

				console.log('else: ' + String(this.date.getSeconds()))
				this.setState({ 
					secStyle: {
						transition: 'transform 0.4s ease',
						transform: 'rotate(' + String(this.date.getSeconds() * (- 6)) + 'deg)'
					}
				 })
			}

		}, 980);
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
				<div className='ring_seconds' style={this.state.secStyle}>
					{this.state.spanList}
				</div>
			</div>
		)
	}
}
