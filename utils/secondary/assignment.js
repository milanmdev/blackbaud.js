exports.Assignment = class Assignment {
  constructor(client, data) {
    this.id = data.assignment_id;
    this.description = {
      short: data.short_description,
      long: data.long_description,
    };
    this.assignedTimestamp = new Date(data.date_assigned).getTime();
    this.dueTimestamp = new Date(data.date_due).getTime();
    this.class = data.groupname;

    this._raw = data;
  }
};
