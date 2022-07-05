//schema for activity

export function createProfileController(profiles: any[], newProfiles: any) {
    const profileIndex = profiles.findIndex((el) => el.id === newProfiles.id);
    if (profileIndex === -1) {
        profiles.push(newProfiles);
    } else {
        profiles[profileIndex] = { // when creat update it will tack some information from the last array 
            ...profiles[profileIndex],
            ...newProfiles,
        };
    }
    return profiles;
}

