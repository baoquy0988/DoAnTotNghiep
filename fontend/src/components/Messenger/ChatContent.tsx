import { Box, Avatar, Typography, Card, styled, Divider, Tooltip } from '@mui/material'

import {
	formatDistance,
	format,
	subDays,
	subHours,
	subMinutes
} from 'date-fns';
import { MutableRefObject, useEffect, useRef } from 'react';

import ChatInfo from 'src/models/Chat'

const DividerWrapper = styled(Divider)(
	({ theme }) => `
      .MuiDivider-wrapper {
        border-radius: ${theme.general.borderRadiusSm};
        text-transform: none;
        background: ${theme.palette.background.default};
        font-size: ${theme.typography.pxToRem(13)};
        color: ${theme.colors.alpha.black[50]};
      }
`
)

const CardWrapperPrimary = styled(Card)(
	({ theme }) => `
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      padding: ${theme.spacing(1)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-right-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
)

const CardWrapperSecondary = styled(Card)(
	({ theme }) => `
      background: ${theme.colors.alpha.black[10]};
      color: ${theme.colors.alpha.black[100]};
      padding: ${theme.spacing(1)};
      border-radius: ${theme.general.borderRadiusXl};
      border-top-left-radius: ${theme.general.borderRadius};
      max-width: 380px;
      display: inline-flex;
`
)


function ChatContent(props: { data: ChatInfo[], user_id: number}) {

	const messagesEndRef = useRef(null)

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}
	useEffect(() => {
		scrollToBottom()
	}, [props.data])

	const show = () => {
		return props.data.map((value, index) => {
			//Nhận tin từ người khác
			if (value.user_id !== props.user_id) {
				return (
					<Box
						display="flex"
						alignItems="flex-start"
						justifyContent="flex-start"
						py={1} key={index}
					>
						<Tooltip title={value.name}>
							<Avatar
								variant="rounded"
								sx={{
									width: 35,
									height: 35
								}}
								alt={value.name}
								src={value.image}
							/>
						</Tooltip>
						<Box
							display="flex"
							alignItems="flex-start"
							flexDirection="column"
							justifyContent="flex-start"
							ml={1}
						>
							<CardWrapperSecondary>
								{value.content}
							</CardWrapperSecondary>
							<Typography
								variant="subtitle1"
								sx={{
									pt: 1,
									display: 'flex',
									alignItems: 'center',
									fontSize: '10px'
								}}
							>
								{value.date}
							</Typography>
						</Box>
					</Box>
				)
			}
			else return (
				<Box
					display="flex"
					alignItems="flex-start"
					justifyContent="flex-end"
					py={1} key={index}
				>
					<Box
						display="flex"
						alignItems="flex-end"
						flexDirection="column"
						justifyContent="flex-end"
						mr={1}
					>
						<CardWrapperPrimary>
							{value.content}
						</CardWrapperPrimary>
						<Typography
							variant="subtitle1"
							sx={{
								display: 'flex',
								alignItems: 'center',
								fontSize: '10px'
							}}
						>
							{value.date}
						</Typography>
					</Box>
				</Box>
			)
		})
	}
	return (
		<Box p={1}>
			<DividerWrapper style={{ marginBottom: '5px' }}>
				{/* {format(new Date(), 'dd / MM / yyyy')} */}
				Hôm nay
			</DividerWrapper>

			{show()}

			{/* <div ref={messagesEndRef} /> */}
		</Box>
	)
}

export default ChatContent
