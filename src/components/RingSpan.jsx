import React from 'react'

function RingSpan(props) {
	const style = {
		transform: 'translate(0, -50%) rotate(' + props.rotation + 'deg)'
	}
	return (
		<span className="ring_span" style={style}>
			<span className="ring_text">{props.text}</span>
		</span>
	)
}

export default RingSpan