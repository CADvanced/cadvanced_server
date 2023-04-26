export default `

  union CharacterResult = Citizen | Officer

  enum CharacterType {
      citizen
      officer
  }

  type Config {
    key: String!
    value: String!
  }

  type Preference {
    id: ID!
    key: String!
    value: String!
    name: String!
    desc: String
    type: String!
  }

  type CallGrade {
    id: ID!
    name: String!
    code: String
    DepartmentId: ID!
    readonly: Boolean
  }

  input CallGradeInput {
    id: ID
    name: String!
    code: String
    DepartmentId: ID!
    readonly: Boolean
  }

  type CallType {
    id: ID!
    name: String!
    code: String
    DepartmentId: ID!
    readonly: Boolean
  }

  input CallTypeInput {
    id: ID
    name: String!
    code: String
    DepartmentId: ID!
    readonly: Boolean
  }

  type Location {
    id: ID!
    name: String!
    x: Float
    y: Float
    calls: [Call!]
    code: String
    readonly: Boolean
  }

  input LocationInput {
    id: ID
    name: String!
    x: Float
    y: Float
    code: String
    readonly: Boolean
  }

  type CallDescription {
    id: ID!
    text: String!
  }

  input CallDescriptionInput {
    id: ID
    text: String!
  }

  type IncidentType {
    id: ID!
    name: String!
    code: String
    readonly: Boolean
    DepartmentId: ID!
  }

  input IncidentTypeInput {
    id: ID
    name: String!
    code: String
    DepartmentId: ID!
    readonly: Boolean
  }

  type Call {
    id: ID!
    callerInfo: String,
    callGrade: CallGrade
    callType: CallType
    callLocations: [Location!]
    callIncidents: [IncidentType!]
    callDescriptions: [CallDescription!]
    assignedUnits: [Unit]
    DepartmentId: ID!,
    markerX: Float
    markerY: Float
  }

  type LicenceStatus {
      id: ID!
      name: String
  }

  type LicenceType {
      id: ID!
      name: String
  }

  type Licence {
      id: ID!
      LicenceTypeId: ID!
      licenceType: LicenceType!
      LicenceStatusId: ID!
      licenceStatus: LicenceStatus!
      citizen: Citizen
  }

  type Warrant {
      id: ID!
      details: String
      citizen: Citizen
      validFrom: String
      validTo: String
  }

  type WeaponStatus {
      id: ID!
      name: String
  }

  type WeaponType {
      id: ID!
      name: String
  }

  type Weapon {
      id: ID!
      citizen: Citizen!
      WeaponTypeId: ID!
      weaponType: WeaponType!
      WeaponStatusId: ID!
      weaponStatus: WeaponStatus!
  }

  type Charge {
      id: ID!  
      name: String
  }

  type Marker {
      id: ID!  
      name: String
      type: String
  }

  type Arrest {
      id: ID!
      date: String
      time: String
      OfficerId: ID
      officer: Officer!
      CitizenId: ID
      citizen: Citizen!
      charges: [Charge]
      OffenceId: ID
  }

  type Citizen {
      id: ID!
      firstName: String!
      lastName: String!
      address: String
      postalCode: String
      GenderId: ID
      gender: Gender
      EthnicityId: ID
      ethnicity: Ethnicity
      dateOfBirth: String
      weight: String
      height: String
      hair: String
      eyes: String
      active: Boolean!
      licences: [Licence]
      warrants: [Warrant]
      weapons: [Weapon]
      vehicles: [Vehicle]
      arrests: [Arrest]
      offences: [Offence]
      markers: [Marker]
      user: User
      history: String
      createdAt: String
      UserId: ID!
  }

  type Officer {
      id: ID!
      firstName: String!
      lastName: String!
      active: Boolean!
      DepartmentId: ID!
      UserId: ID!
      department: Department
  }

  type Ethnicity {
      id: ID!
      name: String
  }

  type Gender {
      id: ID!
      name: String
  }

  type InsuranceStatus {
      id: ID!
      name: String
  }

  type Offence {
      id: ID!
      date: String
      time: String
      location: String
      CitizenId: ID
      citizen: Citizen!
      ArrestId: ID
      arrest: Arrest
      TicketId: ID
      ticket: Ticket
      charges: [Charge]
  }

  type VehicleModel {
      id: ID!
      name: String
  }

  type Ticket {
      id: ID!
      date: String
      time: String
      location: String
      points: String
      fine: String
      notes: String
      OfficerId: ID
      officer: Officer!
      OffenceId: ID
  }

  type Vehicle {
      id: ID!
      licencePlate: String
      colour: String
      citizen: Citizen!
      VehicleModelId: ID
      vehicleModel: VehicleModel
      InsuranceStatusId: ID
      insuranceStatus: InsuranceStatus
      markers: [Marker]
  }

  type UserType {
    id: ID!
    name: String!
    code: String!
  }

  input ChargeInput {
      id: ID!  
      name: String
  }

  input UserTypeInput {
    id: ID!
  }

  type UserRank {
    id: ID!
    name: String!,
    position: String!
    DepartmentId: ID!
  }

  type User {
    id: ID!
    userName: String!
    x: String
    y: String
    steamId: String!
    avatarUrl: String
    alias: String
    createdAt: String!
    updatedAt: String!
    userType: UserType
    token: String
    roles: [UserType]
    units: [Unit]
    citizens: [Citizen]
    officers: [Officer]
    character: CharacterResult
  }

  type Token {
      token: String!
  }

  type UnitType {
    id: ID!
    name: String!
    DepartmentId: ID!
  }

  type UnitState {
    id: ID!
    name: String!
    colour: String!
    code: String
    readonly: Boolean
    active: Boolean!
    DepartmentId: ID!
  }

  type Department {
    id: ID!
    name: String!
    colour: String!
    logo: String
    readonly: Boolean!
    bolo: Boolean!
    units: [Unit]
    calls: [Call]
    callGrades: [CallGrade]
    incidentTypes: [IncidentType]
    unitTypes: [UnitType]
    unitStates: [UnitState]
    officers: [Officer]
    userRanks: [UserRank]
    announcements: [DepartmentAnnouncement]
    documents: [DepartmentDocument]
    createdAt: String!
    updatedAt: String!
  }

  type DepartmentAnnouncement {
    id: ID!
    text: String!
    DepartmentId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type DepartmentDocument {
    id: ID!
    name: String!
    filepath: String!
    DepartmentId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type Unit {
    id: ID!
    updatedAt: String!
    callSign: String!
    unitType: UnitType!
    unitState: UnitState!
    DepartmentId: ID!
    assignedCalls: [Call]
    users: [User]
    UnitTypeId: ID
    UnitStateId: ID
  }

  type UnitCall {
      callId: ID!,
      unitId: ID!
  }

  type UserRole {
      userId: ID!,
      userTypeId: ID!
  }

  type UserRoles {
      userId: ID!,
      userRoles: [UserRole]!
  }

  type UserUnit {
      UserId: ID!,
      UnitId: ID!,
      UserRankId: ID!
  }

  type CitizenMarker {
      CitizenId: ID!
      MarkerId: ID!
  }

  type VehicleMarker {
      VehicleId: ID!
      MarkerId: ID!
  }

  type Map {
      id: String!
      name: String!
      active: Boolean!
      processed: Boolean!
      readonly: Boolean!
  }

  type BoloDetails {
    description: String
    licencePlate: String
    driverDescription: String
    occupants: String
    knownName: String
    weapons: String
    lastLocation: String
    reason: String
  }

  type Bolo {
    id: String!
    boloType: String!
    creator: String!
    details: BoloDetails!
    updatedAt: String!
    DepartmentId: ID!
  }

  type InitialiseFivemResult {
    message: String!
  }

  input BoloDetailsInput {
    description: String
    licencePlate: String
    driverDescription: String
    occupants: String
    knownName: String
    weapons: String
    lastLocation: String
    reason: String
  }

  input UserUnitInput {
      UserId: ID!,
      UnitId: ID!,
      UserRankId: ID!
  }

  type Query {
    initialiseFiveM : InitialiseFivemResult!
    allPreferences: [Preference]
    allConfig: [Config]
    allUserRanks: [UserRank]
    allUnits: [Unit]
    allMaps: [Map]
    usersUnits(steamId: String!): [Unit]
    allUnitTypes: [UnitType]
    allUnitStates: [UnitState]
    allUsers: [User]
    allWhitelisted: [User]
    allCallGrades: [CallGrade]
    allIncidentTypes: [IncidentType]
    allGenders: [Gender]
    allCharges: [Charge]
    allCitizenMarkers: [Marker]
    allVehicleMarkers: [Marker]
    allEthnicities: [Ethnicity]
    allInsuranceStatuses: [InsuranceStatus]
    allLicenceStatuses: [LicenceStatus]
    allLicenceTypes: [LicenceType]
    allVehicleModels: [VehicleModel]
    allCitizenVehicles(CitizenId: ID!): [Vehicle]
    allCitizenWeapons(CitizenId: ID!): [Weapon]
    allCitizenLicences(CitizenId: ID!): [Licence]
    allCitizenWarrants(CitizenId: ID!): [Warrant]
    allCitizensMarkers(id: ID!): [Marker]
    allCitizenOffences(CitizenId: ID!): [Offence]
    allVehicles: [Vehicle]
    allVehiclesMarkers(id: ID!): [Marker]
    allWeaponStatuses: [WeaponStatus]
    allWeaponTypes: [WeaponType]
    allCitizens: [Citizen]
    allOfficers: [Officer]
    allWarrants: [Warrant]
    allWeapons: [Weapon]
    allCallTypes: [CallType]
    allLocations: [Location]
    getUser(id: ID, steamId: String): User
    getPreference(key: String!): Preference
    getCall(id: ID!): Call
    getMap(id: ID!): Map
    getCitizen(id: ID!): Citizen
    getUnit(id: ID!): Unit
    allUserTypes: [UserType]
    allUserUnits: [UserUnit]
    allCalls: [Call]
    allBolos: [Bolo]
    allDepartments: [Department]
    allDepartmentAnnouncements(id: ID): [DepartmentAnnouncement]
    allDepartmentDocuments(id: ID!): [DepartmentDocument]
    getBolo(id: ID!): Bolo
    getDepartment(id: ID!): Department
    allUserLocations(mustHaveLocation: Boolean): [User]
    getUserFromToken: [User]
    getUserCitizens(UserId: ID): [Citizen]
    getUserOfficers(UserId: ID, DepartmentId: ID): [Officer]
    getOffence(id: ID!): Offence
    isFivemOutdated: Boolean
    getCharacter: CharacterResult
    searchVehicles(licencePlate: String, colour: String, vehicleModel: ID): [Vehicle]
    searchCitizens(firstName: String, lastName: String, dateOfBirth: String, id: ID, bool: String): [Citizen]
  }

  type Mutation {
    removeUserFromUnit(
        UserId: ID!,
        UnitId: ID!
    ) : Unit!
    assignUserRoles(
        UserId: ID!
        UserRoles: [UserTypeInput]
    ) : User!
    assignCallToUnit(
      CallId: ID!
      UnitId: ID!
    ) : UnitCall!
    divestCallFromUnit(
      CallId: ID!
      UnitId: ID!
    ) : UnitCall!
    createUserRank(
      name: String!
      DepartmentId: ID!
    ): UserRank!
    createUnit(
      callSign: String!,
      UnitTypeId: ID!,
      UnitStateId: ID!
      DepartmentId: ID!
    ): Unit!
    createUnitType(
      name: String!
      DepartmentId: ID!
    ): UnitType!
    createUnitState(
      name: String!
      colour: String!
      active: Boolean!
      DepartmentId: ID!
    ): UnitState!
    createDepartment(
      name: String!
      colour: String
      logo: String
      readonly: Boolean
      bolo: Boolean
    ): Department!
    updateDepartment(
      id: ID!
      name: String!
      colour: String
      logo: String
      readonly: Boolean
      bolo: Boolean
    ): Department!
    deleteDepartment(
      id: ID!
    ): ID!
    createDepartmentAnnouncement(
      text: String!
      DepartmentId: ID!
    ): DepartmentAnnouncement!
    updateDepartmentAnnouncement(
      id: ID!
      text: String!
      DepartmentId: ID!
    ): DepartmentAnnouncement!
    deleteDepartmentAnnouncement(
      id: ID!
    ): ID!
    createDepartmentDocument(
      name: String!
      filepath: String!
      DepartmentId: ID!
    ): DepartmentDocument!
    updateDepartmentDocument(
      id: ID!
      name: String!
      filepath: String!
      DepartmentId: ID!
    ): DepartmentDocument!
    deleteDepartmentDocument(
      id: ID!
    ): ID!
    createCall(
      callerInfo: String,
      callGrade: CallGradeInput!,
      callType: CallTypeInput!,
      callLocations: [LocationInput],
      callIncidents: [IncidentTypeInput],
      callDescriptions: [CallDescriptionInput]
      DepartmentId: ID!,
      markerX: Float
      markerY: Float
    ): Call!
    updateCall(
      id: ID!,
      callerInfo: String,
      callGrade: CallGradeInput,
      callType: CallTypeInput,
      callLocations: [LocationInput],
      callIncidents: [IncidentTypeInput],
      callDescriptions: [CallDescriptionInput],
      DepartmentId: ID!,
      markerX: Float,
      markerY: Float
    ): Call!
    updatePreference(
      key: String!,
      value: String!
    ): Preference!
    updateCallMarker(
      id: ID!,
      markerX: Float,
      markerY: Float
    ): Call!
    updateUserAssignments(
        userId: ID!,
        assignments: [UserUnitInput]
    ): [UserUnit]
    updateCallGrade(
      id: ID!,
      name: String!
      DepartmentId: ID!
    ): CallGrade!
    updateCallType(
      id: ID!,
      name: String!
      DepartmentId: ID!
    ): CallType!
    updateLocation(
      id: ID!,
      name: String!
    ): Location!
    updateUnitType(
      id: ID!,
      name: String!
      DepartmentId: ID!
    ): UnitType!
    updateUnitState(
      id: ID!,
      name: String!
      colour: String!
      active: Boolean!
      DepartmentId: ID!
    ): UnitState!
    updateIncidentType(
      id: ID!,
      name: String!
      DepartmentId: ID!
    ): IncidentType!
    updateUserRank(
      id: ID!,
      name: String!,
      position: String
      DepartmentId: ID!
    ): [UserRank]!
    updateUser(
      id: ID!
      userName: String!
      steamId: String!
      avatarUrl: String!
      alias: String
    ): User!
    createIncidentType(
      name: String!
      DepartmentId: ID!
    ): IncidentType!
    createGender(
      name: String!
    ): Gender!
    deleteGender(
      id: ID!
    ): ID!
    updateGender(
      id: ID!,
      name: String!
    ): Gender!
    createCharge(
      name: String!
    ): Charge!
    deleteCharge(
      id: ID!
    ): ID!
    updateCharge(
      id: ID!,
      name: String!
    ): Charge!
    createCitizenMarker(
      name: String!
    ): Marker!
    createVehicleMarker(
      name: String!
    ): Marker!
    deleteCitizenMarker(
      id: ID!
    ): ID!
    deleteVehicleMarker(
      id: ID!
    ): ID!
    updateCitizenMarker(
      id: ID!,
      name: String!
    ): Marker!
    updateVehicleMarker(
      id: ID!,
      name: String!
    ): Marker!
    createEthnicity(
      name: String!
    ): Ethnicity!
    createBolo(
      boloType: String!
      details: BoloDetailsInput!
      DepartmentId: ID!
    ): Bolo!
    deleteBolo(
      id: ID!
    ): ID!
    updateBolo(
      id: ID!,
      boloType: String!
      details: BoloDetailsInput!
      DepartmentId: ID!
    ): Bolo!
    deleteEthnicity(
      id: ID!
    ): ID!
    updateEthnicity(
      id: ID!,
      name: String!
    ): Ethnicity!
    createInsuranceStatus(
      name: String!
    ): InsuranceStatus!
    deleteInsuranceStatus(
      id: ID!
    ): ID!
    updateInsuranceStatus(
      id: ID!,
      name: String!
    ): InsuranceStatus!
    createLicenceStatus(
      name: String!
    ): LicenceStatus!
    deleteLicenceStatus(
      id: ID!
    ): ID!
    updateLicenceStatus(
      id: ID!,
      name: String!
    ): LicenceStatus!
    createLicenceType(
      name: String!
    ): LicenceType!
    deleteLicenceType(
      id: ID!
    ): ID!
    updateLicenceType(
      id: ID!,
      name: String!
    ): LicenceType!
    createLicence(
      CitizenId: ID!
      LicenceTypeId: ID!
      LicenceStatusId: ID!
    ): Licence!
    deleteLicence(
      id: ID!
      CitizenId: ID!
    ): ID!
    updateLicence(
      id: ID!,
      CitizenId: ID!
      LicenceTypeId: ID!
      LicenceStatusId: ID!
    ): Licence!
    createOffence(
      date: String
      time: String
      location: String
      charges: [ChargeInput]
      CitizenId: ID!
    ): Offence!
    deleteOffence(
      id: ID!
      CitizenId: ID!
    ): ID!
    updateOffence(
      id: ID!,
      date: String
      time: String
      location: String
      charges: [ChargeInput]
      CitizenId: ID!
    ): Offence!
    createArrest(
      date: String
      time: String
      charges: [ChargeInput]
      OffenceId: ID!
      OfficerId: ID!
      CitizenId: ID!
    ): Arrest!
    deleteArrest(
      id: ID!
      CitizenId: ID!
    ): ID!
    updateArrest(
      id: ID!,
      date: String
      time: String
      charges: [ChargeInput]
      OffenceId: ID
      OfficerId: ID
      CitizenId: ID!
    ): Arrest!
    createVehicleModel(
      name: String!
    ): VehicleModel!
    deleteVehicleModel(
      id: ID!
    ): ID!
    updateVehicleModel(
      id: ID!,
      name: String!
    ): VehicleModel!
    createVehicle(
      licencePlate: String
      colour: String
      CitizenId: ID!
      VehicleModelId: ID
      InsuranceStatusId: ID
    ): Vehicle!
    deleteVehicle(
      id: ID!
      CitizenId: ID!
    ): ID!
    updateVehicle(
      id: ID!,
      licencePlate: String
      colour: String
      CitizenId: ID!
      VehicleModelId: ID
      InsuranceStatusId: ID
    ): Vehicle!
    attachMarkerToCitizen(
      CitizenId: ID!
      MarkerId: ID!
    ): Marker!
    detachMarkerFromCitizen(
      CitizenId: ID!
      MarkerId: ID!
    ): ID
    attachMarkerToVehicle(
      VehicleId: ID!
      MarkerId: ID!
    ): Marker!
    detachMarkerFromVehicle(
      VehicleId: ID!
      MarkerId: ID!
    ): ID
    createWeapon(
      CitizenId: ID!
      WeaponTypeId: ID!
      WeaponStatusId: ID!
    ): Weapon!
    deleteWeapon(
      id: ID!
      CitizenId: ID!
    ): ID!
    updateWeapon(
      id: ID!,
      CitizenId: ID!
      WeaponTypeId: ID!
      WeaponStatusId: ID!
    ): Weapon!
    createTicket(
      date: String
      time: String
      location: String
      points: String
      fine: String
      notes: String
      OfficerId: ID!
      OffenceId: ID!
      CitizenId: ID!
    ): Ticket!
    deleteTicket(
      id: ID!
      CitizenId: ID!
    ): ID!
    updateTicket(
      id: ID!,
      date: String
      time: String
      location: String
      points: String
      fine: String
      notes: String
      OfficerId: ID!
      OffenceId: ID!
      CitizenId: ID!
    ): Ticket!
    createWeaponStatus(
      name: String!
    ): WeaponStatus!
    deleteWeaponStatus(
      id: ID!
    ): ID!
    updateWeaponStatus(
      id: ID!,
      name: String!
    ): WeaponStatus!
    createWeaponType(
      name: String!
    ): WeaponType!
    deleteWeaponType(
      id: ID!
    ): ID!
    updateWeaponType(
      id: ID!,
      name: String!
    ): WeaponType!
    createCitizen(
        firstName: String
        lastName: String
        address: String
        postalCode: String
        dateOfBirth: String
        weight: String
        height: String
        hair: String
        eyes: String
        UserId: ID!
        GenderId: ID
        EthnicityId: ID
    ): Citizen!
    updateCitizen(
        id: ID!
        firstName: String
        lastName: String
        address: String
        postalCode: String
        dateOfBirth: String
        weight: String
        height: String
        hair: String
        eyes: String
        UserId: ID
        GenderId: ID
        EthnicityId: ID
    ): Citizen!
    deleteCitizen(
      id: ID!
    ): ID!
    createOfficer(
        firstName: String
        lastName: String
        address: String
        UserId: ID!
        DepartmentId: ID!
    ): Officer!
    updateOfficer(
        id: ID!
        firstName: String
        lastName: String
    ): Officer!
    deleteOfficer(
      id: ID!
    ): ID!
    createWarrant(
        validFrom: String
        validTo: String
        details: String!
        CitizenId: ID!
    ): Warrant!
    updateWarrant(
        id: ID!
        validFrom: String
        validTo: String
        details: String!
        CitizenId: ID!
    ): Warrant!
    deleteWarrant(
        id: ID!
        CitizenId: ID!
    ): ID!
    createCallGrade(
      name: String!
      DepartmentId: ID!
    ): CallGrade!
    createCallType(
      name: String!
      DepartmentId: ID!
    ): CallType!
    createLocation(
      name: String!
    ): Location!
    createCallDescription(
      text: String!
    ): CallDescription,
    updateUnit(
      id: ID!
      callSign: String!,
      UnitTypeId: ID!,
      UnitStateId: ID!
      DepartmentId: ID!
    ): Unit
    deleteCall(
      id: ID!
    ): ID!
    deleteAllCalls(
      DepartmentId: ID!
    ): Boolean
    deleteCallGrade(
      id: ID!
    ): ID!
    deleteCallType(
      id: ID!
    ): ID!
    deleteLocation(
      id: ID!
    ): ID!
    deleteUnitType(
      id: ID!
    ): ID!
    deleteUnitState(
      id: ID!
    ): ID!
    deleteIncidentType(
      id: ID!
    ): ID!
    deleteUserRank(
      id: ID!
    ): ID!
    deleteUnit(
      id: ID!
    ): ID!
    deleteUser(
      id: ID
      userName: String
    ): ID!
    signup(
      email: String!,
      password: String!,
      username: String!
    ) : User
    login(
      username: String!
      password: String!
    ): User
    authenticateUser(
      uuid: String!
    ): Token!
    updateUserLocations(
        steamId: String!
        x: String!
        y: String!
    ): [User]
    setCharacter(
        type: CharacterType!
        id: ID!
        active: Boolean!
    ): [CharacterResult]
    startPanic(
      steamId: String!
    ): Call!
    createCitizenCall(
      steamId: String!,
      location: String!,
      callerInfo: String!,
      notes: String!,
      DepartmentId: ID!
    ): Call!
    createMap(
      id: String!,
      name: String!
    ): Map!
    updateMap(
      id: String!,
      name: String!,
      active: Boolean!
    ): Map!
    deleteMap(
      id: ID!
    ): ID!
  }

  type Subscription {
    callAdded: Call,
    callUpdated: Call,
    callDeleted: ID!,
    allCallsDeleted: Boolean,
    callGradeAdded: CallGrade,
    callGradeDeleted: ID,
    callGradeUpdated: CallGrade,
    callTypeAdded: CallType,
    callTypeDeleted: ID,
    callTypeUpdated: CallType,
    locationAdded: Location,
    locationDeleted: ID,
    locationUpdated: Location,
    incidentTypeAdded: IncidentType,
    incidentTypeDeleted: ID,
    incidentTypeUpdated: IncidentType,
    userRankAdded: UserRank,
    userRankDeleted: ID,
    userRankUpdated: [UserRank],
    userUnitToggle: UserUnit,
    userUnitAssigned: [UserUnit],
    userDeleted: ID,
    unitTypeAdded: UnitType,
    unitTypeDeleted: ID,
    unitTypeUpdated: UnitType,
    unitStateAdded: UnitState,
    unitStateDeleted: ID,
    unitStateUpdated: UnitState,
    unitCallToggle: UnitCall,
    unitAdded: Unit,
    unitUpdated: Unit,
    unitDeleted: ID,
    userLocationChanged: User,
    bolosSubscription: ID,
    departmentAdded: Department,
    departmentUpdated: Department,
    departmentDeleted: ID,
    departmentAnnouncementAdded: DepartmentAnnouncement,
    departmentAnnouncementUpdated: DepartmentAnnouncement,
    departmentAnnouncementDeleted: ID,
    departmentDocumentAdded: DepartmentDocument,
    departmentDocumentUpdated: DepartmentDocument,
    departmentDocumentDeleted: ID,
    ethnicityAdded: Ethnicity,
    ethnicityDeleted: ID,
    ethnicityUpdated: Ethnicity,
    genderAdded: Gender,
    genderDeleted: ID,
    genderUpdated: Gender,
    vehicleModelAdded: VehicleModel,
    vehicleModelUpdated: VehicleModel,
    vehicleModelDeleted: ID,
    weaponTypeAdded: WeaponType,
    weaponTypeUpdated: WeaponType,
    weaponTypeDeleted: ID,
    weaponStatusAdded: WeaponStatus,
    weaponStatusUpdated: WeaponStatus,
    weaponStatusDeleted: ID,
    insuranceStatusAdded: InsuranceStatus,
    insuranceStatusUpdated: InsuranceStatus,
    insuranceStatusDeleted: ID,
    licenceStatusAdded: LicenceStatus,
    licenceStatusUpdated: LicenceStatus,
    licenceStatusDeleted: ID,
    licenceTypeAdded: LicenceType,
    licenceTypeUpdated: LicenceType,
    licenceTypeDeleted: ID,
    chargeAdded: Charge,
    chargeUpdated: Charge,
    chargeDeleted: ID,
    warrantAdded: Warrant,
    warrantUpdated: Warrant,
    warrantDeleted: ID,
    citizenAdded: Citizen,
    citizenUpdated: Citizen,
    citizenDeleted: ID,
    officerAdded: Officer,
    officerUpdated: Officer,
    officerDeleted: ID,
    characterActiveUpdated: [CharacterResult],
    vehicleAdded: Vehicle,
    vehicleUpdated: Vehicle,
    vehicleDeleted: ID,
    weaponAdded: Weapon,
    weaponUpdated: Weapon,
    weaponDeleted: ID,
    offenceAdded: Offence,
    offenceUpdated: Offence,
    offenceDeleted: ID,
    ticketAdded: Ticket,
    ticketUpdated: Ticket,
    ticketDeleted: Ticket,
    arrestAdded: Arrest,
    arrestUpdated: Arrest,
    arrestDeleted: Arrest,
    licenceAdded: Licence,
    licenceUpdated: Licence,
    licenceDeleted: ID,
    userUpdated: User,
    markerAttachedToCitizen: Marker,
    markerDetachedFromCitizen: ID,
    markerAttachedToVehicle: Marker,
    markerDetachedFromVehicle: ID,
    citizenMarkerAdded: Marker,
    citizenMarkerUpdated: Marker,
    vehicleMarkerAdded: Marker,
    vehicleMarkerUpdated: Marker,
    citizenMarkerDeleted: ID
    vehicleMarkerDeleted: ID
  }
`;
