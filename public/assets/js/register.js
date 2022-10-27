const HOME_URL = "/";
const REGISTER_URL = "/api/auth/local/register";

const REGISTER_FORM_ID = "#register-form";
const FIRST_NAME_ID = "#firstname";
const LAST_NAME_ID = "#lastname";
const EMAIL_ID = "#email";
const USERNAME_ID = "#username";
const PASSWORD_ID = "#password";
const CONFIRM_PASSWORD_ID = "#confirm-password";

// ENTRY_POINT
ele(REGISTER_FORM_ID).addEventListener("submit", registerHandler);

// MAIN FUNCTION
async function registerHandler(e) {
  e.preventDefault();
  redirectToHomeIfLoggedIn();

  if (!validatePassword(PASSWORD_ID, CONFIRM_PASSWORD_ID)) {
    alert("Passwords do not match");
    return;
  }
  const inputData = getInputData(
    FIRST_NAME_ID,
    LAST_NAME_ID,
    EMAIL_ID,
    USERNAME_ID,
    PASSWORD_ID
  );
  const registerOptions = createRegisterOptions(inputData);
  const responseFromServer = await registerFetch(REGISTER_URL, registerOptions);
  if (responseFromServer.error) {
    alert(responseFromServer.response.error.message);
    return;
  }
  setLocalStateFromResponseData(responseFromServer);
  redirectToHome();
  return;
}

// HELPER FUNCTIONS
function setLocalStateFromResponseData(data) {
  const { jwt, user } = data;
  const { id, email, username } = user;
  state = {
    jwt,
    user: {
      id,
      email,
      username,
    },
  };
  localStorage.clear();
  localStorage.setItem("state", JSON.stringify(state));
  return;
}

async function registerFetch(url, options) {
  const response = await fetch(url, options);
  if (response.status === 200) {
    return await response.json();
  }
  return { error: true, response: await response.json() };
}

function createRegisterOptions(data) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}
function validatePassword(passwordId, confirmPasswordId) {
  if (ele(passwordId).value !== ele(confirmPasswordId).value) {
    return false;
  }
  return true;
}

function ele(q) {
  const e = document.querySelectorAll(q);
  return e.length > 1 ? e : e[0];
}

function redirectToHome() {
  window.location.replace(HOME_URL);
}
function redirectToHomeIfLoggedIn() {
  if (localStorage.getItem("user")) {
    redirectToHome();
  }
}

function getInputData(
  firstnameId,
  lastnameId,
  emailId,
  usernameId,
  passwordId
) {
  return {
    firstname: ele(firstnameId).value,
    lastname: ele(lastnameId).value,
    email: ele(emailId).value,
    username: ele(usernameId).value,
    password: ele(passwordId).value,
  };
}
