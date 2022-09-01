import React, { Component } from 'react'
import RingSpan from './RingSpan'

function pad(num, size) {
	const numStr = num.toString()
	return '0'.repeat(size - numStr.length) + numStr
}

export default class Calendar extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
		this.setState({
			spanList: spanProps.map((prop) =>
				<RingSpan key={prop.text} text={pad(prop.text, 2)} rotation={prop.rotation} />
			)
		})
		// this.setState({
		// })
	}
	
	render() {
		return (
			<div class="ring_timer">
				{this.state.spanList}
				<button onClick={() => {
					this.state.spanProps.forEach(prop => {
						prop.rotation += 2
					});
					console.log(this.state.spanProps)
				}}>test</button>
			</div>
		)
	}
}
