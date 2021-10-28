exports.News = class News {
  constructor(client, data) {
    this.id = data.content_item_id;
    this.description = {
      short: data.content_short_description,
      long: data.content_long_description,
    };
    this.class = data.content_locations;
    this.assignedTimestamp = new Date(data.publish_date).getTime();
    this.dueTimestamp = new Date(data.expire_date).getTime();
    this.class = data.groupname;
    this.assigner = data.user_name;

    this._raw = data;
  }
};
