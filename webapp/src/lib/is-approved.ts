const isApproved = (roles: string | null | undefined): boolean => {
    if (roles === null || roles === undefined) return false;
    const split = roles.split(' ');
    if (split.length === 0) return false;
    return split.find(e => e === 'approved') !== undefined;
}

export default isApproved;
