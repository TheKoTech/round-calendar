import Calendar from './components/Calendar.jsx'

function App() {

	const toPX = (percent) => {
		return Math.floor(percent / 100 * window.innerWidth) + 'px'
	}

	return (
		<div
			className='App'
			style={{
				'--font-size': toPX(1.62),
				'--global-diam': toPX(200),
				'--clock-diam': toPX(8),
				'--sec-diam': 0,
				'--min-diam': toPX(3.6),
				'--hour-diam': toPX(7.2),
				'--day-diam': toPX(12),
				'--date-diam': toPX(14),
				'--month-diam': toPX(17.5),
				'--year-diam': toPX(22),
				'--border-diam': toPX(1)
			}}
		>
			<Calendar />
		</div>
	)
}

export default App
