const { ExtendedClass } = require("./../utils/class");

class ClassManager {
  constructor(client) {
    if (!client) throw new Error('"client" cannot be undefined');
    this.client = client;
  }

  /**
   * Fetch a class
   * @returns Class
   * @param {number} id - Id of the class
   */
  async fetch(id) {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);

      const res = this.client.httpInstance
        .get(
          `/api/datadirect/SectionInfoView/?format=json&sectionId=${id}&associationId=1`,
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

      const singleClass = new ExtendedClass(this.client, await res);
      return singleClass;
    } catch (err) {
      return err;
    }
  }
}

module.exports = ClassManager;
