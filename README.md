# merge-patch

JSON Merge-Patch Implementation with Diff and Combine

This module exports three functions:

//  applies the patch to the target and returns the new value
function apply(target, patch)

//  returns the patch which will convert the old value to the new value
//  returns undefined if there is no change
function diff(oldValue, newValue)

//  combines two patches into a single patch which applies both changes
function combine(patch1, patch2)

