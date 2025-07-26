'use server'

const parsePortRange = (input: string) => {
    if (input.trim() === '') throw new Error('Port range cannot be empty');
    return input
        .trim()
        .split(" ")
        .filter(e => e !== '')
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

const editTunnelBinding = async ({
    hostConfig,
    interceptConfig,
    tunnelBindingId
}: {
    hostConfig: unknown,
    interceptConfig: unknown,
    tunnelBindingId: string
}) => {

}

export default editTunnelBinding;
