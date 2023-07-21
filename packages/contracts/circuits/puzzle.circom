pragma circom 2.0.0;

include "./utils.circom";


template puzzle() {

    signal input position;
    signal input solved[256];

    // private
    signal input solution[256];
    signal input solutionAtPosition;
    signal input seed; // hashing from server side

    signal output out; // bomb = position+seed+1, not = position+seed

    for(var v = 0; v < 256; v++){
        assert(solved[v] == solution[v] || solved[v] == 0);
    }

    component isEqual = IsEqual();
    isEqual.in[0] <== solutionAtPosition;
    isEqual.in[1] <== 10;

    component preImage = CalculateTotal(3);
    preImage.nums[0] <== position;
    preImage.nums[1] <== seed;
    preImage.nums[2] <== isEqual.out;

    out <== preImage.sum;
}

component main = puzzle();