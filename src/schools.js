const { School } = require("./../utils/school");

class SchoolManager {
  constructor(client) {
    if (!client) throw new Error('"client" cannot be undefined');
    this.client = client;

    this.client.school = null;
  }

  /**
   * Fetch the current school
   * @returns School
   */
  async fetch() {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);

      const res = this.client.httpInstance
        .get(`/api/webapp/schoolcontext`, {
          headers: {
            "User-Agent": this.client.http.User_Agent,
            origin: this.client.url,
            Cookie: this.client.login_tokens,
          },
        })
        .then(async (res) => {
          return res.data;
        });

      const school = new School(this.client, await res);

      this.client.school = school;
      return school;
    } catch (err) {
      return err;
    }
  }

  /**
   * Get communities available for the user
   * @returns School
   * @param persona {number} - Account Type: 3 = Faculty; 2 = Student
   */
  async getCommunities(persona) {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);
      if (!persona) throw new Error("'persona' cannot be undefined");
      if (persona != 2 && persona != 3)
        throw new Error("'persona' must be a number, 2 or 3");

      const res = this.client.httpInstance
        .get(
          `/api/datadirect/ParentStudentUserCommunityGroupsGet?userId=${this.client.user.id}&memberLevel=3&persona=${persona}&durationId=0`,
          {
            headers: {
              "User-Agent": this.client.http.User_Agent,
              origin: this.client.url,
              Cookie: this.client.login_tokens,
            },
          }
        )
        .then(async (res) => {
          return res.data;
        });

      return new School(this.client, this.client.school._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Get news for the current school
   * @returns School
   */
  async getNews() {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);

      const res = this.client.httpInstance
        .get(`/api/datadirect/ActivityFeedGet/?format=json&lastDate=`, {
          headers: {
            "User-Agent": this.client.http.User_Agent,
            origin: this.client.url,
            Cookie: this.client.login_tokens,
          },
        })
        .then(async (res) => {
          return res.data;
        });

      return new School(this.client, this.client.school._raw, await res);
    } catch (err) {
      return err;
    }
  }
}

module.exports = SchoolManager;
