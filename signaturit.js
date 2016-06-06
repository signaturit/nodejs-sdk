var _credentials,
    _production,
    Q   = require('q'),
    fs  = require('fs'),
    req = require('request');

function requestWithDeferred (method, path, qs, body) {
    var deferred = Q.defer();

    request(deferred, method, path, qs, body);

    return deferred.promise;
}

function request (deferred, method, path, qs, body) {
    var base = _production ? 'https://api.signaturit.com' : 'https://api.sandbox.signaturit.com';

    return req({
        method: method,
        encoding: null,
        uri: base + path,
        qs: qs,
        body: body,
        auth: {
            bearer: _credentials
        },
        headers: {
            'User-Agent': 'signaturit-node-sdk 1.0.2'
        },
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode < 400) {
            deferred.resolve(body);
        } else {
            deferred.reject(body);
        }
    });
}

function extractQueryParameters(conditions)
{
    var parameters = {}, key;

    for (key in conditions) {
        if (key === 'ids') {
            conditions[key] = value.join(',');
        }

        parameters[key] = conditions[key]
    }

    return parameters;
}

function fillArray(formArray, values, parent)
{
    var key, value, parentKey;

    for (key in values) {
        value     = values[key];
        parentKey = parent.length === 0 ? key : parent + "[" + key + "]";

        if (value instanceof Array || value instanceof Object) {
            fillArray(formArray, value, parentKey);
        } else {
            formArray.append(parentKey, value);
        }
    }
}

function extractPostParameters (form, files, recipients, parameters)
{
    files = [].concat(files);

    files.forEach(function(filePath, i) {
        form.append(
            'files[' + i + ']',
            fs.createReadStream(filePath)
        );
    });

    recipients = [].concat(recipients);

    recipients.forEach(function(recipient, i) {
        fillArray(form, recipient, 'recipients['+i+']');
    });

    parameters = parameters || {};

    fillArray(form, parameters, '');

    return form;
}

function SignaturitClient (credentials, production) {
    _credentials = credentials;
    _production  = production;
}

SignaturitClient.prototype.getSignature = function (signatureId) {
    return requestWithDeferred('GET', '/v3/signatures/' + signatureId + '.json');
};

SignaturitClient.prototype.getSignatures = function (limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/signatures.json', parameters);
};

SignaturitClient.prototype.countSignatures = function (conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v3/signatures/count.json', parameters);
};

SignaturitClient.prototype.downloadAuditTrail = function (signatureId, documentId) {
    return requestWithDeferred('GET', '/v3/signatures/' + signatureId + '/documents/' + documentId + '/download/audit_trail');
};

SignaturitClient.prototype.downloadSignedDocument = function (signatureId, documentId) {
    return requestWithDeferred('GET', '/v3/signatures/' + signatureId + '/documents/' + documentId + '/download/signed');
};

SignaturitClient.prototype.createSignature = function (filesPath, recipients, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v3/signatures.json'),
        form     = req.form();

    extractPostParameters(form, filesPath, recipients, params);

    return deferred.promise;
};

SignaturitClient.prototype.cancelSignature = function (signatureId) {
    return requestWithDeferred('PATCH', '/v3/signatures/' + signatureId + '/cancel.json');
};

SignaturitClient.prototype.sendSignatureReminder = function (signatureId) {
    return requestWithDeferred('POST', '/v3/signatures/' + signatureId + '/reminder.json');
};

SignaturitClient.prototype.getBranding = function (brandingId) {
    return requestWithDeferred('GET', '/v3/brandings/' + brandingId + '.json');
};

SignaturitClient.prototype.getBrandings = function () {
    return requestWithDeferred('GET', '/v3/brandings.json');
};

SignaturitClient.prototype.createBranding = function (params) {
    return requestWithDeferred('POST', '/v3/brandings.json', null, params);
};

SignaturitClient.prototype.updateBranding = function (brandingId, params) {
    return requestWithDeferred('PATCH', '/v3/brandings/' + brandingId + '.json', null, params);
};

SignaturitClient.prototype.getTemplates = function (limit, offset) {
    var parameters = {}

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/templates.json', parameters);
};

SignaturitClient.prototype.getEmails = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/emails.json', parameters);
};

SignaturitClient.prototype.countEmails = function(conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v3/emails/count.json', parameters);
};

SignaturitClient.prototype.getEmail = function(emailId) {
    return requestWithDeferred('GET', "/v3/emails/" + emailId + ".json");
};


SignaturitClient.prototype.createEmail = function(files, recipients, subject, body, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v3/emails.json'),
        form     = req.form();

    extractPostParameters(form, files, recipients, params);

    form.append('subject', subject);
    form.append('body', body);

    return deferred.promise;
};

SignaturitClient.prototype.downloadEmailAuditTrail = function (emailId, certificateId) {
    return requestWithDeferred('GET', '/v3/emails/' + emailId + '/certificates/' + certificateId + '/download/audit_trail');
};

module.exports = SignaturitClient;
