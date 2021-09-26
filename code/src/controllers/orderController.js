// 21.09.25 이은비
// Order에 대한 데이터 처리부분
const { User } = require('../models')
const Order = require('../models/order')
const OrderProduct = require('../models/orderProduct')

module.exports = class OrderController {
    static async createOrder(req, res){
        const { orderDate, ordererNum } = req.body

        Order.create({
            orderDate, ordererNum 
        }).then((result)=> {
            res.status(200).json({
                orderNum : result.orderNum,
                orderDate : result.orderDate,
                ordererNum : result.ordererNum
            })
        }).catch((err) => {
            console.log(err)
            if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "User Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readOrder(req, res) {
        const { orderNum } = req.params;

        Order.findByPk(
            orderNum,{
                include: [{model : OrderProduct, attributes: {exclude: [ 'orderNum', 'createdAt', 'updatedAt', 'deletedAt']}, as : 'orderProducts'}], 
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

    static async updateOrder(req, res) {
        const { orderNum, orderDate, ordererNum } = req.body

        const orderInfo = await Order.findByPk(orderNum)
        
        if(!orderInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            Order.update({
                orderDate : orderDate || orderInfo.orderDate
            }, { 
                where : {orderNum : orderNum}
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    orderNum : orderNum,
                    orderDate : orderDate || orderInfo.orderDate, 
                    ordererNum : ordererNum
                })
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteOrder(req, res) {
        const { orderNum } = req.params;

        const orderInfo = await Order.findByPk(orderNum)
        
        if(!orderInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            Order.destroy({ 
                where : {orderNum : orderNum}
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async readOrderByOwner(req, res){
        const { ordererNum } = req.params
       
        Order.findAll({
            where : { ordererNum : ordererNum },
            order : [['orderDate', 'ASC']],
            include: [{model : OrderProduct, attributes: {exclude: [ 'orderNum','createdAt', 'updatedAt', 'deletedAt']}, as : 'orderProducts'}], 
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            console.log(result)
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
}