module.exports = (srv) => {

	const { CheckIn, Users, Offices, Floors, FloorSecurityGuards, SecurityGuards } = cds.entities('my.checkinapi')

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

	srv.before('CREATE', 'SecurityGuards', async (req) => {
		const maxID = await cds.run(SELECT.from(SecurityGuards))
		req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length - 1].ID + 1
	})
}