import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select'

import { format, subYears } from 'date-fns'


export default function SelectSmall(props: {submit : Function}) {
    const [age, setAge] = React.useState<string | undefined>()

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value)
        props.submit(year[event.target.value])
    }

    const year = React.useMemo(() => {
        let temp = []

        const getYear = () => {
            [...Array(5)].map((_, index) => {
                const month = subYears(new Date(), index)
                temp.push(format(month, "yyyy"))

            })
        }
        getYear()
        return temp
    }, [])


    return (
        <FormControl sx={{ m: 1, minWidth: 240 }} size="small">
            <InputLabel id="demo-select-small">Năm</InputLabel>
            <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={age}
                label="Năm"
                onChange={handleChange}
            >
               {year.map((value, index)=>{
                return(
                    <MenuItem value={index} key={index} title={value}>{value}</MenuItem>
                )
               })}

            </Select>
        </FormControl>
    )
}
