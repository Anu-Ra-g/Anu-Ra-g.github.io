const query = `
query User {
    user(username: "anurag1729") {
        id
        posts(pageSize: 20, page: 1, sortBy: DATE_PUBLISHED_DESC) {
            nodes {
                title
                brief
                coverImage {
                    url
                }
                url
                publishedAt
                readTimeInMinutes
            }
        }
    }
}
`;

function formatTime(datetime) {
    const monthNames = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    const month = monthNames[datetime.getMonth()];
    const date = datetime.getDate();
    const year = datetime.getFullYear();

    return `${month} ${date}, ${year}`;
}

async function getBlogData() {
    const data = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
    })

    const result = await data.json()

    return result
}

async function populate() {
    const data = await getBlogData()
    const blogs = data.data.user.posts.nodes

    const container = document.getElementById("container")

    blogs.forEach(blog => {

        const postContainer = document.createElement('div')
        postContainer.classList.add('post-container')

        const blogTitle = document.createElement('h3')
        blogTitle.innerText = blog.title
        blogTitle.classList.add('blog-title')

        const blogBrief = document.createElement("p")
        blogBrief.innerText = blog.brief
        blogBrief.classList.add('blog-brief');

        const blogCover = document.createElement("img")
        blogCover.src = blog.coverImage.url
        blogCover.classList.add('blog-cover')

        const blogData = document.createElement('div')
        blogData.classList.add("blog-data")

        const blogPublishedAt = document.createElement("p")
        blogPublishedAt.innerText = formatTime(new Date(blog.publishedAt))
        blogPublishedAt.style.color = 'black'

        const readTime = document.createElement('div')
        const readIcon = '<span class="material-symbols-outlined">auto_stories</span>';
        readTime.innerHTML = readIcon + '&nbsp;' + blog.readTimeInMinutes + ' min';

        readTime.style.display = 'flex'; 
        readTime.style.alignItems = 'center'; 

        blogData.append(blogPublishedAt, readTime)

        postContainer.addEventListener('click', () => {
            window.open(blog.url, '_blank')
        })

        postContainer.append(blogTitle, blogCover, blogBrief, blogData)

        container.appendChild(postContainer)
    });

    document.body.append(container)

}

populate()


