pragma circom 2.0.0;

include "./utils.circom";
include "./circomlib/circuits/comparators.circom";

template msweeper() {

    signal input solved[256];
    signal input commitment;

    // private
    signal input solution[256];

    signal output out; // win = 1, not = 0

    // Hash solution
    component preImage = CalculateTotal(256);
    component hasher = Poseidon(1);
    component totalSolved = CalculateTotal(256);
    
    for(var v = 0; v < 256; v++){
        assert(solved[v] == solution[v] || solved[v] == 0);
        preImage.nums[v] <== solution[v];
        totalSolved.nums[v] <== solved[v];
    }

    hasher.inputs[0] <== preImage.sum;

    commitment === hasher.out;

    component isEqual = IsEqual();
    isEqual.in[0] <== preImage.sum;
    isEqual.in[1] <== totalSolved.sum;

    out <== isEqual.out;
}

component main { public [commitment]} = msweeper();