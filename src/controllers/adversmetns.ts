//adversmetns of free consultent 

export function createAdverstmentController(adversmetns: any[], newaAdverstmetns: any) {
    const adverstmetnIndex = adversmetns.findIndex((el) => el.id === newaAdverstmetns.id);
    if (adverstmetnIndex === -1) {
        adversmetns.push(newaAdverstmetns);
    } else {
        adversmetns[adverstmetnIndex] = { // when creat update it will tack some information from the last array 
            ...adversmetns[adverstmetnIndex],
            ...newaAdverstmetns,
        };
    }
    return adversmetns;
}