exports.Class = class Class {
  constructor(client, data) {
    this.id = data.sectionid;
    this.name = data.sectionidentifier;
    this.room = data.room;
    this.owner = {
      id: data.OwnerId,
      name: data.groupownername,
      email: data.groupowneremail,
      avatar: data.groupownerphoto
        ? {
            hash: data.groupownerphoto.split(".")[0],
            url: `https://${client.url}/ftpimages/335/user/${data.groupownerphoto}`,
          }
        : null,
    };

    this._raw = data;
  }
};
