pragma circom 2.0.0;

include "./utils.circom";
include "./circomlib/circuits/comparators.circom";

template puzzle() {

    signal input position;
    signal input solved[256];
    signal input commitment;

    // private
    signal input solution[256];
    signal input solutionAtPosition;

    signal output out; // bomb = 1, not = 0

    // Hash solution
    component preImage = CalculateTotal(256);
    component hasher = Poseidon(1);

    for(var v = 0; v < 256; v++){
        assert(solved[v] == solution[v] || solved[v] == 0);
        preImage.nums[v] <== solution[v];
    }

    hasher.inputs[0] <== preImage.sum;

    commitment === hasher.out;

    component isEqual = IsEqual();
    isEqual.in[0] <== solutionAtPosition;
    isEqual.in[1] <== 10;

    out <== isEqual.out;
}

component main { public [commitment]} = puzzle();