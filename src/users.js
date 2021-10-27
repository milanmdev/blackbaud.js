const { User } = require("./../utils/user");

class UserManager {
  constructor(client) {
    if (!client) throw new Error('"client" cannot be undefined');
    this.client = client;
  }
  /**
   * Gets the status for the authenticated user.
   * @returns User
   */
  async userStatus() {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);

      const res = this.client.httpInstance
        .get("/api/webapp/userstatus", {
          headers: {
            "User-Agent": this.client.http.User_Agent,
            origin: this.client.url,
            Cookie: this.client.login_tokens,
          },
        })
        .then(async (res) => {
          return res.data;
        });

      return new User(this, this.client.user._raw, await res);
    } catch (err) {
      return err;
    }
  }
}

module.exports = UserManager;
