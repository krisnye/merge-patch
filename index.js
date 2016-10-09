
function isObject(a) {
    let type = typeof a;
    return a != null && (type === 'object' || type == 'function')
}

function diff(oldValue, newValue) {
    // returns a patch which can convert from the oldValue to the newValue
    // returns undefined if there is no difference between them
    // the patch SHOULD be treated as readonly, since it may reference pre-existing objects
    if (oldValue == newValue) {
        return undefined;
    }
    if (!(oldValue != null && newValue != null && typeof newValue === 'object' && typeof oldValue === 'object')) {
        return newValue != null ? newValue : null;
    }
    if (!Array.isArray(oldValue) && Array.isArray(newValue)) {
        return newValue;
    }
    // old == array, but new isn't, so we add a special length:null value
    if (Array.isArray(oldValue) && !Array.isArray(newValue)) {
        var newValue = JSON.parse(JSON.stringify(newValue));
        // this indicates that the array must be converted to an object.
        newValue.length = null;
        return newValue;
    }
    var patch = undefined;
    for (var name in oldValue) {
        if (oldValue.hasOwnProperty(name)) {
            if (!newValue.hasOwnProperty(name)) {
                if (patch == null) {
                    patch = {};
                }
                patch[name] = null;
            }
            else {
                var propertyDiff = diff(oldValue[name], newValue[name]);
                if (propertyDiff !== undefined) {
                    if (patch == null) {
                        patch = {};
                    }
                    patch[name] = propertyDiff;
                }
            }
        }
    }
    for (var name in newValue) {
        if (newValue.hasOwnProperty(name) && !oldValue.hasOwnProperty(name)) {
            if (patch == null) {
                patch = {};
            }
            patch[name] = newValue[name];
        }
    }
    // if they are both arrays and the new value is shorter, then shorten the length
    if (Array.isArray(oldValue) && Array.isArray(newValue) && newValue.length < oldValue.length) {
        patch.length = newValue.length;
        for (var i = newValue.length; i < oldValue.length; i++) {
            delete patch[i];
        }
    }
    return patch;
}

function merge(target, patch, deleteNull) {
    // length: null when targetting an Array indicates to convert Array to Object.
    if (Array.isArray(target) && patch != null && patch.length === null) {            
        target = {};
        delete patch.length;
    }

    if (patch == null || patch != null && patch.constructor !== Object) {
        if (Array.isArray(patch)) {
            return JSON.parse(JSON.stringify(patch));
        }
        else {
            return patch;
        }
    }
    if (!isObject(target)) {
        target = {};
    }
    var deletedValues = false;
    for (key in patch) {
        var value = patch[key];
        if (deleteNull && value == null) {
            deletedValues = true;
            delete target[key];
        }
        else {
            target[key] = merge(target[key], value, deleteNull);
        }
    }
    if (deletedValues && Array.isArray(target)) {
        // shorten the length
        for (var i = target.length; i > 0; i--) {
            if (target[i - 1] == null) {
                target.length = i - 1;
            }
        }
    }
    return target;
}

function apply(target, patch) {
    return merge(target, patch, true);
}

function combine(patch1, patch2) {
    return merge(patch1, patch2, false);
}

exports.apply = apply
exports.diff = diff
exports.combine = combine
