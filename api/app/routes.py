from time import time
from api.app import app as api

@api.route('/')
@api.route('/index')
def index():
    return "Hello World"

@api.route('/time')
def get_current_time():
    return {'time': time()}