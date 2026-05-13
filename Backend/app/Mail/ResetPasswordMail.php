<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Password',
        );
    }

    public function content(): Content
{
    return new Content(
        htmlString: "
            <h2>Reset Password</h2>

            <p>Click below to reset your password:</p>

            <a href='http://localhost:5173/reset-password?token={$this->token}&email={$this->email}'>
                Reset Password
            </a>
        "
    );
}

    public function attachments(): array
    {
        return [];
    }
}