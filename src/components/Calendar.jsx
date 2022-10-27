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
		this.degub_time = new Date()
		this.state = {
			secStyle: {
				transition: 'transform 0.35s ease',
				transform: 'rotate(0deg)'
				// transform: 'rotate(' + String(this.startDate.getSeconds() * (- 6)) + 'deg)'
			},
			minStyle: {
				transition: 'transform 0.35s ease',
				transform: 'rotate(0deg)'
			},
			// secRotation: this.date,
			secondsSpanList: [],
			// minutesSpanList: [],
			// hoursSpanList: []
		}
	}

	/** вызывает callback каждый раз, когда происходит новая секунда. 
	 * Хранит ID в this.timeoutID */
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


	// todo: change timeMethod to time
	/** Sets the state to time * (- angleMultiplyer). 
	 * @param state {string}
	 * @param time {number}
	 * @param angleMultiplyer {number}
	*/
	rotate(state, time, angleMultiplyer) {

		if (time === 0 && this.state[state].transform !== 'rotate(0deg)') {

			this.setState({
				[state]: {
					transition: 'transform 0.35s ease',
					transform: 'rotate(-360deg)'
				}
			},
				() => setTimeout(() => {
					this.setState({
						[state]: {
							transition: 'none',
							transform: 'rotate(0deg)'
						}
					})
				}, 500)
			)

		} else {

			this.setState({
				[state]: {
					transition: 'transform 0.35s ease',
					transform: 'rotate(' + String(time * (- angleMultiplyer)) + 'deg)'
				}
			})
		}

	}

	componentDidMount() {

		const spanProps = []
		const hourProps = []

		for (let i = 0; i < 60; i++) {
			const prop = {
				value: i,
				rotation: i * 6
			}
			spanProps.push(prop)
		}

		for (let i = 0; i < 24; i++) {
			const prop = {
				value: i,
				rotation: i * 15
			}
			hourProps.push(prop)
		}

		this.setState({
			secondsSpanList: spanProps.map((prop) =>
				<RingSpan key={prop.value} text={pad(prop.value, 2)} rotation={prop.rotation} />
			),
			minutesSpanList: spanProps.map((prop) =>
				<RingSpan key={prop.value} text={pad(prop.value, 2)} rotation={prop.rotation} />
			),
			hoursSpanList: hourProps.map((prop) =>
				<RingSpan key={prop.value} text={pad(prop.value, 2)} rotation={prop.rotation} />
			)
		})

		this.tick(() => {

			this.date = new Date();

			this.rotate('secStyle', this.date.getSeconds(), 6)
			this.rotate('minStyle', this.date.getMinutes(), 6)
			this.rotate('hourStyle', this.date.getHours(), 15)

			console.log(new Date().getTime())

		})

	}

	componentWillUnmount() {
		clearTimeout(this.timeoutID)
		console.log('timeout cleared')
	}

	render() {
		return (
			<div className="ring_timer">
				<div className='dial dial_sec'>
					<div
						className='ring_seconds'
						style={this.state.secStyle}
					>
						{this.state.secondsSpanList}
					</div>
				</div>
				<div className="dial dial_min">
					<div
						className="ring_minutes"
						style={this.state.minStyle}
					>
						{this.state.minutesSpanList}
					</div>
				</div>
				<div className="dial dial_hour">
					<div
						className="ring_hours"
						style={this.state.hourStyle}
					>
						{this.state.hoursSpanList}
					</div>
				</div>
			</div>
		)
	}
}
