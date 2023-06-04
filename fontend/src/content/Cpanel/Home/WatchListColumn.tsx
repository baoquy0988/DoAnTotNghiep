import {
	Card,
	Box,
	Typography,
	Avatar,
	Grid,
	alpha,
	useTheme,
	styled
} from '@mui/material';
import Label from 'src/components/Label';
import Text from 'src/components/Text';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined'
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'
import NotListedLocationOutlinedIcon from '@mui/icons-material/NotListedLocationOutlined'

const AvatarWrapper = styled(Avatar)(
	({ theme }) => `
    margin: ${theme.spacing(0, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${theme.palette.mode === 'dark'
			? theme.colors.alpha.trueWhite[30]
			: alpha(theme.colors.alpha.black[100], 0.07)
		};
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`
);

function WatchListColumn() {
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			background: 'transparent',
			toolbar: {
				show: false
			},
			sparkline: {
				enabled: true
			},
			zoom: {
				enabled: false
			}
		},
		fill: {
			gradient: {
				shade: 'light',
				type: 'vertical',
				shadeIntensity: 0.1,
				inverseColors: false,
				opacityFrom: 0.8,
				opacityTo: 0,
				stops: [0, 100]
			}
		},
		colors: [theme.colors.primary.main],
		dataLabels: {
			enabled: false
		},
		theme: {
			mode: theme.palette.mode
		},
		stroke: {
			show: true,
			colors: [theme.colors.primary.main],
			width: 3
		},
		legend: {
			show: false
		},
		labels: [
			'Monday',
			'Tueday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday'
		],
		xaxis: {
			labels: {
				show: false
			},
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			}
		},
		yaxis: {
			show: false,
			tickAmount: 5
		},
		tooltip: {
			x: {
				show: true
			},
			y: {
				title: {
					formatter: function () {
						return 'Price: $';
					}
				}
			},
			marker: {
				show: false
			}
		}
	};
	const chart1Data = [
		{
			name: 'Lập Trình',
			data: [55.701, 57.598, 48.607, 46.439, 58.755, 46.978, 58.16]
		}
	];
	const chart2Data = [
		{
			name: 'Hỏi Đáp',
			data: [13, 16, 14, 20, 8, 11, 20]
		}
	];
	const chart3Data = [
		{
			name: 'Chia Sẻ',
			data: [51.85, 41.77, 22.09, 42.0, 71.9, 51.84, 31.84]
		}
	]
	const chart4Data = [
		{
			name: 'Khác',
			data: [51.85, 41.77, 22.09, 42.0, 71.9, 51.84, 31.84]
		}
	];

	return (
		<Grid
			container
			direction="row"
			justifyContent="center"
			alignItems="stretch"
			spacing={3}
		>
			<Grid item md={3} xs={12}>
				<Card
					sx={{
						overflow: 'visible'
					}}
				>
					<Box
						sx={{
							p: 3
						}}
					>
						<Box display="flex" alignItems="center">
							<AvatarWrapper>
								<TerminalOutlinedIcon color="warning" />
							</AvatarWrapper>
							<Box>
								<Typography variant="h4" noWrap >
									Lập Trình
								</Typography>
								<Typography variant="subtitle1" noWrap>
									30 ngày qua
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start',
								pt: 3
							}}
						>
							<Typography
								variant="h2"
								sx={{
									pr: 1,
									mb: 1
								}}
							>
								{(new Intl.NumberFormat().format(535888))}
							</Typography>
							<Text color="success">
								<b>+12.5%</b>
							</Text>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start'
							}}
						>
							<Label color="success">+{(new Intl.NumberFormat().format(44))}</Label>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									pl: 1
								}}
							>
								so với tháng trước
							</Typography>
						</Box>
					</Box>
					<Chart
						options={chartOptions}
						series={chart1Data}
						type="area"
						height={200}
					/>
				</Card>
			</Grid>
			<Grid item md={3} xs={12}>
				<Card
					sx={{
						overflow: 'visible'
					}}
				>
					<Box
						sx={{
							p: 3
						}}
					>
						<Box display="flex" alignItems="center">
							<AvatarWrapper>
								<QuestionMarkOutlinedIcon color="info" />
							</AvatarWrapper>
							<Box>
								<Typography variant="h4" noWrap>
									Hỏi Đáp
								</Typography>
								<Typography variant="subtitle1" noWrap>
									30 ngày qua
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start',
								pt: 3
							}}
						>
							<Typography
								variant="h2"
								sx={{
									pr: 1,
									mb: 1
								}}
							>
								{(new Intl.NumberFormat().format(535888))}
							</Typography>
							<Text color="error">
								<b>-3.24%</b>
							</Text>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start'
							}}
						>
							<Label color="error">-{(new Intl.NumberFormat().format(2))}</Label>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									pl: 1
								}}
							>
								so với tháng trước
							</Typography>
						</Box>
					</Box>
					<Chart
						options={chartOptions}
						series={chart2Data}
						type="area"
						height={200}
					/>
				</Card>
			</Grid>
			<Grid item md={3} xs={12}>
				<Card
					sx={{
						overflow: 'visible'
					}}
				>
					<Box
						sx={{
							p: 3
						}}
					>
						<Box display="flex" alignItems="center">
							<AvatarWrapper>
								<ShareRoundedIcon color='inherit' />
							</AvatarWrapper>
							<Box>
								<Typography variant="h4" noWrap>
									Chia Sẻ
								</Typography>
								<Typography variant="subtitle1" noWrap>
									30 ngày qua
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start',
								pt: 3
							}}
						>
							<Typography
								variant="h2"
								sx={{
									pr: 1,
									mb: 1
								}}
							>
								{(new Intl.NumberFormat().format(535888))}
							</Typography>
							<Text color="error">
								<b>-0.33%</b>
							</Text>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start'
							}}
						>
							<Label color="error">-{(new Intl.NumberFormat().format(55))}</Label>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									pl: 1
								}}
							>
								so với tháng trước
							</Typography>
						</Box>
					</Box>
					<Chart
						options={chartOptions}
						series={chart3Data}
						type="area"
						height={200}
					/>
				</Card>
			</Grid>

			<Grid item md={3} xs={12}>
				<Card
					sx={{
						overflow: 'visible'
					}}
				>
					<Box
						sx={{
							p: 3
						}}
					>
						<Box display="flex" alignItems="center">
							<AvatarWrapper>
								<NotListedLocationOutlinedIcon color='primary' />
							</AvatarWrapper>
							<Box>
								<Typography variant="h4" noWrap>
									Khác
								</Typography>
								<Typography variant="subtitle1" noWrap>
									30 ngày qua
								</Typography>
							</Box>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start',
								pt: 3
							}}
						>
							<Typography
								variant="h2"
								sx={{
									pr: 1,
									mb: 1
								}}
							>
								{(new Intl.NumberFormat().format(535888))}
							</Typography>
							<Text color="error">
								<b>-0.33%</b>
							</Text>
						</Box>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-start'
							}}
						>
							<Label color="error">-{(new Intl.NumberFormat().format(25))}</Label>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{
									pl: 1
								}}
							>
								so với tháng trước
							</Typography>
						</Box>
					</Box>
					<Chart
						options={chartOptions}
						series={chart4Data}
						type="area"
						height={200}
					/>
				</Card>
			</Grid>
		</Grid>
	);
}

export default WatchListColumn;

