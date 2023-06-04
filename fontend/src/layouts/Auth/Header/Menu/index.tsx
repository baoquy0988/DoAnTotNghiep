import {
	Box,
	List,
	ListItem,
	ListItemText,
	Menu,
	MenuItem
} from '@mui/material';
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';

import HomeIcon from '@mui/icons-material/Home'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const ListWrapper = styled(Box)(
	({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(['color', 'fill'])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`
);

function HeaderMenu() {
	const ref = useRef<any>(null);
	const [isOpen, setOpen] = useState<boolean>(false);

	const handleOpen = (): void => {
		setOpen(true);
	};

	const handleClose = (): void => {
		setOpen(false);
	};

	return (
		<>
			<ListWrapper
				sx={{
					display: {
						xs: 'none',
						md: 'block'
					}
				}}
			>
				<List disablePadding component={Box} display="flex">
					<ListItem
						classes={{ root: 'MuiListItem-indicators' }}
						button
						component={NavLink}
						to="/home"
					>
						<HomeIcon fontSize='small' style={{marginRight: '-3px',  marginBottom: '2px'}}/>
						<ListItemText
							primaryTypographyProps={{ noWrap: true }}
							primary="Trang Chủ"

						/>
					</ListItem>

					<ListItem
						classes={{ root: 'MuiListItem-indicators' }}
						button
						component={NavLink}
						to="/auth/login"
					>
						<VpnKeyIcon fontSize='small' style={{marginRight: '-3px',  marginBottom: '2px'}}/>
						<ListItemText
							primaryTypographyProps={{ noWrap: true }}
							primary="Đăng Nhập"
						/>
					</ListItem>

					
					<ListItem
						classes={{ root: 'MuiListItem-indicators' }}
						button
						component={NavLink}
						to="/auth/register"
					>
						<AccountCircleIcon fontSize='small' style={{marginRight: '-3px',  marginBottom: '2px'}}/>
						<ListItemText
							primaryTypographyProps={{ noWrap: true }}
							primary="Đăng Ký"
						/>
					</ListItem>

					<ListItem
						classes={{ root: 'MuiListItem-indicators' }}
						button
						ref={ref}
						onClick={handleOpen}
					>
						<ListItemText
							primaryTypographyProps={{ noWrap: true }}
							primary={
								<Box display="flex" alignItems="center">
									Khác
									<Box display="flex" alignItems="center" pl={0.3}>
										<ExpandMoreTwoToneIcon fontSize="small" />
									</Box>
								</Box>
							}
						/>
					</ListItem>
				</List>
			</ListWrapper>
			<Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
				<MenuItem sx={{ px: 3 }} component={NavLink} to="/overview">
					Liên Hệ
				</MenuItem>
				<MenuItem sx={{ px: 3 }} component={NavLink} to="/components/tabs">
					Báo Lỗi
				</MenuItem>
				<MenuItem sx={{ px: 3 }} component={NavLink} to="/components/cards">
					Hỗ Trợ
				</MenuItem>
			</Menu>
		</>
	);
}

export default HeaderMenu;
