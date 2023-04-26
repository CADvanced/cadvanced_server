import Models from '../db/Models/index.js';

class CadState {
    constructor() {
        this.state = {
            preferences: {}
        };
    }

    init() {
        if (Models.hasOwnProperty('Preference')) {
            Models.Preference.findAll({ raw: true }).then(results => {
                // Take the array of prefs and return an object keyed on pref key
                this.state.preferences = results.reduce(
                    (acc, curr) => Object.assign(acc, { [curr.key]: curr }),
                    {}
                );
            });
        }
    }

    getPreferences() {
        return this.state.preferences;
    }

    getPreference(prefKey) {
        if (this.state.preferences.hasOwnProperty(prefKey)) {
            return this.state.preferences[prefKey].value;
        } else {
            return null;
        }
    }

    setPreference(prefKey, value) {
        if (this.state.preferences.hasOwnProperty(prefKey)) {
            this.state.preferences[prefKey].value = value;
        }
    }
}

export default new CadState();
