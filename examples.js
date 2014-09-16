SignaturitClient = require('./signaturit.js');

client = new SignaturitClient('MDcxYTIyMGQyYTI1ZWIyNDNiY2IyZGMyNzY3MmFhNTI2MDA1MTJiM2RiMzEwMTE1YTA3OTFjYzQ0ODEzOWYwZQ');

client.getAccount().then(function (account) {
    console.log(account);
});

client.setDocumentStorage('sftp', {
    auth_method: 'PASS',
    host: '',
    port: '22',
    dir: '/path',
    user: '',
    password: ''
}).then(function (account) {
    console.log(account);
});

client.revertToDefaultDocumentStorage().then(function (account) {
    console.log(account);
});

client.getSignature('e4f07bbb-3755-11e4-b3d4-0aa7697eb409').then(function (signature) {
    console.log(signature);
});

client.getSignatures().then(function (signatures) {
    console.log(signatures);
});

client.countSignatures().then(function (response) {
    console.log(response);
});

client.countSignatures('FINISHED').then(function (response) {
    console.log(response);
});

client.getSignatureDocument('e4f07bbb-3755-11e4-b3d4-0aa7697eb409', 'e52a703e-3755-11e4-b3d4-0aa7697eb409').then(function (document) {
    console.log(document);
});

client.getSignatureDocuments('e4f07bbb-3755-11e4-b3d4-0aa7697eb409').then(function (documents) {
    console.log(documents);
});

client.getAuditTrail('e4f07bbb-3755-11e4-b3d4-0aa7697eb409', 'e52a703e-3755-11e4-b3d4-0aa7697eb409', './audit_trail.pdf').then(function (data) {
    console.log(data);
});

client.getSignedDocument('e4f07bbb-3755-11e4-b3d4-0aa7697eb409', 'e52a703e-3755-11e4-b3d4-0aa7697eb409', './signed.pdf').then(function (data) {
    console.log(data);
});

client.createSignatureRequest('./file.pdf', 'ecentinela@gmail.com').then(function (signature) {
    console.log(signature);
});

client.getBranding('1d2d2b4f-3733-11e4-b3d4-0aa7697eb409').then(function (branding) {
    console.log(branding);
});

client.getBrandings().then(function (brandings) {
    console.log(brandings);
});

client.createBranding({
    subject_tag: 'Test'
}).then(function (branding) {
    console.log(branding);
});

client.updateBranding('3d4941d3-374f-11e4-b3d4-0aa7697eb409', {
    subject_tag: 'Test2'
}).then(function (branding) {
    console.log(branding);
});

client.updateBrandingLogo('3d4941d3-374f-11e4-b3d4-0aa7697eb409', './file.png').then(function (branding) {
    console.log(branding);
});

client.updateBrandingTemplate('3d4941d3-374f-11e4-b3d4-0aa7697eb409', 'sign_request', './file.html').then(function (branding) {
    console.log(branding);
});

client.getTemplates().then(function (templates) {
    console.log(templates);
});
