import React from 'react';
import MainMenu from '../components/MainMenu.js';
import ScreensaverMenu from '../components/ScreensaverMenu.js';
import {ClockItem} from '../components/clock/clock.js';
import Calendar from '../components/calendar/calendar'

export const pages = {
  "MAIN_MENU": <MainMenu />,
  "SCREENSAVER_MENU": <ScreensaverMenu />,
  "CLOCK": <ClockItem />,
  "CALENDAR": <Calendar />
}
