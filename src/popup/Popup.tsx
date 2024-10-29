import {
  AppBar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import SettingsIcon from "@mui/icons-material/Settings";
import { History } from "@/domain/timer/model/history";
import { Duration } from "@/domain/timer/value/duration";
import { useEffect, useState } from "react";
import { Settings } from "@/domain/settings/models/settings";

const startTimer = async (duration: Duration | null) => {
  if (!duration) {
    const time = Number(prompt("Enter timer seconds in seconds:", String(300)));
    if (time === 0 || isNaN(time)) {
      return;
    }
    duration = new Duration(time);
  }

  await History.add(duration);

  const settings = await Settings.get();

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.tabs.sendMessage(tab.id!, {
    type: "timer-started",
    duration: duration.toSeconds(),
    notificationType: settings.notificationType,
  });

  window.close();
};

const TimerListItem = ({ duration }: { duration: Duration }) => {
  const text = duration.toFormatted();
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={() => startTimer(duration)}>
        <ListItemText primary={text} style={{ textAlign: "right" }} />
      </ListItemButton>
    </ListItem>
  );
};

const Popup = () => {
  const presets = [new Duration(60), new Duration(180), new Duration(300), new Duration(600)];
  const [histories, setHistories] = useState<History[]>([]);

  useEffect(() => {
    History.all().then((histories) => setHistories(histories));
  }, []);

  return (
    <div style={{ width: 344 }}>
      <AppBar position="static">
        <Toolbar>
          <EmojiFoodBeverageIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Snack Time
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="settings"
            onClick={() => {
              chrome.runtime.openOptionsPage();
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Stack direction={"row"} spacing={0}>
        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            subheader={
              <ListSubheader component="div" style={{ textAlign: "center" }}>
                Presets
              </ListSubheader>
            }
          >
            {presets.map((duration, index) => (
              <TimerListItem key={index} duration={duration} />
            ))}
            <ListItem disablePadding>
              <ListItemButton onClick={() => startTimer(null)}>
                <ListItemText primary="⚡Custom" style={{ textAlign: "right" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <List
            subheader={
              <ListSubheader component="div" style={{ textAlign: "center" }}>
                Recent
              </ListSubheader>
            }
          >
            {histories.map((history: History, index: number) => (
              <TimerListItem key={index} duration={history.duration} />
            ))}
          </List>
        </Box>
      </Stack>
    </div>
  );
};

export default Popup;
