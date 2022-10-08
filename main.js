//!account logic start

//  inputs group
let loginUsername = document.querySelector("#login-username");
let loginPassword = document.querySelector("#login-password");
let postsList = document.querySelector("#posts-list");

let signupNumber = document.querySelector("#signup-number");
let signupName = document.querySelector("#signup-name");
let signupPassword = document.querySelector("#signup-password");
let signupPasswordConfirm = document.querySelector("#signup-password-confirm");
let signupUsername = document.querySelector("#signup-username");

let loginBtn = document.querySelector("#login-btn");
let signupBtn = document.querySelector("#signup-btn");
let loginHref = document.querySelector("#login-href");
let signupHref = document.querySelector("#signup-href");

let loginFormBlock = document.querySelector(".login-form-content");
let signupFormBlock = document.querySelector(".signup-form-content");

let allBlock = document.querySelector("#all-block");
let slideContainer = document.querySelector(".slide-container");

loginHref.addEventListener("click", () => {
  signupFormBlock.setAttribute("style", "display:none !important");
  loginFormBlock.setAttribute("style", "display:block !important");
});

signupHref.addEventListener("click", () => {
  signupFormBlock.setAttribute("style", "display:block !important");
  loginFormBlock.setAttribute("style", "display:none !important");
});

//! register logic
// npx json-server -w db.json -p 8888
const USERS_API = " http://localhost:8008/users";

async function checkUniqueUserName(username) {
  let res = await fetch(USERS_API);
  let users = await res.json();
  return users.some(item => item.username === username);
}

async function registerUser() {
  // e.preventDefault();
  if (
    !signupNumber.value.trim() ||
    !signupName.value.trim() ||
    !signupPassword.value.trim() ||
    !signupPasswordConfirm.value.trim() ||
    !signupUsername.value.trim()
  ) {
    alert("Some inputs are empty!");
    return false;
  }

  let uniqueUsername = await checkUniqueUserName(signupUsername.value);

  if (uniqueUsername) {
    alert("User with this username already exists!");
    return false;
  }

  if (signupPassword.value !== signupPasswordConfirm.value) {
    alert("Passwords don't match!");
    return false;
  }

  let userObj = {
    number: signupNumber.value,
    name: signupName.value,
    password: signupPassword.value,
    passwordConfirm: signupPasswordConfirm.value,
    username: signupUsername.value,
  };

  fetch(USERS_API, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  alert("Registered successfully!");

  signupNumber.value = "";
  signupName.value = "";
  signupPassword.value = "";
  signupPasswordConfirm.value = "";
  signupUsername.value = "";
  return true;
}

signupBtn.addEventListener("click", e => {
  e.preventDefault();
  registerUser().then(data => {
    if (data) {
      allBlock.setAttribute("style", "display:block !important");
      signupFormBlock.setAttribute("style", "display:none !important");
      loginFormBlock.setAttribute("style", "display:none !important");
      slideContainer.setAttribute("style", "display:none !important");
      postsList.setAttribute("style", "display:block !important");
      checkLoginLogoutStatus();
      render();
    }
  });
});

// ! login logic

let showUsername = document.querySelector("#show-username");
let loginUserBtn = document.querySelector("#loginUser-btn");
let logoutUserBtn = document.querySelector("#logoutUser-btn");
let addPostBtn = document.querySelector("#addPost-btn");

function checkLoginLogoutStatus() {
  let user = localStorage.getItem("user");
  if (!user) {
    loginUserBtn.parentNode.style.display = "block";
    showUsername.innerText = "No user";
  } else {
    loginUserBtn.parentNode.style.display = "none";
    logoutUserBtn.parentNode.style.display = "block";
    showUsername.innerText = JSON.parse(user).user;
  }
}
checkLoginLogoutStatus();

function checkUserInUsers(username, users) {
  return users.some(item => item.username === username);
}

function checkUserPassword(user, password) {
  return user.password === password;
}

function initStorage() {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", "{}");
  }
}

function setUserToStorage(username) {
  localStorage.setItem("user", JSON.stringify({ user: username }));
}

async function loginUser(e) {
  let res = await fetch(USERS_API);
  let users = await res.json();

  if (!loginUsername.value.trim() || !loginPassword.value.trim()) {
    alert("Some inputs are empty!");
    return false;
  }

  if (!checkUserInUsers(loginUsername.value, users)) {
    alert("User not found!");
    return false;
  }

  let userObj = users.find(item => item.username === loginUsername.value);

  if (!checkUserPassword(userObj, loginPassword.value)) {
    alert("Wrong password!");
    return false;
  }

  initStorage();

  setUserToStorage(userObj.username);

  loginUsername.value = "";
  loginPassword.value = "";

  checkLoginLogoutStatus();

  render();
  return true;
}

loginBtn.addEventListener("click", e => {
  e.preventDefault();
  loginUser().then(data => {
    if (data) {
      allBlock.setAttribute("style", "display:block !important");
      signupFormBlock.setAttribute("style", "display:none !important");
      loginFormBlock.setAttribute("style", "display:none !important");
      slideContainer.setAttribute("style", "display:none !important");
      postsList.setAttribute("style", "display:block !important");
      render();
    }
  });
});

//!logout logic

logoutUserBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  logoutUserBtn.parentNode.style.display = "none";
  addPostBtn.parentNode.style.display = "none";
  checkLoginLogoutStatus();
  render();
});
loginUserBtn.addEventListener("click", () => {
  postsList.setAttribute("style", "display:block !important");
  allBlock.setAttribute("style", "display:none !important");
  signupFormBlock.setAttribute("style", "display:none !important");
  loginFormBlock.setAttribute("style", "display:block !important");
  slideContainer.setAttribute("style", "display:block !important");
  render();
});
//! account logic end

