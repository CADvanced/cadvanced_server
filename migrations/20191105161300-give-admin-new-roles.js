module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.sequelize
            .query('SELECT MIN(id) FROM "Users"')
            .then(rows => {
                const id = rows[0][0].min;
                return queryInterface.sequelize
                    .query('SELECT id FROM "UserTypes"')
                    .then(typeRows => {
                        const allTypes = typeRows[0].map(typeRow => typeRow.id);
                        return queryInterface.sequelize
                            .query(
                                'DELETE FROM "UserRoles" where "UserId" = ' + id
                            )
                            .then(() => {
                                const fields = allTypes.map(type => ({
                                    createdAt: new Date(),
                                    updatedAt: new Date(),
                                    UserId: id,
                                    UserTypeId: type
                                }));
                                return queryInterface.bulkInsert(
                                    'UserRoles',
                                    fields
                                );
                            });
                    });
            });
    },
    down: (queryInterface, Sequelize) => {}
};
