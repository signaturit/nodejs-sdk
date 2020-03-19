SignaturitClient = require('./signaturit.js');

describe('Signaturit SDK', function () {
    it('Get signature', function () {
        var client = new SignaturitClient('foo', false);

        expect(client).toBeInstanceOf(SignaturitClient);
    })
});
