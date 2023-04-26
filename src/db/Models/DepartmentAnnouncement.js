export default (sequelize, DataTypes) => {
    const DepartmentAnnouncement = sequelize.define('DepartmentAnnouncement', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        text: { type: DataTypes.TEXT, allowNull: false }
    });
    DepartmentAnnouncement.associate = function (models) {
        models.DepartmentAnnouncement.belongsTo(models.Department, {
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    };
    return DepartmentAnnouncement;
};
