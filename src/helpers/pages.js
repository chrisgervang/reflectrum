import React from 'react';
import MainMenu from '../components/MainMenu.js';
import ScreensaverMenu from '../components/ScreensaverMenu.js';
import { AnalogClockPage } from '../components/clock/AnalogClock.js';
import Calendar from '../components/calendar/calendar';
import {TetrisScreensaver} from '../components/TetrisScreensaver.js'
import {MapScreensaver} from '../components/MapScreensaver.js'
import { QuotesPage } from '../components/quotes/Quotes.js'
import { LockscreenScreensaver } from '../components/LockscreenScreensaver'


export const pages = {
  "MAIN_MENU": <MainMenu />,
  "SCREENSAVER_MENU": <ScreensaverMenu />,
  "CLOCK": <AnalogClockPage />,
  "CALENDAR": <Calendar />,
  "TETRIS": <TetrisScreensaver />,
  "MAP": <MapScreensaver />,
  "QUOTES": <QuotesPage />,
  "LOCKSCREEN": <LockscreenScreensaver />
}
