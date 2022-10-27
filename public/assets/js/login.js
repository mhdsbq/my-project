// GLOBAL VARIBLES
const LOGIN_URL = "/api/auth/local";
const HOME_URL = "/";
const IDENTIFIER_ID = "#identifier";
const PASSWORD_ID = "#password";
const LOGIN_FORM_ID = "#login-form";

// ENTRY_POINT
ele(LOGIN_FORM_ID).addEventListener("submit", loginHandler);

async function loginHandler(e) {
  e.preventDefault();
  redirectToHomeIfLoggedIn();
  const inputData = getInputData(IDENTIFIER_ID, PASSWORD_ID);
  const loginOptions = createLoginOptions(inputData);
  const responseFromServer = await loginFetch(LOGIN_URL, loginOptions);
  if (responseFromServer.error) {
    alert(responseFromServer.response.message);
    return;
  }
  setLocalStateFromResponseData(responseFromServer);
  redirectToHome();
  return;
}

// HELPER FUNCTIONS
function getInputData(identifierId, passwordId) {
  return {
    identifier: ele(identifierId).value,
    password: ele(passwordId).value,
  };
}

function redirectToHome() {
  window.location.replace(HOME_URL);
}

function createLoginOptions(inputData) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inputData),
  };
}
// fetch function wraper
async function loginFetch(url, options) {
  const response = await fetch(url, options);
  if (response.status === 200) {
    return await response.json();
  }

  return { error: true, response: await response.json() };
}

function ele(q) {
  const e = document.querySelectorAll(q);
  return e.length > 1 ? e : e[0];
}

function setLocalStateFromResponseData(responseData) {
  const { jwt, user } = responseData;
  const { id, username, email } = user;
  state = {
    jwt,
    user: {
      id,
      username,
      email,
    },
  };
  localStorage.clear();
  localStorage.setItem("state", JSON.stringify(state));
  return;
}

function redirectToHomeIfLoggedIn() {
  if (
    localStorage.getItem("state") &&
    localStorage.getItem("state").length > 0
  ) {
    redirectToHome;
  }
}
