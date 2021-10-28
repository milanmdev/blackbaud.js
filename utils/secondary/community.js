const { User } = require("./../user.js");

exports.Community = class Community {
  constructor(client, data) {
    this.id = data.sectionid;
    this.name = data.sectionidentifier;
    this.description = data.groupdescription;
    this.level = data.schoollevel;
    this.owner = {
      id: data.OwnerId,
      email: data.groupowneremail,
      avatar: data.groupownerphoto
        ? {
            hash: data.groupownerphoto.split(".")[0],
            url: null,
          }
        : null,
    };

    this._raw = data;
  }
};
