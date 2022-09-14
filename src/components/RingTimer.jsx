import React from "react"
import { useState } from "react"
import RingSpan from "./RingSpan"

function pad(num, size) {
	const numStr = num.toString()
	return '0'.repeat(size - numStr.length) + numStr
}


const RingTimer = function (props) {
	const spanProps = [];
	for (let i = 1; i <= 3; i++) {
		const sp = {
			text: i,
			rotation: (i - 1) * 2
		}
		spanProps.push(sp);
	}

	

	// console.log(pad(1, 2))
	const spanList = spanProps.map((prop) =>
		<RingSpan key={prop.text} text={pad(prop.text, 2)} rotation={prop.rotation} />
	)

	return (
		<div className="ring_timer">
			{spanList}
			<button onClick={() =>{}}>test</button>
		</div>
	)
}

export default RingTimer