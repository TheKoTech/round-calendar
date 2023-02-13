import React, { Component } from 'react'
import Dial from './Dial'
import RingSpan from './RingSpan'
import memoize from 'memoize-one'


function pad(num, size) {
	const numStr = num.toString()
	return '0'.repeat(size - numStr.length) + numStr
}


const getMonthLen = (year, month) => new Date(year, month + 1, 0).getDate()


export default class Calendar extends Component {

	constructor(props) {
		super(props)
		// can be used to set initial rotation
		this.date = new Date()
		this.transition = 'all 0.3s ease'
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
			dayOfWeekStyle: {
				transition: this.transition,
				transform: 'rotate(-3deg)' // because i don't fucking know
			},
			dayOfMonthStyle: {
				transition: this.transition,
				transform: 'rotate(0deg)'
			},
			monthStyle: {
				transition: this.transition,
				transform: 'rotate(0deg)'
			},
			yearStyle: {
				transition: this.transition,
				transform: 'rotate(0deg)'
			},

			secActivated: new Array(120).fill(false),
			minActivated: new Array(120).fill(false),
			hourActivated: new Array(120).fill(false),
			dayOfWeekActivated: new Array(120).fill(false),
			dayOfMonthActivated: new Array(120).fill(false),
			monthActivated: new Array(120).fill(false),
			yearActivated: new Array(120).fill(false)
		}

		this.secProps = []
		this.minProps = []
		this.hourProps = []
		this.dayOfWeekProps = []
		this.dayOfMonthProps = []
		this.monthProps = []
		this.yearProps = []

		for (let i = 0; i < 120; i++) {
			const prop = {
				value: (i % 60),
				rotation: i * 3
			}
			this.secProps.push(prop)
			this.minProps.push(prop)
		}

		for (let i = 0; i < 120; i++) {
			const prop = {
				value: (i % 24),
				rotation: i * 3
			}
			this.hourProps.push(prop)
		}

		const dayStrings = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		for (let i = 0; i < 120; i++) {
			const prop = {
				value: dayStrings[
					i < 30
						? (i + 6) % 7
						: (i + 5) % 7
				],
				rotation: i * 3,
			}
			this.dayOfWeekProps.push(prop)
		}

		this.fillDaysOfMonthProps(this.date)

		const monthStrings = [
			'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
		]

		for (let i = 0; i < 120; i++) {
			const prop = {
				value: monthStrings[i % 12],
				rotation: i * 3
			}
			this.monthProps.push(prop)
		}

