const blogPosts = document.querySelector(".blog-posts");

async function fetchBlogPosts() {
  const response = await fetch("https://dummyjson.com/posts?limit=12");
  const data = await response.json();
  console.log(data);
  return data;
}

fetchBlogPosts();

document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchBlogPosts();

  const posts = data.posts
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

  blogPosts.innerHTML = posts;
});
