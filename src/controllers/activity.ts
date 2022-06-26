//life coah create work shops
export function createActivityController(activites: any[], newaAtivites: any) {
    const activitesIndex = activites.findIndex((el) => el.id === newaAtivites.id);
    if (activitesIndex === -1) {
        activites.push(newaAtivites);
    } else {
        activites[activitesIndex] = { // when creat update it will tack some information from the last array 
            ...activites[activitesIndex],
            ...newaAtivites,
        };
    }
    return activites;
}