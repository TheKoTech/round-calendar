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
		this.syncedIntervals = new Map()
		this.degub_time = new Date()
		this.state = {
			secStyle: {
				transition: 'transform 0.35s ease',
				transform: 'rotate(0deg)'
				// transform: 'rotate(' + String(this.startDate.getSeconds() * (- 6)) + 'deg)'
			},
			// secRotation: this.date,
			spanList: []
		}
	}

	/** вызывает callback каждую секунду. Хранит ID в this.timeoutID */
	tick(callback) {
		const newDate = new Date()
		const delay = 1000 - newDate.getMilliseconds()
		this.timeoutID = setTimeout(
			() => {
				callback()
				this.tick(callback)
			},
			delay
		)
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
		this.tick(() => {
			const now = this.date
			const past = this.date.degub_time
			// console.log(this.date.getSeconds())
			if (now - past > 1500) {
				console.warn(`!!! now: ${now}    past: ${past}`)
			}
			this.date.degub_time = new Date()
		})

		this.timerID = setInterval(() => {
			this.date = new Date();

			if (this.date.getSeconds() === 0 && this.state.secStyle.transform !== 'rotate(0deg)') {

				this.setState({
					secStyle: {
						transition: 'transform 0.35s ease',
						transform: 'rotate(-360deg)'
					}
				},
					() => setTimeout(() => {
						this.setState({
							secStyle: {
								transition: 'none',
								transform: 'rotate(0deg)'
							}
						})
					}, 500)
				)

			} else {

				this.setState({
					secStyle: {
						transition: 'transform 0.35s ease',
						transform: 'rotate(' + String(this.date.getSeconds() * (- 6)) + 'deg)'
					}
				})

			}

		}, 40);
		this.setState({
			spanList: spanProps.map((prop) =>
				<RingSpan key={prop.text} text={pad(prop.text, 2)} rotation={prop.rotation} />
			)
		})
	}

	componentWillUnmount() {
		clearInterval(this.timerID)
		clearTimeout(this.timeoutID)
		console.log('timeout cleared');
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
