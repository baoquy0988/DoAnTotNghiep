import * as React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

export default function SelectSmall() {
    const [address, setAddress] = React.useState('')

    const handleChange = (event: SelectChangeEvent) => {
        setAddress(event.target.value);
    }
    const data = [
        'An Giang', 'Bạc Liêu', 'Bắc Cạn', 'Bắc Giang', 'Bắc Ninh',
        'Bến Tre', 'Bình Dương', 'Bình Định', 'Bình Phước', 'Bình Thuận',
        'Cà Mau', 'Cao Bằng', 'Cần Thơ', 'Đà Nẵng', 'Daklak', 'Đồng Nai',
        'Đồng Tháp', 'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
        'Hải Dương', 'Hải Phòng', 'Hòa Bình', 'Hồ Chí Minh', 'Hưng Yên',
        'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lạng Sơn',
        'Lào Cai', 'Lâm Đồng', 'Long An', 'Nam Định', 'Nghệ An', 'Ninh Bình',
        'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình', 'Quảng Nam',
        'Quảng Ngãi', 'Quảng Ninh', 'Sóc Trăng', 'Sơn La', 'Tây Ninh',
        'Thái Bình', 'Thái Nguyên', 'Thanh Hóa', 'Thừa Thiên Huế', 'Tiền Giang',
        'Trà Vinh', 'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái',
    ]

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size="medium">
            <InputLabel id="demo-select-small">Thành Phố</InputLabel>
            <Select
                value={address}
                label="Thành Phố"
                onChange={handleChange}
            >
                {data.map((value, index) => {
                    return <MenuItem value={index} key={index}>
                        {value}
                    </MenuItem>
                })}

            </Select>
        </FormControl>
    )
}
