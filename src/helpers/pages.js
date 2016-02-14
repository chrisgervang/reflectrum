import React from 'react';
import MainMenu from '../components/MainMenu.js';
import ScreensaverMenu from '../components/ScreensaverMenu.js';
import {ClockItem} from '../components/clock/clock.js';
import Calendar from '../components/calendar/calendar';
import {TetrisScreensaver} from '../components/screensavers/TetrisScreensaver.js'
import {MapScreensaver} from '../components/screensavers/MapScreensaver.js'
import { QuotesPage } from '../components/quotes/Quotes.js'


export const pages = {
  "MAIN_MENU": <MainMenu />,
  "SCREENSAVER_MENU": <ScreensaverMenu />,
  "CLOCK": <ClockItem />,
  "CALENDAR": <Calendar />,
  "TETRIS": <TetrisScreensaver />,
  "MAP": <MapScreensaver />,
  "QUOTES": <QuotesPage />
}
