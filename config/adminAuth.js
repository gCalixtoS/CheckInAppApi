const aad = require('azure-ad-jwt')
var jwt = require('jsonwebtoken')
const cds = require('@sap/cds')

exports.authenticate = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        next()
    } else {
        const token = req.headers.idtoken
        if (!token) {
            return res.status(403).send({ errors: ['No token provided.'] })
        }

        jwt.verify(token, process.env.AD_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    errors: ['Failed to authenticate token.', err]
                })
            } else {
                if (decoded.sysAdmin) {
                    next()
                } else {
                    return res.status(403).send({
                        errors: ['Invalid Token.']
                    })
                }
        
            }
        })
    }
}

exports.login = (req, res, next) => {

    if (req.method === 'OPTIONS') {
        next()
    } else {
        const token = req.headers.idtoken
        if (!token) {
            return res.status(403).send({ errors: ['No token provided.'] })
        }
        aad.verify(token, process.env.AD_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    errors: ['Failed to authenticate token.', err],
                    sysAdmin: false
                })
            } else {
                const { SysAdmins } = cds.entities('my.checkinapi')
                
                const sysAdmin = await cds.run(SELECT.from(SysAdmins).where({ email: { '=': decoded.preferred_username } }))

                if (sysAdmin.length > 0) {
                    const token = jwt.sign({ sysAdmin: sysAdmin[0].email }, process.env.AD_SECRET)
                    res.json({ sysAdmin: sysAdmin[0].email, token })
                } else {
                    res.json({ sysAdmin: false })
                }
            }
        })
    }
}
