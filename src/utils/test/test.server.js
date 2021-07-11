const express = require("express");
const app = express();
const port = 3000;

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
        location.href = "/";
      }
    });
}

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
        location.href = "/";
      }
    });
}

// ===========================================================

const input = (name, type) =>
  `<label>${name}<br/>
        <input id="${name}" type="${type}" />
     </label><br/></br>`;

const home = `
    <a href="/signup">/ signup</a><br/><br/>
    <a href="/login">/ login</a>
`;
const signup = `
    <a href="/">/ home</a><br/><br/>
    <a href="/login">/ login</a><br/><br/>
    <h1>Submit</h1>
    ${input("username", "text")}
    ${input("password", "password")}
    <button onclick="signupSubmit()"}>submit</button>
    <script>
    ${signupSubmit.toString()} 
    </script>
`;

const login = `
    <a href="/">/ home</a><br/><br/>
    <a href="/signup">/ signup</a><br/><br/>
    <h1>Login</h1>
    ${input("username", "text")}
    ${input("password", "password")}
    <button onclick="loginSubmit()"}>submit</button>
    <script>
    ${loginSubmit.toString()} 
    </script>
`;

// ===========================================================
app.get("/", (_, res) => res.send(home));
app.get("/login", (_, res) => res.send(login));
app.get("/signup", (_, res) => res.send(signup));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
