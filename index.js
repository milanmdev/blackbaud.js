const axios = require("axios");
const EventEmitter = require("events").EventEmitter;
const eventManager = new EventEmitter();

const { User } = require("./utils/user");

class Client {
  constructor(options) {
    var instance = this;
    EventEmitter.call(instance);
    this.eventManager = eventManager;

    if (!options.url) throw new Error('"url" cannot be undefined');
    if (!options.username && !options.svcToken)
      throw new Error('"username" cannot be undefined');
    if (!options.password && !options.svcToken)
      throw new Error('"password" cannot be undefined');

    this.url = options.url;
    this.username = options.username;
    this.password = options.password;
    this.svcToken = options.svcToken;
    this.clientData = {
      url: this.url,
      username: this.username,
      password: this.password,
    };

    var default_http = {
      User_Agent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
    };
    this.http = options.http ? options.http : default_http;
    this.httpInstance = axios.create({
      baseURL: "https://" + this.url,
      headers: { "User-Agent": this.http.User_Agent, origin: this.url },
    });
    this.defaultAxios = axios.create();

    /* Try Login Details */
    if (this.svcToken) {
      var getLoginToken = this.defaultAxios
        .post("https://sts-sso.myschoolapp.com/oauth2/token", null, {
          headers: {
            "User-Agent": this.http.User_Agent,
            origin: this.url,
            Cookie: `AuthSvcToken=${this.svcToken}`,
            "content-type": "application/json",
            "x-csrf": "token_needed",
          },
        })
        .catch(function (error) {
          if (error.response.status == 401) {
            throw new Error("Invalid login details provided");
          } else {
            throw error;
          }
        });
      this.loggedIn = false;
      (async () => {
        let getLoginTokenData = await getLoginToken;
        if (!getLoginTokenData.data || !getLoginTokenData.data.access_token) {
          this.loggedIn = false;
          throw new Error("Invalid login details provided");
        }
        this.bbidToken = getLoginTokenData.data.access_token;

        var login = this.httpInstance
          .get("/api/bbid/login", {
            headers: {
              "User-Agent": this.http.User_Agent,
              origin: this.url,
              Authorization: `Bearer ${this.bbidToken}`,
            },
          })
          .catch(function (error) {
            throw error;
          });

        let loginData = await login;
        let res = loginData.data;

        this.login_tokens = loginData.headers["set-cookie"];
        for (let i of loginData.headers["set-cookie"]) {
          if (i.startsWith("t")) {
            this.token = i.split(";")[0].split("t=")[1];
            break;
          }
        }

        if (!res.LoginSuccessful) {
          this.loggedIn = false;
          throw new Error("Invalid login details provided");
        } else {
          var fetchToken = this.httpInstance
            .get("/api/webapp/context", {
              headers: {
                "User-Agent": this.http.User_Agent,
                origin: this.url,
                Cookie: this.login_tokens,
              },
            })
            .catch(function (error) {
              throw error;
            });

          let tokenData = await fetchToken;
          let tokenRes = tokenData.data;
          if (tokenRes.MasterUserInfo) {
            this.loggedIn = true;
            this.user = new User(this, tokenRes.MasterUserInfo);
            eventManager.emit("ready", this);
          } else {
          }
        }
      })();
    } else {
      var login = this.httpInstance
        .post("/api/SignIn", {
          From: "",
          Username: this.username,
          Password: this.password,
          InterfaceSource: "WebApp",
        })
        .catch(function (error) {
          throw error;
        });
      this.loggedIn = false;
      (async () => {
        let loginData = await login;
        let res = loginData.data;

        this.login_tokens = loginData.headers["set-cookie"];
        for (let i of loginData.headers["set-cookie"]) {
          if (i.startsWith("t")) {
            this.token = i.split(";")[0].split("t=")[1];
            break;
          }
        }

        if (!res.LoginSuccessful) {
          this.loggedIn = false;
          throw new Error("Invalid login details provided");
        } else if (res.PasswordExpired) {
          this.loggedIn = false;
          throw new Error(
            "Passsword provided is expired. Set a new one by logging in at https://" +
              this.url
          );
        } else {
          var fetchToken = this.httpInstance
            .get("/api/webapp/context", {
              headers: {
                "User-Agent": this.http.User_Agent,
                origin: this.url,
                Cookie: this.login_tokens,
              },
            })
            .catch(function (error) {
              throw error;
            });
          this.authroziationHeader = { Cookie: this.login_tokens };

          let tokenData = await fetchToken;
          let tokenRes = tokenData.data;
          if (tokenRes.MasterUserInfo) {
            this.loggedIn = true;
            this.user = new User(this, tokenRes.MasterUserInfo);
            eventManager.emit("ready", this);
          } else {
          }
        }
      })();
    }

    /* Require Files */
    this.functions = require("./utils/functions/index");
    this.UserManager = require("./src/users");
    this.SchoolManager = require("./src/schools");
    this.ClassManager = require("./src/classes");
  }

  on(event, f) {
    try {
      eventManager.on(event, f);
    } catch (err) {
      return err;
    }
  }

  once(event, f) {
    try {
      eventManager.once(event, f);
    } catch (err) {
      return err;
    }
  }
}

module.exports = { Client };
