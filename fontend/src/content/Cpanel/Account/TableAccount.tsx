import { FC, ChangeEvent, useState } from 'react';
import { format } from 'date-fns';
import numeral from 'numeral';
import PropTypes, { number } from 'prop-types';
import {
    Tooltip,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Card,
    Checkbox,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableContainer,
    Select,
    MenuItem,
    Typography,
    useTheme,
    CardHeader,
    Alert,
    AlertColor
} from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import Label from 'src/components/Label'
import { CryptoOrderStatus } from 'src/models/UserCpanel'
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone'
import BulkActions from './BulkActions'
import UserCpanel from 'src/models/UserCpanel'
import Edit from './Edit'
import Del from './Del'
import Band from './Band'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import cpanelSocket from 'src/api/socket/cpanelSocket';
interface RecentOrdersTableProps {
    className?: string;
    data: UserCpanel[];
}

interface Filters {
    status?: CryptoOrderStatus;
}

const getStatusLabel = (cryptoOrderStatus: CryptoOrderStatus): JSX.Element => {
    const map = {
        failed: {
            text: 'Chưa Xác Nhận',
            color: 'error'
        },
        completed: {
            text: 'Đã Xác Nhận',
            color: 'success'
        },
        pending: {
            text: 'Khóa',
            color: 'warning'
        }
    };

    const { text, color }: any = map[cryptoOrderStatus];

    return <Label color={color}>{text}</Label>;
};

const applyFilters = (
    data: UserCpanel[],
    filters: Filters
): UserCpanel[] => {
    return data.filter((cryptoOrder) => {
        let matches = true;

        if (filters.status && cryptoOrder.status !== filters.status) {
            matches = false;
        }

        return matches;
    });
};

const applyPagination = (
    data: UserCpanel[],
    page: number,
    limit: number
): UserCpanel[] => {
    return data.slice(page * limit, page * limit + limit);
};
interface ShowNoti {
    text: string
    open: boolean
    type: AlertColor
}
let selectIndex = -1
let selectDel = '-1'
let selectCount = 0

