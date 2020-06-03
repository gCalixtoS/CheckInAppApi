  module.exports = (srv) => {

  const {CheckIn} = cds.entities('my.checkinapi')

//   // Reduce stock of ordered books
//   srv.before ('CREATE', 'Orders', async (req) => {
//     const order = req.data
//     if (!order.amount || order.amount <= 0)  return req.error (400, 'Order at least 1 book')
//     const tx = cds.transaction(req)
//     const affectedRows = await tx.run (
//       UPDATE (CheckIn)
//         .set   ({ stock: {'-=': order.amount}})
//         .where ({ stock: {'>=': order.amount},/*and*/ ID: order.book_ID})
//     )
//     if (affectedRows === 0)  req.error (409, "Sold out, sorry")
//   })

//   // Add some discount for overstocked books
//   srv.after ('READ', 'CheckIn', each => {
//   })

}