const sendJson = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(JSON.stringify(payload));
};

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
})[character]);

const textFromFields = fields => Object.entries(fields)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label} : ${value}`)
    .join('\n');

const confirmationEmail = (name, fields) => {
    const safeName = escapeHtml(name);
    const details = Object.entries(fields)
        .filter(([, value]) => value)
        .map(([label, value]) => `<tr><td style="padding:8px 12px;color:#766e64;font-size:13px;border-bottom:1px solid #eee8de;">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#33291f;font-size:13px;border-bottom:1px solid #eee8de;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`)
        .join('');

    return `<!doctype html><html lang="fr"><body style="margin:0;padding:32px 12px;background:#f4f0e8;font-family:Arial,Helvetica,sans-serif;color:#33291f;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fffdf9;border:1px solid #e4dac7;">
<tr><td style="padding:30px 34px;background:#29231d;color:#f8f5ef;border-bottom:4px solid #b39a68;">
<p style="margin:0;color:#d6bd8c;font-size:11px;letter-spacing:3px;">COCO MIRACLES</p>
<p style="margin:10px 0 0;font-family:Georgia,serif;font-size:25px;line-height:1.2;">Merci pour votre confiance</p></td></tr>
<tr><td style="padding:32px 34px 18px;">
<p style="margin:0 0 14px;font-size:16px;">Bonjour ${safeName},</p>
<p style="margin:0;color:#5d554b;font-size:14px;line-height:1.7;">Nous avons bien reçu votre demande. Notre équipe Coco Miracles prendra le temps d’étudier votre projet et reviendra vers vous dans les meilleurs délais. Cet e-mail confirme la réception de votre demande ; il ne constitue pas une réservation.</p>
</td></tr>
<tr><td style="padding:8px 34px 28px;"><p style="margin:0 0 12px;color:#806e4e;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">Récapitulatif de votre demande</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eee8de;">${details}</table></td></tr>
<tr><td style="padding:22px 34px;background:#f4f0e8;color:#766e64;font-size:12px;line-height:1.7;">
Une question ? Écrivez-nous à <a href="mailto:cocomiracless@gmail.com" style="color:#806e4e;">cocomiracless@gmail.com</a> ou appelez le <a href="tel:+22890499996" style="color:#806e4e;">+228 90 49 99 96</a>.<br>
Avec élégance,<br><strong style="color:#33291f;">L’équipe Coco Miracles</strong></td></tr>
</table></td></tr></table></body></html>`;
};

const notificationEmail = (name, email, fields) => {
    const rows = Object.entries({ ...fields, 'Adresse e-mail': email })
        .filter(([, value]) => value)
        .map(([label, value]) => `<tr><td style="padding:8px 12px;color:#766e64;font-size:13px;border-bottom:1px solid #eee8de;">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#33291f;font-size:13px;border-bottom:1px solid #eee8de;">${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`)
        .join('');

    return `<!doctype html><html lang="fr"><body style="margin:0;padding:28px 12px;background:#f4f0e8;font-family:Arial,Helvetica,sans-serif;color:#33291f;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fffdf9;border:1px solid #e4dac7;">
<tr><td style="padding:24px 30px;background:#29231d;color:#f8f5ef;border-bottom:4px solid #b39a68;"><p style="margin:0;color:#d6bd8c;font-size:11px;letter-spacing:3px;">COCO MIRACLES</p><h1 style="margin:10px 0 0;font-family:Georgia,serif;font-size:23px;font-weight:normal;">Nouvelle demande de projet</h1></td></tr>
<tr><td style="padding:26px 30px;"><p style="margin:0 0 14px;font-size:14px;">Une nouvelle demande a été envoyée par <strong>${escapeHtml(name)}</strong>.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid #eee8de;">${rows}</table><p style="margin:20px 0 0;font-size:13px;"><a href="mailto:${escapeHtml(email)}" style="color:#806e4e;">Répondre à ${escapeHtml(email)}</a></p></td></tr></table></td></tr></table></body></html>`;
};

const sendResendEmail = async (apiKey, message) => {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(12000)
    });
    if (!response.ok) {
        console.error(`Resend email request failed with HTTP ${response.status}.`);
        throw new Error('Le service d’e-mail n’a pas accepté le message.');
    }
};

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { error: 'Cette action n’est pas disponible.' });
    }

    const origin = req.headers.origin;
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    if (origin && host) {
        try {
            if (new URL(origin).host.toLowerCase() !== String(host).toLowerCase()) {
                return sendJson(res, 403, { error: 'La demande ne peut pas être vérifiée.' });
            }
        } catch {
            return sendJson(res, 403, { error: 'La demande ne peut pas être vérifiée.' });
        }
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || 'drikilocko@gmail.com';
    if (!apiKey || !from) {
        console.error('Resend email settings are not configured.');
        return sendJson(res, 503, { error: 'L’envoi d’e-mails n’est pas encore configuré. Réessayez plus tard ou contactez-nous directement.' });
    }

    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(res, 400, { error: 'Le formulaire est incomplet ou invalide.' });
    }

    const fields = {
        'Nom & prénom': typeof body.name === 'string' ? body.name.trim() : '',
        Téléphone: typeof body.phone === 'string' ? body.phone.trim() : '',
        Événement: typeof body.event === 'string' ? body.event.trim() : '',
        'Date estimée': typeof body.date === 'string' ? body.date.trim() : '',
        Lieu: typeof body.location === 'string' ? body.location.trim() : '',
        'Budget estimé': typeof body.budget === 'string' ? body.budget.trim() : '',
        Message: typeof body.message === 'string' ? body.message.trim() : ''
    };
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const lengths = Object.values(fields).map(value => value.length);
    if (
        !fields['Nom & prénom'] ||
        fields['Nom & prénom'].length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 254 ||
        lengths.some(length => length > 2000) ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)
    ) {
        return sendJson(res, 400, { error: 'Vérifiez votre nom, votre adresse e-mail et la longueur des champs.' });
    }

    let notificationSent = false;
    try {
        await sendResendEmail(apiKey, {
            from,
            to: [to],
            reply_to: email,
            subject: `Nouvelle demande Coco Miracles — ${fields['Nom & prénom']}`,
            html: notificationEmail(fields['Nom & prénom'], email, fields),
            text: textFromFields({ ...fields, 'Adresse e-mail': email })
        });
        notificationSent = true;
        await sendResendEmail(apiKey, {
            from,
            to: [email],
            subject: 'Nous avons bien reçu votre demande — Coco Miracles',
            html: confirmationEmail(fields['Nom & prénom'], fields),
            text: `Bonjour ${fields['Nom & prénom']},\n\nNous avons bien reçu votre demande. Notre équipe Coco Miracles reviendra vers vous dans les meilleurs délais. Cet e-mail confirme la réception de votre demande ; il ne constitue pas une réservation.\n\n${textFromFields(fields)}\n\nL’équipe Coco Miracles\ncocomiracless@gmail.com`
        });
    } catch (error) {
        console.error('Contact email delivery failed:', error.name || 'Error');
        return sendJson(res, 502, {
            error: notificationSent
                ? 'Votre demande a bien été transmise à notre équipe, mais l’e-mail de confirmation n’a pas pu être envoyé. Écrivez-nous à cocomiracless@gmail.com si besoin.'
                : 'Votre demande n’a pas pu être envoyée par e-mail. Réessayez ou contactez-nous à cocomiracless@gmail.com.'
        });
    }

    return sendJson(res, 200, { message: 'Votre demande est envoyée. Un e-mail de confirmation vient de vous être adressé.' });
};
