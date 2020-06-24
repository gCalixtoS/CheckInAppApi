module.exports = (srv) => {

	const { CheckIn, Users } = cds.entities('my.checkinapi')

	srv.before('CREATE', 'CheckIn', async (req) => {
		const checkIn = req.data
		const user = await cds.run(SELECT.from(Users).where({ ID: { '=': checkIn.user.ID } }))

		if (user.length == 0) {
			await cds.run(INSERT.into(Users).entries(checkIn.user))
		}
		const existsCheckIn = await cds.run(SELECT.from(CheckIn).where({ floor_ID: { '=': checkIn.floor_ID }, date: { '=': checkIn.date }, user_ID : {'=' : checkIn.user.ID} }))

		if (existsCheckIn.length > 0) {
			req.reject(400, 'Já existe um check-in para a localidade e data.')
		} else {

			req.data.user_ID = checkIn.user.ID
            delete req.data.user
		}
	})
}