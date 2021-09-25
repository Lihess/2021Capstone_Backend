// 21.09.25 이은비
// Order에 대한 데이터 처리부분
const OrderProduct = require('../models/orderProduct')

module.exports = class OrderProductController {
    static async createOrderProduct(req, res){
        const { orderNum, productName, quantity } = req.body
    
        // 순번을 일정하게 부여하기 위해서
        const countOrnu = await OrderProduct.count({ where : { orderNum : orderNum }})

        OrderProduct.create({
            orderNum, productOrnu : countOrnu + 1, productName, quantity
        }).then((result)=> {
            res.status(200).json({
                orderNum : result.orderNum,
                productOrnu : result.productOrnu,
                productName : result.productName, 
                quantity : result.quantity
            })
        }).catch((err) => {
            if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "Order Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readOrderProduct(req, res) {
        const { orderNum, productOrnu } = req.query;

        OrderProduct.findOne({
                where : {orderNum : orderNum, productOrnu : productOrnu},
                attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
            }
        ).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateOrderProduct(req, res) {
        const { orderNum, productOrnu, productName, quantity} = req.body

        const productInfo = await OrderProduct.findOne({where : {orderNum : orderNum, productOrnu : productOrnu}})
        
        if(!productInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            OrderProduct.update({
                productName : productName || productInfo.productName, 
                quantity : quantity || productInfo.quantity
            }, { 
                where : {orderNum : orderNum, productOrnu : productOrnu}
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    orderNum : orderNum,
                    productOrnu : productOrnu,
                    productName : productName || productInfo.productName, 
                    quantity : quantity || productInfo.quantity
                })
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteOrderProduct(req, res) {
        const { orderNum, productOrnu } = req.query;

        const productInfo = await OrderProduct.findOne({where : {orderNum : orderNum, productOrnu : productOrnu}})
        
        if(!productInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            OrderProduct.destroy({ 
                where : {orderNum : orderNum, productOrnu : productOrnu}
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }
}