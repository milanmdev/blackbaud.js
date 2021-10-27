const { ReportCard } = require("./reportCard");
const { Assignment } = require("./assignment");
const { Class } = require("./class");

exports.User = class User {
  constructor(client, data, partial) {
    this.id = data.UserId;
    this.username = data.UserName;
    this.email = { address: data.Email, bad: data.EmailIsBad };
    this.name = {
      full: `${data.FirstName} "${data.NickName}" ${data.LastName}`,
      first: data.FirstName,
      last: data.LastName,
      nick: data.NickName,
    };

    this.suffix = data.Suffix;
    this.gender = data.Gender;
    this.avatar = data.ProfilePhoto
      ? {
          hash: data.ProfilePhoto.LargeFilenameUrl.split("user/")[1].split(
            "."
          )[0],
          url: `https://${client.url}${data.ProfilePhoto.LargeFilenameUrl}`,
        }
      : null;
    this.createdTimestamp = new Date(data.InsertDate).getTime();

    this.partial = partial
      ? {
          unreadMessageCount:
            partial?.UnreadMessageCount !== undefined
              ? partial?.UnreadMessageCount
              : null,
          tokenValid: partial?.TokenValid ? partial?.TokenValid : null,
          reportCards:
            partial[0] && partial[0]?.ReportCardTemplateId
              ? partial.map((reportData) => {
                  return new ReportCard(client, reportData);
                })
              : null,
          assignments:
            partial[0] && partial[0]?.assignment_index_id
              ? partial.map((reportData) => {
                  return new Assignment(client, reportData);
                })
              : null,
          classes:
            partial[0] && partial[0]?.canviewassignments !== undefined
              ? partial.map((reportData) => {
                  return new Class(client, reportData);
                })
              : null,

          _raw: partial,
        }
      : {};

    this._raw = data;
  }
};
