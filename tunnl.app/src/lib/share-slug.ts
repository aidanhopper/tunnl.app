const shareSlug = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ret = '';
    for (let i = 0; i < 8; i++)
        ret += alphabet[Math.floor(Math.random() * 1000) % alphabet.length];
    return ret;
}

export default shareSlug;
