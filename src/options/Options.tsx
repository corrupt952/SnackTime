import { AppBar, Box, Container, FormControlLabel, Radio, RadioGroup, Stack, Toolbar, Typography } from "@mui/material";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import { useEffect, useState } from "react";
import { NotificationType } from "@/types/enums/NotificationType";
import { ExtensionSettings, Settings } from "@/domain/settings/models/settings";

const Options = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.Alarm);
  const [settings, setSettings] = useState<ExtensionSettings>({ notificationType: NotificationType.Alarm });

  useEffect(() => {
    Settings.get().then((settings) => {
      setSettings(settings);
      setNotificationType(settings.notificationType);
    });
  }, []);

  useEffect(() => {
    Settings.set({ notificationType });
  }, [notificationType]);

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
        <Stack spacing={2} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="h6">NotificationType</Typography>
            <RadioGroup
              row
              value={notificationType}
              onChange={(event) => setNotificationType(event.target.value as NotificationType)}
            >
              {Object.values(NotificationType).map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={Object.keys(NotificationType)[Object.values(NotificationType).indexOf(value)]}
                />
              ))}
            </RadioGroup>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Options;
