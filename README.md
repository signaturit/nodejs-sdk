========================
DO NOT USE MASTER BRANCH
========================

Signaturit NODEJS SDK
=====================
This package is a wrapper for Signaturit Api. If you didn't read the documentation yet, maybe it's time to take a look [here](https://docs.signaturit.com/).

Configuration
-------------

Just import the Signaturit Client this way

```
var SignaturitClient = require('signaturit-sdk');
```

Then you can authenticate yourself using your AuthToken

```
client = new SignaturitClient('TOKEN')
```

Remember that you can test the api on our sandbox server, so, if you want to do all the calls to sandbox, set the parameter false in the constructor. If you want use production set the parameter true.

```
client = new SignaturitClient('TOKEN', false)
```

Examples
--------

## Signature request

### Get all signature requests

Retrieve all data from your signature requests using different filters.

#### All signatures

```
client.getSignatures().then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

#### Getting the last 50 signatures

```
client.getSignatures(50).then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

#### Getting the following last 50 signatures

```
client.getSignatures(50, 50).then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

#### Getting only the finished signatures

```
client.getSignatures(null, null, { status: 'completed' }).then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

#### Getting the finished signatures created since July 20th of 2014

```
client.getSignatures(null, null, { status: 'completed', since: '2014-7-20' }).then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

##### Getting signatures with custom field "crm_id"

```
client.getSignatures(null, null, { crm_id: 2445 }).then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Count signature requests

Count your signature requests.

```
client.countSignatures().then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Get signature request

Get a single signature request.

```
client.getSignature('SIGNATURE_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Signature request

Create a new signature request. You can check all signature [params](https://docs.signaturit.com/api/v3#sign_create_sign).

```
recipients = [
  { name: 'Bob', email: 'api@signaturit.com', phone: 346661058397 }
];

files = ['./Signaturit.pdf'];

sign_params = {
  subject: 'Receipt number 250',
  body: 'Please, can you sign this document?'
}

client.createSignature(files, recipients, sign_params).then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

You can send templates with the fields filled

```
sign_params = {
  subject: 'Receipt number 250',
  body: 'Please, can you sign this document?',
  templates: ['TEMPLATE_NAME'],
  data: { WIDGET_ID: 'DEFAULT_VALUE' }
}

client.createSignature([], recipients, sign_params).then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

You can add custom info in your requests

```
files = ['./Signaturit.pdf'];

sign_params = {
  subject: 'Receipt number 250',
  body: 'Please, can you sign this document?',
  data: { crm_id: 2445 }
}

client.createSignature(files, recipients, sign_params).then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Cancel signature request

Cancel a signature request.

```
client.cancelSignature('SIGNATURE_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Send reminder

Send a reminder to signature request.

```
client.sendSignatureReminder('SIGNATURE_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Get audit trail

Get the audit trail of a signature request document

```
client.downloadAuditTrail('SIGNATURE_ID', 'DOCUMENT_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Get signed document

Get the signed document of a signature request document

```
client.downloadSignedDocument('SIGNATURE_ID', 'DOCUMENT_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

## Branding

### Get brandings

Get all account brandings.

```
client.getBrandings().then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Get branding

Get a single branding.

```
client.getBranding('BRANDING_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Create branding

Create a new branding. You can check all branding [params](https://docs.signaturit.com/api/v3#set_branding).`

```
brandingParams = {
  layout_color: '#FFBF00',
  text_color: '#2A1B0A',
  application_texts: {
    sign_button: 'Sign!'
  }
}

client.createBranding(brandingParams).then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

### Update branding

Update a single branding.

```
brandingParams = {
  application_texts: {
    send_button: 'Send!'
  }
}

client.updateBranding('BRANDING_ID', brandingParams).then(function (result) {
    // success code
}, function (error) {
    // error code
})
```

## Template

### Get all templates

Retrieve all data from your templates.

```
client.getTemplates().then(function (result) {
    // success code
}, function (error) {
    // error code
})
```


##Emails

### Get emails

Get all certified emails

####Get all certified emails

```
client.getEmails().then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

####Get last 50 emails

```
client.getEmails(50).then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

####Navigate through all emails in blocks of 50 results

```
client.getEmails(50, 50).then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

### Count emails

Count all certified emails

```
client.countEmails().then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

### Get email

Get a single email

```
client.getEmail('EMAIL_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

### Create email

Create a new certified email.

```
recipients = [
  { name: 'Bob', email: 'api@signaturit.com', phone: 346661058397 }
];

files = ['./Signaturit.pdf'];

client.createEmail(files, recipients, 'Node subject', 'Node body').then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

### Get audit trail document

Get the audit trail document of an email request

```
client.downloadEmailAuditTrail('EMAIL_ID', 'CERTIFICATE_ID').then(function (result) {
    // success code
}, function (error) {
    // error code
});
```

## Sms

### Get sms

Get all certified sms

####Get all certified sms

```
client.getSms().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

####Get last 50 sms

```
client.getSms(50).then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

####Navigate through all sms in blocks of 50 results

```
client.getSms(50, 50).then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Count sms

Count all certified sms

```
client.countSms().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get sms

Get a single sms

```
client.getSingleSms('SMS_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Create sms

Create a new certified sms.

```
recipients = [
  {'name': 'Bob', 'phone': 34123456}
];


client.createSms([], recipients, "Node body").then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get audit trail document

Get the audit trail document of an sms request

```
client.downloadSmsAuditTrail('SMS_ID','CERTIFICATE_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

## Team

### Get users

Get all account users

```
client.getUsers().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get seats

Get all account seats

```
client.getSeats().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get user

Get a single user

```
client.getUser('USER_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Invite users to join your team

Invite user to join the team
 
```
client.inviteUser('bob.soap@signaturit.com', 'admin').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Change user role

Change role for user

```
client.changeUserRole('USER_ID', 'member').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Remove user

Remove user from the team

```
client.removeUser('USER_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Remove seat

Remove seat from the team

```
client.removeSeat().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get groups

Get all account groups

```
client.getGroups().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get group

Get a single group

```
client.getGroup('GROUP_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Create group

Create a new group

```
client.createGroup('test_node').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Update group

Update group name

```
client.updateGroup('GROUP_ID', 'new_name').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Delete group

Delete a group

```
client.deleteGroup('GROUP_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Add manager to group

Add a manager to a group

```
client.addManagerToGroup('GROUP_ID', 'USER_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Add manager to group

Add a member to a group

```
client.addMemberToGroup('GROUP_ID', 'USER_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});

### Delete manager from group

Remove a manager from group

```
client.removeManagerFromGroup('GROUP_ID', 'USER_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Delete member from group

Remove a member from group

```
client.removeMemberFromGroup('GROUP_ID', 'USER_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});

## Contacts

### Get contacts

Get all contacts

```
client.getContacts().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get contact

Get a single contact

```
client.getContact('CONTACT_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Create contact

Create a new contact

```
client.createContact('email@signaturit.com', 'name').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Update contact

Update contact

```
client.updateContact('CONTACT_ID', 'new_email@signaturit.com', 'name1').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Delete contact

Delete a contact

```
client.deleteContact('CONTACT_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

## Subscriptions

### Get subscriptions

Get all subscriptions

```
client.getSubscriptions().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Count subscriptions

Count all subscriptions

```
client.countSubscriptions().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get subscription

Get a single subscription

```
client.getSubscription('SUBSCRIPTION_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```
