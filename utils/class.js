exports.ExtendedClass = class ExtendedClass {
  constructor(client, data, partial) {
    this.courseCount = data.length;
    this.courses = [];
    for (const d of data) {
      let pushData = {
        id: d.Id,
        name: d.GroupName,
        block: d.Block,
        room: d.Room,
        teacher: d.TeacherId,

        schoolYear: d.SchoolYear,
        startDate: new Date(d.StartDate).getTime(),
        endDate: new Date(d.EndDate).getTime(),

        _raw: d,
      };

      this.courses.push(pushData);
    }
  }
};
