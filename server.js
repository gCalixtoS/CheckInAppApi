const cds = require('@sap/cds')
const nodemailer = require('nodemailer')
const moment = require('moment')

cds.on('bootstrap', (app) => {
	// add your own middleware before any by cds are added
	var cors = require('cors')
	app.use(cors())
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		next();
	});

	app.get('/api/checkInList', async (req, res) => {
		const { FloorSecurityGuardsView, Users, DailyCheckInList } = cds.entities('my.checkinapi')

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
					subject: `Lista de check-ins para o dia ${ moment().format('DD/MM/YYYY')}`,
					text: dailyCheckInsFloors[id].map((checkIn) => checkIn.userName + ' : ' + checkIn.userEmail).join('\n')
				}, function (error, info) {
					if (error) {
						console.log(error);
					} else {
						console.log('Email sent: ' + info.response);
					}
				});
			}
		})

		res.send('oks')
	})
})

cds.on('listening', () => {
	// add more middleware ...
})

module.exports = cds.server // delegate to default server.js