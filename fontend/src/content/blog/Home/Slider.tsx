import * as React from 'react';
import { Paper, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

const Slider = () => (
  <Carousel autoPlay={true} swipe={true} indicators={false}>
    <Paper>
      <img src='https://img.freepik.com/free-photo/grunge-paint-background_1409-1337.jpg?w=2000' height='125px' width='100%'/>
    </Paper>
    <Paper>
      <img src='https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000' height='125px' width='100%' />
    </Paper>
  </Carousel>
);

export default Slider;
