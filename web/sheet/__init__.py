import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

gc = gspread.service_account(filename=os.path.dirname(os.path.abspath(__file__)) + '/sheet_cred.json')

sh = gc.open_by_key('1jxzQBy1MOHqFRMP77nB67lr2zjMLbdeMTObzEdWKYPQ')

ws = sh.worksheet('voca')

def get_sheets():
    return sh.worksheets()

def get_sheet(name):
    return sh.worksheet(name)