const TableAccount: FC<RecentOrdersTableProps> = ({ data }) => {
    const [selectedCryptoOrders, setSelectedCryptoOrders] = useState<string[]>(
        []
    );
    const selectedBulkActions = selectedCryptoOrders.length > 0;
    const [page, setPage] = useState<number>(0);
    const [limit, setLimit] = useState<number>(5)
    //người dùng được chọn để chỉnh sửa
    const [userEdit, setUserEdit] = useState<UserCpanel>(
        {
            id: '-1',
            name: "Quản Trị Viên",
            email: '',
            count: -1,
            status: 'failed',
            username: 'admin'
        }
    )
    const [band, setBand] = useState(false)



    const [editShow, setEditShow] = useState(false)
    const [delShow, setDelShow] = useState(false)


    function setShow(value: UserCpanel, index: number) {
        setUserEdit(value)
        setEditShow(true)
        selectIndex = index
    }

    //Thông báo
    const [noti, setNoti] = useState<ShowNoti>(
        {
            type: 'error',
            text: '',
            open: false
        }
    )
    function editSuccess(index: number, value: UserCpanel) {
        data[index] = value
    }
    //Xóa Tài Khoản
    function setShowDel(id: string, index: number, count: number) {
        selectDel = id
        selectIndex = index
        selectCount = count
        setDelShow(true)

    }
    //Render khi thực hiện kháo tài khoản thành công
    function LockSuccess(index: number) {
        data[index].status = 'pending'
    }

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setNoti({ ...noti, open: false })
    }

    const [filters, setFilters] = useState<Filters>({
        status: null
    });

    const statusOptions = [
        {
            id: 'all',
            name: 'Tất Cả'
        },
        {
            id: 'completed',
            name: 'Đã Xác Nhận'
        },
        {
            id: 'pending',
            name: 'Khóa'
        },
        {
            id: 'failed',
            name: 'Chưa Xác Nhận'
        }
    ];

    const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = null;

        if (e.target.value !== 'all') {
            value = e.target.value;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            status: value
        }));
    };

    const handleSelectOneCryptoOrder = (
        event: ChangeEvent<HTMLInputElement>,
        cryptoOrderId: string
    ): void => {
        if (!selectedCryptoOrders.includes(cryptoOrderId)) {
            setSelectedCryptoOrders((prevSelected) => [
                ...prevSelected,
                cryptoOrderId
            ]);
        } else {
            setSelectedCryptoOrders((prevSelected) =>
                prevSelected.filter((id) => id !== cryptoOrderId)
            );
        }
    };

    const handlePageChange = (event: any, newPage: number): void => {
        setPage(newPage);
    };

    const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setLimit(parseInt(event.target.value));
    };

    const filteredCryptoOrders = applyFilters(data, filters);
    const paginatedCryptoOrders = applyPagination(
        filteredCryptoOrders,
        page,
        limit
    );
    const selectedSomeCryptoOrders =
        selectedCryptoOrders.length > 0 &&
        selectedCryptoOrders.length < data.length;
    const selectedAllCryptoOrders =
        selectedCryptoOrders.length === data.length;
    const theme = useTheme();


    const [open, setOpen] = useState(false)

    const [openBand, setOpenBand] = useState({
        id: '-1',
        index: 1,
        username: ""
    })
    const handleClickOpen = (id: string, index: number, username: string) => {
        setOpenBand({
            id: id,
            index: index,
            username: username
        })
        setOpen(true)
    }

    const handleCloseOpenBand = () => {
        setOpen(false)
    }

    function successOpenBand() {
        // data[openBand.index].status = "failed"
        cpanelSocket.openBand(openBand.id).then((res) => {
            data[openBand.index].status = res
            setOpen(false)
            setNoti({
                open: true,
                type: "success",
                text: "Mở Khóa Tài Khoản Thành Công"
            })

        }).catch(() => {
            setOpen(false)
            setNoti({
                open: true,
                type: "error",
                text: "Có Lỗi Xảy Ra"
            })
        })

    }

    const [openBandAcc, setOpenBandAcc] = useState(false)

    const handleClickBand = (id: string, index: number, username: string) => {
        setOpenBand({
            id: id,
            index: index,
            username: username
        })
        setOpenBandAcc(true)
    }

    function successBand(type: boolean) {
        if (type) {
            data[openBand.index].status = "pending"
            setNoti({
                open: true,
                type: "success",
                text: "Khóa Tài Khoản Thành Công"
            })
        } else {
            setNoti({
                open: true,
                type: "error",
                text: "Có Lỗi Xảy Ra"
            })
        }


    }
    return (
        <Card>
            {selectedBulkActions && (
                <Box flex={1} p={2}>
                    <BulkActions />
                </Box>
            )}
            {!selectedBulkActions && (
                <CardHeader
                    action={
                        <Box width={150}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Trạng Thái</InputLabel>
                                <Select
                                    value={filters.status || 'all'}
                                    onChange={handleStatusChange}
                                    label="Trạng Thái"
                                    autoWidth
                                >
                                    {statusOptions.map((statusOption) => (
                                        <MenuItem key={statusOption.id} value={statusOption.id}>
                                            {statusOption.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    }
                    title="Quản Lí Tài Khoản"
                />
            )}
            <Divider />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                            </TableCell>
                            {/* <TableCell>ID</TableCell> */}
                            <TableCell>ID</TableCell>
                            <TableCell>Tên Tài Khoản</TableCell>
                            <TableCell>Tên Hiển Thị</TableCell>
                            <TableCell align="right">Số Bài Viết</TableCell>
                            <TableCell align="right">Trạng Thái</TableCell>
                            <TableCell align="right">Tùy Chọn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedCryptoOrders.map((value, index) => {
                            const isCryptoOrderSelected = selectedCryptoOrders.includes(
                                value.id
                            )
                            return (
                                <TableRow
                                    hover
                                    key={index}
                                    selected={isCryptoOrderSelected}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isCryptoOrderSelected}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                                handleSelectOneCryptoOrder(event, value.id)
                                            }
                                            value={isCryptoOrderSelected}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {value.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {value.username}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {value.email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {value.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {/* {cryptoOrder.sourceDesc} */}
                                        </Typography>
                                    </TableCell>


                                    <TableCell align="right">
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            color="text.primary"
                                            gutterBottom
                                            noWrap
                                        >
                                            {value.count}
                                            {/* {cryptoOrder.cryptoCurrency} */}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {/* {numeral(cryptoOrder.amount).format(
                                                `${cryptoOrder.currency}0,0.00`
                                            )} */}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        {getStatusLabel(value.status)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Chỉnh Sửa" arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': {
                                                        background: theme.colors.primary.lighter
                                                    },
                                                    color: theme.palette.primary.main
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => setShow(value, index)}
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa Tài Khoản" arrow>
                                            <IconButton
                                                sx={{
                                                    '&:hover': { background: theme.colors.error.lighter },
                                                    color: theme.palette.error.main
                                                }}
                                                color="inherit"
                                                size="small"
                                                onClick={() => setShowDel(value.id, index, value.count)}
                                            >
                                                <DeleteTwoToneIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        {value.status !== 'pending' ?
                                            <Tooltip title="Khóa Tài Khoản" arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.error.lighter },
                                                        color: theme.palette.error.main
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => handleClickBand(value.id, index, value.username)}
                                                >
                                                    <LockIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Mở Khóa" arrow>
                                                <IconButton
                                                    sx={{
                                                        '&:hover': { background: theme.colors.success.lighter },
                                                        color: theme.palette.success.main
                                                    }}
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => handleClickOpen(value.id, index, value.username)}
                                                >
                                                    <LockOpenIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        }

                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box p={2}>
                <TablePagination
                    component="div"
                    count={filteredCryptoOrders.length}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 10, 25, 30]}
                    labelRowsPerPage="Số lượng mỗi trang"
                />
            </Box>
            <Edit data={userEdit} open={editShow} close={setEditShow}
                show={editSuccess} index={selectIndex} setNoti={setNoti} />

            <Snackbar
                open={noti.open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Note archived"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert color={noti.type} icon={false}>{noti.text}</Alert>
            </Snackbar>
            <Del open={delShow} close={setDelShow} id={selectDel}
                count={selectCount} lock={LockSuccess} index={selectIndex} setNoti={setNoti} />

            <Band open={openBandAcc} close={setOpenBandAcc} id={openBand.id} success={successBand} />

            <Dialog
                open={open}
                onClose={handleCloseOpenBand}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Mở Khóa Tài Khoản: ${openBand.username} ?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Tài khoản này sẽ được mở khóa và tiếp tục sử dụng các chức năng.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseOpenBand}>Hủy</Button>
                    <Button onClick={() => successOpenBand()} autoFocus variant='contained'>
                        Xác Nhận
                    </Button>
                </DialogActions>
            </Dialog>

        </Card >
    );
};

TableAccount.propTypes = {
    data: PropTypes.array.isRequired
};

TableAccount.defaultProps = {
    data: []
};

export default TableAccount;
