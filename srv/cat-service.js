module.exports = (srv) => {
	const nodemailer = require('nodemailer')
	const moment = require('moment')

	const { CheckIn, Users, FloorSecurityGuardsView, Offices, Floors, FloorSecurityGuards } = cds.entities('my.checkinapi')

	srv.before('CREATE', 'CheckIn', async (req) => {
		const checkIn = req.data

		const user = await cds.run(SELECT.from(Users).where({ ID: { '=': checkIn.user.ID } }))

		if (user.length == 0) {
			const result = await cds.run(INSERT.into(Users).entries(checkIn.user))
		}

		const existsCheckIn = await cds.run(SELECT.from(CheckIn).where({ office_ID: { '=': checkIn.office_ID }, date: { '=': checkIn.date } }))

		req.data.user_ID = checkIn.user.ID
			delete req.data.user

			const maxID = await cds.run(SELECT.from(CheckIn))

			req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length - 1].ID + 1

		if (existsCheckIn.length > 0) {
			req.reject(400, 'Já existe um check-in para a localidade e data.')
		} else {
			req.data.user_ID = checkIn.user.ID
			delete req.data.user

			const maxID = await cds.run(SELECT.from(CheckIn))

			req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length - 1].ID + 1

		}
	})

	srv.before('CREATE', 'Offices', async (req) => {
		const maxID = await cds.run(SELECT.from(Offices))
		req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length - 1].ID + 1
	})

	srv.before('CREATE', 'Floors', async (req) => {
		const maxID = await cds.run(SELECT.from(Floors))
		req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length - 1].ID + 1
	})

	srv.before('CREATE', 'FloorSecurityGuards', async (req) => {
		const maxID = await cds.run(SELECT.from(FloorSecurityGuards))
		req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length - 1].ID + 1
	})

	srv.on('CREATE', 'CheckIn', async (req) => {

		const checkIn = req.data

		const securityGuards = await cds.run(SELECT.from(FloorSecurityGuardsView).where({ floor_ID: { '=': checkIn.floor_ID } }))

		if (securityGuards.length > 0) {
			const user = await cds.run(SELECT.one(Users).columns(['email', 'name']).where({ ID: { '=': checkIn.user_ID } }))

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.MAIL_PROVIDER,
					pass: process.env.MAIL_AUTH
				}
			})



			const emails = securityGuards.map((securityGuard) => {
				return securityGuard.securityGuardEmail
			})

			const office = securityGuards[0].office
			const floor = securityGuards[0].floor

			//DESABILITADO PARA REALIZAÇÃO DOS TESTES EM DEV
			// transporter.sendMail({
			// 	from: process.env.MAIL_PROVIDER,
			// 	to: [emails],
			// 	cc: user.email,
			// 	subject: `${user.name} está solicitando um check-in. `,
			// 	text: `${user.name} está solicitando um check-in no dia ${moment(checkIn.date).format('DD/MM/YYYY')} no escritório ${office} para a localidade ${floor} `
			// }, function (error, info) {
			// 	if (error) {
			// 		console.log(error);
			// 	} else {
			// 		console.log('Email sent: ' + info.response);
			// 	}
			// });
		}
		cds.run(INSERT.into(CheckIn).entries(checkIn))
		return checkIn
	})
}