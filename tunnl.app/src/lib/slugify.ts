const slugify = (str: string) => {
    let end = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRTTUV0123456789';
    for (let i = 0; i < 12; i++)
        end += alphabet[Math.floor(Math.random() * 1000) % alphabet.length];
    return str.split(/\s+/).filter(e => e !== '').join('-').toLowerCase() + '-' + end;
}

export default slugify;
