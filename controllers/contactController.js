const nodemailer = require('nodemailer');

const contactHandler = (req, res, next) => {

    sendContactMessage(req.body).then(() => {
        res.status(200)
            .send({ isSent: true });
    })
        .catch(err => {

            if (err) {
                const e = new Error(err)
                e.status = 500
                send({ isSent: false, error: error })
                next(e)
            } else {
                next(err)
            }

        })

}

exports.contactHandler = contactHandler;


async function sendContactMessage(data) {
    // Generate test SMTP service account from ethereal.email Only needed if you
    // don't have a real mail account for testing
console.log(data);


    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'iamjohnnguyen.com', port: 465, secure: true, // true for 465, false for other ports
        auth: {
            user: "t-ask@iamjohnnguyen.com",
            pass: "helloworld123"
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    //Verify transporter
    // await transporter.verify(function(error, success) {
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log("Server is ready to take our messages");
    //     }
    //   });

    //Construct Contact Information
    let contactContent = `<ul><li><b>Name:</b> ${data.submitName}</li>
    <li><b>Email:</b> ${data.submitEmail}</li>
    <li><b>Subject:</b> ${data.submitSubject}</li>
    <h3>Message</h3>
    <p>${data.submitMessage}</p>
    `;

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"T-ask Contact Message" <sunny@iamjohnnguyen.com>`, // sender address
        to: 'karla@karlalopez3d.com,sunny.sit26@gmail.com', // list of receivers
        subject: 'Contact Message --- T-ask', // Subject line
        html: contactContent
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com> Preview only
    // available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

}
