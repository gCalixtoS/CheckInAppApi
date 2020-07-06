const cds = require('@sap/cds')
const nodemailer = require('nodemailer')
const moment = require('moment')
const Auth = require('./config/auth')
const AdminAuth = require('./config/adminAuth')


cds.on('bootstrap', (app) => {
	// add your own middleware before any by cds are added
	var cors = require('cors')
	app.use(cors())
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	});

	app.use('/catalog', Auth)
	app.use('/admin', AdminAuth.authenticate)

	app.get('/api/login', AdminAuth.login)

	app.get('/api/checkInList', async (req, res) => {
		
		const { FloorSecurityGuardsView, DailyCheckInList } = cds.entities('my.checkinapi')

		const dailyCheckIns = await cds.run(SELECT.from(DailyCheckInList).where({ date: { '=': moment().format('YYYY-MM-DD') } }))
		let dailyCheckInsFloors = {}
		dailyCheckIns.map((checkIn) => {
			if (dailyCheckInsFloors[checkIn.floorID] === undefined) {
				dailyCheckInsFloors[checkIn.floorID] = [checkIn]
			} else {
				dailyCheckInsFloors[checkIn.floorID].push(checkIn)
			}
		})
		
		Object.keys(dailyCheckInsFloors).map(async (id) => {
			const securityGuards = await cds.run(SELECT.from(FloorSecurityGuardsView).where({ floor_ID: { '=': id } }))

			if (securityGuards.length > 0) {
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

				transporter.sendMail({
					from: process.env.MAIL_PROVIDER,
					to: [emails],
					subject: `Lista de check-ins para o dia ${ moment().format('DD/MM/YYYY')}. Localidade: ${office} - ${floor}`,
					html: `<h4>${moment().format('DD/MM/YYYY')} ${office} - ${floor}` +
					'<table style="border: 1px solid black;border-collapse: collapse;"> <thead> <tr> <th style="border: 1px solid black;border-collapse: collapse;">Nome</th> <th style="border: 1px solid black;border-collapse: collapse;">E-mail</th></tr></thead><tbody>' +
					dailyCheckInsFloors[id].map((checkIn) => `<tr><td style="border: 1px solid black;border-collapse: collapse;">${checkIn.userName}</td><td style="border: 1px solid black;border-collapse: collapse;">${checkIn.userEmail}</td></tr>`).join('')
					+ "</tbody>" 
				}, function (error, info) {
					if (error) {
						console.log(error)
					} else {
						console.log('Email sent: ' + info.response)
					}
				})
			}
		})

		res.status(200).send('success')
	})
})

cds.on('listening', () => {
	// add more middleware ...
})

module.exports = cds.server // delegate to default server.js