import subprocess
import threading
import signal
import os
import platform
import json
from pathlib import Path
from collections import deque

class Tunneler:
    def __init__(self,
                 hwid,
                 binary_path='ziti/ziti-edge-tunnel',
                 identities_path='ziti/identities/',
                 dns_ip_range='203.0.113.0/24',
                 log_path='ziti/tunneler.log'): 

        self.hwid = hwid
        self.binary_path = binary_path
        self.identities_path = identities_path
        self._dns_ip_range = dns_ip_range
        self.log_path = log_path
        self.is_win = platform.system().lower() == 'win32'
        self.process = None

    @property
    def enrolled(self):
        return Path(f'{self.identities_path}/{self.hwid}.json').exists()

    @property
    def dns_ip_range(self):
        return self._dns_ip_range

    @dns_ip_range.setter
    def dns_ip_range(self, value):
        self._dns_ip_range = value

    def start(self):
        if self.is_running():
            return

        args = [
            self.binary_path,
            'run',
            '-I',
            self.identities_path,
            '--dns-ip-range',
            self._dns_ip_range,
        ]

        with open(self.log_path, 'a') as log:
            if self.is_win:
                self.process = subprocess.Popen(
                    args,
                    stdout=log,
                    stderr=log,
                    text=True,
                )
            else:
                self.process = subprocess.Popen(
                    args,
                    stdout=log,
                    stderr=log,
                    text=True,
                )

    def stop(self):
        if not self.is_running():
            return
        if self.is_win:
            self.process.send_signal(signal.CTRL_BREAK_EVENT)
        else:
            os.killpg(os.getpgid(self.process.pid), signal.SIGTERM)
        self.process.wait()
        self.process = None

    def is_running(self):
        return self.process is not None and self.process.poll() is None

    def is_connected(self):
        return False

    def status(self):
        if not self.is_running():
            return { 'on': False }
        args = [
            self.binary_path,
            'tunnel_status'    
        ]

        out = subprocess.check_output(
            args,
            text=True
        )
        
        return { 'on': True, 'data': json.loads(out) }

    def enroll(self, jwt):
        args = [
            self.binary_path,
            'enroll',
            '-j',
            jwt,
            '-i',
            f'{self.identities_path}/{self.hwid}.json'
        ]
        subprocess.check_output(args)

    def restart(self):
        self.stop()
        self.start()
