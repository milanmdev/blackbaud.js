const axios = require("axios");
const EventEmitter = require("events").EventEmitter;
const eventManager = new EventEmitter();

const { User } = require("./utils/user");

class Client {
  constructor(options) {
    var instance = this;
    EventEmitter.call(instance);

    if (!options.url) throw new Error('"url" cannot be undefined');
    if (!options.username) throw new Error('"username" cannot be undefined');
    if (!options.password) throw new Error('"password" cannot be undefined');

    this.url = options.url;
    this.username = options.username;
    this.password = options.password;

    var default_http = {
      User_Agent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36",
    };
    this.http = options.http ? options.http : default_http;
    this.httpInstance = axios.create({
      baseURL: "https://" + this.url,
      headers: { "User-Agent": this.http.User_Agent, origin: this.url },
    });

    /* Try Login Details */
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
          .get("***REMOVED***", {
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

    /* Require Files */
    this.functions = require("./utils/functions/index");
    //this.users = require("./src/users");
  }

  on(event, f) {
    try {
      eventManager.on(event, f);
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets the status for the authenticated user.
   * @returns User
   */
  async userStatus() {
    try {
      checkEmit(this, eventManager);

      const res = this.httpInstance
        .get("/api/webapp/userstatus", {
          headers: {
            "User-Agent": this.http.User_Agent,
            origin: this.url,
            Cookie: this.login_tokens,
          },
        })
        .then(async (res) => {
          return res.data;
        });

      return new User(this, this.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets active report cards for the authenticated user.
   * @returns User
   */
  async getReportCards() {
    try {
      checkEmit(this, eventManager);

      const res = this.httpInstance
        .get(
          `/api/Grading/StudentReportCardTemplateList?studentId=${
            this.user.id
          }&schoolYearLabel=${new Date().getFullYear()}+-+${
            new Date().getFullYear() + 1
          }`,
          {
            headers: {
              "User-Agent": this.http.User_Agent,
              origin: this.url,
              Cookie: this.login_tokens,
            },
          }
        )
        .then(async (res) => {
          return res.data;
        });

      return new User(this, this.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets active assignments for the authenticated user.
   * @returns User
   * @param persona {number} - Account Type: 3 = Faculty; 2 = Student
   */
  async getAssignments(persona) {
    try {
      checkEmit(this, eventManager);
      if (!persona) throw new Error("'persona' cannot be undefined");
      if (persona != 2 && persona != 3)
        throw new Error("'persona' must be a number, 2 or 3");

      const res = this.httpInstance
        .get(
          `/api/DataDirect/AssignmentCenterAssignments/?format=json&filter=2&dateStart=${
            new Date().getMonth() + 1
          }%2F${new Date().getDate()}%2F${new Date().getFullYear()}&dateEnd=${
            new Date().getMonth() + 1
          }%2F${new Date().getDate()}%2F${new Date().getFullYear()}&persona=${persona}&statusList=&sectionList=`,
          {
            headers: {
              "User-Agent": this.http.User_Agent,
              origin: this.url,
              Cookie: this.login_tokens,
            },
          }
        )
        .then(async (res) => {
          return res.data;
        });

      return new User(this, this.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Gets classes for the authenticated user.
   * @returns User
   * @param persona {number} - Account Type: 3 = Faculty; 2 = Student
   */
  async getClasses(persona) {
    try {
      checkEmit(this, eventManager);
      if (!persona) throw new Error("'persona' cannot be undefined");
      if (persona != 2 && persona != 3)
        throw new Error("'persona' must be a number, 2 or 3");

      const res = this.httpInstance
        .get(
          `/api/datadirect/ParentStudentUserAcademicGroupsGet?userId=${
            this.user.id
          }&schoolYearLabel=${new Date().getFullYear()}+-+${
            new Date().getFullYear() + 1
          }&memberLevel=3&persona=${persona}&durationList=&markingPeriodId=`,
          {
            headers: {
              "User-Agent": this.http.User_Agent,
              origin: this.url,
              Cookie: this.login_tokens,
            },
          }
        )
        .then(async (res) => {
          return res.data;
        });

      return new User(this, this.user._raw, await res);
    } catch (err) {
      return err;
    }
  }
}

function checkEmit(client, emitter) {
  if (!client.loggedIn) throw new Error("Client is not logged in");
  let eventsEmitted = emitter.eventNames();
  if (!eventsEmitted.includes("ready"))
    throw new Error('"ready" event has not been emitted');

  return true;
}

module.exports = { Client };
