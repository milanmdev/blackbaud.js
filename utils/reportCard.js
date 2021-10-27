exports.ReportCard = class ReportCard {
  constructor(client, data) {
    this.id = data.ReportCardTemplateId;
    this.name = data.Name;
    this.hold = data.OnHold;
    
    this._raw = data;
  }
};
