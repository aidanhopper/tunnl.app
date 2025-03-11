const capitalize = (s: string | null) => {
    if (!s || s.length === 0) return null;
    const cap = s[0].toUpperCase();
    return `${cap}${s.substring(1)}`
}

export default capitalize;
