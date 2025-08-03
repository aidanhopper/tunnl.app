const parsePortRange = (input: string) => {
    if (input.trim() === '') throw new Error('Port range cannot be empty');

    const s = new Set<string>;

    input.trim().split(' ').forEach(e => {
        if (e !== '')
            s.add(e);
    });

    return [...s]
        .map(e => {
            const s = e.split("-");
            if (s.length === 1) return {
                high: Number(e),
                low: Number(e),
            };
            return {
                high: Number(s[1]),
                low: Number(s[0]),
            }
        });
}

export default parsePortRange;
