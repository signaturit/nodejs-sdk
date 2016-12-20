var _credentials,
    _production,
    Q   = require('q'),
    fs  = require('fs'),
    req = require('request');

function requestWithDeferred (method, path, qs, body, binary) {
    var deferred = Q.defer();

    request(deferred, method, path, qs, body, binary);

    return deferred.promise;
}

function request (deferred, method, path, qs, body, binary) {
    var base = _production ? 'https://api.signaturit.com' : 'https://api.sandbox.signaturit.com';

    return req({
        method: method,
        encoding: binary ? null : undefined,
        uri: base + path,
        qs: qs,
        body: body,
        auth: {
            bearer: _credentials
        },
        headers: {
            'User-Agent': 'signaturit-node-sdk 1.0.3'
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

function extractPackageParameters (form, sheet, files, parameters)
{
    files = [].concat(files);

    files.forEach(function(filePath, i) {
        form.append(
            'files[' + i + ']',
            fs.createReadStream(filePath)
        );
    });

    form.append('sheet', fs.createReadStream(sheet));

    parameters = parameters || {};

    fillArray(form, parameters, '');

    return form;
}

function SignaturitClient (credentials, production) {
    _credentials = credentials;
    _production  = production;
}

SignaturitClient.prototype.getSignature = function (signatureId) {
    return requestWithDeferred('GET', '/v3/signatures/' + signatureId + '.json', undefined, undefined, false);
};

SignaturitClient.prototype.getSignatures = function (limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/signatures.json', parameters, undefined, false);
};

SignaturitClient.prototype.countSignatures = function (conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v3/signatures/count.json', parameters, undefined, false);
};

SignaturitClient.prototype.downloadAuditTrail = function (signatureId, documentId) {
    return requestWithDeferred('GET', '/v3/signatures/' + signatureId + '/documents/' + documentId + '/download/audit_trail', undefined, undefined, true);
};

SignaturitClient.prototype.downloadSignedDocument = function (signatureId, documentId) {
    return requestWithDeferred('GET', '/v3/signatures/' + signatureId + '/documents/' + documentId + '/download/signed', undefined, undefined, true);
};

SignaturitClient.prototype.createSignature = function (filesPath, recipients, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v3/signatures.json', undefined, undefined, false),
        form     = req.form();

    extractPostParameters(form, filesPath, recipients, params);

    return deferred.promise;
};

SignaturitClient.prototype.cancelSignature = function (signatureId) {
    return requestWithDeferred('PATCH', '/v3/signatures/' + signatureId + '/cancel.json', undefined, undefined, false);
};

SignaturitClient.prototype.sendSignatureReminder = function (signatureId) {
    return requestWithDeferred('POST', '/v3/signatures/' + signatureId + '/reminder.json', undefined, undefined, false);
};

SignaturitClient.prototype.getBranding = function (brandingId) {
    return requestWithDeferred('GET', '/v3/brandings/' + brandingId + '.json', undefined, undefined, false);
};

SignaturitClient.prototype.getBrandings = function () {
    return requestWithDeferred('GET', '/v3/brandings.json', undefined, undefined, false);
};

SignaturitClient.prototype.createBranding = function (params) {
    return requestWithDeferred('POST', '/v3/brandings.json', null, params, false);
};

SignaturitClient.prototype.updateBranding = function (brandingId, params) {
    return requestWithDeferred('PATCH', '/v3/brandings/' + brandingId + '.json', null, params, false);
};

SignaturitClient.prototype.getTemplates = function (limit, offset) {
    var parameters = {}

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/templates.json', parameters, undefined, false);
};

SignaturitClient.prototype.getEmails = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/emails.json', parameters, undefined, false);
};

SignaturitClient.prototype.countEmails = function(conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v3/emails/count.json', parameters, undefined, false);
};

SignaturitClient.prototype.getEmail = function(emailId) {
    return requestWithDeferred('GET', "/v3/emails/" + emailId + ".json", undefined, undefined, false);
};

SignaturitClient.prototype.createEmail = function(files, recipients, subject, body, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v3/emails.json', undefined, undefined, false),
        form     = req.form();

    extractPostParameters(form, files, recipients, params);

    form.append('subject', subject);
    form.append('body', body);

    return deferred.promise;
};

SignaturitClient.prototype.downloadEmailAuditTrail = function (emailId, certificateId) {
    return requestWithDeferred('GET', '/v3/emails/' + emailId + '/certificates/' + certificateId + '/download/audit_trail', undefined, undefined, true);
};

SignaturitClient.prototype.getSMS = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/sms.json', parameters);
};

SignaturitClient.prototype.countSMS = function(conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v3/sms/count.json', parameters);
};

SignaturitClient.prototype.getSingleSMS = function(smsId) {
    return requestWithDeferred('GET', "/v3/sms/" + smsId + ".json");
};


SignaturitClient.prototype.createSMS = function(files, recipients, body, params) {
    var deferred = Q.defer(),
        req      = request(deferred, 'POST', '/v3/sms.json'),
        form     = req.form();

    extractPostParameters(form, files, recipients, params);

    form.append('body', body);

    return deferred.promise;
};

SignaturitClient.prototype.downloadSMSAuditTrail = function (emailId, certificateId) {
    return requestWithDeferred('GET', '/v3/sms/' + emailId + '/certificates/' + certificateId + '/download/audit_trail');
};

SignaturitClient.prototype.getUsers = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/team/users.json', parameters);
};

SignaturitClient.prototype.getSeats = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/team/seats.json', parameters);
};

