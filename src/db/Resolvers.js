import Sequelize from 'sequelize';
import { PubSub } from 'apollo-server';
import uuidv4 from 'uuid/v4.js';
import moment from 'moment';

import Constants from './Constants.js';
import {
    userHasRoles,
    userHasCitizen,
    createToken,
    checkToken
} from '../helpers/Authorization.js';
import {
    makeUpdateRequest,
    fivemLatestRelease,
    fivemResourceVersion
} from '../helpers/httpRequester.js';
import { checkConnection, getCharacter, hasFiveM } from '../helpers/Misc.js';
import CadState from '../helpers/State.js';

const pubsub = new PubSub();
const Op = Sequelize.Op;

const fivemUpdateUser = async (id, ctx) => {
    const user = await getUser(null, { id }, ctx);
    makeUpdateRequest({
        object: 'user',
        payload: {
            steamId: user.steamId
        }
    });
};

const getUser = (parent, args, { Models }) => {
    if (args.id && args.steamId)
        return Promise.reject(new Error('Must pass ID or Steam ID'));
    if (!args.id && !args.steamId)
        return Promise.reject(new Error('Must pass ID or Steam ID'));
    const where = ['id', 'steamId'].map(prop =>
        args.hasOwnProperty(prop) && args[prop] ? { [prop]: args[prop] } : []
    );
    return Models.User.findOne({
        where: {
            [Op.or]: where
        }
    });
};

const createCallGrade = (parent, args, { Models, user }) =>
    userHasRoles(['CALL_MGR'], user)
        ? Models.CallGrade.create(args).then(callGrade => {
              pubsub.publish(Constants.subscriptions.CALL_GRADE_ADDED, {
                  callGradeAdded: callGrade
              });
              makeUpdateRequest({
                  object: 'call_grades'
              });
              return callGrade;
          })
        : null;

const createCallType = (parent, args, { Models, user }) =>
    userHasRoles(['CALL_MGR'], user)
        ? Models.CallType.create(args).then(callType => {
              pubsub.publish(Constants.subscriptions.CALL_TYPE_ADDED, {
                  callTypeAdded: callType
              });
              makeUpdateRequest({
                  object: 'call_types'
              });
              return callType;
          })
        : null;

const createIncidentType = (parent, args, { Models, user }) =>
    userHasRoles(['CALL_MGR'], user)
        ? Models.IncidentType.create(args).then(incidentType => {
              pubsub.publish(Constants.subscriptions.INCIDENT_TYPE_ADDED, {
                  incidentTypeAdded: incidentType
              });
              makeUpdateRequest({
                  object: 'call_incidents'
              });
              makeUpdateRequest({
                  object: 'calls'
              });
              return incidentType;
          })
        : null;

const createUnitState = (parent, args, { Models, user }) =>
    userHasRoles(['UNIT_MGR'], user)
        ? Models.UnitState.create(args).then(newUnitState => {
              pubsub.publish(Constants.subscriptions.UNIT_STATE_ADDED, {
                  unitStateAdded: newUnitState
              });
              // Tell FiveM to repopulate unit states
              makeUpdateRequest({
                  object: 'unit_states'
              });
              return newUnitState;
          })
        : null;

const populateNewDeptSpecials = async (DepartmentId, parent, args, ctx) => {
    const panic = {
        name: 'Officer emergency',
        code: 'PANIC',
        readonly: 't',
        DepartmentId
    };
    const citizen = {
        name: 'Citizen call',
        code: 'CITIZEN_CALL',
        readonly: 't',
        DepartmentId
    };
    const panic_incident = Object.assign(panic, { colour: 'e20000' });
    await createCallGrade(parent, panic, ctx);
    await createCallGrade(parent, citizen, ctx);
    await createCallType(parent, panic, ctx);
    await createCallType(parent, citizen, ctx);
    await createIncidentType(parent, panic, ctx);
    await createIncidentType(parent, citizen, ctx);
    await createUnitState(parent, panic_incident, ctx);
};

const createCall = (args, { Models, user }) => {
    const myCall = Models.Call.build(args);
    myCall.setCallType(args.callType.id, { save: false });
    myCall.setCallGrade(args.callGrade.id, { save: false });
    return myCall.save().then(saved => {
        const setters = [
            saved.setLocations(args.callLocations.map(loc => loc.id)),
            saved.setIncidentTypes(args.callIncidents.map(inc => inc.id))
        ];
        args.callDescriptions.forEach(desc => {
            // Descriptions arrive with a temporary ID
            desc.id = null;
            return Models.CallDescription.create(desc).then(d => {
                return setters.push(d.setCall(saved.id));
            });
        });
        Promise.all(setters).then(() => {
            makeUpdateRequest({
                object: 'call',
                payload: {
                    callId: saved.id
                }
            });
            makeUpdateRequest({
                object: 'units'
            });
            pubsub.publish(Constants.subscriptions.CALL_ADDED, {
                callAdded: saved
            });
        });
        return saved;
    });
};

const updatePreference = (parent, { key, value }, { Models, user }) => {
    if (userHasRoles(['PREF_MGR'], user)) {
        return Models.Preference.update(
            { value },
            { returning: ['*'], where: { key } }
        )
            .then(([rowsUpdated, [up]]) => {
                CadState.setPreference(key, value);
                makeUpdateRequest({
                    object: 'preference',
                    payload: { key, value }
                });
                return {
                    id: up.id,
                    key: up.key,
                    value: up.value,
                    name: up.name,
                    desc: up.desc,
                    type: up.type
                };
            })
            .catch(error => console.log(error));
    } else {
        return null;
    }
};

const updateUserAssignments = (
    parent,
    { userId, assignments, skipAuth },
    { Models, user, instanceVars, hasFivemToken }
) => {
    if (hasFivemToken || userHasRoles(['DISPATCHER'], user) || skipAuth) {
        return Models.UserUnit.destroy({
            where: { UserId: userId }
        }).then(() => {
            if (!assignments || assignments.length === 0) {
                pubsub.publish(Constants.subscriptions.USER_UNIT_ASSIGNED, {
                    userUnitAssigned: []
                });
                // Tell FiveM to repopulate all user / unit assignments
                makeUpdateRequest({
                    object: 'user_units'
                });
                return Promise.resolve([]);
            } else {
                return Models.User.findAll({
                    include: [
                        {
                            model: Models.Unit,
                            as: 'units',
                            required: true
                        }
                    ]
                }).then(assignedUsers => {
                    if (
                        assignedUsers.length >=
                        parseInt(instanceVars.CV_MAX_ASSIGNED)
                    ) {
                        return Promise.reject(
                            new Error(
                                'You have reached your maximum number of assignable players'
                            )
                        );
                    } else {
                        return Models.UserUnit.bulkCreate(assignments).then(
                            () => {
                                return Models.UserUnit.findAll().then(
                                    userUnits => {
                                        pubsub.publish(
                                            Constants.subscriptions
                                                .USER_UNIT_ASSIGNED,
                                            {
                                                userUnitAssigned: userUnits
                                            }
                                        );
                                        // Tell FiveM to repopulate all user / unit assignments
                                        makeUpdateRequest({
                                            object: 'user_units'
                                        });
                                        return userUnits;
                                    }
                                );
                            }
                        );
                    }
                });
            }
        });
    } else {
        return null;
    }
};

