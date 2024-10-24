import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";

const Options = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <EmojiFoodBeverageIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Snack Time
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Typography variant="h4" gutterBottom>
          Options
        </Typography>
        <Typography variant="body1" gutterBottom>
          Coming soon!
        </Typography>
      </Container>
    </>
  );
};

export default Options;
