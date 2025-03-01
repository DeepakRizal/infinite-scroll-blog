const blogPosts = document.querySelector(".blog-posts");
const loadMoreTrigger = document.querySelector(".load-more");

let isFetching = false;
let skip = 0;
let limit = 12;

async function fetchBlogPosts() {
  if (isFetching) return;
  isFetching = false;

  const response = await fetch(
    `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
  );
  const data = await response.json();

  if (data.posts.length === 0) {
    observer.disconnect();
    loadMoreTrigger.innerText = "No more posts to load.";
    return;
  }

  renderPosts(data.posts);
  skip += limit;
  isFetching = false;
}

function renderPosts(posts) {
  const postsHTML = posts
    .map((post) => {
      return `<div class="card">
  <h2 class="title">${post.title}</h2>
  <p class="body">
    ${post.body.split(" ").slice(0, 7).join(" ")}...
  </p>
  <div class="tags">
    ${post.tags.map((tag) => `<span>#${tag}</span>`).join("")}
    
  </div>
  <div class="stats">
    <span>👍 ${post.reactions.likes}</span>
    <span>👎 ${post.reactions.dislikes}</span>
    <span>👀 ${post.views}views</span>
  </div>
  <button class="read-more">Read More</button>
</div>
    `;
    })
    .join("");

  blogPosts.insertAdjacentHTML("beforeend", postsHTML);
}

//Intersection Observer api setup

const observer = new IntersectionObserver(
  (entries) => {
    const target = entries[0];

    if (target.isIntersecting) {
      fetchBlogPosts();
    }
  },
  { rootMargin: "100px" }
);

observer.observe(loadMoreTrigger);
//Load initial posts on page load
fetchBlogPosts();
