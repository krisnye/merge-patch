
var {patch,diff} = require('./')

function assertEqual(a, b) {
    a = JSON.stringify(a)
    b = JSON.stringify(b)
    if (a !== b) {
        throw new Error(a + " !== " + b)
    }
} 
function double(x) {
    return x * 2;
}

//  patch
assertEqual({a:{b:2,c:3},d:4}, patch({a:{b:2}}, {a:{c:3},d:4}))
assertEqual({b:2}, patch(null, {b:2}))
assertEqual({a:1,b:2}, patch({a:1,b:2,c:3}, {c:undefined}))
assertEqual({a:double}, patch({},{a:double}))
assertEqual({a:[]}, patch({a:[1,2]}, {a:[]}))
// assigning null on an array just sets null to that index
assertEqual([1], patch([1,2], {1:null}))
assertEqual(patch([1,2], {1:null}).length, 1);
assertEqual(patch({foo:[1,2]}, {foo:{1:null}}).foo.length, 1);
assertEqual([1], patch([1,2], {1:undefined}))
// //  diff
assertEqual({b:2}, diff({a:1}, {a:1,b:2}))
assertEqual({a:{b:3,c:null}}, diff({a:{b:2,c:4}}, {a:{b:3}}))
assertEqual({a:1}, diff(null, {a:1}))
assertEqual({c:{d:{f:4}}}, diff({a:1,b:2,c:{d:{e:1,f:2}}}, {a:1,b:2,c:{d:{e:1,f:4}}}))
assertEqual(null, diff({a:1}, undefined))
assertEqual(null, diff({a:1}, null))
assertEqual(undefined, diff({a:{b:2}}, {a:{b:2}}))
// diff on arrays should result in shorter value length
assertEqual(diff([1,2,3], [3,2]), { '0': 3, length: 2 });
// diff between array and object
assertEqual(diff([], {}), {length:null})
assertEqual(diff({}, []), [])
var start = [1,2,3]
var delta = diff(start, {foo:"a"})
var result = patch(start, delta)
assertEqual(result, {foo:"a"})

console.log("Tests Passed");
