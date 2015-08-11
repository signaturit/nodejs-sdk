Signaturit NODEJS SDK
=====================
This package is a wrapper for Signaturit Api. If you didn't read the documentation yet, maybe it's time to take a look [here](http://docs.signaturit.com/).

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
client.getSignatures().then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
});
```

#### Getting the last 50 signatures

```
client.getSignatures(50).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
});
```

#### Getting the following last 50 signatures

```
client.getSignatures(50, 50).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
});
```

#### Getting only the finished signatures

```
client.getSignatures(null, null, {"status": "FINISHED").then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
});
```

#### Getting the finished signatures created since July 20th of 2014

```
client.getSignatures(null, null, {"status": "FINISHED", "since": '2014-7-20'}).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
});
```

##### Getting signatures with custom field "crm_id"

```
client.getSignatures(null, null, null, {"data": {'crm_id': 2445}}).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Count signature requests

Count your signature requests.

```
client.countSignatures().then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get signature request

Get a single signature request.

```
client.getSignature('SIGNATURE_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get signature documents

Get all documents from a signature request.

```
client.getSignatureDocuments('SIGNATURE_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get signature document

Get a single document from a signature request.

```
client.getSignatureDocument('SIGNATURE_ID','DOCUMENT_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Signature request

Create a new signature request. Check all [params](http://docs.signaturit.com/api/#sign_create_sign).

```
recipients = [
  {'fullname': 'Bob', 'email': 'alexflores120@gmail.com', 'phone': 346661058397}
];

files = ['./Signaturit.pdf'];

sign_params = {
  'subject': 'Receipt number 250',
  'body': 'Please, can you sign this document?'
}

client.createSignature(files, recipients, sign_params).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

You can send templates with the fields filled

```
sign_params = {
  'subject': 'Receipt number 250',
  'body': 'Please, can you sign this document?',
  'templates': {'TEMPLATE_NAME'},
  'data': {'WIDGET_ID': 'DEFAULT_VALUE'}
}

client.createSignature([], recipients, sign_params).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

You can add custom info in your requests

```
files = ["./Signaturit.pdf"];

sign_params = {
  'subject': 'Receipt number 250',
  'body': 'Please, can you sign this document?',
  'data': {'crm_id': 2445}
}

client.createSignature(files, recipients, sign_params).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Cancel signature request

Cancel a signature request.

```
client.cancelSignature('SIGNATURE_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Send reminder

Send a reminder for signature request job.

```
client.sendSignatureReminder('SIGNATURE_ID', 'DOCUMENT_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get audit trail

Get the audit trail of a signature request document and save it in the submitted path.

```
client.downloadAuditTrail('SIGNATURE_ID','DOCUMENT_ID','/path/doc.pdf').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get signed document

Get the signed document of a signature request document and save it in the submitted path.

```
client.downloadSignedDocument('SIGNATURE_ID','DOCUMENT_ID','/path/doc.pdf').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

## Account

### Get account

Retrieve the information of your account.

```
client.getAccount().then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

## Branding

### Get brandings

Get all account brandings.

```
client.getBrandings().then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get branding

Get a single branding.

```
client.getBranding('BRANDING_ID').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Create branding

Create a new branding. You can check all branding params [here](http://docs.signaturit.com/api/#set_branding).`

```
brandingParams = {
  corporate_layout_color: '#FFBF00',
  corporate_text_color: '#2A1B0A',
  application_texts: {
    sign_button: 'Sign!'
  }
}

client.createBranding(brandingParams).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
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

client.updateBranding('BRANDING_ID', brandingParams).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Update branding logo

Change the branding logo.

```
params = {
  files: ['/path/new_logo.png']
}

client.updateBrandingLogo('BRANDING_ID', filePath).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Update branding template

Change a template. Learn more about the templates [here](http://docs.signaturit.com/api/#put_template_branding).

```
params = {
  files: ['/path/new_template.html']
}

client.updateBrandingEmail('BRANDING_ID', templateName, filePath).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

## Template

### Get all templates

Retrieve all data from your templates.

```
client.getTemplates().then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```



##Emails

### Get emails

Get all certified emails

####Get all certified emails

```
client.getEmails().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

####Get last 50 emails

```
client.getEmails(50).then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

####Navigate through all emails in blocks of 50 results

```
client.getEmails(50, 50).then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Count emails

Count all certified emails

```
client.countEmails().then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get email

Get a single email

```
client.getEmail('EMAIL_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get email certificates

Get a single email certificates

```
client.getEmailCertificates('EMAIL_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get email certificate

Get a single email certificate

```
client.getEmailCertificate('EMAIL_ID', 'CERTIFICATE_ID').then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Create email

Create a new certified email.

```
recipients = [
  {'fullname': 'Bob', 'email': 'alexflores120@gmail.com', 'phone': 346661058397}
];

files = ['./Signaturit.pdf'];

client.createEmail(files, recipients, "Node subject", "Node body").then(function(error, result) {
    if (result) {
        // Success code
    }

    if (error) {
        // Error code
    }
});
```

### Get original document

Get the original document of an email request and save it in the submitted path.

```
client.downloadEmailOriginalFile('EMAIL_ID','CERTIFICATE_ID','/path/doc.pdf').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

### Get audit trail document

Get the audit trail document of an email request and save it in the submitted path.

```
client.downloadEmailAuditTrail('EMAIL_ID','CERTIFICATE_ID','/path/doc.pdf').then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```
