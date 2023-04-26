module.exports = {
    up: (queryInterface, Sequelize) => {
        const valMap = {
            'Call Manager': 'Manage call values',
            'Unit Manager': 'Manage unit values',
            'User Manager': 'Manage officer values',
            'Preference Manager': 'Manage preferences'
        };
        const promises = Object.keys(valMap).map(key => {
            return queryInterface.bulkUpdate(
                'UserTypes',
                { name: valMap[key] },
                { name: key }
            );
        });
        return Promise.all(promises);
    },
    down: (queryInterface, Sequelize) => {}
};
