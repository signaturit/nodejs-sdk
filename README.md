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

##### All signatures

```
client.getSignatures().then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

##### Getting the last 50 signatures

```
client.getSignatures(50).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

##### Getting the following last 50 signatures

```
client.getSignatures(50, 50).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

##### Getting only the finished signatures 

```
client.getSignatures(null, null, 3).then(function (error, result) {
  if (result) {
    // success code
  }

  if (error) {
    // Error code
  }
})
```

##### Getting the finished signatures created since July 20th of 2014

```
client.getSignatures(null, null, 3, '2014-7-20').then(function (error, result) {
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

client.createSignatureRequest(files, recipients, sign_params).then(function (error, result) {
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
client.getAuditTrail('SIGNATURE_ID','DOCUMENT_ID','/path/doc.pdf').then(function (error, result) {
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
client.getSignedDocument('SIGNATURE_ID','DOCUMENT_ID','/path/doc.pdf').then(function (error, result) {
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

### Set document storage

Set your own storage credentials, to store a copy of the documents. You can get all the info of credential types [here](http://docs.signaturit.com/api/#account_set_credentials).

```
credentials = {
    "type": "sftp",
    "user": "john",
    "port": 22,
    "dir": "/test",
    "host": "john.doe.server",
    "password": "XXX",
    "auth_method": "PASS"
}

client.setDocumentStorage(credentials).then(function (error, result) {
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

client.updateBrandingTemplate('BRANDING_ID', templateName, filePath).then(function (error, result) {
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
