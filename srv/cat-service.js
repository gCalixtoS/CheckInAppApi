module.exports = (srv) => {

  const { CheckIn, Users, Offices, Floors } = cds.entities('my.checkinapi')

  srv.before('CREATE', 'CheckIn', async (req) => {
    const checkIn = req.data
    
    const user = await cds.run(SELECT.from(Users).where({ ID: { '=': checkIn.user.ID } }))
    
    if (user.length == 0) {
        let result = await cds.run(INSERT.into(Users).entries(checkIn.user))        
    }
    req.data.user_ID = checkIn.user.ID
    delete req.data.user

    const maxID = await cds.run(SELECT.from(CheckIn))

    req.data.ID = maxID.length == 0 ? 1 : maxID[maxID.length -1].ID + 1
  })
}