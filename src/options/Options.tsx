import {
  AppBar,
  Box,
  Container,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import { useEffect, useState } from "react";
import { NotificationType } from "@/types/enums/NotificationType";
import { ExtensionSettings, Settings } from "@/domain/settings/models/settings";
import { ColorScheme } from "@/types/enums/ColorScheme";

const Options = () => {
  const [notificationType, setNotificationType] = useState<NotificationType>(NotificationType.Alarm);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(ColorScheme.System);
  const [settings, setSettings] = useState<ExtensionSettings>({
    colorScheme: ColorScheme.System,
    notificationType: NotificationType.Alarm,
  });

  useEffect(() => {
    Settings.get().then((settings) => {
      setSettings(settings);
      setNotificationType(settings.notificationType);
      setColorScheme(settings.colorScheme);
    });
  }, []);

  useEffect(() => {
    Settings.set({ notificationType });
  }, [notificationType]);

  useEffect(() => {
    Settings.set({ colorScheme });
  }, [colorScheme]);

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
        <Stack spacing={6} sx={{ mt: 4 }}>
          <Box>
            <Typography variant="h4">General</Typography>

            <Divider sx={{ mt: 1, mb: 2 }} />

            <Box>
              <Typography variant="h6">Coming soon...</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h4">Appearance</Typography>

            <Divider sx={{ mt: 1, mb: 2 }} />

            <Box>
              <Typography variant="h6">Color Scheme</Typography>
              <RadioGroup
                row
                value={colorScheme}
                onChange={(event) => setColorScheme(event.target.value as ColorScheme)}
              >
                {Object.values(ColorScheme).map((value) => (
                  <FormControlLabel
                    key={value}
                    value={value}
                    control={<Radio />}
                    label={Object.keys(ColorScheme)[Object.values(ColorScheme).indexOf(value)]}
                  />
                ))}
              </RadioGroup>
            </Box>
          </Box>

          <Box>
            <Typography variant="h4">Notification</Typography>

            <Divider sx={{ mt: 1, mb: 2 }} />

            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Notification Type</Typography>
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

              <Box>
                <Typography variant="h6">Alarm Sound</Typography>
                Coming soon...
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
};

export default Options;
