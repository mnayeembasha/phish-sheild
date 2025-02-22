const { phishingKeywords } = require("../utils/phishingKeywords");
const Sentiment = require("sentiment");
const spellchecker = require("spellchecker");
const axios = require("axios");

const sentiment = new Sentiment();

module.exports.emailSpamChecker = async (req, res) => {
    try {
        const { emailContent, senderEmail, links, senderIP, emailHeaders, threshold = 7 } = req.body;

        if (!emailContent) {
            return res.status(400).json({ error: "Email content is required" });
        }

        let score = 0;
        const lowerCaseEmail = emailContent.toLowerCase();

        // Check phishing keywords
        phishingKeywords.forEach(keyword => {
            if (lowerCaseEmail.includes(keyword.toLowerCase())) {
                score += 2;
            }
        });

        // Combined urgency phrases (100 existing + 100 new)
        const allUrgencyPhrases = [
            "immediate action required", "act now", "urgent response", "final warning",
            "verify your account", "security alert", "payment failure", "account suspended",
            "update your information", "confirm your identity", "your account is in danger",
            "respond within 24 hours", "you have won", "claim your prize now", "limited time offer",
            "your bank account is at risk", "password has been compromised", "urgent account verification",
            "restricted account", "suspicious activity detected", "click here to unlock your account",
            "request for confidential information", "reset your password now", "confirm payment details",
            "access suspended", "debit card frozen", "billing issue detected", "action required immediately",
            "important security update", "unusual login attempt", "verify your credentials",
            "your email has been flagged", "claim your refund now", "click now to secure your account",
            "unauthorized transaction detected", "confirm your login details", "your card has been blocked",
            "secure your assets now", "identity verification needed", "act fast to prevent loss",
            "update your banking details", "verify ownership immediately", "your subscription is expiring soon",
            "your payment is overdue", "verify your social security number", "your account is about to be locked",
            "confirm your personal details", "government benefit verification required", "your phone number is compromised",
            "update security settings now", "your insurance policy has expired", "your medical records are exposed",
            "confirm your tax return details", "act fast to protect your data", "immediate risk detected",
            "reset your security questions", "confirm your shipping address", "suspicious email detected",
            "update privacy settings", "unusual behavior detected", "login attempt from unknown device",
            "limited offer", "urgent update required", "immediate payment needed", "verify your email",
            "account at risk", "time-sensitive request", "activate now", "confirm security details",
            "click now to secure your account", "payment confirmation needed", "account suspension imminent",
            "emergency update required", "you must act quickly", "fraud detected on your account",
            "unusual transaction detected", "reset your account", "click to resolve immediately",
            "verify now to prevent account lock", "time is running out", "secure your account now",
            "protect your identity", "immediate attention needed", "urgent alert", "change your password now",
            "critical update required", "this is your final warning", "confirm your identity to proceed",
            "account verification needed", "urgent payment issue", "block suspicious activity",
            "last chance to claim your prize", "time is of the essence", "final chance to act",
            "resolve now to avoid further issues", "click immediately to restore access", "your account is under threat",
            "security breach detected", "confirm payment immediately", "warning: account access suspended",
            "do not ignore this message", "your email has been compromised", "immediate account action required",
            "confirm your transaction", "confirm your credentials within 24 hours", "act now to prevent closure",
            "important: account verification required", "verify your payment details", "unauthorized access attempt",
            "click here to unlock account", "critical security update", "urgent account alert", "complete your verification now",
            "secure your personal information", "immediate action needed to protect your data", "attention required for your account",
            "please verify your details immediately", "immediate funds release", "verify your phone number now",
            "verify your address for security", "act fast to avoid account suspension", "secure your account details now",
            "alert: account verification required", "secure your payment details immediately", "last chance to reset your password",
            "urgent security notification", "critical alert: action required", "urgent: verify now", "do not ignore",
            "account verification deadline", "ensure your account safety", "immediate login verification required",
            "secure your transaction", "immediate confirmation needed", "last chance to claim refund", "safety alert",
            "action needed for account security", "verify now to restore services", "urgent: your account is under review",
            "immediate access restriction", "act now or lose access", "verify account details to prevent suspension",
            "urgent reminder: action required", "last warning: verify now", "account freeze imminent", "verify or lose access",
            "important: security alert", "take action immediately", "final reminder: verify account", "danger of account closure",
            "immediate action needed for recovery", "time-sensitive account verification", "your account is about to expire",
            "important action required", "critical action required immediately", "time-sensitive account verification",
            "urgent: time is running out", "protect your identity now", "account verification urgent", "respond urgently",
            "this is your last reminder", "final chance to secure your account", "verify before it’s too late",
            "urgent security review", "final opportunity to resolve", "last chance to protect your data"
        ];

        allUrgencyPhrases.forEach(phrase => {
            if (lowerCaseEmail.includes(phrase)) {
                score += 3; // Adjust scoring as needed
            }
        });

        // Expanded suspicious sender domains (150 new ones)
        const suspiciousDomains = [
            "@fraud-email.com", "@phishing-zone.com", "@email-scam.com", "@fake-secure.com",
            "@bank-verification.com", "@danger-alert.com", "@account-warning.com", "@security-breach.com",
            "@unusual-activity.com", "@account-lock.com", "@warning-suspicious.com", "@urgent-response.com",
            "@security-alerts-now.com", "@invalid-payment.com", "@banking-fraud.com", "@phishing-alerts.com",
            "@online-scam.com", "@security-verification.com", "@payment-fraud.com", "@financial-threat.com",
            "@emergency-warning.com", "@payment-issues.com", "@account-suspension.com", "@fake-support.com",
            "@urgent-action.com", "@account-issues.com", "@phishing-support.com", "@critical-issue.com",
            "@warning-scam.com", "@account-scam.com", "@bank-alerts.com", "@fraud-detection.com",
            "@data-leak.com", "@identity-theft.com", "@security-warning.com", "@fake-login.com",
            "@emergency-suspension.com", "@bank-issues.com", "@account-verification-required.com",
            "@suspicious-account.com", "@fraud-activities.com", "@fake-banking.com", "@login-alert.com",
            "@payment-confirmation.com", "@security-warning-alert.com", "@password-compromised.com",
            "@account-update-alert.com", "@phishing-warning.com", "@identity-theft-alert.com",
            "@fraud-detection-alert.com", "@security-breach-alert.com", "@urgent-action-needed.com",
            "@suspicious-activity-detected.com", "@online-account-risk.com", "@alert-security-threat.com",
            "@payment-required.com", "@suspicious-access.com", "@fraud-investigation.com", "@unusual-login.com",
            "@banking-alerts.com", "@urgent-security.com", "@warning-update.com", "@urgent-password-change.com",
            "@security-response-required.com", "@payment-update-alert.com", "@account-protection-needed.com",
            "@urgent-password-update.com", "@fraud-warning.com", "@security-alert-now.com", "@fake-transaction.com",
            "@secure-transaction-warning.com", "@bank-notification.com", "@compromised-login.com", "@account-risk.com",
            "@immediate-action-required.com", "@emergency-payment.com", "@account-suspension-warning.com",
            "@critical-action-needed.com", "@urgent-verification-required.com", "@warning-account-closure.com",
            "@secure-transaction-request.com", "@fraud-alert-now.com", "@phishing-detected.com", "@account-alerts.com",
            "@danger-action-needed.com", "@security-violation.com", "@fraud-suspicious.com", "@identity-theft-warning.com",
            "@payment-issue-alert.com", "@critical-verification.com", "@security-notification-alert.com", "@emergency-verification.com",
            "@payment-alert-needed.com", "@immediate-verify.com", "@danger-suspicious.com", "@urgent-action-needed-now.com",
            "@unauthorized-access-warning.com", "@login-verification-alert.com", "@critical-notification.com", "@account-check-alert.com",
            "@payment-warning.com", "@phishing-detection-alert.com", "@suspicious-transaction-alert.com", "@security-requirement.com",
            "@fraud-protection.com", "@urgent-warning-alert.com", "@scam-email-alert.com", "@account-check-required.com",
            "@payment-suspicious.com", "@security-alert-detected.com", "@suspicious-login-attempt.com", "@immediate-action-needed.com",
            "@fraud-response-required.com", "@suspicious-link-detected.com", "@secure-credentials-alert.com", "@account-verification-pending.com",
            "@identity-theft-alert-now.com", "@emergency-action-needed.com", "@urgent-update-now.com", "@account-threat-alert.com",
            "@suspicious-activity-alert.com", "@login-issue-alert.com", "@payment-action-needed.com", "@critical-scam-alert.com",
            "@security-response-pending.com", "@suspicious-payment-attempt.com", "@verify-account-alert.com", "@urgent-verify-now.com",
            "@fraud-warning-detected.com", "@account-in-danger.com", "@security-check-alert.com", "@payment-fraud-warning.com",
            "@emergency-account-update.com", "@suspicious-transaction-detected.com", "@critical-payment-issue.com", "@suspicious-verification.com",
            "@phishing-attack-alert.com", "@security-risk-alert.com", "@login-security-alert.com", "@account-update-request.com",
            "@payment-verification-needed.com", "@emergency-transaction-alert.com", "@fraud-risk-detected.com", "@phishing-detection-now.com",
            "@account-warning-alert.com", "@critical-verification-alert.com", "@urgent-login-issue.com", "@fraud-security-alert.com",
            "@payment-verification-alert.com", "@immediate-action-warning.com", "@emergency-password-update.com", "@payment-suspension-alert.com",
            "@alert-unauthorized-access.com", "@account-suspension-notice.com", "@suspicious-payment-alert.com", "@account-threat-detected.com",
            "@login-detection-alert.com", "@action-required-warning.com", "@fraudulent-payment-alert.com", "@security-violation-alert.com",
            "@account-update-alert-needed.com", "@security-breach-alert-now.com", "@urgent-notification-needed.com", "@payment-suspicious-alert.com",
            "@scam-transaction-alert.com", "@account-verification-alert-now.com", "@urgent-email-update.com", "@action-required-payment.com",
            "@fraud-detected-alert.com", "@phishing-warning-alert.com", "@login-credentials-alert.com", "@security-warning-now.com",
            "@emergency-login-request.com", "@suspicious-activity-now.com", "@payment-alert-warning.com", "@security-breach-now.com"
        ];

        suspiciousDomains.forEach(domain => {
            if (senderEmail.toLowerCase().includes(domain)) {
                score += 5;
            }
        });

        // Sentiment analysis
        const sentimentResult = sentiment.analyze(emailContent);
        score += sentimentResult.score;

        // Spell check
        const misspelled = spellchecker.checkSpelling(emailContent);
        if (misspelled.length > 5) { // If there are more than 5 spelling errors
            score += 2;
        }

        // Evaluate links
        if (links.length > 3) {
            score += 3;
        }

        // Check sender IP
        if (senderIP && senderIP.includes("192.168")) { // Local IP range
            score += 2;
        }

        // Check email headers for unusual activity
        if (emailHeaders && emailHeaders.includes("X-Spam-Flag")) {
            score += 3;
        }

        // Check if score exceeds threshold
        if (score >= threshold) {
            return res.status(200).json({ isSpam: true, score });
        }

        return res.status(200).json({ isSpam: false, score });

    } catch (error) {
        console.error("Error checking spam:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
