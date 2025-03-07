import subprocess

class Tunneler:
    def __init__(self, binary_path, identities_path, dns_ip_range): 
        self.binary_path = binary_path
        self.identities_path = identities_path
        self.dns_ip_range = dns_ip_range

    def start(self):
        args = [
            self.binary_path,
            'run',
            '-I',
            self.identities_path,
            '--dns-ip-range',
            self.dns_ip_range,
        ]

        process = subprocess.Popen(
            args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )

        for line in process.stderr:
            print(line, end='')  # `end=''` avoids adding an extra newline, since `line` already includes it

        for line in process.stdout:
            print(line, end='')  # `end=''` avoids adding an extra newline, since `line` already includes it
