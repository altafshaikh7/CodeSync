import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)


// ─────────────────────────────────────────────
// Send OTP
// ─────────────────────────────────────────────
export const sendOTP = async (email, otp) => {
    const { data, error } = await resend.emails.send({
        from: 'CodeSync <altafshaikh07781@gmail.com>',
        to: email,
        subject: 'Your CodeSync OTP',
        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 400px;
                margin: auto;
                padding: 20px;
                background: #1e293b;
                color: white;
                border-radius: 12px;
            ">
                <h2 style="color: #3b82f6;">
                    CodeSync Verification
                </h2>

                <p>Your OTP is:</p>

                <h1 style="
                    letter-spacing: 8px;
                    color: #3b82f6;
                    font-size: 36px;
                ">
                    ${otp}
                </h1>

                <p style="color: #94a3b8;">
                    Valid for 5 minutes. Do not share this OTP with anyone.
                </p>
            </div>
        `
    })

    if (error) {
        console.error('Resend error:', error)
        throw new Error(error.message)
    }

    console.log('OTP email sent successfully:', data)
}


// ─────────────────────────────────────────────
// Registered User Project Invitation
// ─────────────────────────────────────────────
export const sendProjectInvite = async (
    email,
    { projectName, inviterName }
) => {

    const { data, error } = await resend.emails.send({
        from: 'CodeSync <altafshaikh07781@gmail.com>',
        to: email,
        subject: `${inviterName} invited you to collaborate on "${projectName}" - CodeSync`,
        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 24px;
                background: #1e293b;
                color: white;
                border-radius: 12px;
            ">

                <h2 style="color: #3b82f6;">
                    New Project Invitation
                </h2>

                <p>
                    <strong>${inviterName}</strong>
                    has invited you to collaborate on
                    <strong>${projectName}</strong>
                    on CodeSync.
                </p>

                <a
                    href="${process.env.FRONTEND_URL}/home"
                    style="
                        display: inline-block;
                        margin-top: 16px;
                        padding: 10px 24px;
                        background: #3b82f6;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                    "
                >
                    View Invitation
                </a>

                <p style="
                    color: #94a3b8;
                    margin-top: 16px;
                    font-size: 13px;
                ">
                    Log in to CodeSync to accept or decline this invitation.
                </p>

            </div>
        `
    })

    if (error) {
        console.error('Project invite email error:', error)
        throw new Error(error.message)
    }

    console.log('Project invitation email sent:', data)
}


// ─────────────────────────────────────────────
// Non-Registered User Project Invitation
// ─────────────────────────────────────────────
export const sendProjectInviteSignup = async (
    email,
    { projectName, inviterName }
) => {

    const { data, error } = await resend.emails.send({
        from: 'CodeSync <altafshaikh07781@gmail.com>',
        to: email,
        subject: `${inviterName} invited you to join "${projectName}" on CodeSync`,
        html: `
            <div style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 24px;
                background: #1e293b;
                color: white;
                border-radius: 12px;
            ">

                <h2 style="color: #3b82f6;">
                    You're invited to CodeSync 🚀
                </h2>

                <p>
                    <strong>${inviterName}</strong>
                    has invited you to collaborate on
                    <strong>${projectName}</strong>
                    on CodeSync —
                    a real-time collaborative coding platform powered by AI.
                </p>

                <a
                    href="${process.env.FRONTEND_URL}/register"
                    style="
                        display: inline-block;
                        margin-top: 16px;
                        padding: 10px 24px;
                        background: #3b82f6;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                    "
                >
                    Sign Up & Join
                </a>

                <p style="
                    color: #94a3b8;
                    margin-top: 16px;
                    font-size: 13px;
                ">
                    Create your free CodeSync account with this email address
                    to join the project.
                </p>

            </div>
        `
    })

    if (error) {
        console.error('Signup invitation email error:', error)
        throw new Error(error.message)
    }

    console.log('Signup invitation email sent:', data)
}