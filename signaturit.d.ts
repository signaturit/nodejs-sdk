
  import { PathLike } from "fs";
  export class SignaturitClient {
    constructor(accessToken: string, production: boolean);
    /** Create a new signature request. */
    createSignature: (
      filesPath: PathLike | PathLike[],
      recipients: Recipient | Recipient[],
      params: SignatureParams
    ) => Promise<SignatureResponse>;
    /** Cancel a signature request. The signer will not be able to sign the document. */
    cancelSignature: (signatureId: string) => Promise<SignatureResponse>;
    /** Download the signed PDF file. */
    downloadSignedDocument: (
      signatureId: string,
      documentId: string
    ) => Promise<string>;
    /** Download the binary content of the audit trail PDF. */
    downloadAuditTrail: (
      signatureId: string,
      documentId: string
    ) => Promise<string>;

    /** Get all brandings from your account. */
    getBrandings: () => Promise<BrandingResponse[]>;
    /** Get a branding. */
    getBranding: (brandingId: string) => Promise<BrandingResponse>;
    /** Create a single branding. */
    createBranding: (params: BrandingParams) => Promise<BrandingResponse>;
    /** Update a single branding. */
    updateBranding: (
      brandingId: string,
      params: BrandingParams
    ) => Promise<BrandingResponse>;
    /** Get a subscription. */
    getSubscription: (subscriptionId: string) => Promise<SubscriptionResponse>;
    /** Get all subscriptions. */
    getSubscriptions: (
      limit: number,
      offset: number,
      conditions: any
    ) => Promise<SubscriptionResponse>;
    /** Create a new subscription. */
    createSubscription: (
      url: string,
      events: AnyEvent[]
    ) => Promise<SubscriptionResponse>;
    /** Updates a subscription. */
    updateSubscription: (
      subscriptionId: string,
      url: string,
      events: AnyEvent[]
    ) => Promise<SubscriptionResponse>;
    /** Deletes a subscription. */
    deleteSubscription: (subscriptionId: string) => Promise<any[]>;
  }

  type BrandingParams = {
    /** List with all the customizable texts for application widgets. */
    application_texts?: {
      /** Send button text. */
      send_button?: string;
      /** Customizable text for Signature e-mail sign button. */
      open_sign_button?: string;
      /** Customizable text for Certified e-mail sign button. */
      open_email_button?: string;
      /** Text that follow our terms text (html code is allowed). */
      terms_and_conditions?: string;
    };
    /** Primary element color. */
    layout_color?: string;
    /** The logo sent in emails (base64 encoded). */
    logo?: string;
    /** The color that will be used in the signature draw */
    signature_color?: "black" | "blue";
    /** Primary text color. ex: #FAAC58 */
    text_color: string;
    /** Hide or show the CSV image and text that is stamped in the signed file. */
    show_csv?: boolean;
    /** Hide or show the Biometric Hash in the signed document and audit trail. */
    show_biometric_hash?: boolean;
    /** Hide or show the welcome page that appears before showing the document. */
    show_welcome_page?: boolean;
  };

  type BrandingResponse = { id: string; created_at: Date } & BrandingParams;

  type PageCoordinates = {
    top: string | number;
    left: string | number;
    height: string | number;
    width: string | number;
  };
  type Recipient = {
    email: string;
    name: string;
  };

  type SignatureParams = {
    /** Use a custom branding for the signature request */
    branding_id?: string;
    /** Url to redirect the user when finish the signature process. */
    callback_url?: string;
    /** Custom information in a key: value format that you can include in the signature request */
    data?: { [key: string]: string };
    /** The signature request delivery type. */
    delivery_type: "url" | "email" | "sms";
    /** URL that receive realtime information about this signature process.  */
    events_url?: string;
    /** Expiration time of the document (in days). You can set it 0 to disable reminders (not recommended). */
    expire_time?: number;
    /** A single value or an array with time values in days to wait until sending and automatic reminder. You can set it 0 to disable reminders. */
    reminders?: number | number[];
    /** List with pdf / doc files. */
    files?: PathLike[];
    /** List with signature recipients containing name, email and extra requirements for the signature process if needed. */
    recipients?: Array<
      Recipient & {
        require_signature_in_coordinates?: Array<PageCoordinates | number | {}>;
        widgets?: SignaturItWidget[];
      }
    >;
    /** List with email recipients containing name and email for people that will receive a copy of the signed document when the process is completed. */
    cc?: Recipient[];
    /** The signing mode lets you control the order in which your recipients receive and sign your documents. the default value is sequential. */
    signing_mode?: "sequential" | "parallel";
    /** The type of the signature. Note: the default value is the advanced signature request. */
    type?: "simple" | "advanced" | "smart";
  };

  type SignaturItWidget = {
    page?: number; // range 1...N
    editable?: number; // 0 or 1
    required?: number; // 0 or 1
    height?: number;
    width?: number;
    top?: number;
    left?: number;
    type:
      | "date"
      | "image"
      | "check"
      | "radio"
      | "select"
      | "text"
      | "signature";
    default?: any;
    word_anchor?: string;
    options?: any;
  };

  type Document = {
    id: string;
    created_at: Date;
    file: {
      name: string;
      pages?: number;
      size: number;
    };
    events: {
      created_at: Date;
      type: SignatureEvents | EmailEvents | SMSEvents;
    }[];
    email: string;
    name: string;
    status: string;
  };

  type SignatureResponse = {
    id: string;
    created_at: Date;
    data: any[];
    documents: Document[];
    url?: string;
  };

  type SubscriptionResponse = {
    id: string;
    url: string;
    created_at: Date;
    events: AnyEvent[];
  };

  type SignatureEvents =
    | "email_processed"
    | "email_delivered"
    | "email_opened"
    | "email_bounced"
    | "email_deferred"
    | "reminder_email_processed"
    | "reminder_email_delivered"
    | "reminder_email_opened"
    | "sms_processed"
    | "sms_delivered"
    | "password_sms_processed"
    | "password_sms_delivered"
    | "document_opened"
    | "document_signed"
    | "document_completed"
    | "audit_trail_completed"
    | "document_declined"
    | "document_expired"
    | "document_canceled"
    | "photo_added"
    | "voice_added"
    | "file_added"
    | "photo_id_added"
    | "terms_and_conditions_accepted";

  type EmailEvents =
    | "email_processed"
    | "email_delivered"
    | "email_opened"
    | "documents_opened"
    | "document_opened"
    | "document_downloaded"
    | "certification_completed";

  type SMSEvents =
    | "sms_processed"
    | "sms_delivered"
    | "documents_opened"
    | "document_opened"
    | "document_downloaded"
    | "certification_completed";

  type AnyEvent = SignatureEvents | EmailEvents | SMSEvents | "*";