		for (let i = 0; i < 120; i++) {
			this.yearProps[i] = {
				value: 1960 + i,
				rotation: i * 3
			}
		}
	}


	/** The logic is simple: fill 3 months - current, next and previous. 
	 * The other ones will not be visible */
	fillDaysOfMonthProps = memoize((date) => {

		const lastMonthLength = getMonthLen(date.getFullYear(), date.getMonth() - 1)
		const curMonthLength = getMonthLen(date.getFullYear(), date.getMonth())
		const nextMonthLength = getMonthLen(date.getFullYear(), date.getMonth() + 1)

		for (let i = 120 - lastMonthLength; i < 120; i++) {
			this.dayOfMonthProps[i] = {
				value: i - 119 + lastMonthLength,
				rotation: i * 3
			}
		}

		for (let i = 0; i < curMonthLength; i++) {
			this.dayOfMonthProps[i] = {
				value: i + 1,
				rotation: i * 3
			}
		}

		for (let i = curMonthLength; i < curMonthLength + nextMonthLength; i++) {
			this.dayOfMonthProps[i] = {
				value: i - curMonthLength + 1,
				rotation: i * 3
			}
		}

	})


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

	rotate(unit, time, transitionAngle) {

		const activated = new Array(120).fill(false)

		if (time === 0 && this.state[`${unit}Style`].transform !== 'rotate(0deg)') {

			activated[Math.floor(transitionAngle / 3)] = true

			this.setState({
				[`${unit}Style`]: {
					transition: this.transition,
					transform: 'rotate(-' + transitionAngle + 'deg)'
				},
				[`${unit}Activated`]: activated

			},
				() => setTimeout(() => {
					const activated = new Array(120).fill(false)
					activated[0] = true

					if (unit === 'dayOfMonth') {
						this.fillDaysOfMonthProps(this.date)
					}

					this.setState({
						[`${unit}Style`]: {
							transition: 'none',
							transform: 'rotate(0deg)'
						},
						[`${unit}Activated`]: activated
					})
				}, 500)
			)

		} else {

			activated[time] = true

			if (unit === 'dayOfMonth') {
				this.fillDaysOfMonthProps(this.date)
			}

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

			const addTime = (s = 0, m = 0, h = 0, D = 0, M = 0, Y = 0) => this.date = new Date(
				this.date.getTime() + s * 1000 + m * 60000 + h * 3600000 + D * 86400000 + M * 2592000000 + Y * 31536000000
			)

			addTime(45, 20, 9, 10, 2, 0)

			this.rotate('sec', this.date.getSeconds(), 180)
			this.rotate('min', this.date.getMinutes(), 180)
			this.rotate('hour', this.date.getHours(), 72)
			this.rotate('dayOfWeek', this.date.getDay(), 21)
			this.rotate('dayOfMonth', this.date.getDate() - 1, (getMonthLen(this.date.getFullYear(), this.date.getMonth() - 1)) * 3)
			this.rotate('month', this.date.getMonth(), 36)
			this.rotate('year', (this.date.getFullYear() - 1960), 360)

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

	getDayOfWeekSpanList = memoize((activated) =>
		this.dayOfWeekProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={prop.value}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	getDayOfMonthSpanList = memoize((activated) =>
		this.dayOfMonthProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={pad(prop.value, 2)}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	getMonthSpanList = memoize((activated) =>
		this.monthProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={prop.value}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	getYearSpanList = memoize((activated) =>
		this.yearProps.map((prop, i) =>
			<RingSpan
				key={prop.rotation}
				text={prop.value}
				rotation={prop.rotation}
				activated={activated[i]}
			/>
		)
	)

	render() {

		const secSpanList = this.getSecSpanList(this.state.secActivated)
		const minSpanList = this.getMinSpanList(this.state.minActivated)
		const hourSpanList = this.getHourSpanList(this.state.hourActivated)
		// const dayOfWeekSpanList = this.getDayOfWeekSpanList(this.state.dayOfWeekActivated)
		const dayOfMonthSpanList = this.getDayOfMonthSpanList(this.state.dayOfMonthActivated)
		const monthSpanList = this.getMonthSpanList(this.state.monthActivated)
		const yearSpanList = this.getYearSpanList(this.state.yearActivated)


		return (
			<div className="calendar">
				<div className="ring_timer">
					<div className="sector"></div>
					{/* <Dial className='dial_sec' style={this.state.secStyle}> */}
					<Dial className='dial_sec' style={{ ...this.state.secStyle, '--debug-color': '255, 0, 0' }}>
						{secSpanList}
					</Dial>
					{/* <Dial className='dial_min' style={this.state.minStyle}> */}
					<Dial className='dial_min' style={{ ...this.state.minStyle, '--debug-color': '255, 255, 0' }}>
						{minSpanList}
					</Dial>
					{/* <Dial className='dial_hour' style={this.state.hourStyle}> */}
					<Dial className='dial_hour' style={{ ...this.state.hourStyle, '--debug-color': '0, 255, 0' }}>
						{hourSpanList}
					</Dial>
					{/* <Dial className='dial_day_of_week' style={this.state.dayOfWeekStyle}>
					{dayOfWeekSpanList}
				</Dial> */}
					<Dial className='dial_day_of_month' style={{ ...this.state.dayOfMonthStyle, '--debug-color': '0, 255, 255' }}>
						{dayOfMonthSpanList}
					</Dial>
					{/* <Dial className='dial_month' style={this.state.monthStyle}> */}
					<Dial className='dial_month' style={{ ...this.state.monthStyle, '--debug-color': '0, 0, 255' }}>
						{monthSpanList}
					</Dial>
					{/* <Dial className='dial_year' style={this.state.yearStyle}> */}
					<Dial className='dial_year' style={{ ...this.state.yearStyle, '--debug-color': '255, 0, 255' }}>
						{yearSpanList}
					</Dial>
				</div>
			</div>
		)
	}
}
