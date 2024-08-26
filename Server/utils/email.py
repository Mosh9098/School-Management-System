import sendgrid
from sendgrid.helpers.mail import Mail
from flask import current_app

def send_email(to_email, subject, content, from_email=None):
    if not from_email:
        from_email = current_app.config['DEFAULT_FROM_EMAIL']
    
    sg = sendgrid.SendGridAPIClient(api_key=current_app.config['SENDGRID_API_KEY'])
    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=content
    )
    try:
        response = sg.send(message)
        return response
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None
