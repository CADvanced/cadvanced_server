import deepCleaner from 'deep-cleaner';

export const stripTypename = (req, res, next) => {
    let vars = req.body.variables;
    deepCleaner(vars, '__typename');
    next();
};
