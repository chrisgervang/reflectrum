import React from 'react';
import MainMenu from '../components/MainMenu.jsx';
import ScreensaverMenu from '../components/ScreensaverMenu.jsx';
import { AnalogClockPage } from '../components/clock/AnalogClock.jsx';
import Calendar from '../components/calendar/calendar';
import {TetrisScreensaver} from '../components/TetrisScreensaver.jsx'
import {MapScreensaver} from '../components/MapScreensaver.jsx'
import { QuotesPage } from '../components/quotes/Quotes.jsx'
import { LockscreenScreensaver } from '../components/LockscreenScreensaver'
import { WeatherContainer } from '../components/weather/Weather.jsx'
import OpeningPage from '../components/goodmorning/Opening.jsx'
import { FishTankScreensaver } from '../components/FishTankScreensaver.jsx';
import LinearIssues from '../components/linear/LinearIssues.jsx';
import HomeDashboard from '../components/home/HomeDashboard.jsx';
import Settings from '../components/settings/Settings.jsx';

export const pages = {
  "MAIN_MENU": <MainMenu />,
  "SCREENSAVER_MENU": <ScreensaverMenu />,
  "CLOCK": <AnalogClockPage />,
  "CALENDAR": <Calendar />,
  "TETRIS": <TetrisScreensaver />,
  "MAP": <MapScreensaver />,
  "QUOTES": <QuotesPage />,
  "LOCKSCREEN": <LockscreenScreensaver />,
  "WEATHER": <WeatherContainer />,
  "OPENING": <OpeningPage />,
  "AQUARIUM": <FishTankScreensaver />,
  "LINEAR": <LinearIssues />,
  "HOME": <HomeDashboard />,
  "SETTINGS": <Settings />
}
