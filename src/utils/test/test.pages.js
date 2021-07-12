// ===========================================================

function signupSubmit() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (!username || !password) return alert("inputs are required");

  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation{
          register(username:"${username}",password:"${password}"){
            id
            username
            count
            accessToken
            refreshToken
          }
        }
    `,
    }),
  })
    .then((res) => res.json())
    .then(({ data }) => {
      if (data.register) {
        console.log("data", data.register);
        alert("register success");
        alert(JSON.stringify(data.register, null, 2));
        const { accessToken, refreshToken } = data.register;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        location.href = "/";
      }
    });
}

// =======================================================================

function loginSubmit() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  if (!username || !password) return alert("inputs are required");

  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        mutation {
          login(username: "${username}", password: "${password}") {
            id
            count
            username
            createdAt
            accessToken
            refreshToken
          }
        }
    `,
    }),
  })
    .then((res) => res.json())
    .then(({ data }) => {
      if (data.login) {
        console.log("data", data.login);
        alert("login success");
        alert(JSON.stringify(data.login, null, 2));
        const { accessToken, refreshToken } = data.login;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        location.href = "/";
      }
    });
}

// =======================================================================

async function authMe() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  let res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.stringify({ accessToken, refreshToken }),
    },
    body: JSON.stringify({
      query: `
        query {
          me {
            id
            accessToken
            refreshToken
          }
        }

    `,
    }),
  });

  const { data } = await res.json();

  if (data.me) {
    console.log("data", data.me);
    const { accessToken, refreshToken } = data.me;
    if (accessToken && refreshToken) {
      console.log("reset the tokens");
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }

    return data.me;
  }
}

// =======================================================================
function logoutSubmit() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  location.href = "/login";
}

// ===========================================================

function header() {
  async function auth() {
    if (location.pathname === "/") {
      console.log("hell world");
      const me = await authMe();
      if (!me) location.href = "/login";
      document.body.innerHTML =
        `
         <a href="/logout">/ logout</a><br/><br />
        <h3> you are  authenticated </h3> <br/>
        ` + document.body.innerHTML;
    } else {
      document.body.innerHTML =
        `<a href="/signup">/ signup</a><br/><br/>
         <a href="/login">/ login</a><br/><br />
        <h3> you are NOT authenticated </h3> <br/>
        ` + document.body.innerHTML;
    }
  }
  return `<script> ${authMe.toString()}  (${auth})()</script>`;
}

// ===========================================================

const input = (name, type) =>
  `<label>${name}<br/>
        <input id="${name}" type="${type}" />
     </label><br/></br>`;

const home = `
    <h1>Home</h1>
    ${header()}
`;
const signup = `
    <h1>Submit</h1>
    ${input("username", "text")}
    ${input("password", "password")}
    <button onclick="signupSubmit()"}>submit</button>
    <script>
    ${signupSubmit.toString()} 
    </script>
    ${header()}
`;

const login = `
    <h1>Login</h1>
    ${input("username", "text")}
    ${input("password", "password")}
    <button onclick="loginSubmit()"}>submit</button>
    <script>
    ${loginSubmit.toString()}
    </script>
    ${header()}
`;

const logout = `
   <h1>Logout</h1>
    <script>
    (${logoutSubmit.toString()})()
    </script>
`;

// ===========================================================

module.exports = { signup, login, logout, home };