SignaturitClient.prototype.getUser = function(userId) {
    return requestWithDeferred('GET', "/v3/team/users/" + userId + ".json");
};

SignaturitClient.prototype.inviteUser = function(email, role) {
    var parameters = {}

    parameters.email = email
    parameters.role = role

    return requestWithDeferred('POST', "/v3/team/users.json", null, parameters);
};

SignaturitClient.prototype.changeUserRole = function(userId, role) {
    var parameters = {}

    parameters.role  = role

    return requestWithDeferred('PATCH', "/v3/team/users/" + userId + ".json", null, parameters);
};

SignaturitClient.prototype.removeUser = function(userId) {
    return requestWithDeferred('DELETE', "/v3/team/users/" + userId + ".json");
};

SignaturitClient.prototype.removeSeat = function(seatId) {
    return requestWithDeferred('DELETE', "/v3/team/seats/" + seatId + ".json");
};

SignaturitClient.prototype.getGroups = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/team/groups.json', parameters);
};

SignaturitClient.prototype.getGroup = function(groupId) {
    return requestWithDeferred('GET', "/v3/team/groups/" + groupId + ".json");
};

SignaturitClient.prototype.createGroup = function(name) {
    var parameters = {}

    parameters.name = name

    return requestWithDeferred('POST', "/v3/team/groups.json", null, parameters);
};

SignaturitClient.prototype.updateGroup = function(groupId, name) {
    var parameters   = {}

    parameters.name  = name

    return requestWithDeferred('PATCH', "/v3/team/groups/" + groupId + ".json", null, parameters);
};

SignaturitClient.prototype.deleteGroup = function(groupId) {
    return requestWithDeferred('DELETE', "/v3/team/groups/" + groupId + ".json");
};

SignaturitClient.prototype.addManagerToGroup = function(groupId, userId) {
    return requestWithDeferred('POST', "/v3/team/groups/" + groupId + "/managers/"+ userId + ".json");
};

SignaturitClient.prototype.addMemberToGroup = function(groupId, userId) {
    return requestWithDeferred('POST', "/v3/team/groups/" + groupId + "/members/"+ userId + ".json");
};

SignaturitClient.prototype.removeManagerFromGroup = function(groupId, userId) {
    return requestWithDeferred('DELETE', "/v3/team/groups/" + groupId + "/managers/"+ userId + ".json");
};

SignaturitClient.prototype.removeMemmberFromGroup = function(groupId, userId) {
    return requestWithDeferred('DELETE', "/v3/team/groups/" + groupId + "/members/"+ userId + ".json");
};

SignaturitClient.prototype.getContacts = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/contacts.json', parameters);
};

SignaturitClient.prototype.getContact = function(contactId) {
    return requestWithDeferred('GET', "/v3/contacts/" + contactId + ".json");
};

SignaturitClient.prototype.createContact = function(email, name) {
    var parameters = {}

    parameters.email = email
    parameters.name  = name

    return requestWithDeferred('POST', "/v3/contacts.json", null, parameters);
};

SignaturitClient.prototype.updateContact = function(contactId, email, name) {
    var parameters   = {}

    if (email) {
        parameters.email  = email
    }

    if (name) {
        parameters.name = name
    }

    return requestWithDeferred('PATCH', "/v3/contacts/" + contactId + ".json", null, parameters);
};

SignaturitClient.prototype.deleteContact = function(contactId) {
    return requestWithDeferred('DELETE', "/v3/contacts/" + contactId + ".json");
};

SignaturitClient.prototype.getSubscriptions = function(limit, offset, conditions) {
    var parameters = extractQueryParameters(conditions);

    parameters.limit  = limit || 100;
    parameters.offset = offset || 0;

    return requestWithDeferred('GET', '/v3/subscriptions.json', parameters);
};

SignaturitClient.prototype.countSubscriptions = function(conditions) {
    var parameters = extractQueryParameters(conditions);

    return requestWithDeferred('GET', '/v3/subscriptions/count.json', parameters);
};

SignaturitClient.prototype.getSubscription = function(subscriptionId) {
    return requestWithDeferred('GET', "/v3/subscriptions/" + subscriptionId + ".json");
};

SignaturitClient.prototype.createSubscription = function(url, events) {
    var parameters = {}

    parameters.url = url
    parameters.events  = events

    return requestWithDeferred('POST', "/v3/subscriptions.json", null, parameters);
};

SignaturitClient.prototype.updateSubscription = function(subscriptionId, url, events) {
    var parameters   = {}

    if (url) {
        parameters.url  = url
    }

    if (events) {
        parameters.events = events
    }

    return requestWithDeferred('PATCH', "/v3/subscriptions/" + subscriptionId + ".json", null, parameters);
};

SignaturitClient.prototype.deleteSubscription = function(subscriptionId) {
    return requestWithDeferred('DELETE', "/v3/subscriptions/" + subscriptionId + ".json");
};

module.exports = SignaturitClient;
