import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid/Grid';
import RecentOrders from './RecentOrders';

export default function SimpleAccordion() {
    return (
        <Grid container spacing={3}>

            <Grid item xs={12} style={{ borderTop: '1px soild black' }}>
                <Accordion>
                    <AccordionSummary
                        style={{ borderTop: '3px solid' }}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>Thông Báo</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <RecentOrders />
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Grid>

            <Grid item xs={12}>
                <Accordion defaultExpanded>
                    <AccordionSummary
                        defaultChecked={true}

                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        style={{ borderTop: '3px solid' }}
                    >
                        <Typography>Accordion 1</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Grid>

        </Grid>
    );
}
