import dotenv from 'dotenv';
import express from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import { readFile, writeFile } from 'fs/promises';

dotenv.config();

const app = express();
app.use(express.json());

type Target = {
    vhost: string,
    service: string,
    path: string,
    scheme: "http" | "https",
    idp_issuer_base_url: string,
    idp_client_id: string
}

const targetsPath = process.env.BROWZER_TARGETS_ENV_PATH;
const apiPath = process.env.BROWZER_API_ENV_PATH;
const envPath = process.env.BROWZER_ENV_PATH;

const restartBrowzer = () => exec(process.env.BROWZER_RESTART_COMMAND);

const dumpTargets = (targets: Target[]) => {
    const content = `
        ZITI_BROWZER_BOOTSTRAPPER_TARGETS='${JSON.stringify({ targetsArray: targets })}'
    `.trim() + '\n';

    fs.writeFile(targetsPath, content, err => console.error(err));
}

const buildBrowzerEnv = async () => {
    const apiContents = await readFile(apiPath, { encoding: 'utf-8' });
    const targetsContents = await readFile(targetsPath, { encoding: 'utf-8' });
    console.log('apiContents', apiContents);
    console.log('targetsContents', targetsContents);
    writeFile(envPath, `${apiContents}\n${targetsContents}`, 'utf8')
        .catch(console.error);
}

const readTargets = () => {
    try {
        const content = fs.readFileSync(targetsPath, 'utf-8').replace(
            'ZITI_BROWZER_BOOTSTRAPPER_TARGETS=\'',
            ''
        )
        return JSON.parse(content.substring(0, content.length - 2));
    } catch (err) {
        console.error(err);
        return null;
    }
}

const authenticate = (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token !== process.env.TOKEN) throw new Error('Unauthorized');
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

app.put('/api/v1/targets', authenticate, (req, res) => {
    try {
        const targets: Target[] = req.body.targets;

        dumpTargets(targets);
        buildBrowzerEnv();
        restartBrowzer();

        res.json({ message: 'Successfully put targets' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.get('/api/v1/targets', authenticate, (req, res) => {
    try {
        const targets = readTargets()
        if (!targets) throw new Error('Failed to read targets')
        res.json({ targets: targets });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
})
