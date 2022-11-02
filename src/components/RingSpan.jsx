import React from 'react'

function RingSpan(props) {
	const style = {
		transform: 'translate(0, -50%) rotate(' + props.rotation + 'deg)'
	}
	const activated = props.activated ? ' activated' : ''
	return (
		<span className='ring_span' style={style}>
			<span className={'ring_text' + activated}>{props.text}</span>
		</span>
	)
}

export default RingSpan