import {
	Card,
	CardHeader,
	Divider
} from '@mui/material'
import ReactTooltip from 'react-tooltip'
import CalendarHeatmap from 'react-calendar-heatmap'
import 'react-calendar-heatmap/dist/styles.css'
import { NumberPostDate } from 'src/models/Info';

const today = new Date()

function NumberPost(props: {data: NumberPostDate[]}) {

	function shiftDate(date, numDays) {
		const newDate = new Date(date);
		newDate.setDate(newDate.getDate() + numDays);
		return newDate;
	}

	return (
		<Card>
			<CardHeader subheader = 'Số lượng bài viết trong 1 năm' title="Thống Kê" />
			<Divider />

			<CalendarHeatmap
				startDate={shiftDate(today, -365)}
				endDate={today}
				values={props.data}
				showWeekdayLabels
				monthLabels={['Th1', 'Th2', 'Th3', 'Th4',
					'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']}
				weekdayLabels={["CN", 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy']}
				classForValue={value => {

					if (!value || value === null) {
						return 'color-empty';
					}
					return `color-github-${value.count}`;
				}}
				tooltipDataAttrs={value => {
					return {
						'data-tip': `${value.date} bài viết: ${value.count}`,
					}
				}}
			/>
			<ReactTooltip />
		</Card>
	)
}

export default NumberPost
