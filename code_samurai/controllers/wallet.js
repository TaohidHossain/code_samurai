const { db } = require("../db");


module.exports.getWallet = async (req, res) => {
    const { id } = req.params
    try{
        db.get("SELECT * from wallets WHERE wallet_id = ?", [id], (err, result) => {
            if(err){
                console.log(err)
                return
            }
            if(!result) return res.status(404).send({"message": `wallet with id: ${id} was not found`})
            db.get("SELECT user_id, user_name from users WHERE user_id = ?",[id], (err, row) => {
                if(err){
                    console.log(err)
                }else{
                    //console.log(row)
                    return res.status(200).send({...result, "wallet_user": row})
                }
            })
        })
    } catch(err){
        console.log(err)
    }
}

module.exports.putWallet = async (req, res) => {
    let { recharge } = req.body
    const { id } = req.params
    recharge = parseFloat(recharge)
    //console.log(recharge)
    try{
        if(recharge >=100 && recharge <= 10000){
            let prevBalance = 0;
            let newBalance = 0;
            db.get("SELECT balance from wallets WHERE wallet_id = ?", [id], (err, result) => {
                if(err){
                    console.log(err)
                    return
                }
                else{
                    prevBalance = parseFloat(result.balance)
                    newBalance = prevBalance + recharge
                    db.run("UPDATE wallets SET balance = ? WHERE wallet_id = ?", [newBalance, id])
                    db.get("SELECT * from wallets WHERE wallet_id = ?", [id], (err, result) => {
                        if(err){
                            console.log(err)
                            return
                        }
                        if(!result) return res.status(404).send({"message": `wallet with id: ${id} was not found`})
                        db.get("SELECT user_id, user_name from users WHERE user_id = ?",[id], (err, row) => {
                            if(err){
                                console.log(err)
                            }else{
                                return res.status(200).send({...result, "wallet_user": row})
                            }
                        })
                    })
                }
            })
        }
        else{
            res.status(400).send({"message": `invalid amount: ${recharge}`})
        }
    } catch(err){
        console.log(err)
    }
}