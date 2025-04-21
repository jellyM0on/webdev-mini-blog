$("#loading").show();

getPostsWithUsers();

let allPosts;
let currentPostCount = 0;

let isLoading = false;

// When scrolled to the bottom of the page, load 10 more posts
$(window).on("scroll", function () {
  if (currentPostCount >= allPosts.length) return;

  if (
    !isLoading &&
    $(window).scrollTop() + $(window).height() >= $(document).height() - 10
  ) {
    isLoading = true;

    createPosts(allPosts.slice(currentPostCount, currentPostCount + 10));
    currentPostCount = currentPostCount + 10;

    setTimeout(() => {
      isLoading = false;
    }, 500);
  }
});

// Updates character count
function updateCharCount() {
  const $text = $("#post-input").val();
  const $charCount = $("#char-count");
  $charCount.text($text.length);
}

// Creates posts
function createPosts(posts) {
  const $postsList = $("#posts-list");
  posts.forEach((post) => {
    $postsList.append(`
        <li class="post">
            <img src="./assets/user.svg" alt="user"/>
            <div>
                <p class="post-username">${post.userName} <span class="post-user-id-name">@${post.userIdName}</span></p>
                <h5>${post.title}</h5>
                <p class="post-body">${post.body}</p>
                <div class="post-opts">
                    <div class="post-opts-btns">
                        <button>
                            0 <img class="comment-btn" src="./assets/comment.svg" alt="comment"/>
                        </button>
                        <button>
                            5 <img class="heart-btn" src="./assets/heart.svg" alt="comment"/>
                        </button>
                    </div>
                    <button>
                        <img src="./assets/share.svg" alt="share"/>
                    </button>
                </div>
            </div>
        </li>
        `);
  });
}

function resetPosts(posts) {
  const $postsList = $("#posts-list");
  $postsList.empty();
  createPosts(posts.slice(0, 10));
  currentPostCount = 10;
}

// Get posts
function getPostsWithUsers() {
  $.when(
    $.getJSON("https://jsonplaceholder.typicode.com/posts"),
    $.getJSON("https://jsonplaceholder.typicode.com/users")
  )
    .done(function (postsRes, usersRes) {
      $("#loading").hide();

      const posts = postsRes[0];
      const users = usersRes[0];

      const userMap = {};
      users.forEach((user) => {
        userMap[user.id] = user.name;
      });

      const postsWithNames = posts.map((post) => ({
        ...post,
        userName: userMap[post.userId] || "user name",
        userIdName: `user-${post.userId}`,
      }));

      allPosts = postsWithNames;
      currentPostCount = 10;
      createPosts(postsWithNames.slice(0, 10));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      $("#loading").hide();
      console.error("Error fetching data: ", textStatus, errorThrown);
      alert("Failed to load posts or users. Please try again later.");
    });
}

// Sort functionality

let sortBy = "userId";
let sortType = "asc";

$("#sort-filters").on("change", function () {
  sortBy = $(this).val();
  sortPosts(sortBy, sortType);
});

$("#sort-type").on("click", function () {
  sortType === "asc" ? (sortType = "desc") : (sortType = "asc");
  sortPosts(sortBy, sortType);
});

function sortPosts(sortBy, sortType) {
  allPosts = allPosts.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA === valB) return 0;

    if (sortType === "asc") {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  resetPosts(allPosts);
}

// Filter functionality
let showAllPosts = true;

$("#all-posts-btn").on("click", function () {
  showAllPosts = true;
  filterPosts(showAllPosts);

  $("#my-posts-btn").removeClass("active-btn");
  $("#all-posts-btn").addClass("active-btn");
});

$("#my-posts-btn").on("click", function () {
  showAllPosts = false;
  filterPosts(showAllPosts);

  $("#all-posts-btn").removeClass("active-btn");
  $("#my-posts-btn").addClass("active-btn");
});

function filterPosts(showAllPosts) {
  if (showAllPosts) {
    posts = allPosts;
  } else {
    posts = allPosts.filter((post) => post.userId === 8989); // Placeholder for current user's ID
  }
  resetPosts(posts);
}

// Scroll up button

$("#scroll-up-btn").on("click", function () {
  scrollUp();
});

function scrollUp() {
  $("html, body").animate({ scrollTop: 0 }, 500);
}

// Post post functionality

function handlePostBtn() {
  $("#post-btn").on("click", function () {
    // Get the values from the inputs when POSTing the data:
    const title = $("#post-title").val();
    const body = $("#post-input").val();
    const userId = 8989; // Placeholder for current user's ID

    // Maybe add extra validation so the user can't post empty posts
  });
}

// TODO: Create function to POST the post data

// After posting, add the post return value to the allPosts array
// Maybe add it to the start of the array?
// Might not need to sort until the user clicks the sort options again so it is easier
// But might need to call the filterPosts() function again
// Maybe you can just pass the allPosts as the argument after adding the new post to it