export default {
    Query: {
        initialiseFiveM: async (parent, args, context) => {
            if (userHasRoles(['PREF_MGR'], context.user)) {
                // First check if we can contact the FiveM server
                return checkConnection(context)
                    .then(() => {
                        // We can, so update it with our details
                        const token = uuidv4();
                        updatePreference(
                            parent,
                            {
                                key: 'api_token',
                                value: token
                            },
                            context
                        );
                        makeUpdateRequest({
                            object: 'cad_config',
                            payload: {
                                url: process.env.CLIENT_HOST,
                                key: token
                            }
                        });
                        return Promise.resolve({ message: 'OK' });
                    })
                    .catch(err => {
                        // We can't
                        return Promise.resolve({ message: err.message });
                    });
            }
        },
        allPreferences: (parent, args, { Models, user }) =>
            Models.Preference.findAll({ order: ['id'] }),
        // Return arbitrary config keypairs
        allConfig: () =>
            Promise.resolve([
                {
                    key: 'uid',
                    value: 'cadvanced'
                }
            ]),
        allUserRanks: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER', 'OFFICER_MGR'], user) || hasFivemToken
                ? Models.UserRank.findAll()
                : null,
        allUnits: (parent, args, { Models, user, hasFivemToken }) => {
            return userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Unit.findAll()
                : [];
        },
        allBolos: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Bolo.findAll()
                : [],
        allDepartments: (parent, args, { Models }) =>
            Models.Department.findAll({
                order: [['id', 'ASC']]
            }),
        allDepartmentDocuments: (parent, { id }, { Models }) =>
            Models.DepartmentDocument.findAll({ DepartmentId: id }),
        allDepartmentAnnouncements: (parent, { id }, { Models }) => {
            const where = id ? { where: { DepartmentId: id } } : {};
            return Models.DepartmentAnnouncement.findAll(where);
        },
        allMaps: (parent, args, { Models, user }) => Models.Map.findAll(),
        allWhitelisted: (parent, args, { Models, hasFivemToken }) => {
            return hasFivemToken
                ? Models.User.findAll({
                      include: [
                          {
                              model: Models.UserType,
                              where: { code: 'PLAYER' },
                              as: 'roles'
                          }
                      ]
                  })
                : [];
        },
        usersUnits: (parent, { steamId }, { Models, user }) => {
            if (!steamId)
                return Promise.reject(new Error('Must pass Steam ID'));
            return Models.Unit.findAll({
                include: [
                    {
                        model: Models.User,
                        where: { steamId },
                        as: 'users',
                        // We don't actually need the users, since
                        // we are only returning for a single user
                        attributes: []
                    }
                ]
            });
        },
        allUsers: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER', 'OFFICER_MGR', 'USER_MGR'], user) ||
            hasFivemToken
                ? Models.User.findAll({})
                : null,
        getUser: (...props) => getUser(...props),
        getUserCitizens: (parent, { UserId }, { Models, user }) => {
            if (userHasRoles(['RP_CITIZEN'], user) && UserId == user.id) {
                return Models.Citizen.findAll({
                    where: { UserId },
                    order: [['id', 'ASC']]
                });
            } else {
                return null;
            }
        },
        getUserOfficers: (
            parent,
            { UserId, DepartmentId },
            { Models, user }
        ) => {
            if (userHasRoles(['RP_OFFICER'], user) && UserId == user.id) {
                return Models.Officer.findAll({
                    where: { UserId, DepartmentId },
                    order: [['id', 'ASC']]
                });
            } else {
                return null;
            }
        },
        getCharacter: (parent, args, { Models, user }) => {
            return getCharacter(user);
        },
        allCalls: (parent, args, { Models, user, hasFivemToken }) => {
            return userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Call.findAll()
                : [];
        },
        allUnitTypes: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER', 'UNIT_MGR'], user)
                ? Models.UnitType.findAll()
                : null,
        allUnitStates: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER', 'UNIT_MGR'], user)
                ? Models.UnitState.findAll()
                : null,
        allCallGrades: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER', 'CALL_MGR'], user) || hasFivemToken
                ? Models.CallGrade.findAll()
                : null,
        allIncidentTypes: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER', 'CALL_MGR'], user) || hasFivemToken
                ? Models.IncidentType.findAll()
                : null,
        allGenders: (parent, args, { Models, user }) => Models.Gender.findAll(),
        allCharges: (parent, args, { Models, user }) => Models.Charge.findAll(),
        allCitizenMarkers: (parent, _, { Models }) => {
            return Models.Marker.findAll({ where: { type: 'citizen' } });
        },
        allVehicleMarkers: (parent, _, { Models }) => {
            return Models.Marker.findAll({ where: { type: 'vehicle' } });
        },
        allInsuranceStatuses: (parent, args, { Models, user }) =>
            Models.InsuranceStatus.findAll(),
        allLicenceStatuses: (parent, args, { Models, user }) =>
            Models.LicenceStatus.findAll(),
        allLicenceTypes: (parent, args, { Models, user }) =>
            Models.LicenceType.findAll(),
        allVehicleModels: (parent, args, { Models, user }) =>
            Models.VehicleModel.findAll(),
        allVehicles: (parent, args, { Models, user }) =>
            Models.Vehicle.findAll(),
        allVehiclesMarkers: (parent, { id }, { Models, user }) =>
            Models.Vehicle.findOne({ where: { id } }).then(veh =>
                veh.getMarkers()
            ),
        allCitizenVehicles: (parent, { CitizenId }, { Models, user }) =>
            Models.Vehicle.findAll({ where: { CitizenId }, order: ['id'] }),
        allCitizenWeapons: (parent, { CitizenId }, { Models, user }) =>
            Models.Weapon.findAll({ where: { CitizenId }, order: ['id'] }),
        allCitizenLicences: (parent, { CitizenId }, { Models, user }) =>
            Models.Licence.findAll({ where: { CitizenId }, order: ['id'] }),
        allCitizenWarrants: (parent, { CitizenId }, { Models, user }) =>
            Models.Warrant.findAll({ where: { CitizenId }, order: ['id'] }),
        allCitizensMarkers: (parent, { id }, { Models, user }) =>
            Models.Citizen.findOne({ where: { id } }).then(cit =>
                cit.getMarkers()
            ),
        allCitizenOffences: (parent, { CitizenId }, { Models, user }) =>
            Models.Offence.findAll({ where: { CitizenId }, order: ['id'] }),
        allWeaponStatuses: (parent, args, { Models, user }) =>
            Models.WeaponStatus.findAll(),
        allWeaponTypes: (parent, args, { Models, user }) =>
            Models.WeaponType.findAll(),
        allCitizens: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user)
                ? Models.Citizen.findAll({
                      order: [['id', 'DESC']]
                  })
                : null,
        allOfficers: (parent, args, { Models, user }) =>
            Models.Officer.findAll(),
        allWarrants: (parent, args, { Models, user }) =>
            Models.Warrant.findAll(),
        allWeapons: (parent, args, { Models, user }) => Models.Weapon.findAll(),
        allEthnicities: (parent, args, { Models, user }) =>
            Models.Ethnicity.findAll(),
        allLocations: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Location.findAll()
                : null,
        allCallTypes: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER', 'CALL_MGR'], user) || hasFivemToken
                ? Models.CallType.findAll()
                : null,
        getPreference: (parent, { key }, { Models, user, hasFivemToken }) =>
            hasFivemToken
                ? Models.Preference.findOne({ where: { key } })
                : null,
        getCall: (parent, { id }, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.Call.findOne({ where: { id } })
                : null,
        getBolo: (parent, { id }, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.Bolo.findOne({ where: { id } })
                : null,
        getMap: (parent, where, { Models }) => Models.Map.findOne({ where }),
        getDepartment: (parent, where, { Models }) =>
            Models.Department.findOne({ where }),
        getCitizen: (parent, { id }, { Models, user }) =>
            Models.Citizen.findOne({ where: { id } }),
        getOffence: (parent, { id }, { Models, user }) =>
            Models.Offence.findOne({ where: { id } }),
        getUnit: (parent, { id }, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Unit.findOne({ where: { id } })
                : null,
        allUserTypes: (parent, args, { Models, user }) =>
            userHasRoles(['USER_MGR'], user)
                ? Models.UserType.findAll({ order: [['name', 'ASC']] })
                : null,
        allUserUnits: (parent, args, { Models, user }) =>
            Models.UserUnit.findAll(),
        allUserLocations: (parent, { mustHaveLocation }, { Models, user }) => {
            const where = !mustHaveLocation
                ? {}
                : {
                      x: {
                          [Op.ne]: null
                      },
                      y: {
                          [Op.ne]: null
                      },
                      updatedAt: {
                          [Op.gte]: moment().subtract(10, 'seconds').toDate()
                      }
                  };
            return userHasRoles(['DISPATCHER'], user)
                ? Models.User.findAll({
                      where,
                      include: [
                          {
                              model: Models.Unit,
                              as: 'units'
                          },
                          {
                              model: Models.Officer,
                              where: { active: 't' },
                              as: 'Officer',
                              required: true
                          }
                      ]
                  })
                : null;
        },
        getUserFromToken: (parent, { token }, { Models }) => {
            return checkToken(token).then(decoded => {
                return Models.User.findOne({
                    include: [
                        {
                            model: Models.UserType,
                            as: 'roles'
                        }
                    ],
                    where: {
                        id: decoded.id
                    }
                });
            });
        },
        isFivemOutdated: () => {
            // TODO: We should log the outcome of this check, if we repeatedly
            // receive problematic responses, we need to act on them
            const p1 = fivemLatestRelease();
            const p2 = fivemResourceVersion();
            return Promise.all([p1, p2])
                .then(response => {
                    const [github, fivem] = response;
                    // We got a response from both Github and the FiveM server
                    // so we can try and compare versions
                    let githubV = 0;
                    let fivemV = 0;
                    if (
                        github.hasOwnProperty('data') &&
                        github.data &&
                        github.data.tag_name
                    ) {
                        githubV = github.data.tag_name.replace(/\D/g, '');
                    } else {
                        // We got a success response, but not containing
                        // a version number
                        // TODO: What to return here?
                        return;
                    }
                    if (
                        fivem.hasOwnProperty('data') &&
                        fivem.data &&
                        fivem.data.version
                    ) {
                        fivemV = fivem.data.version.replace(/\D/g, '');
                    } else {
                        // We got a success response, but not containing
                        // a version number
                        return;
                    }
                    return fivemV < githubV ? true : false;
                })
                .catch(error => {
                    // Check if we got an error from the FiveM resource
                    if (
                        error.config.hasOwnProperty('url') &&
                        error.config.url.match(/\/cadvanced\/version/)
                    ) {
                        // The error did come from the resource, check it
                        // it's actually up by pinging an endpoint we know
                        // exists
                        return makeUpdateRequest({})
                            .then(() => {
                                // The resource is up, so it is out of date
                                return true;
                            })
                            .catch(() => {
                                // The resource is not up
                                return;
                            });
                    } else {
                        // The error did not come from fivem, must be a problem
                        // with Github
                        return;
                    }
                });
        },
        searchVehicles: (parent, { search }, { Models, user }) =>
            userHasRoles(['RP_OFFICER'], user)
                ? Models.Vehicle.findAll({
                      where: {
                          licencePlate: {
                              [Op.like]: '%' + search + '%'
                          }
                      }
                  })
                : null,
        searchCitizens: (parent, args, { Models, user, hasFivemToken }) => {
            const where = ['firstName', 'lastName', 'dateOfBirth'].map(prop => {
                if (args[prop] && args[prop].length > 0) {
                    return {
                        [prop]: {
                            [Op.iLike]: '%' + args[prop] + '%'
                        }
                    };
                }
            });
            if (args.id && args.id.length > 0) {
                where.push({ id: args.id });
            }
            let params = {};
            if (args.bool && args.bool == 'or') {
                params = {
                    [Op.or]: where
                };
            } else {
                params = {
                    [Op.and]: where
                };
            }
            return userHasRoles(['RP_OFFICER', 'CITIZEN_MGR'], user) ||
                hasFivemToken
                ? Models.Citizen.findAll({ where: params })
                : null;
        },
        searchVehicles: (parent, args, { Models, user, hasFivemToken }) => {
            const where = ['licencePlate', 'colour'].map(prop => {
                if (args[prop] && args[prop].length > 0 && args[prop] !== 0) {
                    return {
                        [prop]: {
                            [Op.iLike]: '%' + args[prop] + '%'
                        }
                    };
                }
            });
            if (args.vehicleModel && args.vehicleModel !== 0) {
                where.push({ VehicleModelId: args.vehicleModel });
            }
            return hasFivemToken || userHasRoles(['RP_OFFICER'], user)
                ? Models.Vehicle.findAll({
                      where: {
                          [Op.and]: where
                      },
                      order: [['licencePlate', 'ASC']]
                  })
                : null;
        }
    },
    Mutation: {
        attachMarkerToCitizen: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (
                hasFivemToken ||
                userHasRoles(['CITIZEN_MGR', 'OWN_CITIZENS_RECORD'], user)
            ) {
                return Models.Marker.findOne({
                    where: { id: args.MarkerId }
                }).then(attaching => {
                    return Models.Citizen.findOne({
                        where: { id: args.CitizenId }
                    }).then(cit => {
                        return cit.getMarkers().then(markers => {
                            const toSet = [...markers, attaching];
                            return cit.setMarkers(toSet).then(() => {
                                pubsub.publish(
                                    Constants.subscriptions
                                        .MARKER_ATTACHED_TO_CITIZEN,
                                    {
                                        markerAttachedToCitizen: attaching
                                    }
                                );
                                return attaching;
                            });
                        });
                    });
                });
            } else {
                return null;
            }
        },
        detachMarkerFromCitizen: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (
                hasFivemToken ||
                userHasRoles(['CITIZEN_MGR', 'OWN_CITIZENS_RECORD'], user)
            ) {
                return Models.Citizen.findOne({
                    where: { id: args.CitizenId }
                }).then(cit => {
                    return cit.getMarkers().then(markers => {
                        const toSet = markers.filter(
                            m => Number(m.id) !== Number(args.MarkerId)
                        );
                        return cit.setMarkers(toSet).then(() => {
                            pubsub.publish(
                                Constants.subscriptions
                                    .MARKER_DETACHED_FROM_CITIZEN,
                                {
                                    markerDetachedFromCitizen: args.MarkerId
                                }
                            );
                            return args.MarkerId;
                        });
                    });
                });
            } else {
                return null;
            }
        },
        attachMarkerToVehicle: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (
                hasFivemToken ||
                userHasRoles(['CITIZEN_MGR', 'OWN_CITIZENS_RECORD'], user)
            ) {
                return Models.Marker.findOne({
                    where: { id: args.MarkerId }
                }).then(attaching => {
                    return Models.Vehicle.findOne({
                        where: { id: args.VehicleId }
                    }).then(veh => {
                        return veh.getMarkers().then(markers => {
                            const toSet = [...markers, attaching];
                            return veh.setMarkers(toSet).then(() => {
                                pubsub.publish(
                                    Constants.subscriptions
                                        .MARKER_ATTACHED_TO_VEHICLE,
                                    {
                                        markerAttachedToVehicle: attaching
                                    }
                                );
                                return attaching;
                            });
                        });
                    });
                });
            } else {
                return null;
            }
        },
        detachMarkerFromVehicle: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (
                hasFivemToken ||
                userHasRoles(['CITIZEN_MGR', 'OWN_CITIZENS_RECORD'], user)
            ) {
                return Models.Vehicle.findOne({
                    where: { id: args.VehicleId }
                }).then(veh => {
                    return veh.getMarkers().then(markers => {
                        const toSet = markers.filter(
                            m => Number(m.id) !== Number(args.MarkerId)
                        );
                        return veh.setMarkers(toSet).then(() => {
                            pubsub.publish(
                                Constants.subscriptions
                                    .MARKER_DETACHED_FROM_VEHICLE,
                                {
                                    markerDetachedFromVehicle: args.MarkerId
                                }
                            );
                            return args.MarkerId;
                        });
                    });
                });
            } else {
                return null;
            }
        },
        removeUserFromUnit: (parent, { UserId, UnitId }, { Models, user }) => {
            if (userHasRoles(['DISPATCHER'], user)) {
                return Models.UserUnit.destroy({
                    where: { UserId, UnitId }
                }).then(() =>
                    Models.Unit.findOne({ where: { id: UnitId } }).then(
                        unit => {
                            pubsub.publish(
                                Constants.subscriptions.USER_UNIT_ASSIGNED,
                                {
                                    userUnitAssigned: []
                                }
                            );
                            // Tell FiveM to repopulate all user / unit assignments
                            makeUpdateRequest({
                                object: 'user_units'
                            });
                            return unit;
                        }
                    )
                );
            } else {
                return Promise.reject();
            }
        },
        assignUserRoles: (parent, args, { Models, user }) => {
            return userHasRoles(['USER_MGR'], user)
                ? Models.User.findOne({ where: { id: args.UserId } }).then(
                      user => {
                          const roles =
                              args.hasOwnProperty('UserRoles') &&
                              args.UserRoles.length > 0
                                  ? args.UserRoles.map(type => type.id)
                                  : [];
                          return user.setRoles(roles).then(() => {
                              // Tell FiveM to repopulate it's whitelist
                              makeUpdateRequest({
                                  object: 'whitelist'
                              });
                              return user;
                          });
                      }
                  )
                : null;
        },
        assignCallToUnit: (parent, args, { Models, user, hasFivemToken }) => {
            return hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.CallUnit.create(args).then(() => {
                      const ret = {
                          callId: args.CallId,
                          unitId: args.UnitId
                      };
                      pubsub.publish(Constants.subscriptions.UNIT_CALL_TOGGLE, {
                          unitCallToggle: ret
                      });
                      // Tell FiveM to repopulate call
                      makeUpdateRequest({
                          object: 'call',
                          payload: {
                              callId: args.CallId
                          }
                      });
                      // Tell FiveM to repopulate unit
                      makeUpdateRequest({
                          object: 'unit',
                          payload: {
                              unitId: args.UnitId
                          }
                      });
                      return ret;
                  })
                : null;
        },
        divestCallFromUnit: (parent, args, { Models, user, hasFivemToken }) => {
            return hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.CallUnit.destroy({ where: args }).then(() => {
                      const ret = {
                          callId: args.CallId,
                          unitId: args.UnitId
                      };
                      pubsub.publish(Constants.subscriptions.UNIT_CALL_TOGGLE, {
                          unitCallToggle: ret
                      });
                      // Tell FiveM to repopulate units
                      makeUpdateRequest({
                          object: 'call',
                          payload: {
                              callId: args.CallId
                          }
                      });
                      // Tell FiveM to repopulate unit
                      makeUpdateRequest({
                          object: 'unit',
                          payload: {
                              unitId: args.UnitId
                          }
                      });
                      return ret;
                  })
                : null;
        },
        updateUserAssignments: (...props) => updateUserAssignments(...props),
        createUserRank: (parent, args, { Models, user }) => {
            if (userHasRoles(['OFFICER_MGR'], user)) {
                return Models.UserRank.findAndCountAll().then(({ count }) => {
                    // Set the position on the row to be created
                    args.position = count;
                    return Models.UserRank.create(args).then(userRank => {
                        pubsub.publish(
                            Constants.subscriptions.USER_RANK_ADDED,
                            {
                                userRankAdded: userRank
                            }
                        );
                        // Tell FiveM to repopulate user ranks
                        makeUpdateRequest({
                            object: 'user_ranks'
                        });
                        return userRank;
                    });
                });
            } else {
                return null;
            }
        },
        createUnit: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.Unit.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.UNIT_ADDED, {
                          unitAdded: ret
                      });
                      // Tell FiveM to repopulate unit
                      makeUpdateRequest({
                          object: 'unit',
                          payload: {
                              unitId: ret.id
                          }
                      });
                      return ret;
                  })
                : null,
        createUnitType: (parent, args, { Models, user }) =>
            userHasRoles(['UNIT_MGR'], user)
                ? Models.UnitType.create(args).then(newUnitType => {
                      pubsub.publish(Constants.subscriptions.UNIT_TYPE_ADDED, {
                          unitTypeAdded: newUnitType
                      });
                      makeUpdateRequest({
                          object: 'unit_types'
                      });
                      return newUnitType;
                  })
                : null,
        createUnitState,
        createCall: (parent, args, { Models, user }) =>
            createCall(args, { Models, user }),
        updateCallMarker: (parent, args, { Models, user }) => {
            if (userHasRoles(['DISPATCHER'], user)) {
                return Models.Call.update(
                    {
                        markerX: args.markerX,
                        markerY: args.markerY
                    },
                    {
                        returning: ['*'],
                        where: { id: args.id }
                    }
                ).then(([rowsUpdated, [callUpdated]]) => {
                    pubsub.publish(Constants.subscriptions.CALL_UPDATED, {
                        callUpdated
                    });
                    makeUpdateRequest({
                        object: 'call',
                        payload: {
                            callId: args.id
                        }
                    });
                    return callUpdated;
                });
            } else {
                return null;
            }
        },
        updateCall: (parent, args, { Models, user, hasFivemToken }) => {
            if (hasFivemToken || userHasRoles(['DISPATCHER'], user)) {
                // FIXME: Although it works, this is not very elegant. I don't
                // know if it could be improved. Looking at the queries, it's
                // not doing anything particularly unecessary, it just looks
                // so long...!
                const callId = args.id;

                // Call
                const qCall = () => {
                    return Models.Call.update(
                        {
                            callerInfo: args.callerInfo,
                            CallGradeId: args.callGrade.id,
                            CallTypeId: args.callType.id,
                            markerX: args.markerX,
                            markerY: args.markerY,
                            DepartmentId: args.DepartmentId
                        },
                        {
                            returning: ['*'],
                            where: { id: callId }
                        }
                    ).then(([rowsUpdated, [updatedCall]]) => {
                        return Promise.all([
                            updatedCall.setLocations(
                                args.callLocations.map(loc => loc.id)
                            ),
                            updatedCall.setIncidentTypes(
                                args.callIncidents.map(inc => inc.id)
                            )
                        ]);
                    });
                };

                // Call descriptions
                const descIds = args.callDescriptions.map(desc => desc.id);
                // Delete all removed descriptions
                const Op = Sequelize.Op;
                const qDescDel = Models.CallDescription.destroy({
                    where: {
                        id: { [Op.notIn]: descIds },
                        CallId: callId
                    }
                });
                // Create or update remaining
                const qDescUp = args.callDescriptions.map(desc => {
                    return Models.CallDescription.upsert({
                        id: desc.id,
                        text: desc.text,
                        CallId: callId
                    });
                });

                // Iterate all promises...
                return Promise.all([qDescDel, ...qDescUp]).then(() => {
                    // ...then update the call...
                    return qCall().then(() => {
                        // ...the return the updated call object
                        return Models.Call.findOne({
                            where: { id: callId }
                        }).then(callUpdated => {
                            pubsub.publish(
                                Constants.subscriptions.CALL_UPDATED,
                                { callUpdated }
                            );
                            // Tell FiveM to repopulate call
                            makeUpdateRequest({
                                object: 'call',
                                payload: {
                                    callId
                                }
                            });
                            makeUpdateRequest({
                                object: 'units'
                            });
                            return callUpdated;
                        });
                    });
                });
            } else {
                return null;
            }
        },
        updatePreference: (parent, args, context) =>
            updatePreference(parent, args, context),
        updateCallGrade: (parent, args, { Models, user }) =>
            userHasRoles(['CALL_MGR'], user)
                ? Models.CallGrade.update(
                      { name: args.name },
                      { returning: ['*'], where: { id: args.id } }
                  ).then(([rowsUpdated, [updatedCallGrade]]) => {
                      pubsub.publish(
                          Constants.subscriptions.CALL_GRADE_UPDATED,
                          {
                              callGradeUpdated: updatedCallGrade
                          }
                      );
                      makeUpdateRequest({
                          object: 'call_grades'
                      });
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      return updatedCallGrade;
                  })
                : null,
        updateCallType: (parent, args, { Models, user }) =>
            userHasRoles(['CALL_MGR'], user)
                ? Models.CallType.update(
                      { name: args.name },
                      { returning: ['*'], where: { id: args.id } }
                  ).then(([rowsUpdated, [updatedCallType]]) => {
                      pubsub.publish(
                          Constants.subscriptions.CALL_TYPE_UPDATED,
                          {
                              callTypeUpdated: updatedCallType
                          }
                      );
                      makeUpdateRequest({
                          object: 'call_types'
                      });
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      return updatedCallType;
                  })
                : null,
        updateLocation: (parent, args, { Models, user }) =>
            userHasRoles(['CALL_MGR'], user)
                ? Models.Location.update(
                      { name: args.name },
                      { returning: ['*'], where: { id: args.id } }
                  ).then(([rowsUpdated, [updatedLocation]]) => {
                      pubsub.publish(Constants.subscriptions.LOCATION_UPDATED, {
                          locationUpdated: updatedLocation
                      });
                      return updatedLocation;
                  })
                : null,
        updateIncidentType: (parent, args, { Models, user }) =>
            userHasRoles(['CALL_MGR'], user)
                ? Models.IncidentType.update(
                      { name: args.name },
                      { returning: ['*'], where: { id: args.id } }
                  ).then(([rowsUpdated, [updatedIncidentType]]) => {
                      pubsub.publish(
                          Constants.subscriptions.INCIDENT_TYPE_UPDATED,
                          {
                              incidentTypeUpdated: updatedIncidentType
                          }
                      );
                      makeUpdateRequest({
                          object: 'call_incidents'
                      });
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      return updatedIncidentType;
                  })
                : null,
        updateUnitType: (parent, args, { Models, user }) =>
            userHasRoles(['UNIT_MGR'], user)
                ? Models.UnitType.update(
                      { name: args.name },
                      { returning: ['*'], where: { id: args.id } }
                  ).then(([rowsUpdated, [updatedUnitType]]) => {
                      pubsub.publish(
                          Constants.subscriptions.UNIT_TYPE_UPDATED,
                          {
                              unitTypeUpdated: updatedUnitType
                          }
                      );
                      makeUpdateRequest({
                          object: 'unit_types'
                      });
                      return updatedUnitType;
                  })
                : null,
        updateUnitState: (parent, args, { Models, user }) =>
            userHasRoles(['UNIT_MGR'], user)
                ? Models.UnitState.update(
                      {
                          name: args.name,
                          colour: args.colour,
                          active: args.active
                      },
                      { returning: ['*'], where: { id: args.id } }
                  ).then(([rowsUpdated, [updatedUnitState]]) => {
                      pubsub.publish(
                          Constants.subscriptions.UNIT_STATE_UPDATED,
                          {
                              unitStateUpdated: updatedUnitState
                          }
                      );
                      // Tell FiveM to repopulate unit states
                      makeUpdateRequest({
                          object: 'unit_states'
                      });
                      return updatedUnitState;
                  })
                : null,
        updateUserRank: (parent, args, { Models, user }) => {
            if (userHasRoles(['OFFICER_MGR'], user)) {
                // First check if the position of this rank has changed
                return Models.UserRank.findOne({ where: { id: args.id } }).then(
                    rank => {
                        const oldPosition = rank.position;
                        const newPosition = args.position;
                        if (
                            oldPosition >= 0 &&
                            newPosition >= 0 &&
                            oldPosition !== newPosition
                        ) {
                            // The moving rank and the rank it's displacing
                            // swap positions, so update the position of the
                            // rank being displaced
                            return Models.UserRank.update(
                                { position: oldPosition },
                                {
                                    returning: ['*'],
                                    where: { position: newPosition }
                                }
                            ).then(() => {
                                // Now update the position of the moving rank
                                return Models.UserRank.update(
                                    { position: newPosition },
                                    { returning: ['*'], where: { id: args.id } }
                                ).then(() => {
                                    // Return both the ranks that were changed
                                    return Models.UserRank.findAll({
                                        where: {
                                            position: [oldPosition, newPosition]
                                        }
                                    }).then(wereUpdated => {
                                        pubsub.publish(
                                            Constants.subscriptions
                                                .USER_RANK_UPDATED,
                                            {
                                                userRankUpdated: wereUpdated
                                            }
                                        );
                                        // Tell FiveM to repopulate user ranks
                                        makeUpdateRequest({
                                            object: 'user_ranks'
                                        });
                                        return wereUpdated;
                                    });
                                });
                            });
                        } else {
                            return Models.UserRank.update(
                                { name: args.name },
                                { returning: ['*'], where: { id: args.id } }
                            ).then(([rowsUpdated, updatedUserRank]) => {
                                pubsub.publish(
                                    Constants.subscriptions.USER_RANK_UPDATED,
                                    {
                                        userRankUpdated: updatedUserRank
                                    }
                                );
                                // Tell FiveM to repopulate user ranks
                                makeUpdateRequest({
                                    object: 'user_ranks'
                                });
                                return updatedUserRank;
                            });
                        }
                    }
                );
            } else {
                return null;
            }
        },
        createCallGrade,
        createCallType,
        createLocation: (parent, args, { Models, user }) =>
            userHasRoles(['CALL_MGR'], user)
                ? Models.Location.create(args).then(location => {
                      pubsub.publish(Constants.subscriptions.LOCATION_ADDED, {
                          locationAdded: location
                      });
                      makeUpdateRequest({
                          object: 'locations'
                      });
                      return location;
                  })
                : null,
        createCallDescription: (parent, args, { Models, user }) =>
            userHasRoles(['DISPATCHER'], user)
                ? Models.CallDescription.create(args)
                : null,
        createIncidentType,
        createGender: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Gender.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.GENDER_ADDED, {
                          genderAdded: ret
                      });
                      return ret;
                  })
                : null,
        updateGender: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Gender.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.GENDER_UPDATED, {
                          genderUpdated: ret
                      });
                      return ret;
                  })
                : null,
        deleteGender: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Gender.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.GENDER_DELETED, {
                          genderDeleted: ret
                      });
                      return ret;
                  })
                : null,
        createCharge: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.Charge.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.CHARGE_ADDED, {
                          chargeAdded: ret
                      });
                      makeUpdateRequest({
                          object: 'charges'
                      });
                      return ret;
                  })
                : null,
        updateCharge: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.Charge.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.CHARGE_UPDATED, {
                          chargeUpdated: ret
                      });
                      makeUpdateRequest({
                          object: 'charges'
                      });
                      return ret;
                  })
                : null,
        deleteCharge: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.Charge.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.CHARGE_DELETED, {
                          chargeDeleted: ret
                      });
                      makeUpdateRequest({
                          object: 'charges'
                      });
                      return ret;
                  })
                : null,
        createCitizenMarker: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Marker.create(
                      Object.assign(args, { type: 'citizen' })
                  ).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.CITIZEN_MARKER_ADDED,
                          {
                              citizenMarkerAdded: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'citizen_markers'
                      });
                      return ret;
                  })
                : null,
        createVehicleMarker: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Marker.create(
                      Object.assign(args, { type: 'vehicle' })
                  ).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.VEHICLE_MARKER_ADDED,
                          {
                              vehicleMarkerAdded: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'vehicle_markers'
                      });
                      return ret;
                  })
                : null,
        updateCitizenMarker: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Marker.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.CITIZEN_MARKER_UPDATED,
                          {
                              citizenMarkerUpdated: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'citizen_marker'
                      });
                      return ret;
                  })
                : null,
        updateVehicleMarker: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Marker.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.VEHICLE_MARKER_UPDATED,
                          {
                              vehicleMarkerUpdated: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'vehicle_markers'
                      });
                      return ret;
                  })
                : null,
        deleteCitizenMarker: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Marker.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.CITIZEN_MARKER_DELETED,
                          {
                              citizenMarkerDeleted: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'citizen_markers'
                      });
                      return ret;
                  })
                : null,
        deleteVehicleMarker: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Marker.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.VEHICLE_MARKER_DELETED,
                          {
                              vehicleMarkerDeleted: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'vehicle_markers'
                      });
                      return ret;
                  })
                : null,
        createBolo: async (parent, args, { Models, user, hasFivemToken }) => {
            if (userHasRoles(['DISPATCHER'], user) || hasFivemToken) {
                let obj = {
                    creator: null
                };
                // Was this BOLO created by an officer? In which case, record that fact
                if (args.hasOwnProperty('steamId')) {
                    const officerUser = await Models.User.findOne({
                        where: {
                            steamId: args.steamId
                        }
                    });
                    const officer = await Models.Officer.findOne({
                        where: {
                            officer: officerUser.id,
                            active: true
                        }
                    });
                    if (!officer) return null;
                    obj.creator = officer.id;
                }

                // Complete the object used to create the BOLO
                Object.assign(obj, args);

                return Models.Bolo.create(obj).then(ret => {
                    pubsub.publish(Constants.subscriptions.BOLOS_SUBSCRIPTION, {
                        bolosSubscription: ret.id
                    });
                    makeUpdateRequest({
                        object: 'bolos'
                    });
                    return ret;
                });
            } else {
                return null;
            }
        },
        deleteBolo: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Bolo.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.BOLOS_SUBSCRIPTION,
                          {
                              bolosSubscription: ret.id
                          }
                      );
                      makeUpdateRequest({
                          object: 'bolos'
                      });
                      return ret;
                  })
                : null,
        updateBolo: (parent, args, { Models, user, hasFivemToken }) =>
            userHasRoles(['DISPATCHER'], user) || hasFivemToken
                ? Models.Bolo.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.BOLOS_SUBSCRIPTION,
                          {
                              bolosSubscription: ret.id
                          }
                      );
                      makeUpdateRequest({
                          object: 'bolos'
                      });
                      return ret;
                  })
                : null,
        createDepartment: async (parent, args, ctx) => {
            const { Models, user, hasFivemToken } = ctx;
            if (userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken) {
                // Set some default values then let the passed values overwrite them
                const defaultArgs = {
                    colour: 'ff0000',
                    logo: '',
                    readonly: false
                };
                const updatedArgs = Object.assign(defaultArgs, args);
                return Models.Department.create(updatedArgs).then(async ret => {
                    await populateNewDeptSpecials(ret.id, parent, args, ctx);
                    pubsub.publish(Constants.subscriptions.DEPARTMENT_ADDED, {
                        departmentAdded: ret
                    });
                    makeUpdateRequest({
                        object: 'departments'
                    });
                    makeUpdateRequest({
                        object: 'calls'
                    });
                    makeUpdateRequest({
                        object: 'units'
                    });
                    makeUpdateRequest({
                        object: 'call_grades'
                    });
                    makeUpdateRequest({
                        object: 'call_types'
                    });
                    makeUpdateRequest({
                        object: 'call_incidents'
                    });
                    makeUpdateRequest({
                        object: 'unit_types'
                    });
                    makeUpdateRequest({
                        object: 'unit_states'
                    });
                    makeUpdateRequest({
                        object: 'bolos'
                    });
                    makeUpdateRequest({
                        object: 'user_ranks'
                    });
                    return ret;
                });
            } else {
                return null;
            }
        },
        deleteDepartment: (parent, args, { Models, user, hasFivemToken }) =>
            (userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken) &&
            args.id !== '1'
                ? Models.Department.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.DEPARTMENT_DELETED,
                          {
                              departmentDeleted: ret.id
                          }
                      );
                      pubsub.publish(
                          Constants.subscriptions.CHARACTER_ACTIVE_UPDATED,
                          {
                              characterActiveUpdated: []
                          }
                      );
                      makeUpdateRequest({
                          object: 'departments'
                      });
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      makeUpdateRequest({
                          object: 'units'
                      });
                      makeUpdateRequest({
                          object: 'call_grades'
                      });
                      makeUpdateRequest({
                          object: 'call_types'
                      });
                      makeUpdateRequest({
                          object: 'call_incidents'
                      });
                      makeUpdateRequest({
                          object: 'unit_types'
                      });
                      makeUpdateRequest({
                          object: 'unit_states'
                      });
                      makeUpdateRequest({
                          object: 'bolos'
                      });
                      makeUpdateRequest({
                          object: 'user_ranks'
                      });
                      return ret;
                  })
                : null,
        updateDepartment: (parent, args, { Models }) =>
            Models.Department.update(args, {
                returning: ['*'],
                where: { id: args.id }
            }).then(([_, [ret]]) => {
                pubsub.publish(Constants.subscriptions.DEPARTMENT_UPDATED, {
                    departmentUpdated: ret
                });
                makeUpdateRequest({
                    object: 'departments'
                });
                return ret;
            }),
        createDepartmentAnnouncement: async (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken) {
                return Models.DepartmentAnnouncement.create(args).then(ret => {
                    pubsub.publish(
                        Constants.subscriptions.DEPARTMENT_ANNOUNCEMENT_ADDED,
                        {
                            departmentAnnouncementAdded: ret
                        }
                    );
                    makeUpdateRequest({
                        object: 'department_announcements'
                    });
                    return ret;
                });
            } else {
                return null;
            }
        },
        deleteDepartmentAnnouncement: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) =>
            userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken
                ? Models.DepartmentAnnouncement.destroy({ where: args }).then(
                      ret => {
                          pubsub.publish(
                              Constants.subscriptions
                                  .DEPARTMENT_ANNOUNCEMENT_DELETED,
                              {
                                  departmentAnnouncementDeleted: args.id
                              }
                          );
                          makeUpdateRequest({
                              object: 'department_announcements'
                          });
                          return ret;
                      }
                  )
                : null,
        updateDepartmentAnnouncement: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) =>
            userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken
                ? Models.DepartmentAnnouncement.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions
                              .DEPARTMENT_ANNOUNCEMENT_UPDATED,
                          {
                              departmentAnnouncementUpdated: ret.id
                          }
                      );
                      makeUpdateRequest({
                          object: 'department_announcements'
                      });
                      return ret;
                  })
                : null,
        createDepartmentDocument: async (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken) {
                return Models.DepartmentDocument.create(args).then(ret => {
                    pubsub.publish(
                        Constants.subscriptions.DEPARTMENT_DOCUMENT_ADDED,
                        {
                            departmentDocumentAdded: ret.id
                        }
                    );
                    makeUpdateRequest({
                        object: 'departmentDocuments'
                    });
                    return ret;
                });
            } else {
                return null;
            }
        },
        deleteDepartmentDocument: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) =>
            userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken
                ? Models.DepartmentDocument.destroy({ where: args }).then(
                      ret => {
                          pubsub.publish(
                              Constants.subscriptions
                                  .DEPARTMENT_DOCUMENT_DELETED,
                              {
                                  departmentDocumentDeleted: ret.id
                              }
                          );
                          makeUpdateRequest({
                              object: 'departmentDocuments'
                          });
                          return ret;
                      }
                  )
                : null,
        updateDepartmentDocument: (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) =>
            userHasRoles(['DEPARTMENTS_MGR'], user) || hasFivemToken
                ? Models.DepartmentDocument.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.DEPARTMENT_DOCUMENT_UPDATED,
                          {
                              departmentDocumentUpdated: ret.id
                          }
                      );
                      makeUpdateRequest({
                          object: 'departmentDocuments'
                      });
                      return ret;
                  })
                : null,
        createEthnicity: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Ethnicity.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.ETHNICITY_ADDED, {
                          ethnicityAdded: ret
                      });
                      return ret;
                  })
                : null,
        updateEthnicity: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Ethnicity.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.ETHNICITY_UPDATED,
                          {
                              ethnicityUpdated: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteEthnicity: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.Ethnicity.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.ETHNICITY_DELETED,
                          {
                              ethnicityDeleted: ret
                          }
                      );
                      return ret;
                  })
                : null,
        createInsuranceStatus: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.InsuranceStatus.create(args).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.INSURANCE_STATUS_ADDED,
                          {
                              insuranceStatusAdded: ret
                          }
                      );
                      return ret;
                  })
                : null,
        updateInsuranceStatus: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.InsuranceStatus.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.INSURANCE_STATUS_UPDATED,
                          {
                              insuranceStatusUpdated: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteInsuranceStatus: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.InsuranceStatus.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.INSURANCE_STATUS_DELETED,
                          {
                              insuranceStatusDeleted: ret
                          }
                      );

                      return ret;
                  })
                : null,
        createLicenceStatus: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.LicenceStatus.create(args).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.LICENCE_STATUS_ADDED,
                          {
                              licenceStatusAdded: ret
                          }
                      );
                      return ret;
                  })
                : null,
        updateLicenceStatus: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.LicenceStatus.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.LICENCE_STATUS_UPDATED,
                          {
                              licenceStatusUpdated: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteLicenceStatus: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.LicenceStatus.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.LICENCE_STATUS_DELETED,
                          {
                              licenceStatusDeleted: ret
                          }
                      );

                      return ret;
                  })
                : null,
        createLicenceType: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.LicenceType.create(args).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.LICENCE_TYPE_ADDED,
                          {
                              licenceTypeAdded: ret
                          }
                      );
                      return ret;
                  })
                : null,
        updateLicenceType: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.LicenceType.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.LICENCE_TYPE_UPDATED,
                          {
                              licenceTypeUpdated: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteLicenceType: (parent, args, { Models, user }) =>
            userHasRoles(['LEGAL_MGR'], user)
                ? Models.LicenceType.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.LICENCE_TYPE_DELETED,
                          {
                              licenceTypeDeleted: ret
                          }
                      );

                      return ret;
                  })
                : null,
        createLicence: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Licence.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.LICENCE_ADDED, {
                          licenceAdded: ret
                      });
                      return ret;
                  })
                : null,
        updateLicence: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Licence.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.LICENCE_UPDATED, {
                          licenceUpdated: ret
                      });
                      return ret;
                  })
                : null,
        deleteLicence: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Licence.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.LICENCE_DELETED, {
                          licenceDeleted: ret
                      });
                      return ret;
                  })
                : null,
        createOffence: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Offence.create(args).then(offence =>
                      offence
                          .setCharges(args.charges ? args.charges : [])
                          .then(() =>
                              Models.Offence.findOne({
                                  where: { id: offence.id }
                              }).then(ret => {
                                  pubsub.publish(
                                      Constants.subscriptions.OFFENCE_ADDED,
                                      {
                                          offenceAdded: ret
                                      }
                                  );
                                  makeUpdateRequest({
                                      object: 'citizen',
                                      payload: {
                                          citizenId: args.CitizenId
                                      }
                                  });
                                  return ret;
                              })
                          )
                  )
                : null,
        updateOffence: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Offence.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      return ret
                          .setCharges(
                              args.charges ? args.charges.map(c => c.id) : []
                          )
                          .then(() =>
                              Models.Offence.findOne({
                                  where: { id: args.id }
                              }).then(ret => {
                                  pubsub.publish(
                                      Constants.subscriptions.OFFENCE_UPDATED,
                                      {
                                          offenceUpdated: ret
                                      }
                                  );
                                  makeUpdateRequest({
                                      object: 'citizen',
                                      payload: {
                                          citizenId: args.CitizenId
                                      }
                                  });
                                  return ret;
                              })
                          );
                  })
                : null,
        deleteOffence: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Offence.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.OFFENCE_DELETED, {
                          offenceDeleted: ret
                      });
                      makeUpdateRequest({
                          object: 'citizen',
                          payload: {
                              citizenId: args.CitizenId
                          }
                      });
                      return ret;
                  })
                : null,
        createArrest: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Arrest.create(args).then(arrest =>
                      arrest
                          .setCharges(
                              args.charges ? args.charges.map(c => c.id) : []
                          )
                          .then(() =>
                              Models.Arrest.findOne({
                                  where: { id: arrest.id }
                              }).then(arrest => {
                                  pubsub.publish(
                                      Constants.subscriptions.ARREST_ADDED,
                                      {
                                          arrestAdded: arrest
                                      }
                                  );
                                  makeUpdateRequest({
                                      object: 'citizen',
                                      payload: {
                                          citizenId: args.CitizenId
                                      }
                                  });
                                  return arrest;
                              })
                          )
                  )
                : null,
        updateArrest: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Arrest.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      return ret
                          .setCharges(
                              args.charges ? args.charges.map(c => c.id) : []
                          )
                          .then(() => {
                              return Models.Arrest.findOne({
                                  where: { id: ret.id }
                              }).then(arrest => {
                                  pubsub.publish(
                                      Constants.subscriptions.ARREST_UPDATED,
                                      {
                                          arrestUpdated: arrest
                                      }
                                  );
                                  makeUpdateRequest({
                                      object: 'citizen',
                                      payload: {
                                          citizenId: args.CitizenId
                                      }
                                  });
                                  return arrest;
                              });
                          });
                  })
                : null,
        deleteArrest: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Arrest.findOne({ where: { id: args.id } }).then(
                      found => {
                          return Models.Arrest.destroy({
                              where: { id: args.id }
                          }).then(() => {
                              pubsub.publish(
                                  Constants.subscriptions.ARREST_DELETED,
                                  {
                                      arrestDeleted: found
                                  }
                              );
                              return found;
                          });
                      }
                  )
                : null,
        createVehicleModel: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.VehicleModel.create(args).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.VEHICLE_MODEL_ADDED,
                          {
                              vehicleModelAdded: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'vehicle_models'
                      });
                      return ret;
                  })
                : null,
        updateVehicleModel: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.VehicleModel.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.VEHICLE_MODEL_UPDATED,
                          {
                              vehicleModelUpdated: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'vehicle_models'
                      });
                      return ret;
                  })
                : null,
        deleteVehicleModel: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.VehicleModel.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.VEHICLE_MODEL_DELETED,
                          {
                              vehicleModelDeleted: ret
                          }
                      );
                      makeUpdateRequest({
                          object: 'vehicle_models'
                      });
                      return ret;
                  })
                : null,
        createVehicle: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Vehicle.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.VEHICLE_ADDED, {
                          vehicleAdded: ret
                      });
                      return ret;
                  })
                : null,
        updateVehicle: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Vehicle.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.VEHICLE_UPDATED, {
                          vehicleUpdated: ret
                      });
                      return ret;
                  })
                : null,
        deleteVehicle: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Vehicle.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.VEHICLE_DELETED, {
                          vehicleDeleted: ret
                      });
                      return ret;
                  })
                : null,
        createWeapon: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Weapon.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.WEAPON_ADDED, {
                          weaponAdded: ret
                      });
                      return ret;
                  })
                : null,
        updateWeapon: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Weapon.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.WEAPON_UPDATED, {
                          weaponUpdated: ret
                      });
                      return ret;
                  })
                : null,
        deleteWeapon: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            userHasCitizen(args.CitizenId, user)
                ? Models.Weapon.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.WEAPON_DELETED, {
                          weaponDeleted: ret
                      });
                      return ret;
                  })
                : null,
        createTicket: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Ticket.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.TICKET_ADDED, {
                          ticketAdded: ret
                      });
                      makeUpdateRequest({
                          object: 'citizen',
                          payload: {
                              citizenId: args.CitizenId
                          }
                      });
                      return ret;
                  })
                : null,
        updateTicket: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken ||
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Ticket.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.TICKET_UPDATED, {
                          ticketUpdated: ret
                      });
                      makeUpdateRequest({
                          object: 'citizen',
                          payload: {
                              citizenId: args.CitizenId
                          }
                      });
                      return ret;
                  })
                : null,
        deleteTicket: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Ticket.findOne({ where: { id: args.id } }).then(
                      ticket => {
                          return Models.Ticket.destroy({
                              where: { id: args.id }
                          }).then(ret => {
                              pubsub.publish(
                                  Constants.subscriptions.TICKET_DELETED,
                                  {
                                      ticketDeleted: ticket
                                  }
                              );
                              return ret;
                          });
                      }
                  )
                : null,
        createCitizen: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR', 'RP_CITIZEN'], user)
                ? Models.Citizen.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.CITIZEN_ADDED, {
                          citizenAdded: ret
                      });
                      fivemUpdateUser(args.UserId, { Models });
                      return ret;
                  })
                : null,
        updateCitizen: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR', 'RP_CITIZEN'], user)
                ? Models.Citizen.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.CITIZEN_UPDATED, {
                          citizenUpdated: ret
                      });
                      fivemUpdateUser(args.UserId, { Models });
                      return ret;
                  })
                : null,
        deleteCitizen: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR', 'RP_CITIZEN'], user)
                ? Models.Citizen.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.CITIZEN_DELETED, {
                          citizenDeleted: ret
                      });
                      pubsub.publish(
                          Constants.subscriptions.CHARACTER_ACTIVE_UPDATED,
                          {
                              characterActiveUpdated: []
                          }
                      );
                      fivemUpdateUser(args.UserId, { Models });
                      return ret;
                  })
                : null,
        createOfficer: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR', 'RP_OFFICER'], user)
                ? Models.Officer.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.OFFICER_ADDED, {
                          officerAdded: ret
                      });
                      fivemUpdateUser(args.UserId, { Models });
                      return ret;
                  })
                : null,
        updateOfficer: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR', 'RP_OFFICER'], user)
                ? Models.Officer.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.OFFICER_UPDATED, {
                          officerUpdated: ret
                      });
                      fivemUpdateUser(args.UserId, { Models });
                      return ret;
                  })
                : null,
        deleteOfficer: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR', 'RP_OFFICER'], user)
                ? Models.Officer.findOne({ where: args }).then(officer => {
                      return Models.User.findOne({
                          where: {
                              id: officer.UserId
                          }
                      }).then(foundUser => {
                          return officer.destroy().then(ret => {
                              pubsub.publish(
                                  Constants.subscriptions.OFFICER_DELETED,
                                  {
                                      officerDeleted: ret
                                  }
                              );
                              pubsub.publish(
                                  Constants.subscriptions
                                      .CHARACTER_ACTIVE_UPDATED,
                                  {
                                      characterActiveUpdated: []
                                  }
                              );
                              // Tell FiveM to repopulate this officer's user because the
                              // active officer may have just been deleted
                              makeUpdateRequest({
                                  object: 'user',
                                  payload: {
                                      steamId: foundUser.steamId
                                  }
                              });
                              return ret;
                          });
                      });
                  })
                : null,
        createWarrant: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Warrant.create(args).then(ret => {
                      pubsub.publish(Constants.subscriptions.WARRANT_ADDED, {
                          warrantAdded: ret
                      });
                      makeUpdateRequest({
                          object: 'citizen',
                          payload: {
                              citizenId: args.CitizenId
                          }
                      });
                      return ret;
                  })
                : null,
        updateWarrant: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Warrant.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(Constants.subscriptions.WARRANT_UPDATED, {
                          warrantUpdated: ret
                      });
                      makeUpdateRequest({
                          object: 'citizen',
                          payload: {
                              citizenId: args.CitizenId
                          }
                      });
                      return ret;
                  })
                : null,
        deleteWarrant: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_MGR'], user) ||
            (userHasCitizen(args.CitizenId, user) &&
                userHasRoles(['OWN_CITIZENS_RECORD'], user))
                ? Models.Warrant.destroy({ where: args }).then(ret => {
                      pubsub.publish(Constants.subscriptions.WARRANT_DELETED, {
                          warrantDeleted: ret
                      });
                      makeUpdateRequest({
                          object: 'citizen',
                          payload: {
                              citizenId: args.CitizenId
                          }
                      });
                      return ret;
                  })
                : null,
        createWeaponStatus: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.WeaponStatus.create(args).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.WEAPON_STATUS_ADDED,
                          {
                              weaponStatusAdded: ret
                          }
                      );
                      return ret;
                  })
                : null,
        updateWeaponStatus: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.WeaponStatus.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.WEAPON_STATUS_UPDATED,
                          {
                              weaponStatusUpdated: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteWeaponStatus: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.WeaponStatus.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.WEAPON_STATUS_DELETED,
                          {
                              weaponStatusDeleted: ret
                          }
                      );

                      return ret;
                  })
                : null,
        createWeaponType: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.WeaponType.create(args).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.WEAPON_TYPE_ADDED,
                          {
                              weaponTypeAdded: ret
                          }
                      );
                      return ret;
                  })
                : null,
        updateWeaponType: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.WeaponType.update(args, {
                      returning: ['*'],
                      where: { id: args.id }
                  }).then(([_, [ret]]) => {
                      pubsub.publish(
                          Constants.subscriptions.WEAPON_TYPE_UPDATED,
                          {
                              weaponTypeUpdated: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteWeaponType: (parent, args, { Models, user }) =>
            userHasRoles(['CITIZEN_VAL_MGR'], user)
                ? Models.WeaponType.destroy({ where: args }).then(ret => {
                      pubsub.publish(
                          Constants.subscriptions.WEAPON_TYPE_DELETED,
                          {
                              weaponTypeDeleted: ret
                          }
                      );
                      return ret;
                  })
                : null,
        deleteCall: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.Call.destroy({ where: args }).then(() => {
                      pubsub.publish(Constants.subscriptions.CALL_DELETED, {
                          callDeleted: args.id
                      });
                      // Tell FiveM to repopulate units
                      makeUpdateRequest({
                          object: 'units'
                      });
                      // Tell FiveM to repopulate calls
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      // Tell FiveM to repopulate users
                      return args.id;
                  })
                : null,
        deleteAllCalls: (parent, args, { Models, user }) =>
            userHasRoles(['CALL_MGR'], user)
                ? Models.Call.destroy({ where: args }).then(() => {
                      pubsub.publish(
                          Constants.subscriptions.ALL_CALLS_DELETED,
                          {
                              allCallsDeleted: true
                          }
                      );
                      // Tell FiveM to repopulate units
                      makeUpdateRequest({
                          object: 'units'
                      });
                      // Tell FiveM to repopulate calls
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      return true;
                  })
                : false,
        deleteUser: (parent, args, { Models, user }) =>
            userHasRoles(['OFFICER_MGR'], user)
                ? Models.User.destroy({ where: args }).then(() => {
                      pubsub.publish(Constants.subscriptions.USER_DELETED, {
                          userDeleted: args
                      });
                      // Tell FiveM to repopulate units
                      makeUpdateRequest({
                          object: 'units'
                      });
                      // Tell FiveM to repopulate it's whitelist
                      makeUpdateRequest({
                          object: 'whitelist'
                      });
                      return args.id;
                  })
                : null,
        deleteCallGrade: async (parent, args, { Models, user }) => {
            if (userHasRoles(['CALL_MGR'], user)) {
                const toDelete = await Models.CallGrade.findOne({
                    where: args
                });
                if (!toDelete.readonly) {
                    await toDelete.destroy();
                    pubsub.publish(Constants.subscriptions.CALL_GRADE_DELETED, {
                        callGradeDeleted: args.id
                    });
                    makeUpdateRequest({
                        object: 'call_grades'
                    });
                    return args.id;
                }
                return null;
            } else {
                return null;
            }
        },
        deleteCallType: async (parent, args, { Models, user }) => {
            if (userHasRoles(['CALL_MGR'], user)) {
                const toDelete = await Models.CallType.findOne({
                    where: args
                });
                if (!toDelete.readonly) {
                    await toDelete.destroy();
                    pubsub.publish(Constants.subscriptions.CALL_TYPE_DELETED, {
                        callTypeDeleted: args.id
                    });
                    makeUpdateRequest({
                        object: 'call_types'
                    });
                    return args.id;
                }
                return null;
            } else {
                return null;
            }
        },
        deleteLocation: async (parent, args, { Models, user }) => {
            if (userHasRoles(['CALL_MGR'], user)) {
                const toDelete = await Models.Location.findOne({
                    where: args
                });
                if (!toDelete.readonly) {
                    await toDelete.destroy();
                    pubsub.publish(Constants.subscriptions.LOCATION_DELETED, {
                        locationDeleted: args.id
                    });
                    makeUpdateRequest({
                        object: 'locations'
                    });
                    return args.id;
                }
                return null;
            } else {
                return null;
            }
        },
        deleteIncidentType: async (parent, args, { Models, user }) => {
            if (userHasRoles(['CALL_MGR'], user)) {
                const toDelete = await Models.IncidentType.findOne({
                    where: args
                });
                if (!toDelete.readonly) {
                    await toDelete.destroy();
                    pubsub.publish(
                        Constants.subscriptions.INCIDENT_TYPE_DELETED,
                        {
                            incidentTypeDeleted: args.id
                        }
                    );
                    makeUpdateRequest({
                        object: 'call_incidents'
                    });
                    return args.id;
                }
                return null;
            } else {
                return null;
            }
        },
        deleteUserRank: (parent, args, { Models, user }) => {
            if (userHasRoles(['OFFICER_MGR'], user)) {
                // Get the rank that is being destroyed, so we can sort out
                // the ranks of those that are left behind
                return Models.UserRank.findOne({ where: args }).then(rank =>
                    Models.UserRank.destroy({ where: args }).then(() => {
                        // Sort out 'position' for remaining ranks
                        return Models.UserRank.decrement('position', {
                            where: { position: { [Op.gt]: rank.position } }
                        }).then(() => {
                            pubsub.publish(
                                Constants.subscriptions.USER_RANK_DELETED,
                                {
                                    userRankDeleted: args.id
                                }
                            );
                            // Tell FiveM to repopulate user ranks
                            makeUpdateRequest({
                                object: 'user_ranks'
                            });
                            return args.id;
                        });
                    })
                );
            } else {
                return null;
            }
        },
        deleteUnitType: (parent, args, { Models, user }) =>
            userHasRoles(['UNIT_MGR'], user)
                ? Models.UnitType.destroy({ where: args }).then(() => {
                      pubsub.publish(
                          Constants.subscriptions.UNIT_TYPE_DELETED,
                          {
                              unitTypeDeleted: args.id
                          }
                      );
                      makeUpdateRequest({
                          object: 'unit_types'
                      });
                      return args.id;
                  })
                : null,
        deleteUnitState: (parent, args, { Models, user }) =>
            userHasRoles(['UNIT_MGR'], user)
                ? Models.UnitState.destroy({ where: args }).then(() => {
                      pubsub.publish(
                          Constants.subscriptions.UNIT_STATE_DELETED,
                          {
                              unitStateDeleted: args.id
                          }
                      );
                      // Tell FiveM to repopulate unit states
                      makeUpdateRequest({
                          object: 'unit_states'
                      });
                      return args.id;
                  })
                : null,
        deleteUnit: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.Unit.destroy({ where: args }).then(() => {
                      pubsub.publish(Constants.subscriptions.UNIT_DELETED, {
                          unitDeleted: args.id
                      });
                      // Tell FiveM to repopulate unit
                      makeUpdateRequest({
                          object: 'calls'
                      });
                      makeUpdateRequest({
                          object: 'units'
                      });
                      return args.id;
                  })
                : null,
        updateUnit: (parent, args, { Models, user, hasFivemToken }) =>
            hasFivemToken || userHasRoles(['DISPATCHER'], user)
                ? Models.Unit.findByPk(args.id).then(unit => {
                      return unit.update(args).then(ret => {
                          pubsub.publish(Constants.subscriptions.UNIT_UPDATED, {
                              unitUpdated: ret
                          });
                          // Tell FiveM to repopulate the unit
                          makeUpdateRequest({
                              object: 'unit',
                              payload: {
                                  unitId: args.id
                              }
                          });
                          makeUpdateRequest({
                              object: 'calls'
                          });
                          return ret;
                      });
                  })
                : null,
        authenticateUser: (parent, { uuid }, { Models }) => {
            return Models.User.findOne({
                where: { uuid },
                include: [
                    {
                        model: Models.UserType,
                        required: true,
                        as: 'roles'
                    }
                ]
            }).then(user => {
                // Here we are misusing the USER_DELETED subscription to
                // prompt the admin HOC to repopulate users.
                // TODO: We really should add a generic "repopulate"
                // subscription
                pubsub.publish(Constants.subscriptions.USER_DELETED, {
                    userDeleted: 0
                });
                if (user) {
                    return user.update({ uuid: uuidv4() }).then(updated => {
                        const userJson = updated.toJSON();
                        const token = createToken(userJson);
                        return { token };
                    });
                } else {
                    return Promise.reject('No roles granted');
                }
            });
        },
        updateUser: (parent, args, { Models }) => {
            return Models.User.findOne({
                where: { id: args.id }
            }).then(user => {
                if (user) {
                    return user.update(args).then(updated => {
                        pubsub.publish(Constants.subscriptions.USER_UPDATED, {
                            userUpdated: updated
                        });
                        fivemUpdateUser(args.id, { Models });
                        return updated;
                    });
                }
            });
        },
        updateUserLocations: (parent, { userLocations = [] }, { Models }) => {
            if (!hasFiveM()) {
                return Promise.resolve({});
            }
            const usr = Models.User;
            return usr.update({ x: null, y: null }, { where: {} }).then(() => {
                userLocations.forEach(user =>
                    usr.update(
                        { x: user.x, y: user.y },
                        { where: { steamId: user.steamId } }
                    )
                );
            });
        },
        setCharacter: (parent, { type, id, active }, context) => {
            const { Models, user } = context;
            if (!userHasRoles(['RP_CITIZEN', 'RP_OFFICER'], user)) {
                return null;
            }
            let model = null;
            if (type === 'citizen') {
                model = Models.Citizen;
            } else if (type === 'officer') {
                model = Models.Officer;
            } else {
                return Promise.reject(
                    new Error('Unable to find character type')
                );
            }
            // First ensure that the user making the request owns the character
            return model
                .findOne({
                    where: {
                        id,
                        UserId: user.id
                    }
                })
                .then(character => {
                    if (!character) {
                        return Promise.reject(
                            new Error('Unable to find character')
                        );
                    }
                    // First look for active characters, ready the promises to update
                    // them to inactive, returning the results
                    let finders = [];
                    let promises = [];
                    [Models.Citizen, Models.Officer].forEach(mod => {
                        finders.push(
                            mod.findOne({
                                where: { UserId: user.id, active: true }
                            })
                        );
                    });
                    return Promise.all(finders).then(async findResults => {
                        let deactivators = [];
                        findResults.forEach(findResult => {
                            if (findResult) {
                                deactivators.push(
                                    findResult.update(
                                        { active: false },
                                        { returning: ['*'] }
                                    )
                                );
                            }
                        });
                        await updateUserAssignments(
                            parent,
                            {
                                userId: user.id,
                                assignments: [],
                                skipAuth: true
                            },
                            context
                        );
                        return Promise.all(deactivators).then(
                            deactivateResults => {
                                if (active) {
                                    return model
                                        .findOne({ where: { id } })
                                        .then(found => {
                                            return found
                                                .update(
                                                    { active: true },
                                                    { returning: ['*'] }
                                                )
                                                .then(updated => {
                                                    pubsub.publish(
                                                        Constants.subscriptions
                                                            .CHARACTER_ACTIVE_UPDATED,
                                                        {
                                                            characterActiveUpdated:
                                                                [
                                                                    ...deactivateResults,
                                                                    updated
                                                                ]
                                                        }
                                                    );
                                                    // Tell the MDT server to update its
                                                    // user object for this user
                                                    makeUpdateRequest({
                                                        object: 'user',
                                                        payload: {
                                                            steamId:
                                                                user.steamId
                                                        }
                                                    });
                                                    makeUpdateRequest({
                                                        object: 'units'
                                                    });
                                                    // Return the merged results of our labours
                                                    return [
                                                        ...deactivateResults,
                                                        updated
                                                    ];
                                                });
                                        });
                                } else {
                                    // Tell the MDT server to update its
                                    // user object for this user
                                    makeUpdateRequest({
                                        object: 'user',
                                        payload: { steamId: user.steamId }
                                    });
                                    makeUpdateRequest({
                                        object: 'units'
                                    });
                                    pubsub.publish(
                                        Constants.subscriptions
                                            .CHARACTER_ACTIVE_UPDATED,
                                        {
                                            characterActiveUpdated:
                                                deactivateResults
                                        }
                                    );
                                    return deactivateResults;
                                }
                            }
                        );
                    });
                })
                .catch(e => Promise.reject(new Error(e)));
        },
        startPanic: async (parent, args, { Models, user, hasFivemToken }) => {
            if (!hasFivemToken && !userHasRoles(['DISPATCHER'], user)) {
                return null;
            }

            if (!args.hasOwnProperty('steamId')) {
                return null;
            }

            // Get the user who started the panic
            const panicUser = await Models.User.findOne({
                where: {
                    steamId: args.steamId,
                    x: {
                        [Op.ne]: null
                    },
                    y: {
                        [Op.ne]: null
                    },
                    updatedAt: {
                        [Op.gte]: moment().subtract(10, 'seconds').toDate()
                    }
                }
            });

            if (!panicUser) {
                return null;
            }

            const character = await getCharacter({ id: panicUser.id });

            // Get the hardcoded incident type, location, call grade, call type
            // and unit state
            const incidentType = await Models.IncidentType.findOne({
                where: {
                    code: 'PANIC',
                    DepartmentId: character.DepartmentId
                }
            });
            const location = await Models.Location.findOne({
                where: {
                    code: 'PANIC'
                }
            });
            const callGrade = await Models.CallGrade.findOne({
                where: {
                    code: 'PANIC',
                    DepartmentId: character.DepartmentId
                }
            });
            const callType = await Models.CallType.findOne({
                where: {
                    code: 'PANIC',
                    DepartmentId: character.DepartmentId
                }
            });
            const unitState = await Models.UnitState.findOne({
                where: {
                    code: 'PANIC',
                    DepartmentId: character.DepartmentId
                }
            });

            if (
                !incidentType ||
                !location ||
                !callGrade ||
                !callType ||
                !unitState
            ) {
                return null;
            }

            let newCall;
            try {
                newCall = await createCall(
                    {
                        DepartmentId: character.DepartmentId,
                        markerX: panicUser.x,
                        markerY: panicUser.y,
                        callerInfo: `${incidentType.name}: ${character.firstName} ${character.lastName}`,
                        callGrade,
                        callType,
                        callLocations: [location],
                        callIncidents: [incidentType],
                        callDescriptions: [
                            { id: null, text: incidentType.name }
                        ]
                    },
                    { Models, user }
                );
            } catch (err) {
                return null;
            }
            // Get the preferences for the unit states and types that should
            // be assigned to this call, and whether we should set the state
            // of the user's units
            const assignStates = JSON.parse(
                CadState.getPreference('panic_assigned_unit_states')
            );
            const assignTypes = JSON.parse(
                CadState.getPreference('panic_assigned_unit_types')
            );
            const setState = JSON.parse(
                CadState.getPreference('panic_assign_unit_state')
            );

            // Find units that have both assignments. assignStates & assignTypes are
            // arrays of ids.
            const assignUnits = await Models.Unit.findAll({
                where: {
                    UnitStateId: { [Op.in]: assignStates },
                    UnitTypeId: { [Op.in]: assignTypes }
                }
            });

            const assignments = assignUnits.map(unit => ({
                CallId: newCall.id,
                UnitId: unit.id
            }));

            // If no units fit our criteria, we can't assign them
            // the call
            if (assignments.length > 0) {
                // Assign the units to the call
                await Models.CallUnit.bulkCreate(assignments);
                // Tell both the CAD and MDT to update themselves
                assignUnits.forEach(unit => {
                    pubsub.publish(Constants.subscriptions.UNIT_CALL_TOGGLE, {
                        unitCallToggle: { callId: newCall.id, unitId: unit.id }
                    });
                    // Tell FiveM to repopulate call
                    makeUpdateRequest({
                        object: 'call',
                        payload: {
                            callId: newCall.id
                        }
                    });
                    makeUpdateRequest({
                        object: 'unit',
                        payload: {
                            callId: unit.id
                        }
                    });
                });
            }

            // If we should set the user's units state, do it
            if (setState === true) {
                const units = await panicUser.getUnits();
                Promise.all(
                    units.map(async unit => {
                        const updated = await unit.update({
                            UnitStateId: unitState.id
                        });
                        pubsub.publish(Constants.subscriptions.UNIT_UPDATED, {
                            unitUpdated: updated
                        });
                        // Tell FiveM to repopulate unit
                        makeUpdateRequest({
                            object: 'unit',
                            payload: {
                                unitId: unit.id
                            }
                        });
                    })
                );
            }

            // Tell FiveM about the panic
            // We delay this to avoid the race condition of the MDT trying
            // to create a marker before the MDT knows about the call
            // I know, I know...
            setTimeout(() => {
                makeUpdateRequest({
                    object: 'panic',
                    payload: {
                        callId: newCall.id
                    }
                });
            }, 3000);

            return newCall;
        },
        createCitizenCall: async (
            parent,
            args,
            { Models, user, hasFivemToken }
        ) => {
            if (!hasFivemToken && !userHasRoles(['DISPATCHER'], user)) {
                return null;
            }

            if (!args.hasOwnProperty('steamId')) {
                return null;
            }

            // Get the user who created the call
            const callUser = await Models.User.findOne({
                where: {
                    steamId: args.steamId
                }
            });

            if (!callUser) {
                return null;
            }

            // Get the hardcoded incident type, call grade & call type
            const incidentType = await Models.IncidentType.findOne({
                where: { code: 'CITIZEN_CALL' }
            });
            const callGrade = await Models.CallGrade.findOne({
                where: { code: 'CITIZEN_CALL' }
            });
            const callType = await Models.CallType.findOne({
                where: { code: 'CITIZEN_CALL' }
            });

            if (!incidentType || !callGrade || !callType) {
                return null;
            }

            let newCall;
            try {
                newCall = await createCall(
                    {
                        DepartmentId: args.DepartmentId,
                        markerX: callUser.x,
                        markerY: callUser.y,
                        callerInfo: args.callerInfo,
                        callType,
                        callGrade,
                        callLocations: [{ id: args.location }],
                        callIncidents: [incidentType],
                        callDescriptions: [{ id: null, text: args.notes }]
                    },
                    { Models }
                );
            } catch (err) {
                return null;
            }

            return newCall;
        },
        createMap: (parent, args, { Models }) => Models.Map.create(args),
        updateMap: (parent, args, { Models }) =>
            Models.Map.update(args, {
                returning: ['*'],
                where: { id: args.id }
            }).then(([_, [ret]]) => ret),
        deleteMap: async (parent, args, { Models }) => {
            const toDelete = await Models.Map.findOne({
                where: { id: args.id }
            });
            if (!toDelete.readonly) {
                await toDelete.destroy();
                return args.id;
            }
        }
    },
    Subscription: {
        callAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CALL_ADDED])
        },
        callUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CALL_UPDATED])
        },
        callDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CALL_DELETED])
        },
        allCallsDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.ALL_CALLS_DELETED
                ])
        },
        callGradeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CALL_GRADE_ADDED])
        },
        callGradeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CALL_GRADE_DELETED
                ])
        },
        callGradeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CALL_GRADE_UPDATED
                ])
        },
        callTypeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CALL_TYPE_ADDED])
        },
        locationAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.LOCATION_ADDED])
        },
        callTypeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CALL_TYPE_DELETED
                ])
        },
        locationDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.LOCATION_DELETED])
        },
        callTypeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CALL_TYPE_UPDATED
                ])
        },
        locationUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.LOCATION_UPDATED])
        },
        incidentTypeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.INCIDENT_TYPE_ADDED
                ])
        },
        incidentTypeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.INCIDENT_TYPE_DELETED
                ])
        },
        incidentTypeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.INCIDENT_TYPE_UPDATED
                ])
        },
        userRankAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.USER_RANK_ADDED])
        },
        userRankDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.USER_RANK_DELETED
                ])
        },
        userRankUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.USER_RANK_UPDATED
                ])
        },
        userDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.USER_DELETED])
        },
        unitTypeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.UNIT_TYPE_ADDED])
        },
        unitTypeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.UNIT_TYPE_DELETED
                ])
        },
        unitTypeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.UNIT_TYPE_UPDATED
                ])
        },
        unitStateAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.UNIT_STATE_ADDED])
        },
        unitStateDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.UNIT_STATE_DELETED
                ])
        },
        unitStateUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.UNIT_STATE_UPDATED
                ])
        },
        userUnitToggle: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.USER_UNIT_TOGGLE])
        },
        userUnitAssigned: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.USER_UNIT_ASSIGNED
                ])
        },
        unitCallToggle: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.UNIT_CALL_TOGGLE])
        },
        unitAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.UNIT_ADDED])
        },
        unitUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.UNIT_UPDATED])
        },
        unitDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.UNIT_DELETED])
        },
        userLocationChanged: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.USER_LOCATION_CHANGED
                ])
        },
        bolosSubscription: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.BOLOS_SUBSCRIPTION
                ])
        },
        ethnicityAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.ETHNICITY_ADDED])
        },
        departmentAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.DEPARTMENT_ADDED])
        },
        departmentUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_UPDATED
                ])
        },
        departmentDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_DELETED
                ])
        },
        departmentAnnouncementAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_ANNOUNCEMENT_ADDED
                ])
        },
        departmentAnnouncementUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_ANNOUNCEMENT_UDPATED
                ])
        },
        departmentAnnouncementDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_ANNOUNCEMENT_DELETED
                ])
        },
        departmentDocumentAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_DOCUMENT_ADDED
                ])
        },
        departmentDocumentUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_DOCUMENT_UDPATED
                ])
        },
        departmentDocumentDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.DEPARTMENT_DOCUMENT_DELETED
                ])
        },
        ethnicityUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.ETHNICITY_UPDATED
                ])
        },
        ethnicityDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.ETHNICITY_DELETED
                ])
        },
        genderAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.GENDER_ADDED])
        },
        genderUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.GENDER_UPDATED])
        },
        genderDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.GENDER_DELETED])
        },
        vehicleModelAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.VEHICLE_MODEL_ADDED
                ])
        },
        vehicleModelUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.VEHICLE_MODEL_UPDATED
                ])
        },
        vehicleModelDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.VEHICLE_MODEL_DELETED
                ])
        },
        weaponTypeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.WEAPON_TYPE_ADDED
                ])
        },
        weaponTypeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.WEAPON_TYPE_UPDATED
                ])
        },
        weaponTypeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.WEAPON_TYPE_DELETED
                ])
        },
        weaponStatusAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.WEAPON_STATUS_ADDED
                ])
        },
        weaponStatusUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.WEAPON_STATUS_UPDATED
                ])
        },
        weaponStatusDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.WEAPON_STATUS_DELETED
                ])
        },
        insuranceStatusAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.INSURANCE_STATUS_ADDED
                ])
        },
        insuranceStatusUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.INSURANCE_STATUS_UPDATED
                ])
        },
        insuranceStatusDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.INSURANCE_STATUS_DELETED
                ])
        },
        licenceStatusAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.LICENCE_STATUS_ADDED
                ])
        },
        licenceStatusUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.LICENCE_STATUS_UPDATED
                ])
        },
        licenceStatusDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.LICENCE_STATUS_DELETED
                ])
        },
        licenceTypeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.LICENCE_TYPE_ADDED
                ])
        },
        licenceTypeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.LICENCE_TYPE_UPDATED
                ])
        },
        licenceTypeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.LICENCE_TYPE_DELETED
                ])
        },
        chargeAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CHARGE_ADDED])
        },
        chargeUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CHARGE_UPDATED])
        },
        chargeDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CHARGE_DELETED])
        },
        warrantAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.WARRANT_ADDED])
        },
        warrantUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.WARRANT_UPDATED])
        },
        warrantDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.WARRANT_DELETED])
        },
        citizenAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CITIZEN_ADDED])
        },
        citizenUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CITIZEN_UPDATED])
        },
        citizenDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.CITIZEN_DELETED])
        },
        officerAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.OFFICER_ADDED])
        },
        officerUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.OFFICER_UPDATED])
        },
        characterActiveUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CHARACTER_ACTIVE_UPDATED
                ])
        },
        officerDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.OFFICER_DELETED])
        },
        vehicleAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.VEHICLE_ADDED])
        },
        vehicleUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.VEHICLE_UPDATED])
        },
        vehicleDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.VEHICLE_DELETED])
        },
        weaponAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.WEAPON_ADDED])
        },
        weaponUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.WEAPON_UPDATED])
        },
        weaponDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.WEAPON_DELETED])
        },
        offenceAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.OFFENCE_ADDED])
        },
        offenceUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.OFFENCE_UPDATED])
        },
        offenceDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.OFFENCE_DELETED])
        },
        ticketAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.TICKET_ADDED])
        },
        ticketUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.TICKET_UPDATED])
        },
        ticketDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.TICKET_DELETED])
        },
        arrestAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.ARREST_ADDED])
        },
        arrestUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.ARREST_UPDATED])
        },
        arrestDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.ARREST_DELETED])
        },
        licenceAdded: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.LICENCE_ADDED])
        },
        licenceUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.LICENCE_UPDATED])
        },
        licenceDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.LICENCE_DELETED])
        },
        userUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([Constants.subscriptions.USER_UPDATED])
        },
        markerAttachedToCitizen: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.MARKER_ATTACHED_TO_CITIZEN
                ])
        },
        markerDetachedFromCitizen: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.MARKER_DETACHED_FROM_CITIZEN
                ])
        },
        markerAttachedToVehicle: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.MARKER_ATTACHED_TO_VEHICLE
                ])
        },
        markerDetachedFromVehicle: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.MARKER_DETACHED_FROM_VEHICLE
                ])
        },
        citizenMarkerAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CITIZEN_MARKER_ADDED
                ])
        },
        vehicleMarkerAdded: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.VEHICLE_MARKER_ADDED
                ])
        },
        citizenMarkerUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CITIZEN_MARKER_UPDATED
                ])
        },
        vehicleMarkerUpdated: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.VEHICLE_MARKER_UPDATED
                ])
        },
        citizenMarkerDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.CITIZEN_MARKER_DELETED
                ])
        },
        vehicleMarkerDeleted: {
            subscribe: () =>
                pubsub.asyncIterator([
                    Constants.subscriptions.VEHICLE_MARKER_DELETED
                ])
        }
    },
    Department: {
        announcements(department, args, { Models }) {
            return Models.DepartmentAnnouncement.findAll({
                include: [
                    {
                        model: Models.Department,
                        where: { id: department.id }
                    }
                ]
            });
        },
        documents(department, args, { Models }) {
            return Models.DepartmentDocument.findAll({
                include: [
                    {
                        model: Models.Department,
                        where: { id: department.id }
                    }
                ]
            });
        }
    },
    Unit: {
        users(unit, args, { Models }) {
            return Models.User.findAll({
                include: [
                    {
                        model: Models.Unit,
                        as: 'units',
                        where: { id: unit.id }
                    }
                ]
            });
        },
        unitType(unit, args, { Models }) {
            return Models.UnitType.findOne({ where: { id: unit.UnitTypeId } });
        },
        unitState(unit, args, { Models }) {
            return Models.UnitState.findOne({
                where: { id: unit.UnitStateId }
            });
        },
        assignedCalls(unit, args, { Models }) {
            return Models.Call.findAll({
                include: [
                    {
                        model: Models.Unit,
                        where: { id: unit.id }
                    }
                ]
            });
        }
    },
    User: {
        roles(user, args, { Models }) {
            return Models.UserType.findAll({
                include: [
                    {
                        as: 'users',
                        model: Models.User,
                        where: { id: user.id }
                    }
                ]
            });
        },
        units(user, args, { Models }) {
            return user.getUnits();
        },
        citizens(user, args, { Models }) {
            return Models.Citizen.findAll({
                where: { UserId: user.id }
            });
        },
        officers(user, args, { Models }) {
            return Models.Officer.findAll({
                where: { UserId: user.id }
            });
        },
        character(user, args, { Models }) {
            return getCharacter(user);
        }
    },
    Officer: {
        department(character, args, { Models }) {
            return Models.Department.findOne({
                where: { id: character.DepartmentId }
            });
        }
    },
    Call: {
        callDescriptions(call, args, { Models }) {
            return Models.CallDescription.findAll({
                where: { CallId: call.id },
                order: [['createdAt', 'ASC']]
            });
        },
        callLocations(call, args, { Models }) {
            return Models.Location.findAll({
                include: [
                    {
                        model: Models.Call,
                        where: { id: call.id }
                    }
                ]
            });
        },
        callIncidents(call, args, { Models }) {
            return Models.IncidentType.findAll({
                include: [
                    {
                        model: Models.Call,
                        where: { id: call.id }
                    }
                ]
            });
        },
        callGrade(call, args, { Models }) {
            return Models.CallGrade.findOne({
                where: { id: call.CallGradeId }
            });
        },
        callType(call, args, { Models }) {
            return Models.CallType.findOne({ where: { id: call.CallTypeId } });
        },
        assignedUnits(call, args, { Models }) {
            return Models.Unit.findAll({
                include: [
                    {
                        model: Models.Call,
                        where: { id: call.id }
                    }
                ]
            });
        }
    },
    Citizen: {
        offences(citizen, args, { Models }) {
            return citizen.getOffences();
        },
        markers(citizen, args, { Models }) {
            return citizen.getMarkers();
        },
        gender(citizen, args, { Models }) {
            return Models.Gender.findOne({
                where: { id: citizen.GenderId }
            });
        },
        ethnicity(citizen, args, { Models }) {
            return Models.Ethnicity.findOne({
                where: { id: citizen.EthnicityId }
            });
        },
        weapons(citizen, args, { Models }) {
            return citizen.getWeapons();
        },
        vehicles(citizen, args, { Models }) {
            return citizen.getVehicles();
        },
        licences(citizen, args, { Models }) {
            return citizen.getLicences();
        },
        warrants(citizen, args, { Models }) {
            return citizen.getWarrants();
        },
        user(citizen, args, { Models }) {
            return Models.User.findOne({
                where: { id: citizen.UserId }
            });
        }
    },
    Weapon: {
        weaponType(weapon, args, { Models }) {
            return Models.WeaponType.findOne({
                where: { id: weapon.WeaponTypeId }
            });
        },
        weaponStatus(weapon, args, { Models }) {
            return Models.WeaponStatus.findOne({
                where: { id: weapon.WeaponStatusId }
            });
        },
        citizen(weapon, args, { Models }) {
            return Models.Citizen.findOne({
                where: { id: weapon.CitizenId }
            });
        }
    },
    Vehicle: {
        vehicleModel(vehicle, args, { Models }) {
            return Models.VehicleModel.findOne({
                where: { id: vehicle.VehicleModelId }
            });
        },
        insuranceStatus(vehicle, args, { Models }) {
            return Models.InsuranceStatus.findOne({
                where: { id: vehicle.InsuranceStatusId }
            });
        },
        citizen(vehicle, args, { Models }) {
            return Models.Citizen.findOne({
                where: { id: vehicle.CitizenId }
            });
        },
        markers(vehicle, args, { Models }) {
            return vehicle.getMarkers();
        }
    },
    Licence: {
        licenceType(licence, args, { Models }) {
            return Models.LicenceType.findOne({
                where: { id: licence.LicenceTypeId }
            });
        },
        licenceStatus(licence, args, { Models }) {
            return Models.LicenceStatus.findOne({
                where: { id: licence.LicenceStatusId }
            });
        },
        citizen(licence, args, { Models }) {
            return Models.Citizen.findOne({
                where: { id: licence.CitizenId }
            });
        }
    },
    Offence: {
        charges(offence, args, { Models }) {
            return Models.Charge.findAll({
                include: [
                    {
                        model: Models.Offence,
                        where: { id: offence.id }
                    }
                ]
            });
        },
        arrest(offence, args, { Models }) {
            return Models.Arrest.findOne({
                where: { OffenceId: offence.id }
            });
        },
        ticket(offence, args, { Models }) {
            return Models.Ticket.findOne({
                where: { OffenceId: offence.id }
            });
        }
    },
    Arrest: {
        charges(arrest, args, { Models }) {
            return Models.Charge.findAll({
                include: [
                    {
                        model: Models.Arrest,
                        where: { id: arrest.id }
                    }
                ]
            });
        },
        officer(arrest, args, { Models }) {
            return Models.Officer.findOne({
                where: { id: arrest.OfficerId }
            });
        }
    },
    Ticket: {
        officer(ticket, args, { Models }) {
            return Models.Officer.findOne({
                where: { id: ticket.OfficerId }
            });
        }
    },
    CharacterResult: {
        __resolveType(obj) {
            return obj.dataValues.hasOwnProperty('weight')
                ? 'Citizen'
                : 'Officer';
        }
    }
};
