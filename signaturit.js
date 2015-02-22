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

function SignaturitClient (credentials, production) {
    _credentials = credentials;
    _production  = production;
}

SignaturitClient.prototype.getAccount = function () {
    return requestWithDeferred('GET', '/v2/account.json');
};

SignaturitClient.prototype.setDocumentStorage = function (type, params) {
    params = params || {};

    params.type = type;

    return requestWithDeferred('POST', '/v2/account/storage.json', null, params);
};

SignaturitClient.prototype.revertToDefaultDocumentStorage = function () {
    return requestWithDeferred('DELETE', '/v2/account/storage.json');
};

SignaturitClient.prototype.getSignature = function (signatureId) {
    return requestWithDeferred('GET', '/v2/signs/' + signatureId + '.json');
};

SignaturitClient.prototype.getSignatures = function (limit, offset, status, since, data) {
    var params = {
        limit: limit || 100,
        offset: offset || 0
    };

    if (status) {
        params.status = status;
    }

    if (since) {
        params.since = since;
    }

    if (data) {
        for (var key in data) {
            var newKey = 'data.' + key;

            params[newKey] = data[key];
        }
    }

    return requestWithDeferred('GET', '/v2/signs.json', params);
};

SignaturitClient.prototype.countSignatures = function (status, since, data) {
    var params = {};

    if (status) {
        params.status = status;
    }

    if (since) {
        params.since = since;
    }

     if (data) {
        for (var key in data) {
            var newKey = 'data.' + key;

            params[newKey] = data[key];
        }
    }

    return requestWithDeferred('GET', '/v2/signs/count.json', params);
};

SignaturitClient.prototype.getSignatureDocument = function (signatureId, documentId) {
    return requestWithDeferred('GET', '/v2/signs/' + signatureId + '/documents/' + documentId + '.json');
};

SignaturitClient.prototype.getSignatureDocuments = function (signatureId) {
    return requestWithDeferred('GET', '/v2/signs/' + signatureId + '/documents.json');
};

SignaturitClient.prototype.getAuditTrail = function (signatureId, documentId, path) {
    var deferred = Q.defer();

    request(deferred, 'GET', '/v2/signs/' + signatureId + '/documents/' + documentId + '/download/doc_proof').pipe(
        fs.createWriteStream(path)
    );

    return deferred.promise;
};

SignaturitClient.prototype.getSignedDocument = function (signatureId, documentId, path) {
    var deferred = Q.defer();

    request(deferred, 'GET', '/v2/signs/' + signatureId + '/documents/' + documentId + '/download/signed').pipe(
        fs.createWriteStream(path)
    );

    return deferred.promise;
};

SignaturitClient.prototype.createSignatureRequest = function (filesPath, recipients, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v2/signs.json'),
        form     = req.form();

    filesPath = [].concat(filesPath);

    filesPath.forEach(function(filePath, i) {
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

    params = params || {};

    Object.keys(params).forEach(function(key) {
        if ('object' == typeof(params[key])) {
            Object.keys(params[key]).forEach(function(innerKey) {
                form.append(key +'[' + innerKey + ']', params[key][innerKey])
            });
        } else {
            form.append(key, params[key]);
        }
    });

    return deferred.promise;
};

SignaturitClient.prototype.cancelSignatureRequest = function (signatureId) {
    return requestWithDeferred('PATCH', '/v2/signs/' + signatureId + '/cancel.json');
};

SignaturitClient.prototype.sendReminder = function (signatureId, documentId) {
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

SignaturitClient.prototype.updateBrandingTemplate = function (brandingId, template, filePath) {
    var deferred = Q.defer();

    fs.createReadStream(filePath).pipe(
        request(deferred, 'PUT', '/v2/brandings/' + brandingId + '/emails/' + template + '.json')
    );

    return deferred.promise;
};

SignaturitClient.prototype.getTemplates = function () {
    return requestWithDeferred('GET', '/v2/templates.json');
};

module.exports = SignaturitClient;
