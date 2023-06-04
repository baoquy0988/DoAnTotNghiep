import { Typography } from '@mui/material';

function PageHeader({name}) {

  return (
    <>
      <Typography variant="h3" component="h3" gutterBottom>
        Thiết lập tài khoản
      </Typography>
      <Typography variant="subtitle2">
        {name}, bạn có thể thay đổi các tùy chọn tại đây
      </Typography>
    </>
  );
}

export default PageHeader;
