<div  align="center">

<br>

# blackbaud.js

<br>

<p>
Node.js package to interact with Blackbaud's learning management system (LMS)
</p>

<br>

<p>
<br>

<a  href="https://www.npmjs.com/package/blackbaud.js"><img  src="https://img.shields.io/npm/v/blackbaud.js.svg?maxAge=3600"  alt="NPM Version" /></a>
<a  href="https://www.npmjs.com/package/blackbaud.js"><img  src="https://img.shields.io/npm/dt/blackbaud.js.svg?maxAge=3600"  alt="NPM Downloads" /></a>
<a  href="https://david-dm.org/milanmdev/blackbaud.js"><img  src="https://img.shields.io/david/milanmdev/blackbaud.js.svg?maxAge=3600"  alt="Dependencies" /></a>

<!-- <a  href="https://www.npmjs.com/package/blackbaud.js"><img  src="https://api.ghprofile.me/view?username=milanmdev-blackbaud.js&label=repository%20view%20count&style=flat"  alt="Repository view count" /></a> -->

</p>

<br>

<p>
<a  href="https://nodei.co/npm/blackbaud.js/"><img  src="https://nodei.co/npm/blackbaud.js.png?downloads=true&stars=true"  alt="NPM Install Info" /></a>
</p>
</div>

# Example

```js
const { Client } = require("blackbaud.js");

const client = new Client({
  url: "example.myschoolapp.com",
  svcToken: "ExampleSVCToken", // This can be fetched by looking for the "AuthSvcToken" cookie under "myschoolapp.com" in your browser.
  /* username: "john.doe",
  password: "JohnDoePassword123",*/ // Alternatively, you can provide credentials if the LMS does not use BBID.
});
let UserManager = new client.UserManager(client);

client.on("ready", async function (client) {
  console.log(
    `[Blackbaud] Client logged in and ready as "${client.user.username}"`
  );

  await UserManager.getStatus().then((data) => {
    console.log(data.partial.unreadMessageCount); // Returns the number of unread messages for the current user.
  });
});
```
