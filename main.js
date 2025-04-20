getPostsWithUsers();

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
                <p class="post-username">${post.userName}</p>
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
    const posts = postsRes[0].slice(0, 15);
    const users = usersRes[0];

    const userMap = {};
    users.forEach((user) => {
      userMap[user.id] = user.name;
    });

    const postsWithNames = posts.map((post) => ({
      ...post,
      userName: userMap[post.userId],
    }));

    createPosts(postsWithNames);
  });
}
