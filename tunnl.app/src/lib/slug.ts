const slug = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let ret = '';
    for (let i = 0; i < 12; i++)
        ret += alphabet[Math.floor(Math.random() * 1000) % alphabet.length];
    return ret;
}

export default slug;
