import socketio
import subprocess
import platform
from hashlib import sha256
import time
import threading
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
import requests
import json
from tunnler import Tunneler
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()
sio = socketio.Client()

origins = [
    "http://localhost:5173",
    "https://tunnl.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_hardware_id():
    sys = platform.system().lower()
    id = None

    match sys:
        case 'darwin':
            id = subprocess.check_output("""
                ioreg -rd1 -c IOPlatformExpertDevice |
                 grep -E "IOPlatformUUID" | awk '{ print $3 }' | sed 's/\"//g'
                """, shell=True
            ).decode().strip()

        case 'win32':
            id = subprocess.check_output("""
                reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid
                """, shell=True
            ).decode().strip()

        case 'linux':
            id = subprocess.check_output("""
                cat /etc/machine-id
                """, shell=True
            ).decode().strip()

    if id == None:
        return None

    return sha256(id.encode()).hexdigest()

token = None
tunneler = Tunneler()
hwid = get_hardware_id()

if hwid is None:
    print('Cannot generate HWID')
    exit(1)

@sio.event
def connect():
    print('CONNECTION ESTABLISHED')

@sio.event
def disconnect():
    print('disconnected from server')

@sio.on('register:response')
def handle_register_response(data):
    global token
    token = data['token']
    print(token)

@sio.on(f'{hwid}:start-tunneler')
def handle_start_tunneler(data):
    print('HARDWARE ID ROOM', data)

@sio.on(f'{hwid}:stop-tunneler')
def handle_start_tunneler(data):
    print('HARDWARE ID ROOM', data)

def start_socket_client():
    print("Trying to connect to server")
    while True:
        try: 
            sio.connect('http://localhost:3123')
            break
        except socketio.exceptions.ConnectionError:
            time.sleep(5)

    sio.emit('register:request', { 'hwid': hwid })
    sio.wait()

@app.get('/v1/status')
async def status():
    return { 'message': 'Python client is running' }

@app.post('/v1/authenticate/{userid}')
async def authenticate(userid: str):
    global token
    if token is None:
        raise HTTPException(status_code=500, detail='Daemon not registered')

    print("USER ID", userid)
    url = 'http://localhost:5173/api/v1/daemon/user'

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }

    body = {
        'userid': userid,
    }

    r = requests.post(url, json=body, headers=headers)

    if r.status_code != 200:
        raise HTTPException(status_code=500, detail='Failed to authenticate')

    return { 'message': 'Successfully authenticated user with daemon' }

def start_unvicorn():
    uvicorn.run(app, host='127.0.0.1', port=45789)

if __name__ == '__main__':
    socket_thread = threading.Thread(target=start_socket_client, daemon=True)
    uvicorn_thread = threading.Thread(target=start_unvicorn, daemon=True)
    socket_thread.start()
    uvicorn_thread.start()

    tunneler.start()

    uvicorn_thread.join()
