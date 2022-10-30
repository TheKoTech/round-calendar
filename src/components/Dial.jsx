import React from 'react'


function Dial(props) {
	return (
		<div className={`dial ${props.className}`}>
			<div
				className='rotator'
				style={props.style}
			>
				{props.children}
			</div>
		</div>
	)
}

export default Dial
