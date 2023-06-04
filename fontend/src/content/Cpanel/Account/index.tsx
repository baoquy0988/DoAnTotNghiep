import { Alert, Container, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import Footer from 'src/components/Footer'
import { useAppSelector } from "src/app/hooks"
import { selecIsUser } from "src/features/auth/authSlice"
import TableValue from "./TableValue";

export default function CpanelAccount() {
    const account = useAppSelector(selecIsUser)

    const container = () => {
        if (account.level) {
            return (
                <TableValue/>
            )
        }
        return (
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={4}
                pt={5}
            >
                <Alert color='error'>Bạn Không Có Quyền Truy Cập Vào Trang Này</Alert>
            </Grid>
        )
    }
    return (
        <>
            <Helmet>
                <title>Quản Lí Tài Khoản</title>
            </Helmet>
            <Container maxWidth="lg">
                {container()}
            </Container>
            <Footer />
        </>
    )
}