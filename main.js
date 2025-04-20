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
    console.log(post);
  });
}

// Get posts
function getPostsWithUsers() {
  $.when(
    $.getJSON("https://jsonplaceholder.typicode.com/posts"),
    $.getJSON("https://jsonplaceholder.typicode.com/users")
  ).done(function (postsRes, usersRes) {
    const posts = postsRes[0];
    const users = usersRes[0];

    const userMap = {};
    users.forEach((user) => {
      userMap[user.id] = user.name;
    });

    const postsWithNames = posts.map((post) => ({
      ...post,
      userName: userMap[post.userId],
      userIdName: `user-${post.userId}`,
    }));

    allPosts = postsWithNames;
    currentPostCount = 10;
    createPosts(postsWithNames.slice(0, 10));
  });
}