//!create
// inputs group
let postUrl = document.querySelector("#post-url");
let postDesc = document.querySelector("#post-desc");

const POSTS_API = "http://localhost:8008/posts";

function initStorage() {
  if (!localStorage.getItem("posts")) {
    localStorage.setItem("posts", "[]");
  }
}
initStorage();

function setVacanciesToStorage(url, desc) {
  localStorage.setItem(
    "posts",
    JSON.stringify({ image: url, description: desc })
  );
}

function getVacanciesFromStorage() {
  let posts = JSON.parse(localStorage.getItem("posts"));
  return posts;
}

async function createPosts() {
  if (!postUrl.value.trim() || !postDesc.value.trim()) {
    alert("Some inputs are empty!");
    return;
  }

  let postsObj = {
    url: postUrl.value,
    desc: postDesc.value,
  };

  await fetch(POSTS_API, {
    method: "POST",
    body: JSON.stringify(postsObj),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  postUrl.value = "";
  postDesc.value = "";

  setUserToStorage(postsObj.url, postsObj.desc);
  render();
}

let addPostModalBtn = document.querySelector("#addPostModal-btn");
addPostModalBtn.addEventListener("click", createPosts);

// read
let currentPage = 1;
let search = "";

async function render() {
  postsList.innerHTML = "";
  let requestAPI = `${POSTS_API}?q=${search}&_page=${currentPage}&_limit=3`;

  let res = await fetch(requestAPI);
  let data = await res.json();

  data.forEach(item => {
    postsList.innerHTML += `
        <div class="card m-5" style="width: 18rem;">
            <img src=${item.url} class="card-img-top" alt="..." height="150">
            <div class="card-body">

                <p class="card-text">${item.desc}</p>

                <a href="#" class="btn btn-danger btn-delete" id="${item.id}">DELETE</a>
                <a href="#" class="btn btn-dark btn-edit" data-bs-target="#staticBackdrop" data-bs-toggle="modal id="${item.id}">EDIT</a>

            </div>
        </div>
        `;
  });
  let btnCloseModal = document.querySelector("#btn-close-modal");
  btnCloseModal.click();

  if (data.length === 0) return;

  addDeleteEvent();
  addEditEvent();
}
render();

//!delete

async function deletePost(e) {
  let postId = e.target.id;

  await fetch(`${POSTS_API}/${postId}`, {
    method: "DELETE",
  });

  render();
}

function addDeleteEvent() {
  let deletePostBtn = document.querySelectorAll(".btn-delete");
  deletePostBtn.forEach(item => {
    item.addEventListener("click", deletePost);
  });
}

// !update

let saveChangesModalBtn = document.querySelector("#saveModal-btn");

function checkCreateAndSaveBtn() {
  if (saveChangesModalBtn.id) {
    addPostModalBtn.setAttribute("style", "display:none ;");
    saveChangesModalBtn.setAttribute("style", "display:block;");
  } else {
    addPostModalBtn.setAttribute("style", "display:block ;");
    saveChangesModalBtn.setAttribute("style", "display:none;");
  }
}
checkCreateAndSaveBtn();

async function addPostDataToForm(e) {
  let postId = e.target.id;
  let res = await fetch(`${POSTS_API}/${postId}`);
  let postObj = await res.json();

  postUrl.value = postObj.url;
  postDesc.value = postObj.desc;

  saveChangesModalBtn.setAttribute("id", postObj.id);

  checkCreateAndSaveBtn();
}

function addEditEvent() {
  let btnEditContact = document.querySelectorAll(".btn-edit");
  btnEditContact.forEach(item => {
    item.addEventListener("click", addPostDataToForm);
  });
}

async function saveChanges(e) {
  let updatedPostObj = {
    id: e.target.id,
    url: postUrl.value,
    desc: postDesc.value,
  };
  await fetch(`${POSTS_API}/${e.target.id}`, {
    method: "PUT",
    body: JSON.stringify(updatedPostObj),
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
  postUrl.value = "";
  postDesc.value = "";

  saveChangesModalBtn.removeAttribute("id");

  checkCreateAndSaveBtn();

  let btnCloseModal = document.querySelector("#btn-close-modal");
  btnCloseModal.click();

  render();
}

saveChangesModalBtn.addEventListener("click", saveChanges);

// //! search
// let searchInp = document.querySelector("#search-inp");
// searchInp.addEventListener("input", () => {
//   search = searchInp.value;
//   currentPage = 1;
//   render();
// });

// //!pagination
// let nextPage = document.querySelector("#next-page");
// let prevPage = document.querySelector("#prev-page");

// async function checkPages() {
//   let res = await fetch(CONTACTS_API);
//   let data = await res.json();
//   let pages = Math.ceil(data.length / 3);

//   if (currentPage === 1) {
//     prevPage.style.display = "none";
//     nextPage.style.display = "block";
//   } else if (currentPage === pages) {
//     prevPage.style.display = "block";
//     nextPage.style.display = "none";
//   } else {
//     prevPage.style.display = "block";
//     nextPage.style.display = "block";
//   }
// }
// checkPages();

// nextPage.addEventListener("click", () => {
//   currentPage++;
//   render();
//   checkPages();
// });
// prevPage.addEventListener("click", () => {
//   currentPage--;
//   render();
//   checkPages();
// });
