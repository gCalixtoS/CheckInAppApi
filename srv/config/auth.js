const aad   = require('azure-ad-jwt')
const env = require('../../variables.js')

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        next()
    }else{

        const token = req.headers.idtoken
        
        if (!token){
            return res.status(403).send({errors: ['No token provided.']})
        }

        aad.verify(token, env.variables.AD_SECRET,(err, decoded) => {
            if (err){
                return res.status(403).send({
                    errors: ['Failed to authenticate token.', err]
                })
            }else{
                req.decoded = decoded
                next()
            }
        })
    }
}