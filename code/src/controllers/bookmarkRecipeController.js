// 21.09.26 이은비
// Bookmark에 대한 데이터 처리부분
const { Recipe } = require('../models')
const BookmarkRecipe = require('../models/bookmarkRecipe')

module.exports = class BookmarkController {
    static async createBookmark(req, res){
        const { userNum, recipeNum } = req.body

        const countOrnu = await BookmarkRecipe.count({ where : { userNum : userNum }})

        BookmarkRecipe.create({
            userNum, recipeNum, bookmarkOrnu : countOrnu + 1
        }).then((result)=> {
            res.status(200).json({
                userNum : result.userNum, 
                bookmarkOrnu : result.bookmarkOrnu,
                recipeNum : result.recipeNum
            })
        }).catch((err) => {
            console.log(err)
            if(err.name == 'SequelizeForeignKeyConstraintError')
                res.status(404).json({ message: "User or Reicpe Not Found" })
            else res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async readBookmark(req, res) {
        const { userNum, bookmarkOrnu } = req.query;

        BookmarkRecipe.findOne({
                where : { userNum : userNum, bookmarkOrnu : bookmarkOrnu  },
                include: [{model : Recipe, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}, as : 'recipe'}], 
                attributes: {exclude: [ 'recipeNum', 'createdAt', 'updatedAt', 'deletedAt']}
            }
        ).then((result) => {
            result == null 
                ? res.status(404).json({ message: "Not Found" }) : res.status(200).json(result)
        }).catch((err) => {
            console.log(err)
            res.status(500).json({ message: "Internal Server Error" });
        })
    }

    static async updateBookmark(req, res) {
        const { userNum, bookmarkOrnu, recipeNum } = req.body

        const BookmarkInfo = await BookmarkRecipe.count({ where : { userNum : userNum, bookmarkOrnu : bookmarkOrnu }})
        
        if(!BookmarkInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            BookmarkRecipe.update({
                recipeNum : recipeNum || BookmarkInfo.recipeNum
            }, { 
                where : { userNum : userNum, bookmarkOrnu : bookmarkOrnu }
            }).then((result) => {
                // result가 결과객체를 반환하지 않아서..
                res.status(200).json({
                    userNum : userNum,
                    bookmarkOrnu : bookmarkOrnu,
                    recipeNum : recipeNum || BookmarkInfo.recipeNum
                })
            }).catch((err) => {
                console.log(err)
                if(err.name == 'SequelizeForeignKeyConstraintError')
                    res.status(404).json({ message: "User or Reicpe Not Found" })
                else res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    static async deleteBookmark(req, res) {
        const { userNum, bookmarkOrnu } = req.query;

        const BookmarkInfo = await BookmarkRecipe.count({ where : { userNum : userNum, bookmarkOrnu : bookmarkOrnu }})
        
        if(!BookmarkInfo){
            res.status(404).json({ message: "Not Found" })
        } else {
            BookmarkRecipe.destroy({ 
                where : { userNum : userNum, bookmarkOrnu : bookmarkOrnu }
            }).then((result) => {
                res.status(200).json()
            }).catch((err) => {
                res.status(500).json({ message: "Internal Server Error" });
            })
        }
    }

    // 사용자의 모든 즐겨찾기 레시피 read
    static async readBookmarksByUser(req, res){
        const { userNum } = req.params;

        BookmarkRecipe.findAll({
            where : { userNum : userNum },
            // 순번 기준으로 오름차순
            order : [['bookmarkOrnu', 'ASC']],
            include: [{model : Recipe, attributes: {exclude: [ 'createdAt', 'updatedAt', 'deletedAt']}, as : 'recipe'}], 
            attributes: {exclude: [ 'recipeNum', 'createdAt', 'updatedAt', 'deletedAt']}
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