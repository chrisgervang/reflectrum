import os
import requests
import datetime
import threading
from rfc3339 import rfc3339

ACCESS_FNAME = "google_access"
REFRESH_FNAME = "google_refresh"

#CLIENT_ID = "1040844525441-2ogst7rr8vlsss52nfd32num75na7j3o.apps.googleusercontent.com"
#CLENT_SECRET = "dWs0gvx0qazbfllWllwls7h6"

CLIENT_ID = "355661993015-17idpluceq2j4b8e9fd4eilrkp6gt4e4.apps.googleusercontent.com"
CLIENT_SECRET = "rXVG5g_dBRR_RRjuJRRT3CH9"

def get_file_contents(name):
    if not os.path.isfile(name):
        return None
    f = open(name)
    return f.read().strip()

def get_access_token():
    """
    Returns the stored Google authorization token, or None if it doesn't exist.
    """
    return get_file_contents(ACCESS_FNAME)

def get_refresh_token():
    """
    Returns the stored Google refresh token, or None if it doesn't exist.
    """
    return get_file_contents(REFRESH_FNAME)


def store_access_token(token):
    f = open(ACCESS_FNAME, "w")
    f.write(token)
    f.close()

def store_refresh_token(token):
    f = open(REFRESH_FNAME, "w")
    f.write(token)
    f.close()



def start_time():
    """
    Returns the RFC3339 time stamp for the start of today.
    """
    d = datetime.datetime.today()
    start = datetime.datetime(d.year, d.month, d.day, 0, 0, 0, 0)
    return rfc3339(start)

def end_time():
    """
    Returns the RFC3339 time stamp for the end of today.
    """
    d = datetime.datetime.today()
    end = datetime.datetime(d.year, d.month, d.day, 23, 59, 59, 999999)
    return rfc3339(end)


def get_calendars():
    """
    Gets a list of calendar IDs. Returns None if something went wrong.
    """
    access_token = get_access_token()
    if not access_token:
        return None
    url = "https://www.googleapis.com/calendar/v3/users/me/calendarList"
    headers = {
        'authorization': 'Bearer ' + access_token
    }
    r = requests.get(url, headers=headers)
    if r.status_code != 200:
        return None
    data = r.json()
    return data['items']


def get_events():
    """
    Gets the events (for today) associated with the stored access token.
    Returns None if the access token is invalid or nonexistent.
    """
    access_token = get_access_token()
    if not access_token:
        return None
    calendars = get_calendars()
    if not calendars:
        calendars = ["primary"]
    events = []
    for calendar in calendars:
        cal_id = calendar["id"]
        cal_color = calendar["backgroundColor"]
        url = "https://www.googleapis.com/calendar/v3/calendars/" + cal_id + "/events"
        params = {
            'singleEvents': True,
            'orderBy': 'startTime',
            'timeMin': start_time(),
            'timeMax': end_time()
        }
        headers = {
            'authorization': 'Bearer ' + access_token 
        }
        r = requests.get(url, params=params, headers=headers)
        if r.status_code == 200:
            data = r.json()
            items = data['items']
            #adding calendar color to each event
            for i in items:
                i["color"] = cal_color
            events += items
    return events


def poll(code, interval):
    """
    Polls Google for access/refresh tokens.
    After a successful poll, saves the tokens.
    """
    url = "https://www.googleapis.com/oauth2/v4/token"
    params = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'grant_type': "http://oauth.net/grant_type/device/1.0"
    }
    r = requests.post(url, params=params)
    data = r.json()
    if data.has_key("error"):
        threading.Timer(interval, poll, args=[code, interval]).start()
    else:
        store_access_token(data["access_token"])
        store_refresh_token(data["refresh_token"])


def authenticate():
    """
    If a refresh token exists, attempts to refresh the access token.
    Otherwise, goes through the device OAuth flow specified by Google.
    
    Returns None if the access token was refreshed, otherwise starts
    polling Google and returns (user_code, verification_code) for the user.
    """
    refresh = get_refresh_token()
    if refresh:
        url = "https://www.googleapis.com/oauth2/v4/token"
        params = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'refresh_token': refresh,
            'grant_type': 'refresh_token'
        }
        r = requests.post(url, params=params)
        data = r.json()
        access = data['access_token']
        store_access_token(access)
        return None
    url = "https://accounts.google.com/o/oauth2/device/code"
    params = {
        'client_id': CLIENT_ID,
        'scope': 'https://www.googleapis.com/auth/calendar.readonly'
    }
    r = requests.post(url, params=params)
    data = r.json()
    device_code = data["device_code"]
    user_code = data["user_code"]
    verification_url = data["verification_url"]
    interval = data["interval"]
    poll(device_code, interval)
    return (user_code, verification_url)


