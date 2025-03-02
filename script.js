const blogPosts = document.querySelector(".blog-posts");
const loadMoreTrigger = document.querySelector(".load-more");
const searchBar = document.querySelector(".search-bar"); // Get search input
const darkModeToggle = document.querySelector(".dark-mode-toggle");
const image = document.querySelector(".img");
const body = document.body;

let allPosts = []; // Store all posts for searching
let isFetching = false;
let skip = 0;
let limit = 12;

async function fetchBlogPosts() {
  if (isFetching) return;
  isFetching = true;

  const response = await fetch(
    `https://dummyjson.com/posts?limit=${limit}&skip=${skip}`
  );
  const data = await response.json();

  if (data.posts.length === 0) {
    observer.disconnect();
    loadMoreTrigger.innerText = "No more posts to load.";
    return;
  }

  allPosts = [...allPosts, ...data.posts]; // Store fetched posts
  renderPosts(allPosts); // Render all posts
  skip += limit;
  isFetching = false;
}

function renderPosts(posts) {
  blogPosts.innerHTML = "";
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
          <span>👀 ${post.views} views</span>
        </div>
        <button class="read-more">Read More</button>
      </div>`;
    })
    .join("");

  blogPosts.insertAdjacentHTML("beforeend", postsHTML);
}

// Implement Search Functionality
searchBar.addEventListener("input", () => {
  const searchQuery = searchBar.value.toLowerCase();
  const filteredPosts = allPosts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery)
  );

  renderPosts(filteredPosts); // Display only matching posts
});

// Intersection Observer API setup for Infinite Scroll
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
fetchBlogPosts(); // Load initial posts

// Adding dark mode functionality
darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  image.classList.toggle("darkModeImage");
});
