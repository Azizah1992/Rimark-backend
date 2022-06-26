// مفالات وتوعيه

export function createBlogController(blogs: any[], newblogs: any) {
    const blogsIndex = blogs.findIndex((el) => el.id === newblogs.id);
    if (blogsIndex === -1) {
        blogs.push(newblogs);
    } else {
        blogs[blogsIndex] = { // when creat update it will tack some information from the last array 
            ...blogs[ blogsIndex],
            ...newblogs,
        };
    }
    return blogs;
}
