import {
	Avatar,
	Tooltip,
	IconButton,
	Box,
	Button,
	styled,
	InputBase,
	useTheme
} from '@mui/material'
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone'
import SendTwoToneIcon from '@mui/icons-material/SendTwoTone'
import { useRef, useState } from 'react';

const MessageInputWrapper = styled(InputBase)(
	({ theme }) => `
    font-size: ${theme.typography.pxToRem(15)};
    padding: ${theme.spacing(1)};
    width: 100%;
`
)

const Input = styled('input')({
	display: 'none'
});

function BottomBarContent(props: { send: Function }) {
	const theme = useTheme()
	const refText = useRef<HTMLInputElement>()

	function onClickSend(e) {
		e.preventDefault()
		const text = refText.current.value
		if (text.trim() === '') return
		props.send(text.trim())
		refText.current.value = ''
	}

	return (
		<form onSubmit={onClickSend} style={{ width: '100%' }}>
			<Box
				sx={{
					background: theme.colors.alpha.white[50],
					display: 'flex',
					alignItems: 'center',
					p: 2
				}}
			>

				<Box flexGrow={1} display="flex" alignItems="center">
					<MessageInputWrapper
						autoFocus
						placeholder="Nhập nội dung chat"
						fullWidth
						inputRef={refText}
						type="text"
					/>
				</Box>
				<Box>
					<Tooltip arrow placement="top" title="Choose an emoji">
						<IconButton
							sx={{ fontSize: theme.typography.pxToRem(16) }}
							color="primary"
						>
							😀
						</IconButton>
					</Tooltip>
					<Input accept="image/*" id="messenger-upload-file" type="file" />
					<Tooltip arrow placement="top" title="Attach a file">
						<label htmlFor="messenger-upload-file">
							<IconButton sx={{ mx: 1 }} color="primary" component="span">
								<AttachFileTwoToneIcon fontSize="small" />
							</IconButton>
						</label>
					</Tooltip>
					<Button startIcon={<SendTwoToneIcon />} variant="contained" type='submit'>
						Send
					</Button>
				</Box>

			</Box >
		</form>
	)
}

export default BottomBarContent
