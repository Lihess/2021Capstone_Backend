// 21.09.25 이은비
// Order에 대한 데이터 처리부분
const Order = require('../models/order')
const OrderProduct = require('../models/orderProduct')
const { Op, Sequelize } = require("sequelize");
const { nowDate } = require('../utils/date');
const axios = require('axios')
const { User } = require('../models');

module.exports = class OrderController {
    static async createOrder(req, res){
        const { orderDate, ordererNum } = req.body

        // 식별자 지정 : yymmdd0000
        const { lastNum } = await Order.findOne({ 
            where : { orderNum : {[Op.like] : `${nowDate()}%` }},
            attributes : [[Sequelize.fn('max', Sequelize.col('order_num')), 'lastNum']],
            raw: true
        })
        // 해당 날짜에 생성된 엔터티가 없다면 날짜+0001, 있다면 +1
        const orderNum = lastNum == null ? nowDate() + '0001' : lastNum + 1

        Order.create({
            orderNum, orderDate, ordererNum 
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

    // 사용자의 모든 주문 내역 read
    static async readOrdersByUser(req, res){
        const { ordererNum } = req.params
       
        await createOrderList(ordererNum)

        Order.findAll({
            where : { ordererNum : ordererNum },
            order : [['orderDate', 'DESC'], ['orderNum', 'DESC']],
            include: [{model : OrderProduct, attributes: {exclude: [ 'orderNum','createdAt', 'updatedAt', 'deletedAt']}, as : 'orderProducts'}], 
            attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}
        }).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
}


// 쇼핑몰에서 사용자의 최근 주문 정보 불러오기&저장
const createOrderList = async(ordererNum) => {
    const { linkToken } = await User.findByPk(ordererNum)

    if(linkToken) {
        const list = await axios.get("https://dummy-shopping-mall.herokuapp.com/api/order",{
            headers : {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${linkToken}`
            }
        }).catch((err) => {console.log(err)});
    
        // 에러가 없고, 주문정보가 있을때
        if(list && list.data.orderDate) {
            // 식별자 지정 : yymmdd0000
            const { lastNum } = await Order.findOne({ 
                where : { orderNum : {[Op.like] : `${nowDate()}%` }},
                attributes : [[Sequelize.fn('max', Sequelize.col('order_num')), 'lastNum']],
                raw: true
            })
    
            // 해당 날짜에 생성된 엔터티가 없다면 날짜+0001, 있다면 +1
            const orderNum = lastNum == null ? nowDate() + '0001' : lastNum + 1
    
            // 구해진 주문번호 삽입
            const orderProduct = list.data.orderProducts.map((product) => {
                return { orderNum : orderNum, ...product }
            })
    
            // 주문 정보 저장
            Order.create({ orderNum, orderDate : list.data.orderDate, ordererNum}).catch((err) => {console.log(err)});
            OrderProduct.bulkCreate(orderProduct).catch((err) => {console.log(err)});
        } 
    }
}