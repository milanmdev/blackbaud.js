const { Community } = require("./secondary/community");
const { News } = require("./secondary/news");

exports.School = class School {
  constructor(client, data, partial) {
    this.id = data.SchoolInfo.SchoolId;
    this.name = data.SchoolInfo.SchoolName;
    this.url = {
      main: data.SchoolUrl.site_url,
      portal: data.SchoolInfo.LiveUrl,
    };
    this.timezone = data.SchoolInfo.Timezone;
    this.email = data.SchoolInfo.MailboxName;
    this.locale = data.Culture.Culture;

    this.brand = {
      logo: {
        id: data.Style.LogoId,
        hash: data.Style.LogoFilename.split(".")[0],
        url: `https://${client.url}${encodeURI(data.Style.Logo)}`,
      },
      colors: data.Colors,
    };
    this.current = {
      id: data.CurrentSchoolYear.SchoolYearId,
      label: data.CurrentSchoolYear.SchoolYearLabel,
      start: new Date(data.CurrentSchoolYear.BeginSchoolYear).getTime(),
      end: new Date(data.CurrentSchoolYear.EndSchoolYear).getTime(),
    };

    this.partial = partial
      ? {
          communities:
            partial[0] && partial[0]?.sectionidentifier !== undefined
              ? partial.map((reportData) => {
                  return new Community(client, reportData);
                })
              : null,
          news:
            partial[0] && partial[0]?.event_registration_id !== undefined
              ? partial.map((reportData) => {
                  return new News(client, reportData);
                })
              : null,

          _raw: partial,
        }
      : {};

    this._raw = data;
  }
};
