'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            { tableName: 'VehicleModels' },
            [
                {
                    name: 'Albany Alpha',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Buccaneer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Buccaneer Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Cavalcade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Emperor',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Fränken Stange',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Manana',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Primo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Roosevelt',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Stretch',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Virgo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Virgo Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Albany Washington',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Annis Elegy RH8',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Annis Elegy Retro Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Annis RE-78',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'BF Bifta',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'BF Dune Buggy',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'BF Ingection',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'BF Raptor',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'BF Surfer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Dubsta',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Dubsta 6X6',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Glendale',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Panto',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Schafter',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Schwartzer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Stirling GT',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Surano',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor Surrano',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Benefactor XLS',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bollokan Prairie',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Banshee',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Banshee 900R',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Bison',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Buffalo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Buffalo S',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Duneloader',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Gauntlet',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Gresley',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Paradise',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Rat-Loader',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Rumpo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Youga',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Bravado Youga Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Armored Boxville',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Boxville',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Bus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Camper',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Dashound',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Pony',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Shuttle Bus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Stockade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Taco Van',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Tipper',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Tour Bus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Brute Utility Truck',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Buckingham Alpha-Z1',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Canis Bodhi',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Canis Crusader',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Canis Kalahari',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Canis Mesa',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Canis Mesa (Merryweather)',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Canis Seminole',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Chariot (Albany) Romero Hearse',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Cheval Fugitive',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Cheval Picador',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Cheval Surge',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Coil Brawler',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Coil Voltic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Asea',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Burrito',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Drift Tampa',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Granger',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Moonbeam',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Premier',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Rancher XL',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Rhapsody',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Sabre Turbo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Tampa',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Tornado',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Tornado Cabrio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Vigero',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Voodoo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Declasse Z-Type',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Exemplar',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee JB 700',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Massacro',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Rapid GT',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Rapid GT Cabrio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Rapid GT Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Seven-70',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Specter',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dewbauchee Vagner',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Akuma',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Blista',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Double-T',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Enduro',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Jester',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Thrust',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Thrust',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Vindicator',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dinka Vindicator',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dundreary Landstalker',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Dundreary Regina',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Eastern Motorcycle Company Gargoyle',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Emperor ETR1',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Emporer Habenero',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Cognoscenti',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Cognoscenti 55',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Cognoscenti 55 Armored',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Cognoscenti Armored',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Cognoscenti Cabrio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Huntley S',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Super Diamond',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Windsor',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Enus Windsor Drop',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Gallivanter Baller',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Gallivanter Baller LE',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Gallivanter Baller LE Armored',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Bestia GTS',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Brioso R/A',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Carbonizzare',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Cheetah',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Cheetah Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Stinger',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Stinger GT',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Turismo Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Turismo R',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti Visione',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Grotti X80 Proto',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'HVY Barracks',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'HVY Barracks Semi',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'HVY Biff',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'HVY Mixer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'HVY Ripley',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'HVY Tipper',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Hijak Khamelion',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Imponte Nightshade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Imponte Phoenix',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Imponte Ruiner',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Imponte Ruiner',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Invetero Coquette',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Invetero Coquette BlackFin',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Invetero Coquette Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Invetero Coquette Classic Cabrio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'JoBuilt Hauler',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'JoBuilt Phantom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'JoBuilt Rubble',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Asterope',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin BeeJay XL',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Diletantte',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Futo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Intruder',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Kuruma',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Rebel',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Sultan',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Karin Sultan RS',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'LCC Avarus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Casco',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Felon',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Felon GT',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Furore GT',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Pigalle',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Toro',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Lampadati Tropor Rallye',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Liberty City Cycles Hexer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Liberty City Cycles Innovation',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'MTL Brickade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'MTL Dune',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'MTL Flatbed',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'MTL Packer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'MTL Pounder',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Maibatsu Manchez',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Maibatsu Mule',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Maibatsu Mule',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Maibatsu Penumbra',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Maibatsu Sanchez',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Mammoth Patriot',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Nagasaki BF400',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Nagasaki Caddy',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Nagasaki Carbon RS',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Nagasaki Carbon RS',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Nagasaki Chimera',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Nagasaki Street Blaze',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Obey 9F',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Obey 9F Cabrio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Obey Omnis',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Obey Rocoto',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Obey Tailgater',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ocelot Ardent',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ocelot F620',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ocelot Jackal',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ocelot Lynx',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ocelot Penetrator',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ocelot XA-21',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Overflod Entity XF',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Bati 801',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Bati 801RR',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Esskey',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi FCR 1000',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi FCR 1000 Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Faggio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Faggio Mod',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Fagio Sport',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Infernus Classic',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Infurnus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Monroe',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Osiris',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Reaper',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Ruffian',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Tempesta',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Torero',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Vacca',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Vortex',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pegassi Zentorno',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pfister 811',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pfister Comet',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Pfister Comet Retro Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Police Prison Bus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Principe Diablous',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Principe Diablous Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Principe Lectro',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Principe Nemesis',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Progen GP1',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Progen Itali GTB',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Progen Itali GTB Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Progen T20',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Progen Tyrus',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Schyster Fusilade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Shitzu Defiler',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Shitzu Hakuchou',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Shitzu PCJ 600',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Shitzu Vader',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Stanley Fieldmaster',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Tow Truck',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Tow Truck (old)',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Truffade Adder',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Truffade Nero',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ubermacht Oracle',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ubermacht Sentinel',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ubermacht Sentinel XS',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ubermacht Zion',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Ubermacht Zion Cabrio',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Benson',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Blade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Bobcat XL',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Bullet',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Chino',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Chino Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Contender',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Dominator',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid FMJ',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Guardian',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Hotknife',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Minivan',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Peyote',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Radius',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Retinue',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Sadler',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Sandking SWB',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Sandking XL',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Scrap Truck',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Slamvan',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Speedo',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Stainer',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Taxi',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vapid Utility Truck (Contender)',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Vulcar Ingot',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Weeny Issi',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Western Motoercycle Company Sovereign',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Western Motorcycle Company Cliffhanger',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Western Motorcycle Company Daemon',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Western Motorcycle Company Daemon',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Western Motorcycle Company Nightblade',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Western Motorcyle Company Bagger',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Willard Faction',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Willard Faction Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Willard Faction Donk Custom',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Zirconium Journey',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                },
                {
                    name: 'Zirconium Stratum',
                    createdAt: Sequelize.fn('NOW'),
                    updatedAt: Sequelize.fn('NOW')
                }
            ],
            {}
        );
    },

    down: (queryInterface, Sequelize) => {}
};
