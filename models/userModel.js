module.exports = (Sequelize, sequelize, DataTypes) => {
    return sequelize.define(
        "user",
        {
            ...require("./cors")(Sequelize, DataTypes),
            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null,
            },
            
            
        },
        {
            tableName: "user",
        }
    );
};
