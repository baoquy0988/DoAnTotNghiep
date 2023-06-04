import { Box, Container, Typography, styled } from '@mui/material'
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp'
import { useState } from 'react'
import makeStyles from '@mui/styles/makeStyles'

const FooterWrapper = styled(Container)(
	({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
)

const useStyles = makeStyles((theme) => ({
	myClassName: {
		position: 'fixed',
		bottom: '20px',
		right: '10px',
		"&:hover": {
			color: 'blue'
		}
	}
}))

function Footer() {
	const [visible, setVisible] = useState(false)
	const classes = useStyles()

	const toggleVisible = () => {
		const scrolled = document.documentElement.scrollTop;
		if (scrolled > 300) {
			setVisible(true)
		}
		else if (scrolled <= 300) {
			setVisible(false)
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	};
	
	window.addEventListener('scroll', toggleVisible)

	return (
		<FooterWrapper className="footer-wrapper">
			<Box
				pb={4}
				display={{ xs: 'block', md: 'flex' }}
				alignItems="center"
				textAlign={{ xs: 'center', md: 'left' }}
				justifyContent="space-between"
			>
			</Box>
			<ArrowCircleUpIcon className={classes.myClassName}
				fontSize='large' onClick={scrollToTop}
				style={{ display: visible ? 'inline' : 'none' }}
			/>
		</FooterWrapper>
	)
}

export default Footer
