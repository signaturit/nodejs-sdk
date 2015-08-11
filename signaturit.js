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
    var base = _production ? 'https://api.signaturit.com' : 'http://api.sandbox.signaturit.com';

    return req({
        method: method,
        uri: base + path,
        qs: qs,
        body: body,
        auth: {
            bearer: _credentials
        },
        headers: {
            'User-Agent': 'signaturit-node-sdk 0.0.6'
        },
        json: true
    }, function (error, response, body) {
        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(body);
        }
    });
}

function extractQueryParameters(conditions)
{
    var parameters = {};

    for (var key in conditions) {
        if (key === 'data') {
            var data = conditions[key];

            for (var dataKey in data) {
                parameters[key][dataKey] = data[dataKey];
            }

            continue;
        }

        if (key === 'ids') {
            conditions[key] = value.join(',');
        }

        parameters[key] = conditions[key]
    }

    return parameters;
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
        if (recipient.email) {
            form.append('recipients[' + i + '][fullname]', recipient.fullname);
            form.append('recipients[' + i + '][email]', recipient.email);

            if (recipient.phone) {
                form.append('recipients[' + i + '][phone]', recipient.phone);
            }
        } else {
            form.append('recipients[' + i + ']', recipient);
        }
    });

    parameters = parameters || {};

    Object.keys(parameters).forEach(function(key) {
        if ('object' == typeof(parameters[key])) {
            Object.keys(parameters[key]).forEach(function(innerKey) {
                form.append(key +'[' + innerKey + ']', parameters[key][innerKey])
            });
        } else {
            form.append(key, parameters[key]);
        }
    });

    return form;
}

function SignaturitClient (credentials, production) {
    _credentials = credentials;
    _production  = production;
}

SignaturitClient.prototype.getAccount = function () {
    return requestWithDeferred('GET', '/v2/account.json');
};


SignaturitClient.prototype.getSignature = function (signatureId) {
    return requestWithDeferred('GET', '/v2/signs/' + signatureId + '.json');
};

SignaturitClient.prototype.getSignatures = function (limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v2/signs.json', parameters);
};

SignaturitClient.prototype.countSignatures = function (conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v2/signs/count.json', parameters);
};

SignaturitClient.prototype.getSignatureDocument = function (signatureId, documentId) {
    return requestWithDeferred('GET', '/v2/signs/' + signatureId + '/documents/' + documentId + '.json');
};

SignaturitClient.prototype.getSignatureDocuments = function (signatureId) {
    return requestWithDeferred('GET', '/v2/signs/' + signatureId + '/documents.json');
};

SignaturitClient.prototype.downloadAuditTrail = function (signatureId, documentId, path) {
    var deferred = Q.defer();

    request(deferred, 'GET', '/v2/signs/' + signatureId + '/documents/' + documentId + '/download/doc_proof').pipe(
        fs.createWriteStream(path)
    );

    return deferred.promise;
};

SignaturitClient.prototype.downloadSignedDocument = function (signatureId, documentId, path) {
    var deferred = Q.defer();

    request(deferred, 'GET', '/v2/signs/' + signatureId + '/documents/' + documentId + '/download/signed').pipe(
        fs.createWriteStream(path)
    );

    return deferred.promise;
};

SignaturitClient.prototype.createSignature = function (filesPath, recipients, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v2/signs.json'),
        form     = req.form();

    extractPostParameters(form, filesPath, recipients, params);

    return deferred.promise;
};

SignaturitClient.prototype.cancelSignaturet = function (signatureId) {
    return requestWithDeferred('PATCH', '/v2/signs/' + signatureId + '/cancel.json');
};

SignaturitClient.prototype.sendSignatureReminder = function (signatureId, documentId) {
    return requestWithDeferred('POST', '/v2/signs/' + signatureId + '/documents/' + documentId + '/reminder.json');
};

SignaturitClient.prototype.getBranding = function (brandingId) {
    return requestWithDeferred('GET', '/v2/brandings/' + brandingId + '.json');
};

SignaturitClient.prototype.getBrandings = function () {
    return requestWithDeferred('GET', '/v2/brandings.json');
};

SignaturitClient.prototype.createBranding = function (params) {
    return requestWithDeferred('POST', '/v2/brandings.json', null, params);
};

SignaturitClient.prototype.updateBranding = function (brandingId, params) {
    return requestWithDeferred('PATCH', '/v2/brandings/' + brandingId + '.json', null, params);
};

SignaturitClient.prototype.updateBrandingLogo = function (brandingId, filePath) {
    var deferred = Q.defer();

    fs.createReadStream(filePath).pipe(
        request(deferred, 'PUT', '/v2/brandings/' + brandingId + '/logo.json')
    );

    return deferred.promise;
};

SignaturitClient.prototype.updateBrandingEmail= function (brandingId, template, filePath) {
    var deferred = Q.defer();

    fs.createReadStream(filePath).pipe(
        request(deferred, 'PUT', '/v2/brandings/' + brandingId + '/emails/' + template + '.json')
    );

    return deferred.promise;
};

SignaturitClient.prototype.getTemplates = function () {
    return requestWithDeferred('GET', '/v2/templates.json');
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

SignaturitClient.prototype.getEmailCertificates = function(emailId) {
    return requestWithDeferred('GET', "/v3/emails/" + emailId + "/certificates.json");
};

SignaturitClient.prototype.getEmailCertificate = function(emailId, certificateId) {
    return requestWithDeferred('GET', "/v3/emails/" + emailId + "/certificates/" + certificateId + ".json");
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

SignaturitClient.prototype.downloadEmailAuditTrail = function (emailId, certificateId, path) {
    var deferred = Q.defer();

    request(deferred, 'GET', '/v3/emails/' + emailId + '/certificates/' + certificateId + '/download/audit_trail').pipe(
        fs.createWriteStream(path)
    );

    return deferred.promise;
};
SignaturitClient.prototype.downloadSignedDocument = function (emailId, certificateId, path) {
    var deferred = Q.defer();

    request(deferred, 'GET', '/v3/emails/' + emailId + '/certificates/' + certificateId + '/download/original').pipe(
        fs.createWriteStream(path)
    );

    return deferred.promise;
};


module.exports = SignaturitClient;
