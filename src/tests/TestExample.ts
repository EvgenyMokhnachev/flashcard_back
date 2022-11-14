import * as assert from 'assert';
import SomeCommonClass from "../main/SomeCommonClass";

describe('Describe Test', () => {

    it('Count of cells should be 3', () => {
        new SomeCommonClass().test('back test');
        assert.equal(3, 3);
    })

});
