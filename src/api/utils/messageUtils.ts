export const invalid = {
    request: "Invalid request.",
    object: "Invalid object pattern.",
    id: "ID is invalid.",
    email: "Email is invalid.",
    db: "Unexpected database error."
}

export const login = {
    email: "Email does not exist.",
    expired: "Login expired.",
    password: "Password does not match.",
    disabled: "Sorry the login is disabled."
}

export const registration = {
    email: "Email is already in use."
}

export const auth = {
    400: "Bad Request",
    401: "Authentication Failed",
    403: "Forbidden"
}
export const upload = {
    undefined: "The uploaded didn't work, please contact the website administrator.",
    size: "The uploaded File is bigger than 20 MB.",
    type: "The uploaded File is not PNG or JPEG."
}

export const paypal = {
    description: "Ihre Bestellung bei Tiefschlafen.de",
    note_to_payer: "Kontaktieren Sie uns, wenn Sie Fragen haben: info@tiefschlafen.de",
}

export const email = {
    sender_name: "Tiefschlafen.de",
    order_subject: "Ihre Bestellung bei Tiefschlafen.de.",
    order_donotreply: `Diese E-Mail wurde automatisch erstellt. 
    Bitte antworten Sie nicht auf dieses Schreiben, 
    da Ihre Nachricht an diese Adresse nicht bearbeitet werden kann.`,
    order_paymentmethod: "Sie haben mit {payment} bezahlt",
    order_confirmation: `vielen Dank für Ihre Bestellung, 
    deren Eingang wir hiermit gerne bestätigen.
    Wir freuen uns, dass Sie bei uns etwas Passendes gefunden haben.
    Sobald Ihre Bestellung auf dem Weg zu Ihnen ist, informieren wir Sie per E-Mail.`,
    order_preheader: `Vielen Dank, für Ihren
    Einkauf bei Tiefschlafen!
    Hier sind die Informationen
    zu Ihrer Bestellung.`
}

export const email_selector = {
    payment_method: [
        {
            id: "paypal",
            response: "Paypal"
        }
    ]
}