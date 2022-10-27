const LOGIN_BTN_ID = "#login";
const REGISTER_BTN_ID = "#register";
const CLASSROOM_BTN_ID = "#classroom";
const LOGOUT_BTN_ID = "#logout";
const LOGIN_URL = "/login.html";
const REGISTER_URL = "/register.html";
// Entry points
export default function navbarHandlers() {
  document.addEventListener("DOMContentLoaded", navStateHandler);
  ele(LOGOUT_BTN_ID).addEventListener("click", logOutHandler);
  ele(LOGIN_BTN_ID).addEventListener("click", () => {
    window.location.href = LOGIN_URL;
  });
  ele(REGISTER_BTN_ID).addEventListener("click", () => {
    window.location.href = REGISTER_URL;
  });
}

// Main functions

function navStateHandler() {
  const localState = getLocalState();
  renderNavbarOnAuthStatus(isLogedIn(localState));
}

function logOutHandler() {
  localStorage.clear();
  const isLogedIn = false;
  renderNavbarOnAuthStatus(isLogedIn);
}

// Helper functions

function getLocalState() {
  return JSON.parse(localStorage.getItem("state"));
}

function setLocalState(state) {
  localStorage.setItem("state", JSON.stringify(state));
  return JSON.parse(localStorage.getItem(state));
}

function isLogedIn(localState = getLocalState()) {
  return localState && localState.jwt && localState.jwt.length > 0;
}

function renderNavbarOnAuthStatus(isLogedIn = isLogedIn()) {
  if (isLogedIn) {
    ele(LOGIN_BTN_ID).style.display = "none";
    ele(REGISTER_BTN_ID).style.display = "none";
    ele(CLASSROOM_BTN_ID).style.display = "block";
    ele(LOGOUT_BTN_ID).style.display = "block";
  } else {
    ele(LOGIN_BTN_ID).style.display = "block";
    ele(REGISTER_BTN_ID).style.display = "block";
    ele(CLASSROOM_BTN_ID).style.display = "none";
    ele(LOGOUT_BTN_ID).style.display = "none";
  }
  return;
}

function ele(q) {
  const e = document.querySelectorAll(q);
  return e.length > 1 ? e : e[0];
}
