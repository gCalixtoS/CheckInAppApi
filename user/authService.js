const jwt = require('jsonwebtoken')
const User = require('./user')

const login = async (req, res, next) => {
    try {
        
        const user = await User.getUserDetails(req.headers.accessToken);
        console.log(user)
        if (user) {
            // Add properties to profile
            const token = jwt.sign(user, process.env.AD_SECRET, {
                expiresIn:"1 day"
            })
            const {userPrincipalName, mail } = user
            res.json({userPrincipalName, mail, token})
        }
    } catch (err) {
        res.status(400).send({errors: ['Usuário/Senha Inválidos.']})
    }
}

const validateToken = (req, res, next) => {
    const token = req.body.token || ''

    jwt.verify(token, process.env.AD_SECRET, (err, decoded) => {
        return res.status(200).send({valid: !err})
    })
}

module.exports = {login, validateToken}