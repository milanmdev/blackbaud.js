const { User } = require("./../utils/user");

class UserManager {
  constructor(client) {
    if (!client) throw new Error('"client" cannot be undefined');
    this.client = client;

    this.fetchProperties =
      "FieldsToNull%2CLastName%2CFirstName%2CMiddleName%2COtherLastName%2CPrefix%2CSuffix%2CMaidenName%2CNickName%2CDisplayName%2CGender%2CPronouns%2CBirthDate%2CLivingStatus%2CBoardingOrDay%2CAffiliation%2CRetireDate%2CReligionTypeId%2CEthnicityType%2CCitizenship%2CIsAbroad%2CPublishUserPage%2CIsDeceased%2CDeceasedDate%2CIsLost%2CSsn%2CCustomField1%2CCustomField2%2CCustomField3%2CCustomField4%2CCustomField5%2CCustomField6%2CCustomField7%2CCustomField8%2CCustomField9%2CCustomField10%2CPersonalBio%2CEmail%2CEmailIsBad%2CCcEmail%2CCcEmailIsBad%2CGreeting%2CScreenName%2CIMService%2CPersonalWebsite%2CProfilePhoto%2CLatinoHispanic%2CInStateResident%2CResidentCounty%2CResidentFromDate%2CBirthPlace%2CPrimaryLanguageId%2CSpokenLanguages%2CRaceSelections%2CVisaTypeId%2CVisaStatus%2CVisaNumber%2CVisaIssueDate%2CVisaExpireDate%2CPassportNumber%2CPassportExpireDate%2CStudentId%2CLockerNbr%2CLockerCombo%2CMailboxNbr%2CMailboxCombo%2CPhotoEditSettings%2CSchoolProgramId%2CInternational%2CStudentResponsibleSignerInd";
  }
  /**
   * Get the status for the authenticated user.
   * @returns User
   */
  async getStatus() {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);

      const res = this.client.httpInstance
        .get("/api/webapp/userstatus", {
          headers: {
            "User-Agent": this.client.http.User_Agent,
            origin: this.client.url,
            Cookie: this.client.login_tokens,
          },
        })
        .then(async (res) => {
          return res.data;
        });

      return new User(this.client, this.client.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Get active report cards for the authenticated user.
   * @returns User
   */
  async getReportCards() {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);

      const res = this.client.httpInstance
        .get(
          `/api/Grading/StudentReportCardTemplateList?studentId=${
            this.client.user.id
          }&schoolYearLabel=${new Date().getFullYear()}+-+${
            new Date().getFullYear() + 1
          }`,
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

      return new User(this.client, this.client.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Get active assignments for the authenticated user.
   * @returns User
   * @param persona {number} - Account Type: 3 = Faculty; 2 = Student
   */
  async getAssignments(persona) {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);
      if (!persona) throw new Error("'persona' cannot be undefined");
      if (persona != 2 && persona != 3)
        throw new Error("'persona' must be a number, 2 or 3");

      const res = this.client.httpInstance
        .get(
          `/api/DataDirect/AssignmentCenterAssignments/?format=json&filter=2&dateStart=${
            new Date().getMonth() + 1
          }%2F${new Date().getDate()}%2F${new Date().getFullYear()}&dateEnd=${
            new Date().getMonth() + 1
          }%2F${new Date().getDate()}%2F${new Date().getFullYear()}&persona=${persona}&statusList=&sectionList=`,
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

      return new User(this.client, this.client.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Get classes for the authenticated user.
   * @returns User
   * @param persona {number} - Account Type: 3 = Faculty; 2 = Student
   */
  async getClasses(persona) {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);
      if (!persona) throw new Error("'persona' cannot be undefined");
      if (persona != 2 && persona != 3)
        throw new Error("'persona' must be a number, 2 or 3");

      const res = this.client.httpInstance
        .get(
          `/api/datadirect/ParentStudentUserAcademicGroupsGet?userId=${
            this.client.user.id
          }&schoolYearLabel=${new Date().getFullYear()}+-+${
            new Date().getFullYear() + 1
          }&memberLevel=3&persona=${persona}&durationList=&markingPeriodId=`,
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

      return new User(this.client, this.client.user._raw, await res);
    } catch (err) {
      return err;
    }
  }

  /**
   * Fetch a user by their Id.
   * @returns User
   * @param id {number} - Id of the user
   */
  async fetch(id) {
    try {
      this.client.functions.checkEmit(this.client, this.client.eventManager);
      if (!id) throw new Error("'id' cannot be undefined");
      if (typeof id !== "number") throw new Error("'id' must be a number");

      const res = this.client.httpInstance
        .get(`/api/user/${id}/?propertylist=${this.fetchProperties}`, {
          headers: {
            "User-Agent": this.client.http.User_Agent,
            origin: this.client.url,
            Cookie: this.client.login_tokens,
          },
        })
        .then(async (res) => {
          return res.data;
        });

      let userElement = new User(this.client, await res);
      userElement.id = id;

      return userElement;
    } catch (err) {
      return err;
    }
  }
}

module.exports = UserManager;
