import { Card } from '@mui/material';
import { CryptoOrder } from 'src/models/crypto_order';
import TableAccount from './TableAccount';
import { subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import cpanelSocket from 'src/api/socket/cpanelSocket';
import UserCpanel from 'src/models/UserCpanel';

function RecentOrders() {

    const [data, setData] = useState<UserCpanel[]>([])

    useEffect(() => {
        cpanelSocket.get().then((res) => {
            setData(res)
        })
    }, [])

    return (
        <Card sx={{ mt: 1 }}>
            <TableAccount data={data} />
        </Card>
    )
}

export default RecentOrders;
