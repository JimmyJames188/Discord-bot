function deepEquel(object1, object2) {
    const areObjects = isObject(object1) && isObject(object2);
    const areArrays = isArray(object1) && isArray(object2);

    if(areObjects){
        return deepEqualObject(object1, object2)
    }else if(areArrays){
        return deepEqualArray(object1, object2)
    }else{
        return object1 === object2
    }
}
exports.deepEquel = deepEquel

function deepEqualObject(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    if (keys1.length !== keys2.length) {
      return false;
    }
  
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        const areArrays = isArray(val1) && isArray(val2);
        if(areArrays){
            if(!deepEqualArray(val1, val2)){
                return false;
            }
        }else if(
            areObjects && !deepEqualObject(val1, val2) ||
            !areObjects && val1 !== val2){
                return false;
        }
    }
  
    return true;
}
exports.deepEqualObject = deepEqualObject

function deepEqualArray(object1, object2) {
  
    if (object1.length !== object2.length) {
        return false;
    }
  
    for (var i = 0; i < object1.length; i++) {
        const val1 = object1[i];
        const val2 = object2[i];
        const areObjects = isObject(val1) && isObject(val2);
        const areArrays = isArray(val1) && isArray(val2);
        if(areObjects){
            if(!deepEqualObject(val1, val2)){
                return false;
            }
        }else if(
            areArrays && !deepEqualArray(val1, val2) ||
            !areArrays && val1 !== val2){
                return false;
        }
    }
  
    return true;
}
exports.deepEqualArray = deepEqualArray
  

function isArray(array) {
    return array != null && typeof array === 'array';
}
exports.isArray = isArray

function isObject(object) {
    return object != null && typeof object === 'object';
}
exports.isObject = isObject
