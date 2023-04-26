'use strict';

import { Sequelize, DataTypes } from 'sequelize';

import Arrest from './Arrest.js';
import Bolo from './Bolo.js';
import Call from './Call.js';
import CallDescription from './CallDescription.js';
import CallGrade from './CallGrade.js';
import CallType from './CallType.js';
import CallUnit from './CallUnit.js';
import Charge from './Charge.js';
import Citizen from './Citizen.js';
import Department from './Department.js';
import DepartmentAnnouncement from './DepartmentAnnouncement.js';
import DepartmentDocument from './DepartmentDocuments.js';
import Ethnicity from './Ethnicity.js';
import Gender from './Gender.js';
import IncidentType from './IncidentType.js';
import InsuranceStatus from './InsuranceStatus.js';
import Licence from './Licence.js';
import LicenceStatus from './LicenceStatus.js';
import LicenceType from './LicenceType.js';
import Location from './Location.js';
import Map from './Map.js';
import Marker from './Marker.js';
import Offence from './Offence.js';
import Officer from './Officer.js';
import Preference from './Preference.js';
import Ticket from './Ticket.js';
import Unit from './Unit.js';
import UnitState from './UnitState.js';
import UnitType from './UnitType.js';
import User from './User.js';
import UserRank from './UserRank.js';
import UserRole from './UserRole.js';
import UserType from './UserType.js';
import UserUnit from './UserUnit.js';
import Vehicle from './Vehicle.js';
import VehicleModel from './VehicleModel.js';
import Warrant from './Warrant.js';
import Weapon from './Weapon.js';
import WeaponStatus from './WeaponStatus.js';
import WeaponType from './WeaponType.js';

const db = {};

const sequelize = new Sequelize(
    'cadvanced',
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: 'db',
        dialect: 'postgres',
        schema: 'cadvanced'
    }
);

const models = {
    Arrest,
    Bolo,
    Call,
    CallDescription,
    CallGrade,
    CallType,
    CallUnit,
    Charge,
    Citizen,
    Department,
    DepartmentAnnouncement,
    DepartmentDocument,
    Ethnicity,
    Gender,
    IncidentType,
    InsuranceStatus,
    Licence,
    LicenceStatus,
    LicenceType,
    Location,
    Map,
    Marker,
    Offence,
    Officer,
    Preference,
    Ticket,
    Unit,
    UnitState,
    UnitType,
    User,
    UserRank,
    UserRole,
    UserType,
    UserUnit,
    Vehicle,
    VehicleModel,
    Warrant,
    Weapon,
    WeaponStatus,
    WeaponType
};

Object.keys(models).forEach(model => {
    const modelDefinition = models[model](sequelize, DataTypes);
    db[model] = modelDefinition;
});

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
