module.exports = {
    up: (queryInterface, Sequelize) => {
        const valMap = {
            'Call Manager': 'CALL_MGR',
            'Unit Manager': 'UNIT_MGR',
            'User Manager': 'OFFICER_MGR',
            Player: 'PLAYER',
            Dispatcher: 'DISPATCHER',
            'Preference Manager': 'PREF_MGR'
        };
        const promises = Object.keys(valMap).map(key => {
            return queryInterface.bulkUpdate(
                'UserTypes',
                { code: valMap[key] },
                { name: key }
            );
        });
        return Promise.all(promises);
    },
    down: (queryInterface, Sequelize) => {}
};
