import React, { Component } from 'react'
import Dial from './Dial'
import RingSpan from './RingSpan'
import memoize from 'memoize-one'


function pad(num, size) {
	const numStr = num.toString()
	return '0'.repeat(size - numStr.length) + numStr
}


export default class Calendar extends Component {

	constructor(props) {
		super(props)
		this.date = new Date()
		this.degub_time = new Date()
		this.transition = 'transform 0.25s ease'
		this.state = {
			secStyle: {
				transition: this.transition,
				transform: 'rotate(0deg)'
			},
			minStyle: {
				transition: this.transition,
				transform: 'rotate(0deg)'
			},
			hourStyle: {
				transition: this.transition,
				transform: 'rotate(0deg)'
			},
			secSpanList: [],
			minSpanList: [],
			hourSpanList: [],
			secActivated: new Array(120).fill(false),
			minActivated: new Array(120).fill(false),
			hourActivated: new Array(120).fill(false)
		}

		this.secProps = []
		this.minProps = []
		this.hourProps = []

		for (let i = 0; i < 120; i++) {
			const prop = {
				value: (i % 60),
				rotation: i * 3,
				activated: false
			}
			this.secProps.push(prop)
			this.minProps.push(prop)
		}

		for (let i = 0; i < 120; i++) {
			const prop = {
				value: (i % 24),
				rotation: i * 3,
				activated: false
			}
			this.hourProps.push(prop)
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

	// todo: optimize by assigning all states at once, when changing more than one
	/** Sets the state[Unit] to time * (- angleMultiplyer). 
	 * @param unit {string}
	 * @param time {number}
	 * @param transitionAngle {number | string}
	*/
	rotate(unit, time, transitionAngle) {

		const activated = new Array(120).fill(false)

		if (time === 0 && this.state[`${unit}Style`].transform !== 'rotate(0deg)') {

			activated[transitionAngle / 3] = true
			activated[0] = true

			this.setState({
				[`${unit}Style`]: {
					transition: this.transition,
					transform: 'rotate(-' + transitionAngle + 'deg)'
				},
				[`${unit}Activated`]: activated

			},
				() => setTimeout(() => {
					console.log('clearing transition')
					this.setState({
						[`${unit}Style`]: {
							transition: 'none',
							transform: 'rotate(0deg)'
						}
					})
				}, 500)
			)

		} else {

			activated[time] = true

			this.setState({
				[`${unit}Style`]: {
					transition: this.transition,
					transform: 'rotate(' + String(time * (- 3)) + 'deg)'
				},
				[`${unit}Activated`]:
					activated

			})
		}

	}

	componentDidMount() {

		this.tick(() => {

			this.date = new Date();
			this.date = new Date(this.date.getTime() + 25 * 60000 - 55 * 1000)

			this.rotate('sec', this.date.getSeconds(), 180)
			this.rotate('min', this.date.getMinutes(), 180)
			this.rotate('hour', this.date.getHours(), 72)

		})

	}

	componentWillUnmount() {
		clearTimeout(this.timeoutID)
	}

	getSecSpanList = memoize((activated) =>
		this.secProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={pad(prop.value, 2)}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	getMinSpanList = memoize((activated) =>
		this.minProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={pad(prop.value, 2)}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	getHourSpanList = memoize((activated) =>
		this.hourProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={pad(prop.value, 2)}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	render() {

		const secSpanList = this.getSecSpanList(this.state.secActivated)
		const minSpanList = this.getMinSpanList(this.state.minActivated)
		const hourSpanList = this.getHourSpanList(this.state.hourActivated)

		return (
			<div className="ring_timer">
				<Dial className='dial_sec' style={this.state.secStyle}>
					{secSpanList}
				</Dial>
				<Dial className='dial_min' style={this.state.minStyle}>
					{minSpanList}
				</Dial>
				<Dial className='dial_hour' style={this.state.hourStyle}>
					{hourSpanList}
				</Dial>
			</div>
		)
	}
}
